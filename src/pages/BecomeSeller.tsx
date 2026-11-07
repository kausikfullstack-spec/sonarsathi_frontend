import { Link } from 'react-router-dom'
import { FiGrid, FiMapPin, FiCalendar } from 'react-icons/fi'
import ShoppingPage from './ShoppingPage'
export default function BecomeSeller() {
  return <ShoppingPage eyebrow="GROW WITH SONASATHI" title="Become a seller" description="Your craftsmanship deserves to be discovered. Bring your store closer to jewellery lovers in your neighbourhood."><div className="seller-benefits">{[{ icon: FiGrid, title: 'Showcase your collection', text: 'Give every design a place to shine with a dedicated jewellery catalogue.' }, { icon: FiMapPin, title: 'Help customers find you', text: 'Introduce your store, share its location, and tell your story.' }, { icon: FiCalendar, title: 'Connect through store visits', text: 'Help customers discover their favourites before they walk through your door.' }].map(({ icon: Icon, title, text }) => <article className="shopping-panel" key={title}><Icon aria-hidden="true" /><h2>{title}</h2><p>{text}</p></article>)}</div><div className="shopping-panel seller-next"><div><h2>Let’s build beautiful connections.</h2><p>Seller registration is coming soon. Preview a store profile to see how your jewellery could be presented.</p></div><Link className="button" to="/explore-shops">Explore store profiles</Link></div></ShoppingPage>
}

