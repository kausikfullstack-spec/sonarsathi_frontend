import { Link } from 'react-router-dom'
import { FiStar } from 'react-icons/fi'
import { BsPatchCheckFill } from 'react-icons/bs'
import { storeReviewSummary } from '../data/reviews'
import HeadingShine from './ui/HeadingShine'
import './store-reviews.css'

export function RatingStars({ rating }: { rating: number }) {
  return <span className="review-stars" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <span className="review-star" key={index} aria-hidden="true"><FiStar className="review-star-base" /><FiStar className="review-star-filled" style={{ clipPath: `inset(0 ${100 - Math.max(0, Math.min(1, rating - index)) * 100}% 0 0)` }} /></span>)}</span>
}

export function StoreRating({ slug }: { slug: string }) {
  const { average, count } = storeReviewSummary(slug)
  if (!count) return null
  return <Link className="store-rating-summary" to={`/shop/${slug}#reviews`} aria-label={`Read ${count} sample reviews, rated ${average.toFixed(1)} out of 5`}><RatingStars rating={average} /><strong>{average.toFixed(1)}</strong><span>({count} sample reviews)</span></Link>
}

export default function StoreReviews({ slug, name }: { slug: string; name: string }) {
  const { reviews, average, count } = storeReviewSummary(slug)
  return <section className="store-reviews" id="reviews" aria-labelledby="store-reviews-title"><div className="section-heading"><div><div className="eyebrow">A FEW WORDS FROM OUR COMMUNITY</div><h2 id="store-reviews-title"><HeadingShine>Ratings &amp; <em>reviews.</em></HeadingShine></h2></div></div>
    <div className="review-overview"><strong>{average.toFixed(1)}<small> / 5</small></strong><div><RatingStars rating={average} /><span>{count} sample reviews for {name}</span></div><span className="review-demo-label">Demo reviews</span></div>
    <p className="review-demo-note">These names, comments, ratings, and verification badges are fictional examples. No reviewer identity or purchase has been verified.</p>
    <div className="review-list">{reviews.map(review => <article className="review-card" key={review.id}><div className="review-card-heading"><span className="review-avatar" aria-hidden="true">{review.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><div className="review-author"><strong>{review.name}</strong>{review.verified && <span className="review-verified" title="Illustrative verification badge for a fictional demo reviewer"><BsPatchCheckFill aria-hidden="true" /> Verified user <span className="review-badge-demo">(demo)</span></span>}</div><time dateTime={review.date}>{new Date(`${review.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time></div><RatingStars rating={review.rating} /><h3>{review.title}</h3><p>{review.comment}</p></article>)}</div>
  </section>
}
