import { useMemo } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import L from "leaflet"

import "leaflet/dist/leaflet.css"

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import type { FanZone, Match, Stadium } from "../data/types"

// ✅ Fix icônes Leaflet avec Vite
const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface FanZonesMapProps {
  fanZones: FanZone[]
  stadiums: Stadium[]
  matches: Match[]
}

export function FanZonesMap({ fanZones, stadiums, matches }: FanZonesMapProps) {
  // ✅ Centre Europe du Sud / Maroc
  const center: [number, number] = [35.0, -6.0]

  const matchesByStadium = useMemo(() => {
    const map = new Map<string, Match[]>()

    for (const m of matches) {
      const list = map.get(m.stadiumId) ?? []
      list.push(m)
      map.set(m.stadiumId, list)
    }

    for (const list of map.values()) {
      list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    }

    return map
  }, [matches])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carte interactive</CardTitle>
        <CardDescription>
          Stades officiels (2030) cliquables + fan zones. Clique sur un stade pour voir les matchs.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="h-[520px] w-full overflow-hidden rounded-xl border">
          <MapContainer center={center} zoom={4} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 🏟️ Stades */}
            {stadiums.map((s) => (
              <Marker key={s.id} position={[s.coordinates.lat, s.coordinates.lng]}>
                <Popup>
                  <div className="space-y-2">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm text-gray-600">
                      {s.city}, {s.country} • {s.capacity.toLocaleString()} places
                    </div>

                    <div className="pt-2">
                      <div className="text-sm font-medium">Matchs dans ce stade</div>
                      <div className="mt-1 space-y-1">
                        {(matchesByStadium.get(s.id) ?? []).slice(0, 6).map((m) => (
                          <div key={m.id} className="text-sm">
                            <span className="font-medium">{m.homeTeam}</span> vs{" "}
                            <span className="font-medium">{m.awayTeam}</span>
                            <div className="text-xs text-gray-600">
                              {m.date} • {m.time} • {m.phase}
                            </div>
                          </div>
                        ))}

                        {(matchesByStadium.get(s.id) ?? []).length === 0 && (
                          <div className="text-sm text-gray-600">Aucun match chargé.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 🎉 Fan zones */}
            {fanZones.map((fz) => (
              <Marker key={fz.id} position={[fz.coordinates.lat, fz.coordinates.lng]}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{fz.name}</div>
                    <div className="text-sm text-gray-600">
                      {fz.city}, {fz.country}
                    </div>
                    <div className="pt-2">
                      <Badge variant="secondary">{fz.type}</Badge>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
