// Wipes the packages collection and reseeds 5 mock packages per type (single, day, week).
// Usage: node scripts/seedPackages.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Package = require('../models/Package');

const img = (file) => `/images/${encodeURI(file)}`;

const singlePackages = [
  {
    name: 'Great Pyramid of Giza',
    city: 'Giza',
    description: 'Stand before the last surviving wonder of the ancient world. Explore the Giza plateau, the Great Pyramid of Khufu and the Sphinx with breathtaking desert panoramas.',
    image: img('Great Pyramid of Giza.jpg'),
    price: 2400, discountedPrice: 1500, rating: 4.9, reviewCount: 312,
    openingHours: '8:00 AM – 5:00 PM', closingDays: 'None — open daily',
    recommendedDuration: 3, guidedTour: 'yes',
    includedServices: 'Entry ticket, Plateau access, Panorama point visit',
    deluxeExtras: 'Private Egyptologist|Inside Great Pyramid ticket|Camel ride at panorama point|Hotel pickup',
  },
  {
    name: 'Karnak Temple Complex',
    city: 'Luxor',
    description: 'Walk through the colossal Hypostyle Hall and the avenue of sphinxes at the largest religious complex ever built, dedicated to the god Amun-Ra.',
    image: img('Karnak Temple Complex.webp'),
    price: 1800, discountedPrice: 1100, rating: 4.8, reviewCount: 204,
    openingHours: '6:00 AM – 5:30 PM', closingDays: 'None — open daily',
    recommendedDuration: 2.5, guidedTour: 'yes',
    includedServices: 'Entry ticket, Site map, Audio guide',
    deluxeExtras: 'Private Egyptologist|Sound & Light show ticket|Hotel pickup',
  },
  {
    name: 'Abu Simbel Temples',
    city: 'Aswan',
    description: 'Marvel at the four colossal statues of Ramesses II carved into the mountainside, relocated stone by stone to save them from the rising waters of Lake Nasser.',
    image: img('Abu Simbel Temples.webp'),
    price: 4500, discountedPrice: 2200, rating: 4.9, reviewCount: 178,
    openingHours: '5:00 AM – 6:00 PM', closingDays: 'None — open daily',
    recommendedDuration: 2, guidedTour: 'no',
    includedServices: 'Entry ticket, Nefertari temple access',
    deluxeExtras: 'Round-trip private A/C car from Aswan|Private Egyptologist|Breakfast box',
  },
  {
    name: 'Grand Egyptian Museum',
    city: 'Giza',
    description: 'Discover the complete Tutankhamun collection and over 100,000 artefacts in the world\'s largest archaeological museum, overlooking the pyramids.',
    image: img('Grand Egyptian Museum.webp'),
    price: 2900, discountedPrice: 1900, rating: 4.8, reviewCount: 256,
    openingHours: '9:00 AM – 6:00 PM', closingDays: 'None — open daily',
    recommendedDuration: 4, guidedTour: 'yes',
    includedServices: 'Entry ticket, Grand Staircase access, Tutankhamun galleries',
    deluxeExtras: 'Private Egyptologist|Skip-the-line entry|Lunch at museum restaurant',
  },
  {
    name: 'Philae Temple',
    city: 'Aswan',
    description: 'Take a short boat ride across the Nile to the island temple of Isis, one of the most romantic and beautifully preserved sanctuaries in Egypt.',
    image: img('Philae Temple.jpg'),
    price: 1500, discountedPrice: 900, rating: 4.7, reviewCount: 143,
    openingHours: '7:00 AM – 4:00 PM', closingDays: 'None — open daily',
    recommendedDuration: 2, guidedTour: 'no',
    includedServices: 'Entry ticket, Shared motorboat transfer',
    deluxeExtras: 'Private motorboat|Private Egyptologist|Sound & Light show ticket',
  },
];

