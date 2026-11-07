import { CoverFlowCarousel } from './ui/3-d-coverflow-carousel'
import { products } from '../data/catalogue'

const featuredIds = [1, 2, 3, 4, 6]
const items = featuredIds.map(id => {
  const product = products.find(item => item.id === id)!
  return {
    tag: product.tag,
    titleLine1: product.name,
    titleLine2: product.category,
    desc: 'A little inspiration for your next visit. Discover the design and meet your jeweller.',
    img: product.alternateImage || product.image,
    ctaText: 'Explore design',
    ctaUrl: `/product/${product.id}`,
  }
})

export default function FeaturedCarousel() {
  return <CoverFlowCarousel items={items} />
}
