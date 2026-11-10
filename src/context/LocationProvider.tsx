import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { LocationContext } from './useLocation'
import type { LocationState } from './useLocation'
import CityPicker from '../components/CityPicker'
import type { Coordinates } from '../data/stores'
export default function LocationProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [status, setStatus] = useState<LocationState['status']>('idle')
  const [error, setError] = useState('')
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
  const requestId = useRef(0)
  const requestedOnArrival = useRef(false)
  function clear() { requestId.current++; setCoordinates(null); setAccuracy(null); setStatus('idle'); setError('') }
  const locate = useCallback(() => {
    if (!navigator.geolocation) { setError('This browser does not support location. You can still browse every store.'); setStatus('error'); setCityPickerOpen(true); return }
    const currentRequest = ++requestId.current
    setStatus('loading'); setError('')
    navigator.geolocation.getCurrentPosition(position => {
      if (currentRequest !== requestId.current) return
      setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude }); setAccuracy(position.coords.accuracy); setStatus('ready')
    }, issue => {
      if (currentRequest !== requestId.current) return
      setStatus('error')
      setCityPickerOpen(true)
      setError(issue.code === 1 ? 'Location permission was denied. Enable it in your browser settings and try again, or browse all stores below.' : issue.code === 3 ? 'Finding your location timed out. Please try again.' : 'Your location is unavailable right now. Please try again or browse all stores.')
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 })
  }, [])
  useEffect(() => {
    if (requestedOnArrival.current) return
    try { if (localStorage.getItem('sonasathi-city')) return } catch { /* Storage may be disabled. */ }
    const timer = window.setTimeout(() => {
      if (requestedOnArrival.current) return
      requestedOnArrival.current = true
      locate()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [locate])
  return <LocationContext.Provider value={{ coordinates, accuracy, status, error, locate, clear, openCityPicker: () => setCityPickerOpen(true) }}>{children}<CityPicker open={cityPickerOpen} onClose={() => setCityPickerOpen(false)} /></LocationContext.Provider>
}
