// src/app/components/HomePage.tsx

import * as React from "react"
import { Calendar, MapPin, Sparkles, ArrowRight, Globe, Shield, Zap, Trophy } from "lucide-react"

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

import type { Match } from "../data/types"
import type { Page } from "../App" // ✅ ICI la correction

interface HomePageProps {
  onNavigate: (page: Page) => void
  matches: Match[]
}

export function HomePage({ onNavigate, matches }: HomePageProps) {
  const upcomingMatches = (matches ?? []).slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <Badge className="mb-4 bg-yellow-500 text-yellow-950 hover:bg-yellow-400">
            100 ans de passion ⚽
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Coupe du Monde 2030
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Votre compagnon intelligent pour une expérience inoubliable
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2 text-lg px-8"
              onClick={() => onNavigate("ticketing")}
            >
              Acheter des billets
              <ArrowRight className="size-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2 text-lg px-8"
              onClick={() => onNavigate("assistant")}
            >
              <Sparkles className="size-5" />
              Parler à FanBot
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Une expérience complète</h2>
          <p className="text-lg text-gray-600">
            Tout ce dont vous avez besoin en une seule plateforme
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card
            className="border-2 hover:border-blue-500 transition-all hover:shadow-lg cursor-pointer"
            onClick={() => onNavigate("ticketing")}
            role="button"
            tabIndex={0}
          >
            <CardHeader>
              <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="size-6 text-blue-600" />
              </div>
              <CardTitle>Billetterie Sécurisée</CardTitle>
              <CardDescription>
                Achat instantané avec QR Code. Paiement sécurisé par blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Vue 3D des places</li>
                <li>✓ Prix transparents</li>
                <li>✓ Billet électronique immédiat</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className="border-2 hover:border-purple-500 transition-all hover:shadow-lg cursor-pointer"
            onClick={() => onNavigate("assistant")}
            role="button"
            tabIndex={0}
          >
            <CardHeader>
              <div className="size-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="size-6 text-purple-600" />
              </div>
              <CardTitle>Assistant IA 24/7</CardTitle>
              <CardDescription>
                FanBot répond à toutes vos questions en temps réel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Recommandations personnalisées</li>
                <li>✓ Horaires & itinéraires</li>
                <li>✓ Support multilingue</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className="border-2 hover:border-green-500 transition-all hover:shadow-lg cursor-pointer"
            onClick={() => onNavigate("map")}
            role="button"
            tabIndex={0}
          >
            <CardHeader>
              <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="size-6 text-green-600" />
              </div>
              <CardTitle>Carte Interactive</CardTitle>
              <CardDescription>
                Explorez les Fan Zones, stades et attractions touristiques.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ GPS temps réel</li>
                <li>✓ Éviter les bouchons</li>
                <li>✓ Points d&apos;intérêt</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Matchs à venir</h2>
              <p className="text-gray-600">Ne manquez pas les rencontres les plus attendues</p>
            </div>
            <Button onClick={() => onNavigate("ticketing")} className="gap-2">
              Voir tous les matchs
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <Card
                key={match.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate("ticketing")}
                role="button"
                tabIndex={0}
              >
                <CardHeader>
                  <Badge className="w-fit mb-2">{match.phase}</Badge>

                  <div className="flex items-center justify-between text-xl md:text-2xl font-bold gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-2xl">{match.homeFlag}</span>
                      <span className="truncate">{match.homeTeam}</span>
                    </div>

                    <span className="text-gray-400 shrink-0">vs</span>

                    <div className="flex items-center gap-2 min-w-0 justify-end">
                      <span className="truncate">{match.awayTeam}</span>
                      <span className="text-2xl">{match.awayFlag}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="size-4" />
                      <span>
                        {new Date(match.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        à {match.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="size-4" />
                      <span>
                        {match.stadium}, {match.city}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <span className="text-lg font-bold text-blue-600">
                        À partir de {match.price}€
                      </span>
                      <span className="text-xs text-gray-500">
                        {Number(match.availableSeats ?? 0).toLocaleString()} places
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <Shield className="size-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Plateforme officielle et sécurisée</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Partenaire officiel de la FIFA. Paiements cryptés, conformité RGPD, disponibilité 99.9%.
            Votre expérience en toute sérénité.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-2 bg-green-400 rounded-full" />
              <span>Paiement sécurisé PCI-DSS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 bg-green-400 rounded-full" />
              <span>Support client 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 bg-green-400 rounded-full" />
              <span>Remboursement garanti</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="size-6" />
            <span className="text-xl font-bold">Smart Fan 2030</span>
          </div>

          <p className="text-gray-400 mb-6">
            Propulsé par l&apos;Intelligence Artificielle pour une expérience centenaire
          </p>

          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">À propos</a>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
