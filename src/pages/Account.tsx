import HeadingShine from '../components/ui/HeadingShine'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiChevronDown, FiEye, FiEyeOff, FiHeart, FiUser } from 'react-icons/fi'
import { useShop } from '../context/useShop'
import ShoppingPage from './ShoppingPage'
import './account.css'

export default function Account() {
  const { wishlist } = useShop()
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const register = mode === 'register'

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (register && data.get('password') !== data.get('confirmPassword')) {
      const confirmation = form.elements.namedItem('confirmPassword') as HTMLInputElement
      confirmation.setCustomValidity('Your passwords do not match.')
      confirmation.reportValidity()
      return
    }
    setMessage(register ? 'Registration is not connected yet. Your details have not been saved and no account has been created.' : 'Login is not connected yet. You have not been signed in.')
    form.reset()
    setShowPassword(false)
  }

  return <ShoppingPage eyebrow="YOUR LITTLE CORNER" title="My account" description="A little closer to the designs you love. Log in or create your SonaSathi account.">
    <div className="account-panels account-layout">
      <section className="shopping-panel account-form-panel" aria-labelledby="account-form-title">
        <div className="account-form-heading"><span className="account-user-icon"><FiUser aria-hidden="true" /></span><div className="account-mode"><label htmlFor="account-mode">Get started</label><div><select id="account-mode" value={mode} onChange={event => { setMode(event.target.value); setShowPassword(false); setMessage('') }}><option value="login">Login</option><option value="register">Register</option></select><FiChevronDown aria-hidden="true" /></div></div></div>
        <h2 id="account-form-title"><HeadingShine>{register ? 'Begin a beautiful connection.' : 'Lovely to see you again.'}</HeadingShine></h2>
        <p>{register ? 'Create an account to start your jewellery journey.' : 'Enter your details to continue your jewellery journey.'}</p>
        <form key={mode} className="account-form" onSubmit={submit} onChange={() => setMessage('')}>
          {register && <label htmlFor="account-name">Full name<input id="account-name" name="name" autoComplete="name" placeholder="Your full name" required maxLength={100} /></label>}
          <label htmlFor="account-email">Email address<input id="account-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
          <label htmlFor="account-password">Password<span className="account-password"><input id="account-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} placeholder={register ? 'At least 8 characters' : 'Enter your password'} minLength={register ? 8 : undefined} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></span></label>
          {register && <label htmlFor="account-confirm">Confirm password<input id="account-confirm" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Re-enter your password" required onChange={event => event.target.setCustomValidity('')} /></label>}
          <p className="account-preview-note">Form preview: account registration and login are not connected yet.</p>
          <button type="submit" className="button">{register ? 'Create account' : 'Login'}<FiArrowUpRight aria-hidden="true" /></button>
          <div className="account-status" role="status">{message}</div>
        </form>
        <div className="account-switch">{register ? 'Already have an account?' : 'New to SonaSathi?'} <button type="button" onClick={() => { setMode(register ? 'login' : 'register'); setMessage(''); setShowPassword(false) }}>{register ? 'Login' : 'Register'}</button></div>
      </section>
      <aside className="shopping-panel account-saved"><FiHeart aria-hidden="true" /><div className="eyebrow">KEEP A LITTLE INSPIRATION</div><h2><HeadingShine>Your favourites, all together.</HeadingShine></h2><p>{wishlist.length ? `${wishlist.length} favourite ${wishlist.length === 1 ? 'design is' : 'designs are'} waiting for another look.` : 'Save the pieces that catch your eye. Find them here whenever you are ready to take a closer look.'}</p><Link className="button" to="/jewellery?saved=true">View saved designs ({wishlist.length})<FiArrowUpRight aria-hidden="true" /></Link><p className="account-saved-note">Your saved designs are available on this browser, even without an account.</p></aside>
    </div>
  </ShoppingPage>
}