const dayPackages = [
  {
    name: 'Cairo Highlights Day Tour',
    city: 'Cairo',
    description: 'See the essentials of Cairo in one day: the Pyramids of Giza, the Sphinx, the Egyptian Museum and the bustling Khan El Khalili bazaar.',
    image: img('Cairo Highlights Day Tour.jpg'),
    price: 6500, discountedPrice: 4200, rating: 4.8, reviewCount: 289,
    openingHours: 'Departs 08:00 daily', closingDays: 'None',
    duration: 9, minGroup: 2, maxGroup: 15,
    includedServices: 'Egyptologist guide, A/C transport, Entry fees, Lunch',
    itinerary: [
      { time: '08:00', activity: 'Hotel pickup' },
      { time: '09:00', activity: 'Pyramids of Giza & the Sphinx' },
      { time: '12:30', activity: 'Lunch with pyramid views' },
      { time: '14:00', activity: 'Egyptian Museum in Tahrir' },
      { time: '16:00', activity: 'Khan El Khalili bazaar' },
      { time: '17:30', activity: 'Drop-off at hotel' },
    ],
    deluxeExtras: 'Private A/C car|Personal Egyptologist|VIP fast-track entry|Gourmet lunch',
  },
  {
    name: 'Aswan Highlights Day Tour',
    city: 'Aswan',
    description: 'Explore the High Dam, the Unfinished Obelisk and Philae Temple, then sail at sunset on a traditional felucca around Elephantine Island.',
    image: img('Aswan Highlights Day Tour.png'),
    price: 5500, discountedPrice: 3600, rating: 4.7, reviewCount: 167,
    openingHours: 'Departs 07:30 daily', closingDays: 'None',
    duration: 8, minGroup: 2, maxGroup: 12,
    includedServices: 'Egyptologist guide, A/C transport, Entry fees, Felucca ride, Lunch',
    itinerary: [
      { time: '07:30', activity: 'Hotel pickup' },
      { time: '08:15', activity: 'Aswan High Dam' },
      { time: '09:30', activity: 'Unfinished Obelisk' },
      { time: '11:00', activity: 'Philae Temple by motorboat' },
      { time: '13:30', activity: 'Nubian lunch' },
      { time: '15:00', activity: 'Felucca sail around Elephantine Island' },
    ],
    deluxeExtras: 'Private A/C car|Personal Egyptologist|Nubian village visit|Private felucca',
  },
  {
    name: 'Alexandria Full Day Expedition',
    city: 'Alexandria',
    description: 'Travel to the Pearl of the Mediterranean to visit the Catacombs of Kom El Shoqafa, Pompey\'s Pillar, the Qaitbay Citadel and the modern Bibliotheca Alexandrina.',
    image: img('Alexandria Full Day Expedition.jpeg'),
    price: 7200, discountedPrice: 4800, rating: 4.6, reviewCount: 121,
    openingHours: 'Departs 07:00 daily', closingDays: 'Fridays (reduced hours)',
    duration: 12, minGroup: 2, maxGroup: 14,
    includedServices: 'Egyptologist guide, A/C transport from Cairo, Entry fees, Seafood lunch',
    itinerary: [
      { time: '07:00', activity: 'Pickup from Cairo hotel' },
      { time: '10:00', activity: 'Catacombs of Kom El Shoqafa' },
      { time: '11:30', activity: 'Pompey\'s Pillar' },
      { time: '13:00', activity: 'Seafood lunch on the Corniche' },
      { time: '14:30', activity: 'Qaitbay Citadel' },
      { time: '16:00', activity: 'Bibliotheca Alexandrina' },
      { time: '19:00', activity: 'Return to Cairo' },
    ],
    deluxeExtras: 'Private A/C car|Personal Egyptologist|Montaza Palace gardens|Premium seafood lunch',
  },
  {
    name: 'Fayoum Oasis & Wadi El Rayan',
    city: 'Fayoum',
    description: 'Escape the city to Egypt\'s oldest oasis: the waterfalls of Wadi El Rayan, the fossil valley of Wadi El Hitan and the pottery village of Tunis.',
    image: img('Fayoum Oasis & Wadi El Rayan.jpg'),
    price: 5000, discountedPrice: 3200, rating: 4.7, reviewCount: 98,
    openingHours: 'Departs 07:00 daily', closingDays: 'None',
    duration: 10, minGroup: 2, maxGroup: 10,
    includedServices: '4x4 transport, Local guide, Protectorate fees, Bedouin lunch',
    itinerary: [
      { time: '07:00', activity: 'Pickup from Cairo or Giza' },
      { time: '09:30', activity: 'Wadi El Rayan waterfalls' },
      { time: '11:30', activity: 'Wadi El Hitan (Valley of the Whales)' },
      { time: '14:00', activity: 'Bedouin lunch at Lake Qarun' },
      { time: '15:30', activity: 'Tunis pottery village' },
      { time: '18:00', activity: 'Return to hotel' },
    ],
    deluxeExtras: 'Private 4x4|Sandboarding session|Sunset desert tea',
  },
  {
    name: 'Saqqara, Memphis & Dahshur Pyramids',
    city: 'Giza',
    description: 'Trace the evolution of the pyramid from Djoser\'s Step Pyramid at Saqqara to the Bent and Red Pyramids of Dahshur, with a stop at ancient Memphis.',
    image: img('Saqqara, Memphis & Dahshur Pyramids.jpg'),
    price: 5400, discountedPrice: 3500, rating: 4.8, reviewCount: 134,
    openingHours: 'Departs 08:30 daily', closingDays: 'None',
    duration: 7, minGroup: 1, maxGroup: 12,
    includedServices: 'Egyptologist guide, A/C transport, Entry fees, Lunch',
    itinerary: [
      { time: '08:30', activity: 'Hotel pickup' },
      { time: '09:30', activity: 'Memphis open-air museum' },
      { time: '11:00', activity: 'Saqqara & the Step Pyramid of Djoser' },
      { time: '13:00', activity: 'Lunch at a local restaurant' },
      { time: '14:30', activity: 'Bent & Red Pyramids of Dahshur' },
      { time: '16:30', activity: 'Drop-off at hotel' },
    ],
    deluxeExtras: 'Private A/C car|Personal Egyptologist|Inside Red Pyramid access|Serapeum ticket',
  },
];

