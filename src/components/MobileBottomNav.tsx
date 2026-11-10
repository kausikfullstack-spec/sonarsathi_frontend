import { NavLink, useLocation } from 'react-router-dom'
import { FiShoppingBag, FiMapPin, FiUser, FiShoppingCart } from 'react-icons/fi'
import './mobile-bottom-nav.css'

const links = [
  { label: 'Explore jewellery', path: '/jewellery', icon: FiShoppingBag },
  { label: 'Find jewellers', path: '/explore-shops', icon: FiMapPin },
  { label: 'Account', path: '/account', icon: FiUser },
  { label: 'Cart', path: '/cart', icon: FiShoppingCart },
]

export default function MobileBottomNav() {
  const { pathname } = useLocation()
  return <nav className="mobile-bottom-nav" aria-label="Main mobile navigation">
    {links.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} className={({ isActive }) => `mobile-bottom-link${isActive || (path === '/account' && ['/login', '/register'].includes(pathname)) || (path === '/explore-shops' && pathname.startsWith('/shop/')) ? ' active' : ''}`}><Icon aria-hidden="true" /><span>{label}</span></NavLink>)}
  </nav>
}
