// --------------------
// PHASES DES MATCHS
// --------------------
export type Phase =
  | "Groupe"
  | "Huitièmes"
  | "Quarts"
  | "Demi-finales"
  | "Finale"

// --------------------
// STADIUM
// --------------------
export interface Stadium {
  id: string
  name: string
  city: string
  country: string
  capacity: number
  imageUrl: string
  coordinates: {
    lat: number
    lng: number
  }
}

// --------------------
// MATCH
// --------------------
export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  stadium: string
  stadiumId: string
  city: string
  country: string
  phase: Phase
  price: number
  availableSeats: number
  homeFlag: string
  awayFlag: string
}

// --------------------
// FAN ZONE
// --------------------
export type FanZoneType =
  | "Fan Zone"
  | "Public Screening"
  | "Festival"
  | "Food Court"
  | "VIP Area"

export interface FanZone {
  id: string
  name: string
  city: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
  capacity: number
  activities: string[]
  type: FanZoneType
}

// --------------------
// RECOMMENDATION
// --------------------
export type RecommendationType =
  | "hotel"
  | "restaurant"
  | "activity"
  | "transport"

export interface Recommendation {
  id: string
  type: RecommendationType
  title: string
  description: string
  price: number
  rating: number // 1 → 5
  imageUrl: string
}

// --------------------
// TICKET
// --------------------
export interface Ticket {
  id: string
  matchId: string
  section: string
  row: string
  seat: string
  price: number
  qrCode: string
  purchaseDate: string
  match?: Match
}

// --------------------
// USER PROFILE
// --------------------
export interface Profile {
  id: string
  email: string
  name: string
  favoriteTeam?: string | null
  avatarUrl?: string | null
}
