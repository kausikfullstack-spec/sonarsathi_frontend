// Illustrative showroom photos. Sources: public/images/store-banners/sources.json
export const storeBanners: Record<string, string> = {
  "bowbazar-gold-house": "/images/store-banners/bowbazar-gold-house.jpg",
  "bhowanipore-jewel-studio": "/images/store-banners/bhowanipore-jewel-studio.webp",
  "salt-lake-gold-gallery": "/images/store-banners/salt-lake-gold-gallery.jpg",
  "diamond-plaza-jewels": "/images/store-banners/diamond-plaza-jewels.jpg",
  "baguiati-heritage-jewellers": "/images/store-banners/baguiati-heritage-jewellers.webp"
}

// Additional demo profiles share illustrative showroom photography.
Object.assign(storeBanners, {
  'bardhaman-curzon-jewels': storeBanners['bowbazar-gold-house'],
  'golapbag-gold-studio': storeBanners['bhowanipore-jewel-studio'],
  'bankura-heritage-gold': storeBanners['baguiati-heritage-jewellers'],
  'lalbazar-jewel-house': storeBanners['diamond-plaza-jewels'],
  'medinipur-gold-gallery': storeBanners['salt-lake-gold-gallery'],
  'keranitola-jewel-studio': storeBanners['bhowanipore-jewel-studio'],
  'park-street-jewel-lounge': storeBanners['diamond-plaza-jewels'],
})
