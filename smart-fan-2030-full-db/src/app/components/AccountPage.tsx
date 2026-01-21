// src/app/components/AccountPage.tsx
import { useMemo, useState } from "react"
import {
  Calendar,
  Download,
  LogOut,
  Mail,
  MapPin,
  QrCode,
  Ticket as TicketIcon,
  User as UserIcon,
} from "lucide-react"
import { toast } from "sonner"

import { supabase } from "../../utils/supabase/client"
import type { Profile, Ticket } from "../data/types"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface AccountPageProps {
  profile: Profile | null
  tickets: Ticket[]
  onAuthChanged: () => Promise<void> | void
}

export function AccountPage({ profile, tickets, onAuthChanged }: AccountPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [busy, setBusy] = useState(false)

  const ticketCountLabel = useMemo(() => {
    const n = tickets.length
    return `${n} billet${n > 1 ? "s" : ""}`
  }, [tickets.length])

  // ✅ FIX: fonction au bon scope + utilise un ID qui EXISTE (ticket.id)
  async function downloadTicketPdf(ticketId: string) {
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/pdf`)
      if (!res.ok) {
        const txt = await res.text().catch(() => "")
        throw new Error(txt || `HTTP_${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ticket-${ticketId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success("Billet téléchargé ✅")
    } catch (e: any) {
      toast.error(e?.message ?? "Téléchargement impossible")
    }
  }

  const handleAuth = async () => {
    if (!email || !password || (mode === "signup" && !name)) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    setBusy(true)
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success("Connexion réussie ✅")
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (error) throw error
        toast.success("Compte créé ✅")
      }
      await onAuthChanged()
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur")
    } finally {
      setBusy(false)
    }
  }

  const handleLogout = async () => {
    setBusy(true)
    try {
      await supabase.auth.signOut()
      toast.success("Déconnecté")
      await onAuthChanged()
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur")
    } finally {
      setBusy(false)
    }
  }

  // =========================
  // UI LOGIN / SIGNUP
  // =========================
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="size-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Mon Compte</CardTitle>
            <CardDescription>Connectez-vous pour accéder à vos billets</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={mode === "login" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setMode("login")}
                disabled={busy}
              >
                Connexion
              </Button>
              <Button
                type="button"
                variant={mode === "signup" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setMode("signup")}
                disabled={busy}
              >
                Inscription
              </Button>
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-gray-500">Minimum 6 caractères.</p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleAuth}
              disabled={busy}
            >
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Option A2 : Auth Supabase réel, <span className="font-semibold">confirmation email désactivée</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // =========================
  // UI CONNECTÉ
  // =========================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="size-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                {(profile.name || profile.email || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{profile.name || "Utilisateur"}</h1>
                <p className="text-blue-100">{profile.email}</p>
                <p className="text-blue-100 text-sm">{ticketCountLabel}</p>
              </div>
            </div>

            <Button variant="secondary" className="gap-2" onClick={handleLogout} disabled={busy}>
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tickets">Mes Billets</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Tickets */}
          <TabsContent value="tickets" className="space-y-6">
            {tickets.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <TicketIcon className="size-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun billet pour le moment</h3>
                  <p className="text-gray-600">Rendez-vous dans la billetterie pour réserver vos places.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {tickets.map((ticket) => {
                  const match = ticket.match
                  return (
                    <Card key={ticket.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <Badge className="mb-3 bg-yellow-500 text-yellow-950">
                          {match?.phase ?? "Match"}
                        </Badge>

                        <div className="flex items-center justify-between text-xl font-bold mb-2">
                          <span>
                            {match?.homeFlag ?? "⚽"} {match?.homeTeam ?? "—"}
                          </span>
                          <span className="text-sm opacity-75">vs</span>
                          <span>
                            {match?.awayTeam ?? "—"} {match?.awayFlag ?? ""}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-blue-100">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            {match?.date ? new Date(match.date).toLocaleDateString("fr-FR") : ""}{" "}
                            {match?.time ? `à ${match.time}` : ""}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4" />
                            {match?.stadium ?? ""} {match?.city ? `, ${match.city}` : ""}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500 mb-1">Section</div>
                              <div className="font-semibold">{ticket.section}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">Rangée</div>
                              <div className="font-semibold">{ticket.row}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">Siège</div>
                              <div className="font-semibold">{ticket.seat}</div>
                            </div>
                          </div>

                          <div className="border-t pt-3">
                            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center">
                              <div className="text-center">
                                <QrCode className="size-24 mx-auto mb-2 text-gray-400" />
                                <div className="text-xs text-gray-500 font-mono break-all">{ticket.qrCode}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 gap-2"
                              onClick={() => downloadTicketPdf(ticket.id)} // ✅ FIX
                            >
                              <Download className="size-4" />
                              Télécharger
                            </Button>

                            <Button
                              variant="outline"
                              className="flex-1 gap-2"
                              onClick={() => toast.success("Envoi email (démo)")}
                            >
                              <Mail className="size-4" />
                              Envoyer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
                <CardDescription>Profil Supabase (`profiles`)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input value={profile.name || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>ID</Label>
                    <Input value={profile.id} readOnly />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Astuce : le profil est créé automatiquement via trigger lors du signup.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
