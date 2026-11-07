import HeadingShine from './HeadingShine'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './3-d-coverflow-carousel.css'

export interface CarouselItem {
  tag?: string
  titleLine1: string
  titleLine2?: string
  desc?: string
  img: string
  ctaText?: string
  ctaUrl?: string
}

export interface CoverFlowCarouselProps {
  items: CarouselItem[]
  sectionLabel?: string
  autoplay?: boolean
  autoplayDelay?: number
  className?: string
  onCtaClick?: (item: CarouselItem) => void
}

export function CoverFlowCarousel({ items, sectionLabel = 'THE SONASATHI EDIT', autoplay = true, autoplayDelay = 5000, className = '', onCtaClick }: CoverFlowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const section = useRef<HTMLElement>(null)
  const touchStart = useRef<number | null>(null)
  const total = items.length
  const index = total ? currentIndex % total : 0
  const rotating = autoplay && !hovered && !focused && !reducedMotion && visible && total > 1
  const next = useCallback(() => { if (total > 1) setCurrentIndex(previous => (previous + 1) % total) }, [total])
  const previous = useCallback(() => { if (total > 1) setCurrentIndex(value => (value - 1 + total) % total) }, [total])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: .25 })
    if (section.current) observer.observe(section.current)
    return () => observer.disconnect()
  }, [total])

  useEffect(() => {
    if (!rotating) return
    const interval = window.setInterval(() => { if (!document.hidden) next() }, Math.max(2000, autoplayDelay))
    return () => window.clearInterval(interval)
  }, [rotating, autoplayDelay, next])

  if (!total) return null

  return <section ref={section} className={`coverflow ${className}`} aria-label="Featured jewellery" aria-roledescription="carousel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
    onKeyDown={event => { if (event.key === 'ArrowLeft') { event.preventDefault(); previous() } else if (event.key === 'ArrowRight') { event.preventDefault(); next() } }}
    onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null }}
    onTouchEnd={event => { const end = event.changedTouches[0]?.clientX; if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 45) { if (end < touchStart.current) next(); else previous() } touchStart.current = null }}>
    <div className="coverflow-ambience" aria-hidden="true"><img src={items[index].img} alt="" loading="lazy" /></div>
    <div className="coverflow-inner">
      <div className="coverflow-heading"><div className="eyebrow">{sectionLabel}</div><h2><HeadingShine>A little gold. <em>A lot to love.</em></HeadingShine></h2><p>Beautiful details, meaningful moments. Find a piece that feels like you.</p></div>
      <div className="coverflow-stage">
        {items.map((item, slideIndex) => {
          let offset = (slideIndex - index + total) % total
          if (offset > total / 2) offset -= total
          const center = offset === 0
          const distance = Math.abs(offset)
          const style = {
            '--slide-offset': offset,
            transform: `translateX(calc(var(--coverflow-step) * ${offset})) scale(${center ? 1 : distance === 1 ? .84 : .68}) rotateY(${-Math.sign(offset) * (distance === 1 ? 24 : 38)}deg)`,
            opacity: distance > 2 ? 0 : center ? 1 : distance === 1 ? .72 : .4,
            zIndex: 30 - distance * 10,
            filter: center ? 'brightness(1)' : `brightness(${distance === 1 ? .8 : .6})`,
            visibility: distance > 2 ? 'hidden' : 'visible',
          } as CSSProperties
          return <article key={`${item.ctaUrl}-${slideIndex}`} className={`coverflow-card${center ? ' is-active' : ''}`} style={style} role="group" aria-roledescription="slide" aria-label={`${slideIndex + 1} of ${total}: ${item.titleLine1}`} aria-hidden={!center}>
            <img className="coverflow-photo" src={item.img} alt={item.titleLine1} loading="lazy" decoding="async" />
            {!center && <button className="coverflow-select" tabIndex={-1} aria-label={`Show ${item.titleLine1}`} onClick={() => setCurrentIndex(slideIndex)} />}
            <div className="coverflow-shade" />
            <div className="coverflow-content">
              <span className="coverflow-tag">{item.tag}</span>
              <div><h3>{item.titleLine1}</h3>{item.titleLine2 && <span className="coverflow-subtitle">{item.titleLine2}</span>}<span className="coverflow-rule" />{item.desc && <p>{item.desc}</p>}
                <Link className="coverflow-cta" to={item.ctaUrl || '/jewellery'} tabIndex={center ? 0 : -1} onClick={event => { if (onCtaClick) { event.preventDefault(); onCtaClick(item) } }}>{item.ctaText || 'Explore design'}<FiArrowUpRight aria-hidden="true" /></Link>
              </div>
            </div>
          </article>
        })}
      </div>
      {total > 1 && <div className="coverflow-controls">
        <button className="coverflow-arrow" onClick={previous} aria-label="Previous jewellery design"><FiChevronLeft /></button>
        <div className="coverflow-dots" aria-label="Choose featured design">{items.map((item, dot) => <button key={dot} onClick={() => setCurrentIndex(dot)} aria-label={`Show ${item.titleLine1}`} aria-current={index === dot ? 'true' : undefined}><span /></button>)}</div>
        <button className="coverflow-arrow" onClick={next} aria-label="Next jewellery design"><FiChevronRight /></button>
       
      </div>}
      <span className="sr-only" aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">{items[index].titleLine1}, design {index + 1} of {total}</span>
    </div>
  </section>
}

export default CoverFlowCarousel
