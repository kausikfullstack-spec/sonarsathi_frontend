import { AppContext } from './useShop'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../data/catalogue'
export function AppProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState('Kolkata')
  const [category, setCategory] = useState('All jewellery')
  const [search, setSearch] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)
  const [booking, setBooking] = useState<Product | null>(null)
  const [wishlist, setWishlist] = useState<number[]>(() => { try { const saved = JSON.parse(localStorage.getItem('sonasathi-wishlist') || localStorage.getItem('sonasetu-wishlist') || '[]'); return Array.isArray(saved) ? saved.filter((id): id is number => typeof id === 'number') : [] } catch { return [] } })
  useEffect(() => { localStorage.setItem('sonasathi-wishlist', JSON.stringify(wishlist)) }, [wishlist])
  const toggleWishlist = (id: number) => setWishlist(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id])
  return <AppContext.Provider value={{ city, setCity, category, setCategory, search, setSearch, wishlist, toggleWishlist, savedOnly, setSavedOnly, booking, setBooking }}>{children}</AppContext.Provider>
}

