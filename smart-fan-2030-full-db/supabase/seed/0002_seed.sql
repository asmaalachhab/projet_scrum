-- Smart Fan Companion 2030 - Seed data (from src/app/data/mockData.ts)

-- Stadiums
insert into public.stadiums (id, name, city, country, capacity, image_url, lat, lng)
values
  ('santiago-bernabeu','Santiago Bernabéu','Madrid','Espagne',81044,'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',40.4531,-3.6884),
  ('camp-nou','Camp Nou','Barcelone','Espagne',99354,'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',41.3809,2.1228),
  ('mohammed-v','Stade Mohammed V','Casablanca','Maroc',67000,'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',33.5731,-7.5898),
  ('centenario','Estadio Centenario','Montevideo','Uruguay',60235,'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',-34.8941,-56.1526),
  ('monumental','Estadio Monumental','Buenos Aires','Argentine',83214,'https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGN1cCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4MDQzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',-34.5453,-58.4498)
on conflict (id) do update set
  name=excluded.name,
  city=excluded.city,
  country=excluded.country,
  capacity=excluded.capacity,
  image_url=excluded.image_url,
  lat=excluded.lat,
  lng=excluded.lng;

-- Matches
insert into public.matches (id, home_team, away_team, home_flag, away_flag, date, time, stadium_id, city, country, phase, price, available_seats)
values
  ('m1','France','Brésil','🇫🇷','🇧🇷','2030-06-15','21:00','santiago-bernabeu','Madrid','Espagne','Groupe',150,15000),
  ('m2','Espagne','Allemagne','🇪🇸','🇩🇪','2030-06-16','18:00','camp-nou','Barcelone','Espagne','Groupe',140,20000),
  ('m3','Maroc','Portugal','🇲🇦','🇵🇹','2030-06-17','20:00','mohammed-v','Casablanca','Maroc','Groupe',120,18000),
  ('m4','Argentine','Angleterre','🇦🇷','🏴','2030-06-18','19:00','monumental','Buenos Aires','Argentine','Groupe',160,12000),
  ('m5','Uruguay','Italie','🇺🇾','🇮🇹','2030-06-19','17:00','centenario','Montevideo','Uruguay','Groupe',130,16000),
  ('m6','France','Argentine','🇫🇷','🇦🇷','2030-07-10','21:00','santiago-bernabeu','Madrid','Espagne','Demi-finales',350,8000),
  ('m7','Espagne','Brésil','🇪🇸','🇧🇷','2030-07-14','20:00','camp-nou','Barcelone','Espagne','Finale',500,5000)
on conflict (id) do update set
  home_team=excluded.home_team,
  away_team=excluded.away_team,
  home_flag=excluded.home_flag,
  away_flag=excluded.away_flag,
  date=excluded.date,
  time=excluded.time,
  stadium_id=excluded.stadium_id,
  city=excluded.city,
  country=excluded.country,
  phase=excluded.phase,
  price=excluded.price,
  available_seats=excluded.available_seats;

-- Fan Zones
insert into public.fan_zones (id, name, city, country, lat, lng, capacity, activities)
values
  ('fz1','Madrid Fan Zone','Madrid','Espagne',40.4168,-3.7038,50000, array['Écran géant','Food trucks','Concerts live','Zone enfants']),
  ('fz2','Barcelona Fan Village','Barcelone','Espagne',41.3851,2.1734,45000, array['Écran géant','Bar à tapas','Animations DJ','Photobooth']),
  ('fz3','Casablanca Football Plaza','Casablanca','Maroc',33.5883,-7.6114,40000, array['Écran géant','Cuisine marocaine','Musique traditionnelle','Souk artisanal'])
on conflict (id) do update set
  name=excluded.name,
  city=excluded.city,
  country=excluded.country,
  lat=excluded.lat,
  lng=excluded.lng,
  capacity=excluded.capacity,
  activities=excluded.activities;

-- Recommendations
insert into public.recommendations (id, type, title, description, price, rating, image_url)
values
  ('r1','hotel','Hôtel Bernabéu Plaza','À 10 minutes à pied du stade, chambres modernes avec vue',120,4.50,'https://images.unsplash.com/photo-1671069833604-34a8b4d9a812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzY4MDQzMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080'),
  ('r2','restaurant','Tapas del Estadio','Cuisine espagnole authentique, spécialité paella',35,4.80,'https://images.unsplash.com/photo-1671069833604-34a8b4d9a812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzY4MDQzMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080'),
  ('r3','transport','Navette Stade Express','Service de bus direct de votre hôtel au stade',15,4.30,'https://images.unsplash.com/photo-1671069833604-34a8b4d9a812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzY4MDQzMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080'),
  ('r4','activity','Visite du Musée du Football','Découvrez l\'histoire du football mondial',25,4.60,'https://images.unsplash.com/photo-1671069833604-34a8b4d9a812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzY4MDQzMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080')
on conflict (id) do update set
  type=excluded.type,
  title=excluded.title,
  description=excluded.description,
  price=excluded.price,
  rating=excluded.rating,
  image_url=excluded.image_url;

-- Chatbot FAQ
insert into public.chatbot_faq (key, response)
values
  ('horaires','Les matchs de la phase de groupes commencent le 15 juin 2030. Les horaires sont: 17h00, 18h00, 20h00 et 21h00 (heure locale). La finale aura lieu le 14 juillet à 20h00.'),
  ('parking','Tous les stades disposent de parkings officiels. Réservez votre place à l\'avance via l\'application. Prix: 15-25€ par match. Alternative: utilisez les transports en commun, gratuits avec votre billet de match!'),
  ('transport','Des navettes gratuites circulent entre les Fan Zones et les stades 3h avant le match. Métro gratuit avec présentation de votre billet électronique. Ligne directe disponible depuis l\'aéroport.'),
  ('hotels','Nous recommandons de réserver votre hôtel au moins 3 mois à l\'avance. Des packages officiels incluant billet + hôtel sont disponibles. Consultez la section Recommandations pour nos partenaires certifiés.'),
  ('billetterie','La billetterie ouvre 6 mois avant le premier match. Prix: 80€ (phase de groupes) à 500€ (finale). Paiement sécurisé. Votre billet électronique QR Code est immédiatement disponible.'),
  ('règles','Entrée au stade 2h avant le coup d\'envoi. Objets interdits: bouteilles en verre, armes, fumigènes. Drapeaux autorisés (max 2m x 1.5m). Contrôle de sécurité obligatoire.'),
  ('météo','En juin-juillet, températures moyennes: Madrid 28°C, Barcelone 25°C, Casablanca 24°C, Buenos Aires 10°C (hiver), Montevideo 12°C. Prévoyez crème solaire et casquette!'),
  ('accessibilité','Tous les stades sont accessibles PMR. Places dédiées avec vue optimale. Service d\'assistance gratuit, réservez 48h à l\'avance. Chiens guides autorisés.'),
  ('nourriture','Restaurants dans tous les stades. Prix moyens: 8-15€. Eau gratuite aux fontaines. Allergies? Signalez-le lors de l\'achat, menus spéciaux disponibles.'),
  ('default','Je suis FanBot, votre assistant personnel pour la Coupe du Monde 2030! Je peux vous aider avec: les horaires, le parking, les transports, les hôtels, la billetterie, les règles du stade, et bien plus. Posez-moi votre question!')
on conflict (key) do update set
  response=excluded.response;
