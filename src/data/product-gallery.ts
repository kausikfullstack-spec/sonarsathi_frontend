import type { Product } from './catalogue'

export interface ProductView { src: string; label: string; scale: number }

/** Use the same product's photos; label derived closeups explicitly. */
export function productGalleryViews(product: Product): ProductView[] {
  return [
    { src: product.image, label: 'Full view', scale: 1 },
    product.alternateImage
      ? { src: product.alternateImage, label: 'Alternate view', scale: 1 }
      : { src: product.image, label: 'Detail view', scale: 1.6 },
    { src: product.image, label: 'Detail closeup', scale: 2.2 },
  ]
}
