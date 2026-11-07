import type { Coordinates, Store } from './stores'
import { distanceKm } from './stores'

export interface ShopFilters {
  query: string
  city: string
  area: string
  categories: string[]
  radius: string
  sort: 'nearest' | 'name'
}

export function filterShops(stores: Store[], filters: ShopFilters, coordinates: Coordinates | null) {
  const query = filters.query.trim().toLowerCase().replace(/midnapore|medinipure/g, 'medinipur').replace(/burdwan/g, 'bardhaman')
  const results = stores.map(store => ({ store, distance: coordinates ? distanceKm(coordinates, store) : undefined })).filter(({ store, distance }) =>
    `${store.name} ${store.city} ${store.area} ${store.address}`.toLowerCase().includes(query)
    && (filters.city === 'all' || store.city === filters.city)
    && (filters.area === 'all' || store.area === filters.area)
    && (!filters.categories.length || filters.categories.some(category => store.categories.includes(category)))
    && (!coordinates || filters.radius === 'all' || (distance !== undefined && distance <= Number(filters.radius))),
  )
  results.sort((a, b) => coordinates && filters.sort === 'nearest' ? (a.distance! - b.distance!) || a.store.name.localeCompare(b.store.name) : a.store.name.localeCompare(b.store.name))
  const nearest = coordinates ? results.reduce<typeof results[number] | undefined>((best, item) => !best || item.distance! < best.distance! ? item : best, undefined) : undefined
  return { results, nearestSlug: nearest?.store.slug }
}
