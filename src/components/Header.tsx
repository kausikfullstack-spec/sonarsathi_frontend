import Select from './ui/Select'
import './header-search.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiArrowUpRight, FiHeart, FiMapPin, FiMenu, FiSearch, FiX } from 'react-icons/fi'
import { RiVipDiamondLine } from 'react-icons/ri'
import { useShop } from '../context/useShop'
import HeaderUtilities from './HeaderUtilities'
export function Brand({ useLogo = false }: { useLogo?: boolean }) { return <Link className={`brand${useLogo ? ' brand--logo' : ''}`} to="/" aria-label="SonaSathi home">{useLogo ? <img src="/brand/sonasathi-gold-luxury-logo.png" alt="SonaSathi" width={2172} height={724} /> : <><RiVipDiamondLine /><span>sona<span className="brand-accent">sathi</span><small>A LITTLE TRUST. A LIFETIME OF GOLD.</small></span></>}</Link> }
export default function Header() {
  const { city, setCity, search, setSearch, wishlist } = useShop()
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const savedOnly = location.pathname === '/jewellery' && new URLSearchParams(location.search).get('saved') === 'true'
  return <><div className="announcement">Beautiful jewellery. Trusted jewellers. A connection that shines. <span>Discover the SonaSathi way <FiArrowUpRight /></span></div><header className="header"><Brand useLogo /><nav className={menu ? 'navigation open' : 'navigation'}><Link to="/jewellery" onClick={() => setMenu(false)}>Explore jewellery</Link><Link to="/explore-shops" onClick={() => setMenu(false)}>Find jewellers</Link><Link to="/#how-it-works" onClick={() => setMenu(false)}>How it works</Link></nav><div className="header-actions"><label className="location"><FiMapPin /><Select variant="header" aria-label="Your city" value={city} onChange={event => setCity(event.target.value)}>{['Kolkata','Bardhaman','Bankura','Medinipur'].map(value => <option key={value}>{value}</option>)}</Select></label><button className={'icon-button wishlist-button ' + (savedOnly ? 'selected' : '')} aria-label={`Show ${wishlist.length} saved designs`} onClick={() => { navigate(!savedOnly ? '/jewellery?saved=true' : '/jewellery') }}><FiHeart />{wishlist.length > 0 && <span>{wishlist.length}</span>}</button><HeaderUtilities /><button className="icon-button mobile-menu" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <FiX /> : <FiMenu />}</button></div></header><div className="search-strip"><div className="container search-inner"><span>YOUR NEXT HEIRLOOM STARTS HERE</span><form className="header-search" role="search" onSubmit={event => { event.preventDefault(); navigate('/jewellery') }}><FiSearch aria-hidden="true" /><input type="search" aria-label="Search jewellery" placeholder="Search necklaces, rings, and more..." value={search} onChange={event => setSearch(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') setSearch('') }} />{search && <button className="header-search-clear" type="button" aria-label="Clear jewellery search" onClick={() => setSearch('')}><FiX aria-hidden="true" /></button>}<button className="header-search-submit" type="submit" aria-label="Search jewellery designs"><span>Search</span><FiArrowUpRight aria-hidden="true" /></button></form><span>EXPLORE ONLINE. FALL IN LOVE IN STORE.</span></div></div></>
}

