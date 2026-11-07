import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiGrid, FiMapPin, FiNavigation } from 'react-icons/fi'
import type { Store } from '../data/stores'
import { directionsUrl, formatDistance } from '../data/stores'
import { useLocationState } from '../context/useLocation'
import { StoreRating } from './StoreReviews'
import { storeBanners } from '../data/store-banners'
import './directory-store-card.css'

export default function DirectoryStoreCard({ store, distance, nearest = false }: { store: Store; distance?: number; nearest?: boolean }) {
  const { coordinates, locate, status } = useLocationState()
  return <article className="directory-shop-card" data-store={store.slug}>
    <Link className="directory-shop-photo" to={`/shop/${store.slug}`} aria-label={`Explore ${store.name}`}>
      <img src={storeBanners[store.slug] || store.image} alt={`Jewellery showroom inspiration for the ${store.name} demo profile`} loading="lazy" decoding="async" />
      <span className="directory-shop-image-shade" />
      <span className="directory-shop-demo">Demo jeweller</span>
      <span className="directory-shop-design-count"><FiGrid aria-hidden="true" />{store.productIds.length} designs</span>
      <span className="directory-shop-photo-caption">{store.specialty}<span>Showroom inspiration · sample photo</span></span>
      {nearest && <span className="directory-shop-nearest"><FiNavigation aria-hidden="true" />Nearest to you</span>}
    </Link>
    <div className="directory-shop-body">
      <div className="directory-shop-identity"><span className="directory-shop-monogram" aria-hidden="true">{store.initials}</span><span className="directory-shop-area"><FiMapPin aria-hidden="true" />{store.area}, {store.city}</span></div>
      <h2><Link to={`/shop/${store.slug}`}>{store.name}</Link></h2>
      <StoreRating slug={store.slug} />
      <p className="directory-shop-description">{store.description}</p>
      <div className="directory-shop-categories" aria-label="Collections">{store.categories.slice(0, 3).map(category => <Link key={category} to={`/shop/${store.slug}`}>{category}</Link>)}{store.categories.length > 3 && <Link className="directory-shop-more" to={`/shop/${store.slug}`} aria-label={`View all ${store.categories.length} collections`}>+{store.categories.length - 3} more</Link>}</div>
      <div className="directory-shop-location"><FiMapPin aria-hidden="true" /><div><span>VISIT THE STORE</span><p>{store.address}</p></div></div>
      <div className="directory-shop-distance"><FiNavigation aria-hidden="true" />{distance === undefined ? <button type="button" onClick={locate} disabled={status === 'loading'}>{status === 'loading' ? 'Finding your location...' : 'Enable location to see distance'}</button> : <span><strong>Approx. {formatDistance(distance)} away</strong></span>}</div>
      <div className="directory-shop-actions"><Link className="button" to={`/shop/${store.slug}`}>Explore jeweller<FiArrowUpRight aria-hidden="true" /></Link><a className="directory-shop-directions" href={directionsUrl(store, coordinates)} target="_blank" rel="noopener noreferrer"><FiNavigation aria-hidden="true" />Directions</a></div>
    </div>
  </article>
}
