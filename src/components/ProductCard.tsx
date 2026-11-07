import { useState } from 'react'
import './product-card.css'
import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiHeart, FiMapPin } from 'react-icons/fi'
import { money } from '../data/catalogue'
import type { Product } from '../data/catalogue'
import { useShop } from '../context/useShop'
export default function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist } = useShop()
  const [alternateReady, setAlternateReady] = useState(false)
  const saved = wishlist.includes(product.id)
  const detailUrl = `/product/${product.id}`
  return <article className="product-card" data-product-id={product.id} data-price={product.price} data-category={product.category}><div className="product-image"><Link className={`product-photo-button${alternateReady ? ' has-alternate' : ''}`} aria-label={`View details of ${product.name}`} to={detailUrl}><img className="product-front-image" src={product.image} alt={product.name} loading="lazy" decoding="async" />{product.alternateImage && <img className="product-alternate-image" src={product.alternateImage} alt={`${product.name} - alternate view`} loading="lazy" decoding="async" onLoad={() => setAlternateReady(true)} onError={() => setAlternateReady(false)} />}</Link><span className="product-tag">{product.tag}</span><button className={`save-button ${saved ? 'saved' : ''}`} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name}`} aria-pressed={saved} onClick={() => toggleWishlist(product.id)}><FiHeart /></button><span className="purity">{product.purity} {product.metal ?? 'Gold'} · Sample design</span></div><div className="product-info"><div className="product-details"><span>{product.category}</span><span>{product.weight} g · {product.purity}</span></div><h3><Link to={detailUrl}>{product.name}</Link></h3><div className="price-row"><strong>{money(product.price)}</strong><Link className="product-detail-arrow" aria-label={`Explore ${product.name}`} to={detailUrl}><FiArrowUpRight /></Link></div><div className="product-store"><FiMapPin />{product.storeSlug ? <Link to={`/shop/${product.storeSlug}`}>{product.store}</Link> : product.store}<span>· Kolkata</span></div></div></article>
}
