// Mock data for World Cup 2030

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  stadium: string;
  city: string;
  country: string;
  phase: 'Groupe' | 'Huitièmes' | 'Quarts' | 'Demi-finales' | 'Finale';
  price: number;
  availableSeats: number;
  homeFlag: string;
  awayFlag: string;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
}

export interface Ticket {
  id: string;
  matchId: string;
  match: Match;
  section: string;
  row: string;
  seat: string;
  price: number;
  qrCode: string;
  purchaseDate: string;
}

export interface FanZone {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  capacity: number;
  activities: string[];
}

export interface Recommendation {
  id: string;
  type: 'hotel' | 'restaurant' | 'activity' | 'transport';
  title: string;
  description: string;
  price: number;
  rating: number;
  imageUrl: string;
}

// Stades
export const stadiums: Stadium[] = [
  {
    id: 'santiago-bernabeu',
    name: 'Santiago Bernabéu',
    city: 'Madrid',
    country: 'Espagne',
    capacity: 81044,
    imageUrl: 'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    coordinates: { lat: 40.4531, lng: -3.6884 }
  },
  {
    id: 'camp-nou',
    name: 'Camp Nou',
    city: 'Barcelone',
    country: 'Espagne',
    capacity: 99354,
    imageUrl: 'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    coordinates: { lat: 41.3809, lng: 2.1228 }
  },
  {
    id: 'mohammed-v',
    name: 'Stade Mohammed V',
    city: 'Casablanca',
    country: 'Maroc',
    capacity: 67000,
    imageUrl: 'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    coordinates: { lat: 33.5731, lng: -7.5898 }
  },
  {
    id: 'centenario',
    name: 'Estadio Centenario',
    city: 'Montevideo',
    country: 'Uruguay',
    capacity: 60235,
    imageUrl: 'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    coordinates: { lat: -34.8941, lng: -56.1526 }
  },
  {
    id: 'monumental',
    name: 'Estadio Monumental',
    city: 'Buenos Aires',
    country: 'Argentine',
    capacity: 83214,
    imageUrl: 'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    coordinates: { lat: -34.5453, lng: -58.4498 }
  }
];

// Matchs
export const matches: Match[] = [
  {
    id: 'm1',
    homeTeam: 'France',
    awayTeam: 'Brésil',
    date: '2030-06-15',
    time: '21:00',
    stadium: 'Santiago Bernabéu',
    city: 'Madrid',
    country: 'Espagne',
    phase: 'Groupe',
    price: 150,
    availableSeats: 15000,
    homeFlag: '🇫🇷',
    awayFlag: '🇧🇷'
  },
  {
    id: 'm2',
    homeTeam: 'Espagne',
    awayTeam: 'Allemagne',
    date: '2030-06-16',
    time: '18:00',
    stadium: 'Camp Nou',
    city: 'Barcelone',
    country: 'Espagne',
    phase: 'Groupe',
    price: 140,
    availableSeats: 20000,
    homeFlag: '🇪🇸',
    awayFlag: '🇩🇪'
  },
  {
    id: 'm3',
    homeTeam: 'Maroc',
    awayTeam: 'Portugal',
    date: '2030-06-17',
    time: '20:00',
    stadium: 'Stade Mohammed V',
    city: 'Casablanca',
    country: 'Maroc',
    phase: 'Groupe',
    price: 120,
    availableSeats: 18000,
    homeFlag: '🇲🇦',
    awayFlag: '🇵🇹'
  },
  {
    id: 'm4',
    homeTeam: 'Argentine',
    awayTeam: 'Angleterre',
    date: '2030-06-18',
    time: '19:00',
    stadium: 'Estadio Monumental',
    city: 'Buenos Aires',
    country: 'Argentine',
    phase: 'Groupe',
    price: 160,
    availableSeats: 12000,
    homeFlag: '🇦🇷',
    awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
  },
  {
    id: 'm5',
    homeTeam: 'Uruguay',
    awayTeam: 'Italie',
    date: '2030-06-19',
    time: '17:00',
    stadium: 'Estadio Centenario',
    city: 'Montevideo',
    country: 'Uruguay',
    phase: 'Groupe',
    price: 130,
    availableSeats: 16000,
    homeFlag: '🇺🇾',
    awayFlag: '🇮🇹'
  },
  {
    id: 'm6',
    homeTeam: 'France',
    awayTeam: 'Argentine',
    date: '2030-07-10',
    time: '21:00',
    stadium: 'Santiago Bernabéu',
    city: 'Madrid',
    country: 'Espagne',
    phase: 'Demi-finales',
    price: 350,
    availableSeats: 8000,
    homeFlag: '🇫🇷',
    awayFlag: '🇦🇷'
  },
  {
    id: 'm7',
    homeTeam: 'Espagne',
    awayTeam: 'Brésil',
    date: '2030-07-14',
    time: '20:00',
    stadium: 'Camp Nou',
    city: 'Barcelone',
    country: 'Espagne',
    phase: 'Finale',
    price: 500,
    availableSeats: 5000,
    homeFlag: '🇪🇸',
    awayFlag: '🇧🇷'
  }
];

