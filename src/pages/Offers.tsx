import HeadingShine from '../components/ui/HeadingShine'
import { Link } from 'react-router-dom'
import { LuMegaphone } from 'react-icons/lu'
import ShoppingPage from './ShoppingPage'
export default function Offers() {
  return <ShoppingPage eyebrow="A LITTLE MORE TO LOVE" title="Offers" description="Discover more reasons to visit your neighbourhood jeweller."><div className="shopping-panel shopping-empty"><LuMegaphone aria-hidden="true" /><h2><HeadingShine>Good things are on their way.</HeadingShine></h2><p>No verified offers are available right now. Explore our jewellers and confirm any current offers directly with the store.</p><Link className="button" to="/explore-shops">Explore jewellers</Link></div></ShoppingPage>
}
