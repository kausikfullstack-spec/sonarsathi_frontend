import { products } from './catalogue'
import { storeProfiles } from './store-profiles'

export const stores = storeProfiles.map(store => {
  const collection = products.filter(product => product.storeSlug === store.slug)
  return { ...store, productIds: collection.map(product => product.id), categories: [...new Set(collection.map(product => product.category))], image: collection[0]?.image ?? products[0].image }
})
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
