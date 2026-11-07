import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiMapPin, FiNavigation } from 'react-icons/fi'
import type { Store } from '../data/stores'
import { directionsUrl, formatDistance } from '../data/stores'
import { useLocationState } from '../context/useLocation'
import { StoreRating } from './StoreReviews'
import './home-jeweller-card.css'

export default function HomeJewellerCard({ store, distance }: { store: Store; distance?: number }) {
  const { coordinates } = useLocationState()
  return <article className="home-jeweller-card" data-store={store.slug}>
    <Link className="home-jeweller-photo" to={`/shop/${store.slug}`} aria-label={`Explore ${store.name}`}>
      <img src={store.image} alt={`${store.name} sample jewellery collection`} loading="lazy" decoding="async" />
      <span className="home-jeweller-demo">Demo jeweller</span>
      <span className="home-jeweller-photo-note">{store.productIds.length} designs to discover<FiArrowUpRight aria-hidden="true" /></span>
    </Link>
    <div className="home-jeweller-body">
      <div className="home-jeweller-identity"><span className="home-jeweller-logo" aria-hidden="true">{store.initials}</span><span><FiMapPin aria-hidden="true" />{store.area}, Kolkata</span></div>
      <div className="home-jeweller-specialty">{store.specialty}</div>
      <h3><Link to={`/shop/${store.slug}`}>{store.name}</Link></h3>
      <StoreRating slug={store.slug} />
      <p className="home-jeweller-description">{store.description}</p>
      <div className="home-jeweller-tags" aria-label="Collections">{store.categories.slice(0, 2).map(category => <span key={category}>{category}</span>)}{store.categories.length > 2 && <Link to={`/shop/${store.slug}`} aria-label={`Explore all ${store.categories.length} collections`}>+{store.categories.length - 2} collections</Link>}</div>
      {distance !== undefined && <div className="home-jeweller-distance"><FiNavigation aria-hidden="true" />Approx. {formatDistance(distance)} away<span> · straight-line estimate</span></div>}
      <div className="home-jeweller-actions"><Link className="button" to={`/shop/${store.slug}`}>Explore store<FiArrowUpRight aria-hidden="true" /></Link><a className="home-jeweller-directions" href={directionsUrl(store, coordinates)} target="_blank" rel="noopener noreferrer"><FiNavigation aria-hidden="true" />Directions</a></div>
    </div>
  </article>
}
