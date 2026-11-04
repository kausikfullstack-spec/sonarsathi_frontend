import { createContext, useContext } from 'react'
import type { Product } from '../data/catalogue'
type AppState = { city: string; setCity: (city: string) => void; category: string; setCategory: (category: string) => void; search: string; setSearch: (search: string) => void; wishlist: number[]; toggleWishlist: (id: number) => void; savedOnly: boolean; setSavedOnly: (value: boolean) => void; booking: Product | null; setBooking: (product: Product | null) => void }
export const AppContext = createContext<AppState | null>(null)
export function useShop() { const context = useContext(AppContext); if (!context) throw new Error('useShop requires AppProvider'); return context }
