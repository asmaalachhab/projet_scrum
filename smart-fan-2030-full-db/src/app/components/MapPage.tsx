import { Bus, Camera, Hotel, MapPin, UtensilsCrossed } from 'lucide-react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { FanZonesMap } from './FanZonesMap'
import type { FanZone, Match, Recommendation, Stadium } from '../data/types'

interface MapPageProps {
  recommendations: Recommendation[]
  fanZones: FanZone[]
  stadiums: Stadium[]
  matches: Match[]
}

export function MapPage({ recommendations, fanZones, stadiums, matches }: MapPageProps) {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return Hotel
      case 'restaurant':
        return UtensilsCrossed
      case 'activity':
        return Camera
      case 'transport':
        return Bus
      default:
        return MapPin
    }
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'hotel':
        return 'bg-blue-100 text-blue-700'
      case 'restaurant':
        return 'bg-orange-100 text-orange-700'
      case 'activity':
        return 'bg-purple-100 text-purple-700'
      case 'transport':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="size-10" />
            <h1 className="text-4xl font-bold">Carte Interactive</h1>
          </div>
          <p className="text-lg text-green-100">
            Explorez les stades, Fan Zones et découvrez les meilleures recommandations locales
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="map">Carte & Stades</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <FanZonesMap fanZones={fanZones} stadiums={stadiums} matches={matches} />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recommandations</h2>
              <p className="text-gray-600 mb-6">Hôtels, restaurants, activités et transports près des stades</p>

              <div className="grid md:grid-cols-2 gap-6">
                {recommendations.map((rec) => {
                  const Icon = getRecommendationIcon(rec.type)
                  const colorClass = getRecommendationColor(rec.type)
                  return (
                    <Card key={rec.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                      <div
                        className="h-48 bg-cover bg-center rounded-t-lg"
                        style={{ backgroundImage: `url(${rec.imageUrl})` }}
                      >
                        <div className="h-full bg-gradient-to-t from-black/60 to-transparent rounded-t-lg flex items-end p-4">
                          <Badge className={colorClass}>
                            <Icon className="size-3 mr-1" />
                            {rec.type === 'hotel'
                              ? 'Hôtel'
                              : rec.type === 'restaurant'
                                ? 'Restaurant'
                                : rec.type === 'activity'
                                  ? 'Activité'
                                  : 'Transport'}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{rec.title}</CardTitle>
                            <CardDescription className="mt-2">{rec.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">⭐ {rec.rating.toFixed(1)}</span>
                          </div>
                          <div className="font-bold text-green-600">{rec.price}€</div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
