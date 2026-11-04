import { products } from './catalogue'

export const stores = [
  { slug: 'bowbazar-gold-house', name: 'Bowbazar Gold House', area: 'Bowbazar', address: '166, Bepin Behari Ganguly St, Baithakkhana, Chandni Chawk, Bowbazar, Kolkata, West Bengal 700014', lat: 22.5685, lng: 88.3659, initials: 'BG', specialty: 'Traditional gold', categories: ['Necklaces', 'Bangles', 'Rings'], description: 'Discover traditional gold designs, intricate necklaces, and pieces for your family celebrations in the heart of Bowbazar.', productIds: [1, 3, 4], image: products[0].image },
  { slug: 'bhowanipore-jewel-studio', name: 'Bhowanipore Jewel Studio', area: 'Bhowanipore', address: '3, Ashutosh Mukherjee Rd, Gaza Park, Sreepally, Bhowanipore, Kolkata, West Bengal 700020', lat: 22.5390, lng: 88.3465, initials: 'BJ', specialty: 'Everyday diamonds', categories: ['Earrings', 'Rings', 'Pendants'], description: 'A neighbourhood studio for delicate diamonds and understated everyday pieces. Discover something meaningful for yourself or someone you love.', productIds: [2, 3, 6], image: products[2].image },
  { slug: 'salt-lake-gold-gallery', name: 'Salt Lake Gold Gallery', area: 'Salt Lake', address: 'BUS STOP, BA 54 SECTOR 1, behind Hariyana Vidya Mandir, BIDHAN NAGAR, Bidhannagar, Kolkata, West Bengal 700064', lat: 22.5984, lng: 88.4088, initials: 'SG', specialty: 'Contemporary gold', categories: ['Bracelets', 'Pendants', 'Earrings'], description: 'Modern silhouettes meet the warmth of gold. Browse a collection of wearable favourites for workdays, weekends, and everything in between.', productIds: [2, 5, 6], image: products[5].image },
  { slug: 'diamond-plaza-jewels', name: 'Diamond Plaza Jewels', area: 'Jessore Road', address: '4th Floor, DIAMOND PLAZA MALL, 68, Jessore Rd, Kolkata, West Bengal 700055', lat: 22.6155, lng: 88.4122, initials: 'DP', specialty: 'Occasion jewellery', categories: ['Rings', 'Necklaces', 'Earrings'], description: 'Make your milestones shine with an occasion collection of statement necklaces, diamond-inspired rings, and thoughtful gifts.', productIds: [1, 2, 3], image: products[1].image },
  { slug: 'baguiati-heritage-jewellers', name: 'Baguiati Heritage Jewellers', area: 'Baguiati', address: 'DC 1/12 Shastribagan, VIP Rd, opposite to Apex Nursing Home, beside To VIP Sweets, Desh Bandhu Nagar, Kolkata, West Bengal 700059', lat: 22.6111, lng: 88.4293, initials: 'BH', specialty: 'Bridal favourites', categories: ['Bangles', 'Necklaces', 'Bracelets'], description: 'Celebrate a new chapter with classic bridal-inspired designs, warm gold bangles, and heirloom-style pieces to treasure.', productIds: [1, 4, 5], image: products[3].image },
].map(store => ({ ...store, productIds: products.filter(product => product.storeSlug === store.slug).map(product => product.id), categories: [...new Set(products.filter(product => product.storeSlug === store.slug).map(product => product.category))] }))
export type Store = typeof stores[number]
export type Coordinates = { lat: number; lng: number }
// Approximate neighbourhood pins for dummy listings, not surveyed storefront coordinates.
export function distanceKm(from: Coordinates, to: Coordinates) {
  const rad = (degrees: number) => degrees * Math.PI / 180
  const a = Math.sin(rad(to.lat - from.lat) / 2) ** 2 + Math.cos(rad(from.lat)) * Math.cos(rad(to.lat)) * Math.sin(rad(to.lng - from.lng) / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)))
}
export const formatDistance = (km: number) => km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
export const directionsUrl = (store: Store, origin?: Coordinates | null) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}${origin ? `&origin=${origin.lat},${origin.lng}` : ''}`
