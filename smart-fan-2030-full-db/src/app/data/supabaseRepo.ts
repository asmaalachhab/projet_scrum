import { supabase } from "../../utils/supabase/client"
import type { Match, Stadium, FanZone, Recommendation, Ticket, Profile } from "./types"

export function envReady(): boolean {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY
}

/**
 * ✅ Cache user pour éviter supabase.auth.getUser() à répétition
 * - En dev (React StrictMode) ça évite de doubler/tripler les requêtes "user"
 */
let _userCache: any | null = null
let _userCacheAt = 0

async function getUserCached(ttlMs = 10_000) {
  const now = Date.now()
  if (_userCacheAt && now - _userCacheAt < ttlMs) return _userCache

  const { data, error } = await supabase.auth.getUser()
  if (error) {
    _userCache = null
    _userCacheAt = now
    return null
  }

  _userCache = data?.user ?? null
  _userCacheAt = now
  return _userCache
}

export function clearUserCache() {
  _userCache = null
  _userCacheAt = 0
}

// -------------------------------
// READ DATA (PUBLIC)
// -------------------------------
export async function fetchStadiums(): Promise<Stadium[]> {
  const { data, error } = await supabase.from("stadiums").select("*").order("name")
  if (error) throw new Error(error.message)

  return (data ?? []).map((s: any) => ({
    id: s.id,
    name: s.name,
    city: s.city,
    country: s.country,
    capacity: s.capacity,
    imageUrl: s.image_url,
    coordinates: { lat: s.lat, lng: s.lng },
  }))
}

export async function fetchMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("*, stadiums(name)")
    .order("date")
  if (error) throw new Error(error.message)

  return (data ?? []).map((m: any) => ({
    id: m.id,
    homeTeam: m.home_team,
    awayTeam: m.away_team,
    date: m.date,
    time: m.time,
    stadium: m.stadiums?.name ?? "",
    stadiumId: m.stadium_id,
    city: m.city,
    country: m.country,
    phase: m.phase,
    price: Number(m.price),
    availableSeats: m.available_seats,
    homeFlag: m.home_flag,
    awayFlag: m.away_flag,
  }))
}

export async function fetchFanZones(): Promise<FanZone[]> {
  const { data, error } = await supabase.from("fan_zones").select("*").order("name")
  if (error) throw new Error(error.message)

  return (data ?? []).map((fz: any) => ({
    id: fz.id,
    name: fz.name,
    city: fz.city,
    country: fz.country,
    coordinates: { lat: fz.lat, lng: fz.lng },
    capacity: fz.capacity,
    activities: fz.activities ?? [],
  }))
}

export async function fetchRecommendations(): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .order("rating", { ascending: false })
  if (error) throw new Error(error.message)

  return (data ?? []).map((r: any) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    description: r.description,
    price: Number(r.price),
    rating: Number(r.rating),
    imageUrl: r.image_url,
  }))
}

export async function fetchChatFaq(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("chatbot_faq").select("key, response")
  if (error) throw new Error(error.message)

  const out: Record<string, string> = {}
  for (const row of data ?? []) out[(row as any).key] = (row as any).response
  return out
}

// -------------------------------
// AUTH-BOUND DATA
// -------------------------------
export async function getProfile(): Promise<Profile | null> {
  const user = await getUserCached()
  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error || !data) {
    // profile peut ne pas exister au début
    return {
      id: user.id,
      email: user.email ?? "",
      name: user.user_metadata?.name ?? user.email ?? "Utilisateur",
      favoriteTeam: null,
      avatarUrl: null,
    }
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    favoriteTeam: data.favorite_team,
    avatarUrl: data.avatar_url,
  }
}

export async function fetchMyTickets(): Promise<Ticket[]> {
  const user = await getUserCached()
  if (!user) return []

  // ✅ IMPORTANT: filtrer par user_id (sinon tu charges les tickets de tout le monde)
  // Si ta table n'a pas user_id, dis-le moi, je l’adapte à ton schéma.
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("purchase_date", { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((t: any) => ({
    id: t.id,
    matchId: t.match_id,
    section: t.section,
    row: t.row,
    seat: t.seat,
    price: Number(t.price),
    qrCode: t.qr_code,
    purchaseDate: t.purchase_date,
  }))
}

export async function purchaseTicket(params: {
  matchId: string
  section: string
  row: string
  seat: string
}): Promise<{ ticketId: string }> {
  const user = await getUserCached()
  if (!user) throw new Error("NOT_AUTHENTICATED")

  const { data, error } = await supabase.rpc("purchase_ticket", {
    p_match_id: params.matchId,
    p_section: params.section,
    p_row: params.row,
    p_seat: params.seat,
  })

  if (error) throw new Error(error.message)
  return { ticketId: (data as any).ticket_id }
}
