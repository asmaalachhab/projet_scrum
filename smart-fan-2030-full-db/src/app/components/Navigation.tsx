import * as React from "react"
import { Home, Ticket, Map as MapIcon, MessageSquare, User, Trophy } from "lucide-react"
import { Button } from "./ui/button"

// ✅ On importe le type Page depuis App.tsx (source unique)
import type { Page } from "../App"

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const items: { key: Page; label: string; icon: React.ElementType }[] = [
    { key: "home", label: "Accueil", icon: Home },
    { key: "ticketing", label: "Billetterie", icon: Ticket },
    { key: "map", label: "Carte", icon: MapIcon },
    { key: "assistant", label: "Assistant IA", icon: MessageSquare },
    { key: "account", label: "Mon Compte", icon: User },
  ]

  return (
    <>
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex items-center gap-3 text-left"
              aria-label="Aller à l'accueil"
            >
              <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Trophy className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold leading-tight text-gray-900">Smart Fan 2030</div>
                <div className="text-xs text-gray-500">Coupe du Monde</div>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              {items.map((item) => {
                const Icon = item.icon
                const active = currentPage === item.key

                return (
                  <Button
                    key={item.key}
                    variant={active ? "default" : "ghost"}
                    onClick={() => onNavigate(item.key)}
                    className={active ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700"}
                  >
                    <Icon className="size-4 mr-2" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {items.map((item) => {
            const Icon = item.icon
            const active = currentPage === item.key

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                  active
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon className="size-5" />
                <span className="text-[11px] leading-none">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
