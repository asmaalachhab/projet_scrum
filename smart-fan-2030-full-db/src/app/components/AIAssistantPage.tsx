// src/app/components/AIAssistantPage.tsx
import { useEffect, useMemo, useRef, useState } from "react"
import { Bot, Clock, Info, MapPin, Send, Sparkles, Ticket, User as UserIcon, Square } from "lucide-react"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAssistantPageProps {
  faq: Record<string, string>
}

type Mode = "faq" | "ollama"

// ✅ via proxy Vite (recommandé pour éviter CORS)
const OLLAMA_BASE = "" // on va appeler /ollama/...
const OLLAMA_MODEL = (import.meta.env.VITE_OLLAMA_MODEL as string) || "llama3.1:latest"

function withTimeout<T>(p: Promise<T>, ms = 15000): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`TIMEOUT_${ms}ms`)), ms)),
  ])
}

// ✅ Lit le flux NDJSON d’Ollama et renvoie le texte mot par mot via onToken
async function ollamaChatStreamWordByWord(opts: {
  prompt: string
  signal: AbortSignal
  onToken: (t: string) => void
}) {
  const res = await fetch(`${OLLAMA_BASE}/ollama/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: opts.signal,
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: true, // ✅ streaming
      messages: [
        {
          role: "system",
          content:
            "Tu es FanBot, assistant pour la Coupe du Monde 2030 (Maroc/Espagne). Réponds clairement en français.",
        },
        { role: "user", content: opts.prompt },
      ],
    }),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => "")
    throw new Error(`HTTP_${res.status} ${txt || res.statusText}`)
  }

  if (!res.body) throw new Error("NO_STREAM_BODY")

  const reader = res.body.getReader()
  const decoder = new TextDecoder("utf-8")
  let buffer = ""

  // Astuce: pour "mot par mot", Ollama envoie souvent par morceaux,
  // on découpe aussi par espaces pour rendre l’affichage plus fluide.
  let pending = ""

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Ollama stream => NDJSON: une ligne JSON par chunk
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      let obj: any
      try {
        obj = JSON.parse(trimmed)
      } catch {
        continue
      }

      // format typique: { message: { content: "..." }, done: false }
      const chunk: string = obj?.message?.content ?? ""
      const doneFlag: boolean = !!obj?.done

      if (chunk) {
        pending += chunk

        // ✅ découpe mot par mot (en gardant les espaces)
        const parts = pending.split(/(\s+)/) // garde espaces
        // on garde le dernier morceau incomplet dans pending
        pending = parts.pop() ?? ""

        for (const part of parts) {
          if (part.length) opts.onToken(part)
        }
      }

      if (doneFlag) {
        // flush ce qu'il reste
        if (pending) {
          opts.onToken(pending)
          pending = ""
        }
      }
    }
  }

  // flush final si jamais
  if (pending) opts.onToken(pending)
}

export function AIAssistantPage({ faq }: AIAssistantPageProps) {
  const defaultMessage = useMemo(() => {
    return (
      faq.default ||
      "Je suis FanBot, votre assistant personnel pour la Coupe du Monde 2030 ! Posez-moi une question (horaires, parking, transports, billetterie, règles du stade, etc.)."
    )
  }, [faq])

  const [mode, setMode] = useState<Mode>("faq")

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: defaultMessage, timestamp: new Date() },
  ])

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) return prev
      const first = prev[0]
      if (first.role !== "assistant" || first.id !== "1") return prev
      return [{ ...first, content: defaultMessage }, ...prev.slice(1)]
    })
  }, [defaultMessage])

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const quickQuestions = [
    { icon: Clock, text: "Horaires des matchs", key: "horaires" },
    { icon: MapPin, text: "Où me garer ?", key: "parking" },
    { icon: Ticket, text: "Comment acheter un billet ?", key: "billetterie" },
    { icon: Info, text: "Règles du stade", key: "règles" },
  ]

  const findFaqResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(faq)) {
      if (key === "default") continue
      if (lower.includes(key.toLowerCase())) return response
    }

    if (/(hôtel|hotel|logement)/i.test(userMessage)) return faq.hotels || defaultMessage
    if (/(transport|navette|métro|metro|bus)/i.test(userMessage)) return faq.transport || defaultMessage
    if (/(billet|acheter|prix|paiement)/i.test(userMessage)) return faq.billetterie || defaultMessage
    if (/(manger|restaurant|nourriture)/i.test(userMessage)) return faq.nourriture || defaultMessage
    if (/(accessibilit|pmr)/i.test(userMessage)) return (faq as any)["accessibilité"] || defaultMessage
    if (/(météo|meteo|température|temperature)/i.test(userMessage)) return (faq as any)["météo"] || defaultMessage

    return defaultMessage
  }

  const stopAI = () => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsTyping(false)
  }

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText ?? input).trim()
    if (!textToSend) return
    if (isTyping) return

    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      if (mode === "faq") {
        const response = findFaqResponse(textToSend)
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() },
        ])
        return
      }

      // ✅ OLLAMA streaming mot par mot
      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", timestamp: new Date() }])

      const controller = new AbortController()
      abortRef.current = controller

      let acc = ""

      await withTimeout(
        ollamaChatStreamWordByWord({
          prompt: textToSend,
          signal: controller.signal,
          onToken: (t) => {
            acc += t
            setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)))
          },
        }),
        120000
      )

      abortRef.current = null

      if (!acc.trim()) {
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: defaultMessage } : m)))
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 2).toString(), role: "assistant", content: "⛔ Réponse arrêtée.", timestamp: new Date() },
        ])
        return
      }

      const msg = String(err?.message || err || "")
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `❌ Erreur Ollama.\nVérifie que Ollama tourne + proxy /ollama OK.\nModèle: ${OLLAMA_MODEL}\n\nDétail: ${msg}`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
      abortRef.current = null
    }
  }

  const badgeText = mode === "faq" ? "FAQ DB" : `Ollama (${OLLAMA_MODEL})`

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Sparkles className="size-8" />
            </div>
            <h1 className="text-4xl font-bold">FanBot Assistant</h1>
          </div>
          <p className="text-lg text-purple-100">
            {mode === "faq" ? "FAQ depuis la base de données." : `Réponse Ollama mot par mot (${OLLAMA_MODEL}).`}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-3 mb-6">
          <Button variant={mode === "faq" ? "default" : "outline"} onClick={() => setMode("faq")}>
            FAQ DB
          </Button>
          <Button
            variant={mode === "ollama" ? "default" : "outline"}
            onClick={() => setMode("ollama")}
            className={mode === "ollama" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          >
            IA Ollama
          </Button>
        </div>

        {messages.length <= 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Questions fréquentes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickQuestions.map((q) => {
                const Icon = q.icon
                return (
                  <Button
                    key={q.key}
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300"
                    onClick={() => handleSend(q.text)}
                  >
                    <Icon className="size-5 text-purple-600" />
                    <span className="text-xs text-center">{q.text}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        <Card className="mb-4 shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-5 text-purple-600" />
              Conversation
              <Badge className="ml-2">{badgeText}</Badge>

              {mode === "ollama" && isTyping && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={stopAI}
                  className="ml-auto gap-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Square className="size-4" />
                  Stop
                </Button>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center ${
                      m.role === "user" ? "bg-blue-600" : "bg-gradient-to-br from-purple-600 to-pink-600"
                    }`}
                  >
                    {m.role === "user" ? <UserIcon className="size-5 text-white" /> : <Bot className="size-5 text-white" />}
                  </div>

                  <div className={`flex-1 ${m.role === "user" ? "flex justify-end" : ""}`}>
                    <div
                      className={`inline-block max-w-[80%] rounded-2xl px-4 py-3 ${
                        m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{m.content}</p>
                      <span className={`text-xs mt-1 block ${m.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {m.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder={mode === "faq" ? "Question (FAQ)…" : "Question (Ollama)…"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSend()}
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
                disabled={isTyping}
              >
                <Send className="size-4" />
                Envoyer
              </Button>
            </div>

            {mode === "ollama" && isTyping && (
              <p className="text-xs text-gray-500 mt-2">
                Réponse en cours… tu peux cliquer sur <span className="font-semibold">Stop</span>.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
