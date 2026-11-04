import ProductDetail from './pages/ProductDetail'
import { products } from './data/catalogue'
import './product-detail.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Collections from './components/Collections'
import BookingModal from './components/BookingModal'
import { Journey, Jewellers, Faq, Footer } from './components/Sections'
import { AppProvider } from './context/ShopContext'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import LocationProvider from './context/LocationProvider'
import ExploreShops from './pages/ExploreShops'
import StoreDetail from './pages/StoreDetail'
import { stores } from './data/stores'
import { jewelleryCategories } from './data/categories'
import ProductListing from './pages/ProductListing'
import CategoryNavigation from './components/CategoryNavigation'
import './App.css'
import './shops.css'
import './products.css'
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const titles: Record<string, string> = { '/': 'SonaSetu — A connection you can trust', '/explore-shops': 'Explore Kolkata Jewellers | SonaSetu' }
    const store = pathname.startsWith('/shop/') ? stores.find(item => `/shop/${item.slug}` === pathname) : undefined
    const product = products.find(item => `/product/${item.id}` === pathname)
    const category = jewelleryCategories.find(item => `/jewellery/${item.slug}` === pathname)
    document.title = titles[pathname] ?? (product ? `${product.name} | SonaSetu` : store ? `${store.name} · Kolkata | SonaSetu` : category ? `${category.name} Collection | SonaSetu` : pathname === '/jewellery' ? 'Explore All Jewellery | SonaSetu' : 'Page not found | SonaSetu')
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
function StoreRoute() { const { pathname } = useLocation(); return <StoreDetail key={pathname} /> }
function ProductRoute() { const { pathname } = useLocation(); return <ProductDetail key={pathname} /> }
function ListingRoute() { const { pathname } = useLocation(); return <ProductListing key={pathname} /> }
export default function App() { return <BrowserRouter><AppProvider><LocationProvider><RouteEffects /><Header /><CategoryNavigation /><main><Routes><Route path="/" element={<><Hero /><Collections /><Journey /><Jewellers /><Faq /></>} /><Route path="/jewellery" element={<ListingRoute />} /><Route path="/jewellery/:categorySlug" element={<ListingRoute />} /><Route path="/product/:productId" element={<ProductRoute />} /><Route path="/explore-shops" element={<ExploreShops />} /><Route path="/shop/:slug" element={<StoreRoute />} /><Route path="*" element={<section className="container section empty-state"><h1>Page not found.</h1><Link className="button" to="/explore-shops">Explore stores</Link></section>} /></Routes></main><Footer /><BookingModal /></LocationProvider></AppProvider></BrowserRouter> }
