import { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiSearch, FiX } from 'react-icons/fi'
import type { Product } from '../data/catalogue'
import { productGalleryViews } from '../data/product-gallery'
import { mountProductMagnifier } from '../lib/jquery-product-magnifier'
import './product-gallery.css'

export default function ProductGallery({ product }: { product: Product }) {
  const views = productGalleryViews(product)
  const [selected, setSelected] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([])
  const view = views[selected]

  useEffect(() => {
    if (!stage.current) return
    return mountProductMagnifier(stage.current, { zoom: 2.5, viewScale: view.scale, lensSize: 180 })
  }, [view.src, view.scale])

  function step(direction: number, focus = false) {
    const next = (selected + direction + views.length) % views.length
    setSelected(next)
    if (focus) thumbnails.current[next]?.focus()
  }

  return <div className="jewellery-gallery product-gallery">
    <div className="jewellery-main-image gallery-image-frame">
      <div className="product-magnifier" ref={stage} data-gallery-id={product.id}>
        <img className="gallery-selected-image" src={view.src} alt={`${product.name} — ${view.label}`} style={{ transform: `scale(${view.scale})` }} decoding="async" />
      </div>
      <span className="product-tag">{product.tag}</span>
      <span className="gallery-view-counter" aria-hidden="true">{selected + 1} / {views.length}</span>
      <button className="zoom-design" type="button" aria-label={`Enlarge ${view.label.toLowerCase()} of ${product.name}`} onClick={() => dialog.current?.showModal()}><FiMaximize2 aria-hidden="true" /></button>
    </div>
    <div className="gallery-thumbnail-row" role="group" aria-label={`Image views of ${product.name}`} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1, true) } }}>
      {views.map((image, index) => <button type="button" className={`gallery-thumbnail${selected === index ? ' is-selected' : ''}`} key={image.label} ref={element => { thumbnails.current[index] = element }} aria-label={`Show ${image.label.toLowerCase()} of ${product.name}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><span className="gallery-thumbnail-image"><img src={image.src} alt="" loading="lazy" decoding="async" style={{ transform: `scale(${image.scale})` }} /></span><span>{image.label}</span></button>)}
    </div>
    <div className="gallery-selection-status" role="status" aria-live="polite">{view.label}{view.scale > 1 ? ' · Closeup of the original photograph' : ''}</div>
    <p className="gallery-help"><FiSearch aria-hidden="true" /><span><span className="gallery-hover-instruction">Hover over the image to magnify. </span>Select a thumbnail or expand for a closer look.</span></p>
    <div className="jewellery-gallery-note"><span>{product.purity} {product.metal ?? 'Gold'}</span><span>{product.weight} g listed weight</span><span>Explore online. Try in store.</span></div>
    <dialog className="design-zoom-dialog gallery-dialog" ref={dialog} aria-label={`Enlarged ${product.name}`} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      <button className="icon-button zoom-close" type="button" aria-label="Close enlarged image" onClick={() => dialog.current?.close()}><FiX aria-hidden="true" /></button>
      <div className="gallery-dialog-stage"><img src={view.src} alt={`${product.name} — ${view.label}`} style={{ transform: `scale(${view.scale})` }} /></div>
      <div className="gallery-dialog-controls"><button type="button" aria-label="Previous product image" onClick={() => step(-1)}><FiChevronLeft aria-hidden="true" /></button><span>{view.label} · {selected + 1} / {views.length}</span><button type="button" aria-label="Next product image" onClick={() => step(1)}><FiChevronRight aria-hidden="true" /></button></div>
    </dialog>
  </div>
}
