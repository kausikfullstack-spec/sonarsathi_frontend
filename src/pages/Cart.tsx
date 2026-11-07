import { Link } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import ShoppingPage from './ShoppingPage'
export default function Cart() {
  return <ShoppingPage eyebrow="YOUR NEXT LITTLE TREASURE" title="Your cart" description="A beautiful discovery is just the beginning."><div className="shopping-panel shopping-empty"><FiShoppingCart aria-hidden="true" /><h2>Your cart is empty.</h2><p>SonaSathi currently brings you from online discovery to an in-store purchase. Save designs you love and plan a visit to try them with your jeweller.</p><Link to="/jewellery" className="button">Explore jewellery</Link><Link to="/jewellery?saved=true" className="text-link">View saved designs</Link></div></ShoppingPage>
}
