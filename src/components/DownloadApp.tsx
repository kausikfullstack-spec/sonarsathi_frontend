import { useState } from 'react'
import { FiArrowUpRight, FiHeart, FiMapPin, FiWifi, FiBattery } from 'react-icons/fi'
import { FaGooglePlay, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import HeadingShine from './ui/HeadingShine'
import './download-app.css'

export default function DownloadApp() {
  const [message, setMessage] = useState('')
  return <section className="download-app section" aria-labelledby="download-app-heading">
    <div className="container download-app-inner">
      <div className="download-app-copy">
        <div className="eyebrow">A LITTLE CLOSER. ALWAYS WITH YOU.</div>
        <h2 id="download-app-heading"><HeadingShine>Download the <em>SonaSathi app.</em></HeadingShine></h2>
        <p>Beautiful designs. Your favourite jewellers. Keep a little inspiration close, wherever life takes you.</p>
        <div className="download-app-benefits"><span><FiMapPin aria-hidden="true" /> Discover jewellers near you</span></div>
        <div className="download-app-actions">
          <button type="button" className="download-app-play" onClick={() => setMessage('The SonaSathi app download is coming soon.')} aria-describedby="download-app-status">
            <FaGooglePlay aria-hidden="true" /><span><small>GET IT ON</small><strong>Google Play</strong></span><FiArrowUpRight aria-hidden="true" />
          </button>
          <div className="download-app-rating" aria-label="4.5 out of 5 stars">
            <div><strong>4.5</strong><span className="download-app-stars" aria-hidden="true"><FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt /></span></div>
            <span>Out of 5 stars</span>
          </div>
        </div>
        <p id="download-app-status" className="download-app-status" role="status">{message || 'Coming soon on Android'}</p>
      </div>
      <div className="download-app-visual" aria-hidden="true">
        <div className="download-app-orbit" />
        <div className="download-app-phone">
          <div className="download-app-side-button download-app-action-button" />
          <div className="download-app-side-button download-app-volume-up" />
          <div className="download-app-side-button download-app-volume-down" />
          <div className="download-app-side-button download-app-power-button" />
          <div className="download-app-screen">
            <div className="download-app-status-bar"><span>9:41</span><div className="download-app-dynamic-island"><i /></div><span><FiWifi /><FiBattery /></span></div>
            <img className="download-app-screenshot" src="/app/home-screen.png" alt="" width={786} height={1704} loading="lazy" />
            <div className="download-app-home-indicator" />
          </div>
        </div>
        <div className="download-app-floating"><FiHeart /><span>A favourite today.<strong>A treasure forever.</strong></span></div>
      </div>
    </div>
  </section>
}
