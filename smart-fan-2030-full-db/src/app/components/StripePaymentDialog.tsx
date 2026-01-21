import { useMemo, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const PUBLISHABLE_KEY = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string) || ""
const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null

type CreateIntentBody = {
  amount: number
  currency: string
  matchName: string
  stadiumName: string
  date: string
  time: string
  section: string
  seat: string
  customerName: string
  customerEmail: string
}

async function safeReadError(res: Response) {
  // essaie JSON puis texte
  try {
    const j = await res.json()
    if (j?.error) return String(j.error)
    return JSON.stringify(j)
  } catch {
    try {
      const t = await res.text()
      return t || `HTTP_${res.status}`
    } catch {
      return `HTTP_${res.status}`
    }
  }
}

async function createPaymentIntent(body: CreateIntentBody) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000) // 15s timeout (évite “Failed to fetch” silencieux)

  try {
    const res = await fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!res.ok) {
      const msg = await safeReadError(res)
      throw new Error(msg)
    }

    const data = (await res.json()) as { clientSecret: string; paymentIntentId: string }
    if (!data?.clientSecret || !data?.paymentIntentId) {
      throw new Error("Réponse invalide du serveur (clientSecret/paymentIntentId manquants)")
    }
    return data
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new Error("Le serveur met trop de temps à répondre (timeout). Vérifie le backend.")
    }
    throw e
  } finally {
    clearTimeout(timeout)
  }
}

function CheckoutForm(props: {
  amountCents: number
  matchName: string
  stadiumName: string
  date: string
  time: string
  section: string
  seat: string
  onSuccess: (paymentIntentId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()

  const [busy, setBusy] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const totalLabel = useMemo(() => (props.amountCents / 100).toFixed(2), [props.amountCents])

  const handlePay = async () => {
    if (!stripe || !elements) return

    if (!name.trim() || !email.trim()) {
      toast.error("Veuillez saisir votre nom et email")
      return
    }

    const card = elements.getElement(CardElement)
    if (!card) {
      toast.error("Carte bancaire non disponible")
      return
    }

    setBusy(true)
    try {
      // 1) créer PaymentIntent (backend)
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        amount: props.amountCents,
        currency: "eur",
        matchName: props.matchName,
        stadiumName: props.stadiumName,
        date: props.date,
        time: props.time,
        section: props.section,
        seat: props.seat,
        customerName: name.trim(),
        customerEmail: email.trim(),
      })

      // 2) confirmer carte (Stripe)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: name.trim(), email: email.trim() },
        },
      })

      if (result.error) throw new Error(result.error.message || "Paiement refusé")

      if (result.paymentIntent?.status !== "succeeded") {
        throw new Error(`Paiement non validé (status: ${result.paymentIntent?.status})`)
      }

      toast.success("Paiement réussi ✅")
      props.onSuccess(paymentIntentId)
    } catch (e: any) {
      toast.error(e?.message || "Erreur paiement")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nom complet</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean.dupont@example.com" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Carte bancaire</Label>
        <div className="rounded-xl border bg-white p-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <div className="text-sm text-gray-600">Total</div>
        <div className="text-lg font-semibold">{totalLabel}€</div>
      </div>

      <Button
        onClick={handlePay}
        disabled={busy || !stripe || !elements}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
      >
        {busy ? "Paiement en cours…" : "Payer maintenant"}
      </Button>

      {!PUBLISHABLE_KEY && (
        <p className="text-xs text-red-600">VITE_STRIPE_PUBLISHABLE_KEY manquante (.env)</p>
      )}
    </div>
  )
}

export function StripePaymentDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  amountCents: number
  matchName: string
  stadiumName: string
  date: string
  time: string
  section: string
  seat: string
  onSuccess: (paymentIntentId: string) => void
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Paiement sécurisé</DialogTitle>
        </DialogHeader>

        {!stripePromise ? (
          <div className="text-sm text-gray-700">
            <p className="mb-2">Stripe n’est pas configuré.</p>
            <p className="text-xs text-gray-500">
              Ajoute <span className="font-mono">VITE_STRIPE_PUBLISHABLE_KEY</span> dans ton fichier{" "}
              <span className="font-mono">.env</span>.
            </p>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              amountCents={props.amountCents}
              matchName={props.matchName}
              stadiumName={props.stadiumName}
              date={props.date}
              time={props.time}
              section={props.section}
              seat={props.seat}
              onSuccess={props.onSuccess}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  )
}
