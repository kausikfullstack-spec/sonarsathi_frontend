import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import HeadingShine from './ui/HeadingShine'
import './trusted-businesses.css'

const banners = [
  { src: '/images/trusted-across-india.png', alt: 'SonaSathi — Trusted Across India. Fine gold jewellery for every celebration.', background: '#f5e7d0' },
  { src: '/images/trusted-india-navy.png', alt: 'Trusted by businesses across India. Gold jewellery and an illuminated map of India against a navy backdrop.', background: '#0c2431' },
  { src: '/images/trusted-businesses-gold.png', alt: 'Trusted by businesses across India. Traditional gold necklaces, earrings and bangles in a golden showroom.', background: '#e6c29b' },
]

export default function TrustedBusinesses() {
  const [active, setActive] = useState(0)
  function move(direction: number) { setActive(previous => (previous + direction + banners.length) % banners.length) }
  return (
    <section className="trusted-businesses container" aria-labelledby="trusted-businesses-title">
      <h2 id="trusted-businesses-title" className="trusted-businesses-title">
        <HeadingShine>Trusted By Businesses</HeadingShine>
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M24 5c-7 8-10 14-10 20 0 7 5 12 10 15 5-3 10-8 10-15 0-6-3-12-10-20Z" />
          <path d="M24 40C11 40 5 31 4 20c11-1 20 5 20 20Zm0 0c13 0 19-9 20-20-11-1-20 5-20 20Z" />
        </svg>
        <HeadingShine><em>Across India</em></HeadingShine>
      </h2>
      <div className="trusted-banner-carousel" role="region" aria-roledescription="carousel" aria-label="SonaSathi banners">
        {banners.map((banner, index) => <div key={banner.src} hidden={index !== active} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${banners.length}`}>
          <Link className="trusted-businesses-banner" style={{ background: banner.background }} to="/jewellery" aria-label="Explore the SonaSathi jewellery collection">
            <img src={banner.src} alt={banner.alt} loading="lazy" decoding="async" />
          </Link>
        </div>)}
        <div className="trusted-banner-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous banner"><FiChevronLeft /></button>
          <div className="trusted-banner-dots">{banners.map((banner, index) => <button key={banner.src} type="button" className={active === index ? 'active' : ''} aria-label={`Show banner ${index + 1}`} aria-current={active === index ? 'true' : undefined} onClick={() => setActive(index)}><span /></button>)}</div>
          <span className="trusted-banner-count" aria-live="polite" aria-atomic="true">{active + 1} / {banners.length}</span>
          <button type="button" onClick={() => move(1)} aria-label="Next banner"><FiChevronRight /></button>
        </div>
      </div>
    </section>
  )
}
