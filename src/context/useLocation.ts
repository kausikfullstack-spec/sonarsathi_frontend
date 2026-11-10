import { createContext, useContext } from 'react'
import type { Coordinates } from '../data/stores'
export type LocationState = { coordinates: Coordinates | null; accuracy: number | null; status: 'idle' | 'loading' | 'ready' | 'error'; error: string; openCityPicker: () => void; locate: () => void; clear: () => void }
export const LocationContext = createContext<LocationState | null>(null)
export function useLocationState() {
  const state = useContext(LocationContext)
  if (!state) throw new Error('LocationProvider is required')
  return state
}
