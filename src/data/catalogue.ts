import { jewelleryCategories } from './categories'
import { productImages } from './product-images'
export const categories = ['All jewellery', ...jewelleryCategories.map(category => category.name)]
export type Product = { id: number; name: string; category: string; price: number; weight: string; purity: string; store: string; image: string; alternateImage?: string; tag: string; storeSlug?: string; metal?: string }
const originalProducts: Product[] = [
  { id: 1, name: 'The Everyday Gold Necklace', category: 'Necklaces', price: 42850, weight: '5.24', purity: '22K', store: 'Mehta & Sons Jewellers', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=85', tag: 'Bestseller' },
  { id: 2, name: 'Petal Diamond Studs', category: 'Earrings', price: 28600, weight: '2.86', purity: '18K', store: 'Kalyan Jewellers', image: '/earrings.jpg', tag: 'New arrival' },
  { id: 3, name: 'The Eternal Solitaire', category: 'Rings', price: 35200, weight: '3.12', purity: '18K', store: 'Mehta & Sons Jewellers', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85', tag: 'Most loved' },
  { id: 4, name: 'Classic Gold Bangle', category: 'Bangles', price: 68400, weight: '8.42', purity: '22K', store: 'Senco Gold & Diamonds', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=85', tag: 'Timeless' },
  { id: 5, name: 'Golden Link Bracelet', category: 'Bracelets', price: 31900, weight: '3.91', purity: '22K', store: 'Kalyan Jewellers', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=85', tag: 'New arrival' },
  { id: 6, name: 'Little Moments Pendant', category: 'Pendants', price: 18500, weight: '2.18', purity: '18K', store: 'Senco Gold & Diamonds', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=85', tag: 'Everyday favourite' },
]
const demoStores = [
  { name: 'Bowbazar Gold House', slug: 'bowbazar-gold-house' },
  { name: 'Bhowanipore Jewel Studio', slug: 'bhowanipore-jewel-studio' },
  { name: 'Salt Lake Gold Gallery', slug: 'salt-lake-gold-gallery' },
  { name: 'Diamond Plaza Jewels', slug: 'diamond-plaza-jewels' },
  { name: 'Baguiati Heritage Jewellers', slug: 'baguiati-heritage-jewellers' },
]
const originals = originalProducts.map((product, index) => ({ ...product, store: demoStores[index % 5].name, storeSlug: demoStores[index % 5].slug, metal: 'Gold' }))
const generated: Product[] = jewelleryCategories.flatMap((category, index) => {
  const count = originalProducts.some(product => product.category === category.name) ? 3 : 4
  return Array.from({ length: count }, (_, variant) => {
    const store = demoStores[(index + variant) % demoStores.length]
    const silver = category.slug === 'coins' && variant === 3
    return { id: 100 + index * 10 + variant, name: `${['Classic', 'Heritage', 'Everyday', 'Celebration'][variant]} ${silver ? 'Silver ' : 'Gold '}${category.name}`, category: category.name, price: silver ? 1800 : category.basePrice + variant * 7250, weight: silver ? '10.00' : (category.basePrice / 8500 + variant * .75).toFixed(2), purity: silver ? '999' : variant % 2 ? '18K' : category.slug === 'coins' ? '24K' : '22K', metal: silver ? 'Silver' : 'Gold', store: store.name, storeSlug: store.slug, image: silver ? '/categories/silver-coins.svg' : category.image, tag: ['Bestseller', 'New arrival', 'Everyday favourite', 'Occasion edit'][variant] }
  })
})
export const products: Product[] = [...originals, ...generated].map(product => ({ ...product, ...productImages[product.id] }))
export const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
