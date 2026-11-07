import { NavLink } from 'react-router-dom'
import { FiShoppingCart, FiUser } from 'react-icons/fi'
import { LuHandshake, LuMegaphone } from 'react-icons/lu'
import './header-utilities.css'

const shortcuts = [
  { label: 'Offers', path: '/offers', icon: LuMegaphone },
  { label: 'Become a seller', path: '/become-a-seller', icon: LuHandshake },
  { label: 'Account', path: '/account', icon: FiUser },
  { label: 'Cart', path: '/cart', icon: FiShoppingCart },
]

export default function HeaderUtilities() {
  return <nav className="header-shortcuts" aria-label="Shopping shortcuts">
    {shortcuts.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} className={({ isActive }) => `header-shortcut${isActive ? ' active' : ''}`}><Icon aria-hidden="true" /><span>{label}</span></NavLink>)}
  </nav>
}