// Fan Zones
export const fanZones: FanZone[] = [
  {
    id: 'fz1',
    name: 'Madrid Fan Zone',
    city: 'Madrid',
    country: 'Espagne',
    coordinates: { lat: 40.4168, lng: -3.7038 },
    capacity: 50000,
    activities: ['Écran géant', 'Food trucks', 'Concerts live', 'Zone enfants']
  },
  {
    id: 'fz2',
    name: 'Barcelona Fan Village',
    city: 'Barcelone',
    country: 'Espagne',
    coordinates: { lat: 41.3851, lng: 2.1734 },
    capacity: 45000,
    activities: ['Écran géant', 'Bar à tapas', 'Animations DJ', 'Photobooth']
  },
  {
    id: 'fz3',
    name: 'Casablanca Football Plaza',
    city: 'Casablanca',
    country: 'Maroc',
    coordinates: { lat: 33.5883, lng: -7.6114 },
    capacity: 40000,
    activities: ['Écran géant', 'Cuisine marocaine', 'Musique traditionnelle', 'Souk artisanal']
  }
];

// Recommandations
export const recommendations: Recommendation[] = [
  {
    id: 'r1',
    type: 'hotel',
    title: 'Hôtel Bernabéu Plaza',
    description: 'À 10 minutes à pied du stade, chambres modernes avec vue',
    price: 120,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1671069833604-34a8b4d9a812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzY4MDQzMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'r2',
    type: 'restaurant',
    title: 'Tapas del Estadio',
    description: 'Cuisine espagnole authentique, spécialité paella',
    price: 35,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1671069833604-34a8b4d9a812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzY4MDQzMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'r3',
    type: 'transport',
    title: 'Navette Stade Express',
    description: 'Service de bus direct de votre hôtel au stade',
    price: 15,
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1671069833604-34a8b4d9a812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzY4MDQzMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'r4',
    type: 'activity',
    title: 'Visite du Musée du Football',
    description: 'Découvrez l\'histoire du football mondial',
    price: 25,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1671069833604-34a8b4d9a812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzY4MDQzMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

// Messages du chatbot
export const chatbotResponses: Record<string, string> = {
  'horaires': 'Les matchs de la phase de groupes commencent le 15 juin 2030. Les horaires sont: 17h00, 18h00, 20h00 et 21h00 (heure locale). La finale aura lieu le 14 juillet à 20h00.',
  'parking': 'Tous les stades disposent de parkings officiels. Réservez votre place à l\'avance via l\'application. Prix: 15-25€ par match. Alternative: utilisez les transports en commun, gratuits avec votre billet de match!',
  'transport': 'Des navettes gratuites circulent entre les Fan Zones et les stades 3h avant le match. Métro gratuit avec présentation de votre billet électronique. Ligne directe disponible depuis l\'aéroport.',
  'hotels': 'Nous recommandons de réserver votre hôtel au moins 3 mois à l\'avance. Des packages officiels incluant billet + hôtel sont disponibles. Consultez la section Recommandations pour nos partenaires certifiés.',
  'billetterie': 'La billetterie ouvre 6 mois avant le premier match. Prix: 80€ (phase de groupes) à 500€ (finale). Paiement sécurisé par Stripe. Votre billet électronique QR Code est immédiatement disponible.',
  'règles': 'Entrée au stade 2h avant le coup d\'envoi. Objets interdits: bouteilles en verre, armes, fumigènes. Drapeaux autorisés (max 2m x 1.5m). Contrôle de sécurité obligatoire.',
  'météo': 'En juin-juillet, températures moyennes: Madrid 28°C, Barcelone 25°C, Casablanca 24°C, Buenos Aires 10°C (hiver), Montevideo 12°C. Prévoyez crème solaire et casquette!',
  'accessibilité': 'Tous les stades sont accessibles PMR. Places dédiées avec vue optimale. Service d\'assistance gratuit, réservez 48h à l\'avance. Chiens guides autorisés.',
  'nourriture': 'Restaurants dans tous les stades. Prix moyens: 8-15€. Eau gratuite aux fontaines. Allergies? Signalez-le lors de l\'achat, menus spéciaux disponibles.',
  'default': 'Je suis FanBot, votre assistant personnel pour la Coupe du Monde 2030! Je peux vous aider avec: les horaires, le parking, les transports, les hôtels, la billetterie, les règles du stade, et bien plus. Posez-moi votre question!'
};

// Utilisateur mock
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  favoriteTeam?: string;
  tickets: Ticket[];
}

export const mockUser: User = {
  id: 'user1',
  email: 'thomas@example.com',
  name: 'Thomas Martin',
  favoriteTeam: 'France',
  tickets: []
};
