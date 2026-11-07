import HeadingShine from './ui/HeadingShine'
import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import { products } from '../data/catalogue'
import { jewelleryCategories } from '../data/categories'
import ProductCard from './ProductCard'
export default function Collections() {
  return <section className="section container" id="collections"><div className="section-heading"><div><div className="eyebrow">A LITTLE SOMETHING FOR EVERY YOU</div><h2><HeadingShine>Find your kind of <em>beautiful.</em></HeadingShine></h2></div><Link className="text-link" to="/jewellery">View all jewellery <FiArrowUpRight /></Link></div><div className="category-tabs home-category-links" aria-label="Explore collections"><Link className="active" to="/jewellery">All jewellery</Link>{jewelleryCategories.slice(0, 6).map(category => <Link key={category.slug} to={`/jewellery/${category.slug}`}>{category.name}</Link>)}</div><div className="product-grid">{products.slice(0, 6).map(product => <ProductCard key={product.id} product={product} />)}</div><p className="catalogue-note">A curated preview. Sample designs and indicative prices; confirm availability and pricing in store.</p></section>
}
