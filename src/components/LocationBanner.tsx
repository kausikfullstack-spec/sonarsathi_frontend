import { FiCrosshair, FiMapPin, FiX } from 'react-icons/fi'
import { useLocationState } from '../context/useLocation'
export default function LocationBanner() {
  const { coordinates, accuracy, status, error, locate, clear } = useLocationState()
  return <div className="location-banner"><div className="location-banner-copy"><FiMapPin /><div><strong>{coordinates ? 'Showing distance from your current location' : 'Your next favourite jeweller could be just around the corner.'}</strong><p>{coordinates ? `Location accuracy: approximately ${Math.round(accuracy ?? 0)} m. Your location stays in this browser session.` : 'Allow location access to find which of our five Kolkata stores is closest to you.'}</p>{error && <p className="location-error" role="alert">{error}</p>}</div></div><div className="location-banner-actions"><button className="button small" disabled={status === 'loading'} onClick={locate}><FiCrosshair />{status === 'loading' ? 'Finding you…' : coordinates ? 'Refresh location' : 'Use my current location'}</button>{(coordinates || status === 'loading') && <button className="icon-button" aria-label="Clear location" onClick={clear}><FiX /></button>}</div></div>
}