const weekPackages = [
  {
    name: 'Complete Egypt Discovery',
    city: 'Cairo',
    description: 'The definitive Egypt journey: Cairo\'s pyramids and museums, a Nile flight to Luxor\'s temples and tombs, and the Nubian charm of Aswan.',
    image: img('Complete Egypt Discovery.webp'),
    price: 68000, discountedPrice: 48000, rating: 4.9, reviewCount: 87,
    durationDays: 7, nights: 6, minGroup: 2, maxGroup: 16,
    accommodationIncluded: 'yes', hotelName: 'Marriott Mena House & Sofitel Winter Palace',
    includedServices: 'Egyptologist guide, Domestic flights, A/C transport, Entry fees, Daily breakfast',
    dailyItinerary: [
      { day: 1, title: 'Arrival in Cairo', activities: 'Airport meet & greet, hotel check-in', desc: 'Welcome to Egypt. Transfer to your hotel with pyramid views.', meal: 'Dinner' },
      { day: 2, title: 'Pyramids & Grand Egyptian Museum', activities: 'Giza plateau, Sphinx, GEM', desc: 'A full day with the pharaohs of the Old Kingdom.', meal: 'Breakfast, Lunch' },
      { day: 3, title: 'Islamic & Coptic Cairo', activities: 'Citadel, Hanging Church, Khan El Khalili', desc: 'Explore Cairo\'s medieval heart.', meal: 'Breakfast' },
      { day: 4, title: 'Fly to Luxor', activities: 'Karnak and Luxor temples', desc: 'Morning flight south to ancient Thebes.', meal: 'Breakfast, Lunch' },
      { day: 5, title: 'West Bank of Luxor', activities: 'Valley of the Kings, Hatshepsut Temple, Colossi of Memnon', desc: 'Optional sunrise hot-air balloon ride.', meal: 'Breakfast' },
      { day: 6, title: 'Aswan', activities: 'Philae Temple, felucca sail', desc: 'Drive to Aswan with stops at Edfu and Kom Ombo.', meal: 'Breakfast, Dinner' },
      { day: 7, title: 'Departure', activities: 'Flight back to Cairo, airport transfer', desc: 'Farewell, Egypt.', meal: 'Breakfast' },
    ],
    deluxeExtras: 'Private Egyptologist throughout|Hot-air balloon over Luxor|Abu Simbel excursion|Suite upgrades',
  },
  {
    name: 'Nile Cruise & Siwa Oasis',
    city: 'Luxor',
    description: 'Combine a classic four-night Nile cruise between Luxor and Aswan with a desert adventure to the remote, palm-filled Siwa Oasis.',
    image: img('Nile Cruise & Siwa Oasis.jpeg'),
    price: 78000, discountedPrice: 56000, rating: 4.8, reviewCount: 64,
    durationDays: 8, nights: 7, minGroup: 2, maxGroup: 20,
    accommodationIncluded: 'yes', hotelName: 'MS Sonesta Star Goddess & Adrère Amellal',
    includedServices: 'Egyptologist guide, Full-board cruise, Domestic flights, A/C transport, Entry fees',
    dailyItinerary: [
      { day: 1, title: 'Embark in Luxor', activities: 'Board cruise, Karnak Temple', desc: 'Settle into your cabin on the Nile.', meal: 'Lunch, Dinner' },
      { day: 2, title: 'Luxor West Bank', activities: 'Valley of the Kings, sail to Edfu', desc: 'Royal tombs, then set sail south.', meal: 'Breakfast, Lunch, Dinner' },
      { day: 3, title: 'Edfu & Kom Ombo', activities: 'Temple of Horus, Temple of Sobek', desc: 'Two riverside temples in one day.', meal: 'Breakfast, Lunch, Dinner' },
      { day: 4, title: 'Aswan', activities: 'High Dam, Philae Temple', desc: 'Arrive in Aswan.', meal: 'Breakfast, Lunch, Dinner' },
      { day: 5, title: 'Disembark & fly to Cairo', activities: 'Flight to Cairo, overnight', desc: 'Transfer north for the desert leg.', meal: 'Breakfast' },
      { day: 6, title: 'Drive to Siwa', activities: 'Desert road via Marsa Matruh', desc: 'A scenic journey to the Western Desert.', meal: 'Breakfast, Dinner' },
      { day: 7, title: 'Siwa Oasis', activities: 'Oracle Temple, Cleopatra\'s Spring, Great Sand Sea', desc: 'Sunset over the dunes.', meal: 'Breakfast, Lunch, Dinner' },
      { day: 8, title: 'Departure', activities: 'Return transfer to Cairo', desc: 'End of the journey.', meal: 'Breakfast' },
    ],
    deluxeExtras: 'Suite cabin upgrade|Private desert safari in Siwa|Private Egyptologist|Spa treatment',
  },
  {
    name: 'Red Sea Riviera & Ancient Temples',
    city: 'Hurghada',
    description: 'Balance culture and relaxation: snorkel the coral reefs of the Red Sea from a Hurghada resort and take a day trip to the temples of Luxor.',
    image: img('Red Sea Riviera & Ancient Temples.webp'),
    price: 46000, discountedPrice: 32000, rating: 4.7, reviewCount: 72,
    durationDays: 6, nights: 5, minGroup: 1, maxGroup: 18,
    accommodationIncluded: 'yes', hotelName: 'Steigenberger ALDAU Beach Hotel',
    includedServices: 'Airport transfers, All-inclusive resort, Snorkel boat trip, Luxor day trip, Entry fees',
    dailyItinerary: [
      { day: 1, title: 'Arrive in Hurghada', activities: 'Resort check-in', desc: 'Relax on the beach.', meal: 'Dinner' },
      { day: 2, title: 'Giftun Island snorkelling', activities: 'Boat trip, two reef stops', desc: 'Colourful reefs and turquoise lagoons.', meal: 'Breakfast, Lunch, Dinner' },
      { day: 3, title: 'Luxor day trip', activities: 'Karnak, Valley of the Kings', desc: 'Early drive to Luxor and back.', meal: 'Breakfast, Lunch' },
      { day: 4, title: 'Desert safari', activities: 'Quad biking, Bedouin village', desc: 'Sunset in the Eastern Desert.', meal: 'Breakfast, Dinner' },
      { day: 5, title: 'Free day', activities: 'Beach, spa or optional diving', desc: 'Your day to unwind.', meal: 'Breakfast, Lunch, Dinner' },
      { day: 6, title: 'Departure', activities: 'Airport transfer', desc: 'Goodbye, Red Sea.', meal: 'Breakfast' },
    ],
    deluxeExtras: 'Sea-view suite|Private yacht snorkel day|Private Egyptologist in Luxor',
  },
  {
    name: 'Dahab & Sinai Explorer',
    city: 'Dahab',
    description: 'Hike Mount Sinai for sunrise, visit St. Catherine\'s Monastery and dive the legendary Blue Hole on this laid-back Sinai adventure.',
    image: img('Dahab & Sinai Explorer.webp'),
    price: 35000, discountedPrice: 24000, rating: 4.8, reviewCount: 59,
    durationDays: 5, nights: 4, minGroup: 2, maxGroup: 12,
    accommodationIncluded: 'yes', hotelName: 'Dahab Paradise Resort',
    includedServices: 'Bedouin guide, A/C transport, Snorkel equipment, Monastery entry, Daily breakfast',
    dailyItinerary: [
      { day: 1, title: 'Arrive in Dahab', activities: 'Transfer from Sharm airport, check-in', desc: 'Evening stroll on the lighthouse promenade.', meal: 'Dinner' },
      { day: 2, title: 'Blue Hole & Three Pools', activities: 'Snorkelling at two famous sites', desc: 'Some of the clearest water in the world.', meal: 'Breakfast, Lunch' },
      { day: 3, title: 'Mount Sinai sunrise', activities: 'Night hike, St. Catherine\'s Monastery', desc: 'Watch the sun rise over the Sinai peaks.', meal: 'Breakfast' },
      { day: 4, title: 'Coloured Canyon', activities: '4x4 trip and canyon hike', desc: 'Walk between layered rock walls.', meal: 'Breakfast, Lunch' },
      { day: 5, title: 'Departure', activities: 'Airport transfer', desc: 'Farewell to Sinai.', meal: 'Breakfast' },
    ],
    deluxeExtras: 'Intro scuba dive|Private 4x4|Camel trek to Ras Abu Galum',
  },
  {
    name: 'Legendary Egypt Family Journey',
    city: 'Giza',
    description: 'A family-friendly week with kid-focused Egyptologists, camel rides at the pyramids, a short Nile cruise and hands-on hieroglyph workshops.',
    image: img('Legendary Egypt Family Journey.webp'),
    price: 60000, discountedPrice: 42000, rating: 4.9, reviewCount: 48,
    durationDays: 7, nights: 6, minGroup: 3, maxGroup: 15,
    accommodationIncluded: 'yes', hotelName: 'Le Méridien Pyramids & Hilton Luxor',
    includedServices: 'Family Egyptologist, Domestic flights, A/C transport, Entry fees, Daily breakfast',
    dailyItinerary: [
      { day: 1, title: 'Welcome to Cairo', activities: 'Airport pickup, pool time', desc: 'Easy start for jet-lagged travellers.', meal: 'Dinner' },
      { day: 2, title: 'Pyramids & camel ride', activities: 'Giza plateau, Sphinx, camel ride', desc: 'The kids\' favourite day.', meal: 'Breakfast, Lunch' },
      { day: 3, title: 'Museum treasure hunt', activities: 'Grand Egyptian Museum quiz trail', desc: 'Find Tutankhamun\'s golden mask.', meal: 'Breakfast' },
      { day: 4, title: 'Fly to Luxor', activities: 'Karnak, hieroglyph workshop', desc: 'Write your name like a pharaoh.', meal: 'Breakfast, Dinner' },
      { day: 5, title: 'Valley of the Kings', activities: 'Royal tombs, donkey ride', desc: 'Discover the tombs of the kings.', meal: 'Breakfast, Lunch' },
      { day: 6, title: 'Nile felucca & banana island', activities: 'Felucca sail, island picnic', desc: 'A relaxed day on the river.', meal: 'Breakfast, Lunch' },
      { day: 7, title: 'Departure', activities: 'Flight to Cairo, airport transfer', desc: 'Home with souvenirs and stories.', meal: 'Breakfast' },
    ],
    deluxeExtras: 'Family suites|Private Egyptologist|Hot-air balloon over Luxor|Private felucca',
  },
];

const packages = [
  ...singlePackages.map((p) => ({ ...p, type: 'single', status: 'active' })),
  ...dayPackages.map((p) => ({ ...p, type: 'day', status: 'active' })),
  ...weekPackages.map((p) => ({ ...p, type: 'week', status: 'active' })),
];

async function seed() {
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL is not set in .env');
  await mongoose.connect(process.env.MONGO_URL);

  // Keep a backup of whatever is there before wiping it
  const existing = await Package.find().lean();
  if (existing.length) {
    const backupPath = path.join(__dirname, `packages-backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(existing, null, 2));
    console.log(`Backed up ${existing.length} existing packages to ${backupPath}`);
  }

  await Package.deleteMany({});
  const inserted = await Package.insertMany(packages);
  console.log(`Inserted ${inserted.length} packages:`);
  ['single', 'day', 'week'].forEach((t) =>
    console.log(`  ${t}: ${inserted.filter((p) => p.type === t).length}`)
  );
}

seed()
  .catch((err) => { console.error('Seeding failed:', err.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
