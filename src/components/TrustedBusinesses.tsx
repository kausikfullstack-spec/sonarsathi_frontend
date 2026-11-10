import { Link } from 'react-router-dom'
import HeadingShine from './ui/HeadingShine'
import './trusted-businesses.css'

export default function TrustedBusinesses() {
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
      <Link className="trusted-businesses-banner" to="/jewellery" aria-label="Explore the SonaSathi jewellery collection">
        <img
          src="/images/trusted-across-india.png"
          alt="SonaSathi — Trusted Across India. Fine gold jewellery for every celebration. A woman wearing a gold necklace, earrings and bangles with a green saree."
          width="1916"
          height="821"
          loading="lazy"
          decoding="async"
        />
      </Link>
    </section>
  )
}
