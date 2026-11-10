import { useEffect, useRef, useState } from 'react'
import { FiCheck, FiMapPin, FiSearch, FiX } from 'react-icons/fi'
import { stores } from '../data/stores'
import { useShop } from '../context/useShop'
import './city-picker.css'

const cities = [...new Set(stores.map(store => store.city))].sort()

export default function CityPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const { city, setCity } = useShop()
  const [query, setQuery] = useState('')
  useEffect(() => {
    if (!open) { dialog.current?.close(); return }
    const previousFocus = document.activeElement as HTMLElement | null
    dialog.current?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; previousFocus?.focus() }
  }, [open])
  const results = cities.filter(value => value.toLowerCase().includes(query.trim().toLowerCase()))
  function close() { setQuery(''); onClose() }
  function choose(value: string) {
    setCity(value)
    try { localStorage.setItem('sonasathi-city', value) } catch { /* Selection still works without storage. */ }
    close()
  }
  return <dialog ref={dialog} className="city-picker" aria-labelledby="city-picker-title" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close() }}>
    <div className="city-picker-top"><h2 id="city-picker-title">Choose your <em>city.</em></h2><button type="button" className="icon-button" aria-label="Close city selection" onClick={close}><FiX /></button></div>
    <label className="city-picker-search"><FiSearch aria-hidden="true" /><input autoFocus type="search" aria-label="Search cities" placeholder="Search for your city..." value={query} onChange={event => setQuery(event.target.value)} /></label>
    <div className="city-picker-list-heading">Available cities <span aria-live="polite">{results.length} {results.length === 1 ? 'city' : 'cities'}</span></div>
    <div className="city-picker-list">{results.map(value => <button type="button" key={value} className={value === city ? 'selected' : ''} onClick={() => choose(value)} aria-pressed={value === city}><FiMapPin aria-hidden="true" /><span>{value}</span>{value === city && <FiCheck aria-hidden="true" />}</button>)}</div>
    {results.length === 0 && <p className="city-picker-empty" role="status">No cities found. Try another name.</p>}
  </dialog>
}
