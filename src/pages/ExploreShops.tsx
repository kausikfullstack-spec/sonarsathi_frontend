import Select from '../components/ui/Select'
import './explore-hero.css'
import './shop-directory.css'
import HeadingShine from '../components/ui/HeadingShine'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCrosshair, FiMapPin, FiNavigation, FiRefreshCw, FiSearch, FiSliders, FiX } from 'react-icons/fi'
import { stores } from '../data/stores'
import { filterShops } from '../data/shop-filters'
import type { ShopFilters } from '../data/shop-filters'
import { jewelleryCategories } from '../data/categories'
import { useLocationState } from '../context/useLocation'
import DirectoryStoreCard from '../components/DirectoryStoreCard'

const cities = [...new Set(stores.map(store => store.city))]
const allCategories = jewelleryCategories.map(category => category.name).filter(category => stores.some(store => store.categories.includes(category)))

export default function ExploreShops() {
  const { coordinates, status, error, locate, clear } = useLocationState()
  const [filters, setFilters] = useState<ShopFilters>({ query: '', city: 'all', area: 'all', categories: [], radius: 'all', sort: 'nearest' })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { results, nearestSlug } = filterShops(stores, filters, coordinates)
  const areas = stores.filter(store => filters.city === 'all' || store.city === filters.city).map(store => store.area).sort((a, b) => a.localeCompare(b))
  const active = Number(Boolean(filters.query.trim())) + Number(filters.city !== 'all') + Number(filters.area !== 'all') + filters.categories.length + Number(Boolean(coordinates && filters.radius !== 'all'))
  const change = <K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) => setFilters(previous => ({ ...previous, [key]: value }))
  function reset() { setFilters({ query: '', city: 'all', area: 'all', categories: [], radius: 'all', sort: coordinates ? 'nearest' : 'name' }) }
  function nearMe() {
    setFilters(previous => ({ ...previous, city: 'all', area: 'all', radius: '25', sort: 'nearest' }))
    if (!coordinates) locate()
  }
  function clearLocation() { clear(); setFilters(previous => ({ ...previous, radius: 'all', sort: 'name' })) }
  function selectCity(city: string) { setFilters(previous => ({ ...previous, city, area: 'all' })) }
  function toggleCategory(category: string) { change('categories', filters.categories.includes(category) ? filters.categories.filter(value => value !== category) : [...filters.categories, category]) }

  return <>
    <section className="directory-hero"><div className="container"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Explore shops</span></div><div className="directory-hero-layout"><div className="directory-hero-copy"><div className="eyebrow">GOOD PEOPLE. BEAUTIFUL CRAFT. CLOSER TO YOU.</div><h1><HeadingShine>Find your gold.<br /><em>Meet your jeweller.</em></HeadingShine></h1><p>From Park Street to Bardhaman, Bankura, and Medinipur.<br />Discover jewellery and plan a visit closer to home.</p><div className="directory-stats"><span><strong>{String(stores.length).padStart(2, '0')}</strong> demo jewellers</span><span><strong>{String(cities.length).padStart(2, '0')}</strong> West Bengal cities</span><span>Explore online. Buy in store.</span></div></div><figure className="directory-hero-art"><img src="/product-images/1-front.jpg" alt="A gold necklace with delicate leaf and bow details" fetchPriority="high" /><figcaption><span>A LITTLE CRAFT. A LASTING CONNECTION.</span><span>Sample jewellery collection</span></figcaption></figure></div></div></section>
    <section className="container directory-content">
      <div className="shop-directory-top"><label className="shop-directory-search"><FiSearch aria-hidden="true" /><input aria-label="Search stores" placeholder="Search jeweller, city, or neighbourhood..." value={filters.query} onChange={event => change('query', event.target.value)} />{filters.query && <button type="button" aria-label="Clear store search" onClick={() => change('query', '')}><FiX /></button>}</label><button className="shop-mobile-filters" type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="jeweller-filters"><FiSliders aria-hidden="true" />Filters{active > 0 && <span>{active}</span>}</button></div>
      <div className="shop-directory-layout">
        <aside className={`shop-filter-sidebar${filtersOpen ? ' is-open' : ''}`} id="jeweller-filters" aria-label="Filter jewellers">
          <div className="shop-filter-heading"><strong><FiSliders aria-hidden="true" />Refine your search</strong><button type="button" onClick={reset}>Reset</button></div>
          <div className="shop-location-filter"><strong className="shop-location-title"><FiNavigation aria-hidden="true" />Nearby shops</strong><button className="shop-locate-button" type="button" onClick={nearMe} disabled={status === 'loading'}><FiCrosshair aria-hidden="true" />{status === 'loading' ? 'Locating...' : coordinates ? 'Show nearby shops' : 'Use my location'}</button>
            {coordinates && <div className="shop-location-compact"><span className="shop-location-status" role="status"><span className="shop-location-dot" aria-hidden="true" />Location on</span><div className="shop-location-actions"><button type="button" onClick={locate} disabled={status === 'loading'} aria-label="Refresh location" title="Refresh location"><FiRefreshCw aria-hidden="true" /></button><button type="button" onClick={clearLocation} aria-label="Clear location" title="Clear location"><FiX aria-hidden="true" /></button></div></div>}
            {error && <p className="shop-location-error" role="alert">{error.includes('denied') ? 'Location blocked. Enable it in your browser.' : error.includes('timed out') ? 'Location timed out. Try again.' : 'Location unavailable. Choose a city below.'}</p>}
            <label className="shop-radius-label" htmlFor="shop-radius">Distance<Select id="shop-radius" aria-label="Distance radius" value={coordinates ? filters.radius : 'all'} disabled={!coordinates} onChange={event => change('radius', event.target.value)}><option value="all">Any distance</option>{[2, 5, 10, 25, 50, 100, 200].map(radius => <option key={radius} value={String(radius)}>Within {radius} km</option>)}</Select></label>
          </div>
          <fieldset className="shop-filter-group"><legend>City</legend><label className="shop-filter-choice"><input type="radio" name="shop-city" value="all" checked={filters.city === 'all'} onChange={() => selectCity('all')} /><span>All cities</span><small>{stores.length}</small></label>{cities.map(city => <label className="shop-filter-choice" key={city}><input type="radio" name="shop-city" value={city} checked={filters.city === city} onChange={() => selectCity(city)} /><span>{city}</span><small>{stores.filter(store => store.city === city).length}</small></label>)}</fieldset>
          <fieldset className="shop-filter-group"><legend>Neighbourhood</legend><Select aria-label="Neighbourhood" value={filters.area} onChange={event => change('area', event.target.value)}><option value="all">All neighbourhoods</option>{areas.map(area => <option value={area} key={area}>{area}</option>)}</Select></fieldset>
          <fieldset className="shop-filter-group"><legend>Collections</legend><div className="shop-category-options">{allCategories.map(category => <label className="shop-filter-choice" key={category}><input type="checkbox" checked={filters.categories.includes(category)} onChange={() => toggleCategory(category)} /><span>{category}</span></label>)}</div></fieldset>
          <p className="shop-filter-note">Distances use approximate demo store pins. Check Directions before your visit.</p>
        </aside>
        <div className="shop-directory-results">
          <div className="shop-results-toolbar"><p aria-live="polite"><strong>{results.length}</strong> {results.length === 1 ? 'jeweller' : 'jewellers'} {filters.city === 'all' ? 'across West Bengal' : `in ${filters.city}`}{coordinates && <span>Distances from your current location</span>}</p><label><span>Sort by</span><Select aria-label="Sort stores" value={coordinates ? filters.sort : 'name'} onChange={event => change('sort', event.target.value as ShopFilters['sort'])}><option value="nearest" disabled={!coordinates}>Nearest first</option><option value="name">Name: A-Z</option></Select></label></div>
          {active > 0 && <div className="shop-active-filters"><span>{active} {active === 1 ? 'filter' : 'filters'} applied</span>{filters.city !== 'all' && <button type="button" onClick={() => selectCity('all')}>{filters.city}<FiX aria-hidden="true" /></button>}{filters.area !== 'all' && <button type="button" onClick={() => change('area', 'all')}>{filters.area}<FiX aria-hidden="true" /></button>}{coordinates && filters.radius !== 'all' && <button type="button" onClick={() => change('radius', 'all')}>Within {filters.radius} km<FiX aria-hidden="true" /></button>}{filters.categories.map(category => <button key={category} type="button" onClick={() => toggleCategory(category)}>{category}<FiX aria-hidden="true" /></button>)}<button className="shop-clear-all" type="button" onClick={reset}>Clear all</button></div>}
          <div className="directory-shop-grid">{results.map(({ store, distance }) => <DirectoryStoreCard key={store.slug} store={store} distance={distance} nearest={store.slug === nearestSlug} />)}</div>
          {results.length === 0 && <div className="empty-state shop-directory-empty"><FiMapPin aria-hidden="true" /><h3>No jewellers match just yet.</h3><p>Try another city, a wider distance, or fewer collection filters.</p><button className="button small" type="button" onClick={reset}>Clear filters</button></div>}
        </div>
      </div>
      <div className="directory-disclaimer"><strong>A little clarity before you visit</strong><p>These are fictional demo jewellers in Kolkata, Bardhaman, Bankura, and Medinipur. Photos, collections, reviews, and hours are samples. Regional addresses and store pins indicate approximate neighbourhoods. Use Directions to check the address and route.</p></div>
    </section>
  </>
}
