import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FiChevronDown } from 'react-icons/fi'
import { GiDropEarrings, GiLinkedRings, GiDiamondRing, GiRing, GiGemPendant, GiNecklace, GiGemChain, GiDoubleNecklace, GiTribalPendant, GiHeartNecklace, GiTiara, GiCoins } from 'react-icons/gi'
import { jewelleryCategories } from '../data/categories'
const icons = [GiDropEarrings, GiLinkedRings, GiDiamondRing, GiRing, GiGemPendant, GiNecklace, GiGemChain, GiDoubleNecklace, GiTribalPendant, GiHeartNecklace, GiTiara, GiRing, GiCoins]
export default function CategoryNavigation() {
  const [open, setOpen] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  useEffect(() => {
    function dismiss(event: PointerEvent) { if (!wrapper.current?.contains(event.target as Node)) setOpen(false) }
    function key(event: KeyboardEvent) { if (event.key === 'Escape' && wrapper.current?.querySelector('button')?.getAttribute('aria-expanded') === 'true') { setOpen(false); wrapper.current?.querySelector<HTMLButtonElement>('button')?.focus() } }
    document.addEventListener('pointerdown', dismiss); document.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', key) }
  }, [])
  return <div className="category-navigation"><div className="category-navigation-inner container"><nav aria-label="Shop by category" className="category-navigation-scroll">{jewelleryCategories.slice(0, 11).map((category, index) => { const Icon = icons[index]; return <NavLink key={category.slug} to={`/jewellery/${category.slug}`} onClick={() => setOpen(false)}><Icon /><span>{category.name}</span></NavLink> })}</nav><div className="category-more" ref={wrapper}><button className={(open || ['/jewellery/nath', '/jewellery/coins'].includes(pathname)) ? 'active' : ''} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="more-categories">More <FiChevronDown className={open ? 'rotated' : ''} /></button>{open && <nav id="more-categories" aria-label="More jewellery categories" className="category-dropdown">{jewelleryCategories.slice(11).map((category, index) => { const Icon = icons[index + 11]; return <NavLink key={category.slug} to={`/jewellery/${category.slug}`} onClick={() => setOpen(false)}><Icon />{category.name}</NavLink> })}</nav>}</div></div></div>
}
