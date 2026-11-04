import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiArrowUpRight, FiChevronDown, FiHeart, FiMapPin, FiMenu, FiSearch, FiX } from 'react-icons/fi'
import { RiVipDiamondLine } from 'react-icons/ri'
import { useShop } from '../context/useShop'
export function Brand() { return <a className="brand" href="/" aria-label="SonaSetu home"><RiVipDiamondLine /><span>sona<span className="brand-accent">setu</span><small>A LITTLE TRUST. A LIFETIME OF GOLD.</small></span></a> }
export default function Header() {
  const { city, setCity, search, setSearch, wishlist } = useShop()
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const savedOnly = location.pathname === '/jewellery' && new URLSearchParams(location.search).get('saved') === 'true'
  return <><div className="announcement">Beautiful jewellery. Trusted jewellers. A connection that shines. <span>Discover the SonaSetu way <FiArrowUpRight /></span></div><header className="header container"><Brand /><nav className={menu ? 'navigation open' : 'navigation'}><Link to="/jewellery" onClick={() => setMenu(false)}>Explore jewellery</Link><Link to="/explore-shops" onClick={() => setMenu(false)}>Find jewellers</Link><Link to="/#how-it-works" onClick={() => setMenu(false)}>How it works</Link></nav><div className="header-actions"><label className="location"><FiMapPin /><select aria-label="Your city" value={city} onChange={event => setCity(event.target.value)}>{['Kolkata','Mumbai','Delhi','Bengaluru','Jaipur'].map(value => <option key={value}>{value}</option>)}</select><FiChevronDown /></label><button className={'icon-button wishlist-button ' + (savedOnly ? 'selected' : '')} aria-label={`Show ${wishlist.length} saved designs`} onClick={() => { navigate(!savedOnly ? '/jewellery?saved=true' : '/jewellery') }}><FiHeart />{wishlist.length > 0 && <span>{wishlist.length}</span>}</button><Link className="button small header-cta" to="/explore-shops">Find your jeweller <FiArrowUpRight /></Link><button className="icon-button mobile-menu" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <FiX /> : <FiMenu />}</button></div></header><div className="search-strip"><div className="container search-inner"><span>YOUR NEXT HEIRLOOM STARTS HERE</span><form onSubmit={event => { event.preventDefault(); navigate('/jewellery') }}><FiSearch /><input aria-label="Search jewellery" placeholder="Search for necklaces, rings, and little things you’ll love…" value={search} onChange={event => setSearch(event.target.value)} /><button aria-label="Search"><FiArrowUpRight /></button></form><span>EXPLORE ONLINE. FALL IN LOVE IN STORE.</span></div></div></>
}
