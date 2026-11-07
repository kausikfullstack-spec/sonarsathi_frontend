import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowUp, FiArrowUpRight, FiCopy, FiHeart, FiHelpCircle, FiMapPin, FiShare2 } from 'react-icons/fi'
import { Brand } from './Header'
import './footer.css'

export default function Footer() {
  const [message, setMessage] = useState('')
  const [showLink, setShowLink] = useState(false)
  const siteUrl = window.location.origin

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(siteUrl)
      setMessage('Website link copied.')
      setShowLink(false)
    } catch {
      setMessage('Select and copy the website link below.')
      setShowLink(true)
    }
  }

  async function share() {
    if (!navigator.share) { await copyLink(); return }
    try {
      await navigator.share({ title: 'SonaSathi', text: 'Discover jewellery and meet your neighbourhood jeweller.', url: siteUrl })
      setMessage('Share options opened.')
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) await copyLink()
    }
  }

  return <footer className="site-footer">
    <div className="footer-brand-band"><div className="container footer-brand-row"><Brand useLogo /><div><span>A LITTLE TRUST. A LIFETIME OF GOLD.</span><p>Beautiful jewellery.<br /><em>Meaningful connections.</em></p></div><Link className="footer-discover" to="/jewellery">Discover your next favourite<FiArrowUpRight aria-hidden="true" /></Link></div></div>
    <div className="container">
      <div className="footer-link-grid">
        <section className="footer-hallmark" aria-labelledby="footer-hallmark-title"><h3 id="footer-hallmark-title">Verify hallmark</h3><a className="footer-bis" href="https://www.bis.gov.in/bis-apps/?lang=en" target="_blank" rel="noopener noreferrer"><img className="footer-bis-logo" src="/brand/bis-logo.svg" alt="Bureau of Indian Standards" width={360} height={254} loading="lazy" /><span>BIS Care<FiArrowUpRight aria-hidden="true" /></span></a><p>A little confidence before you buy. Check the HUID with the official BIS Care app.</p></section>
        <nav aria-label="Footer useful links"><h3>Useful links</h3><Link to="/jewellery">Explore jewellery</Link><Link to="/explore-shops">Find a store</Link><Link to="/offers">Offers</Link><Link to="/become-a-seller">Become a seller</Link><Link to="/explore-shops">Shops in Kolkata</Link></nav>
        <nav aria-label="Footer information"><h3>Information</h3><Link to="/#faq">Help &amp; FAQs</Link><Link to="/#how-it-works">How SonaSathi works</Link><Link to="/account">My account</Link><Link to="/jewellery?saved=true">Saved designs</Link><Link to="/cart">My cart</Link></nav>
        <nav className="footer-visit" aria-label="Footer visit and support"><h3>Let’s connect</h3><Link to="/explore-shops"><FiMapPin aria-hidden="true" /><span>Visit a jeweller</span></Link><Link to="/#faq"><FiHelpCircle aria-hidden="true" /><span>Ask a little question</span></Link><Link to="/jewellery?saved=true"><FiHeart aria-hidden="true" /><span>Keep your favourites</span></Link><p>Explore online.<br />Fall in love in store.</p></nav>
        <section className="footer-sharing" aria-labelledby="footer-sharing-title"><h3 id="footer-sharing-title">Share a little gold</h3><p>A beautiful discovery is even better when shared.</p><div className="footer-share-buttons"><button type="button" onClick={share} aria-label="Share SonaSathi"><FiShare2 aria-hidden="true" /></button><button type="button" onClick={copyLink} aria-label="Copy SonaSathi website link"><FiCopy aria-hidden="true" /></button></div><span role="status" className="footer-share-message">{message}</span>{showLink && <input className="footer-copy-input" aria-label="SonaSathi website link" value={siteUrl} readOnly onFocus={event => event.target.select()} />}</section>
      </div>
      <div className="footer-finish"><span>© {new Date().getFullYear()} SonaSathi. Crafted for connections.</span><span>Sample catalogue · Kolkata, India</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Back to top<FiArrowUp aria-hidden="true" /></button></div>
    </div>
  </footer>
}
