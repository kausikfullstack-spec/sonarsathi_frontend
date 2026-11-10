import HeadingShine from './components/ui/HeadingShine'
import FeaturedCarousel from './components/FeaturedCarousel'
import Offers from './pages/Offers'
import BecomeSeller from './pages/BecomeSeller'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import { products } from './data/catalogue'
import './product-detail.css'
import Header from './components/Header'
import MobileBottomNav from './components/MobileBottomNav'
import Hero from './components/Hero'
import Collections from './components/Collections'
import TrustedBusinesses from './components/TrustedBusinesses'
import BookingModal from './components/BookingModal'
import { Journey, Jewellers, Faq, Footer } from './components/Sections'
import { AppProvider } from './context/ShopContext'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
    const titles: Record<string, string> = { '/offers': 'Offers | SonaSathi', '/become-a-seller': 'Become a seller | SonaSathi', '/account': 'Login | SonaSathi', '/login': 'Login | SonaSathi', '/register': 'Register | SonaSathi', '/cart': 'Your cart | SonaSathi', '/': 'SonaSathi | A connection you can trust', '/explore-shops': 'Explore West Bengal Jewellers | SonaSathi' }
    const store = pathname.startsWith('/shop/') ? stores.find(item => `/shop/${item.slug}` === pathname) : undefined
    const product = products.find(item => `/product/${item.id}` === pathname)
    const category = jewelleryCategories.find(item => `/jewellery/${item.slug}` === pathname)
    document.title = titles[pathname] ?? (product ? `${product.name} | SonaSathi` : store ? `${store.name} | ${store.city} | SonaSathi` : category ? `${category.name} Collection | SonaSathi` : pathname === '/jewellery' ? 'Explore All Jewellery | SonaSathi' : 'Page not found | SonaSathi')
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
function StoreRoute() { const { pathname } = useLocation(); return <StoreDetail key={pathname} /> }
function ProductRoute() { const { pathname } = useLocation(); return <ProductDetail key={pathname} /> }
function ListingRoute() { const { pathname } = useLocation(); return <ProductListing key={pathname} /> }
function SiteRoutes() { const { pathname } = useLocation(); const authPage = ['/login', '/register', '/account'].includes(pathname); return <><RouteEffects />{!authPage && <><Header /><CategoryNavigation /></>}<main className={authPage ? 'auth-main' : undefined}><Routes><Route path="/offers" element={<Offers />} /><Route path="/become-a-seller" element={<BecomeSeller />} /><Route path="/account" element={<Navigate to="/login" replace />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/cart" element={<Cart />} /><Route path="/" element={<><Hero /><TrustedBusinesses /><Jewellers /><Collections /><Journey /><FeaturedCarousel /><Faq /></>} /><Route path="/jewellery" element={<ListingRoute />} /><Route path="/jewellery/:categorySlug" element={<ListingRoute />} /><Route path="/product/:productId" element={<ProductRoute />} /><Route path="/explore-shops" element={<ExploreShops />} /><Route path="/shop/:slug" element={<StoreRoute />} /><Route path="*" element={<section className="container section empty-state"><h1><HeadingShine>Page not found.</HeadingShine></h1><Link className="button" to="/explore-shops">Explore stores</Link></section>} /></Routes></main>{!authPage && <><Footer /><BookingModal /></>}<MobileBottomNav /></> }
export default function App() { return <BrowserRouter><AppProvider><LocationProvider><SiteRoutes /></LocationProvider></AppProvider></BrowserRouter> }

