// server.js (ESM)
import "dotenv/config"
import express from "express"
import cors from "cors"
import Stripe from "stripe"
import PDFDocument from "pdfkit"
import QRCode from "qrcode"
import { createClient } from "@supabase/supabase-js"

const app = express()

// ✅ CORS propre (dev)
// - Si tu utilises Vite proxy (/api), CORS n’est pas indispensable,
//   mais ça évite les soucis si tu testes en direct.
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(express.json())

const PORT = Number(process.env.PORT) || 8000

// ---------- ENV ----------
const STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY || "").trim()
const SUPABASE_URL = String(process.env.SUPABASE_URL || "").trim()
const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()

if (!STRIPE_SECRET_KEY) console.error("❌ STRIPE_SECRET_KEY manquant dans backend/.env")
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("⚠️ Supabase env missing: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (routes DB désactivées)")
}

// ---------- CLIENTS ----------
const stripe = new Stripe(STRIPE_SECRET_KEY || "sk_test_missing", {
  apiVersion: "2024-06-20",
})

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null

// ---------- Helpers ----------
function asIntCents(v) {
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  const i = Math.round(n)
  if (i <= 0) return null
  return i
}

function safeStr(v, max = 200) {
  const s = String(v ?? "").trim()
  return s.length > max ? s.slice(0, max) : s
}

// ✅ Petit log utile pour debug
app.use((req, _res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`)
  next()
})

// ---------- Health ----------
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    stripe: Boolean(STRIPE_SECRET_KEY),
    supabase: Boolean(supabase),
  })
})

// ---------- Supabase: récupérer des matchs ----------
app.get("/api/matches", async (_req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error: "Supabase non configuré (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants)",
      })
    }

    const { data, error } = await supabase.from("matches").select("*").limit(50)
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ data })
  } catch (err) {
    console.error("❌ /api/matches error:", err)
    return res.status(500).json({ error: "Erreur récupération matches" })
  }
})

// ---------- PaymentIntent ----------
app.post("/api/payments/create-intent", async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "STRIPE_SECRET_KEY manquant (backend/.env)" })
    }

    const b = req.body || {}
    const amount = asIntCents(b.amount)
    const currency = safeStr(b.currency || "eur", 10).toLowerCase()

    if (!amount) return res.status(400).json({ error: "amount (cents) invalide" })

    const matchName = safeStr(b.matchName)
    const stadiumName = safeStr(b.stadiumName)
    const date = safeStr(b.date, 40)
    const time = safeStr(b.time, 20)
    const section = safeStr(b.section, 80)
    const seat = safeStr(b.seat, 40)
    const customerName = safeStr(b.customerName, 120)
    const customerEmail = safeStr(b.customerEmail, 120)

    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: customerEmail || undefined,
      metadata: {
        matchName,
        stadiumName,
        date,
        time,
        section,
        seat,
        customerName,
        customerEmail,
      },
      description: matchName ? `Smart Fan 2030 - ${matchName}` : "Smart Fan 2030 Ticket",
    })

    return res.json({
      clientSecret: pi.client_secret,
      paymentIntentId: pi.id,
    })
  } catch (err) {
    console.error("❌ create-intent error:", err)
    // ✅ renvoie une erreur claire au frontend
    return res.status(500).json({
      error: "Erreur création PaymentIntent (vérifie STRIPE_SECRET_KEY et la connexion Stripe)",
    })
  }
})

// ---------- Ticket PDF (on-demand) ----------
app.get("/api/tickets/:paymentIntentId/pdf", async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY) {
      return res.status(500).send("STRIPE_SECRET_KEY manquant (backend/.env)")
    }

    const paymentIntentId = safeStr(req.params.paymentIntentId, 100)
    if (!paymentIntentId) return res.status(400).send("paymentIntentId manquant")

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (!pi) return res.status(404).send("PaymentIntent introuvable")

    if (pi.status !== "succeeded") {
      return res.status(403).send(`Paiement non validé (status: ${pi.status})`)
    }

    const md = pi.metadata || {}

    const matchName = safeStr(md.matchName || "Match")
    const stadiumName = safeStr(md.stadiumName || "Stade")
    const date = safeStr(md.date || "")
    const time = safeStr(md.time || "")
    const section = safeStr(md.section || "")
    const seat = safeStr(md.seat || "")
    const customerName = safeStr(md.customerName || "Client")

    const total = (pi.amount_received ?? pi.amount ?? 0) / 100
    const currency = String(pi.currency || "eur").toUpperCase()

    const qrPayload = JSON.stringify({
      type: "SMART_FAN_TICKET_2030",
      paymentIntentId: pi.id,
      matchName,
      stadiumName,
      date,
      time,
      section,
      seat,
      customerName,
    })

    const qrPng = await QRCode.toBuffer(qrPayload, {
      type: "png",
      errorCorrectionLevel: "M",
      margin: 1,
      scale: 8,
    })

    const filenameSafe = `ticket_${pi.id}.pdf`
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="${filenameSafe}"`)

    const doc = new PDFDocument({ size: "A4", margin: 40 })
    doc.pipe(res)

    doc.fontSize(22).text("Smart Fan Companion 2030", { align: "left" }).moveDown(0.3)
    doc.fontSize(12).fillColor("#444444").text("Billet officiel (démo académique)", { align: "left" }).moveDown(1)

    const boxX = 40
    const boxY = 140
    const boxW = 515
    const boxH = 520

    doc.save().roundedRect(boxX, boxY, boxW, boxH, 16).lineWidth(1).stroke("#D0D0D0").restore()

    const leftX = boxX + 24
    const topY = boxY + 24

    doc.fillColor("#111111").fontSize(18).text(matchName, leftX, topY, { width: 320 })

    doc
      .fontSize(12)
      .fillColor("#333333")
      .text(`Stade: ${stadiumName}`, leftX, topY + 40, { width: 320 })
      .text(`Date: ${date} ${time ? `à ${time}` : ""}`, leftX, topY + 62, { width: 320 })
      .text(`Client: ${customerName}`, leftX, topY + 84, { width: 320 })

    doc
      .fontSize(12)
      .fillColor("#333333")
      .text(`Section: ${section || "—"}`, leftX, topY + 130)
      .text(`Siège: ${seat || "—"}`, leftX, topY + 152)
      .text(`Montant: ${total.toFixed(2)} ${currency}`, leftX, topY + 174)

    doc.save().moveTo(boxX + 360, boxY + 20).lineTo(boxX + 360, boxY + boxH - 20).lineWidth(1).stroke("#E6E6E6").restore()

    const qrX = boxX + 390
    const qrY = boxY + 60
    doc.image(qrPng, qrX, qrY, { width: 140, height: 140 })

    doc.fontSize(10).fillColor("#555555").text("QR Code", qrX, qrY + 150, { width: 140, align: "center" })
    doc.fontSize(9).fillColor("#777777").text(`Référence: ${pi.id}`, qrX, qrY + 172, { width: 140, align: "center" })

    doc
      .fontSize(9)
      .fillColor("#777777")
      .text("Ce billet est généré à la demande après paiement (Stripe PaymentIntent).", boxX, boxY + boxH + 18, {
        width: boxW,
      })

    doc.end()
  } catch (err) {
    console.error("❌ ticket pdf error:", err)
    return res.status(500).send("Erreur génération PDF")
  }
})

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`)
})
