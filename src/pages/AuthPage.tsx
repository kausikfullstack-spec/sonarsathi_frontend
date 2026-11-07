import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiArrowUpRight, FiEye, FiEyeOff } from 'react-icons/fi'
import { Brand } from '../components/Header'
import HeadingShine from '../components/ui/HeadingShine'
import './auth.css'

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const register = mode === 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

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
    setMessage(register ? 'Registration is not connected yet. No account has been created and your details have not been saved.' : 'Login is not connected yet. You have not been signed in.')
    form.reset()
    setShowPassword(false)
  }

  return <div className="auth-page">
    <aside className="auth-visual" aria-label="SonaSathi jewellery inspiration">
      <img className="auth-visual-photo" src="/images/jewellery-hero-banner.jpg" alt="Gold link jewellery resting on softly draped ivory satin" fetchPriority="high" />
      <div className="auth-visual-shade" />
      <Brand useLogo />
      <div className="auth-visual-copy"><span>A LITTLE TRUST. A LIFETIME OF GOLD.</span><h2>Some connections<br /><em>are golden.</em></h2><p>Discover a piece you love.<br />Meet a jeweller you can trust.</p></div>
    </aside>
    <section className="auth-form-side" aria-labelledby="auth-title">
      <Link className="auth-back" to="/"><FiArrowLeft aria-hidden="true" />Back to SonaSathi</Link>
      <div className="auth-form-content">
        <nav className="auth-tabs" aria-label="Account access"><Link to="/login" aria-current={!register ? 'page' : undefined}>Login</Link><Link to="/register" aria-current={register ? 'page' : undefined}>Register</Link></nav>
        <div className="eyebrow">YOUR LITTLE CORNER</div>
        <h1 id="auth-title"><HeadingShine>{register ? 'Begin a beautiful connection.' : 'Welcome back.'}</HeadingShine></h1>
        <p className="auth-intro">{register ? 'Create your SonaSathi account and start your jewellery journey.' : 'A little closer to the designs you love. Enter your details to continue.'}</p>
        <form className="auth-form" onSubmit={submit} onChange={event => { setMessage(''); const confirmation = event.currentTarget.elements.namedItem('confirmPassword') as HTMLInputElement | null; confirmation?.setCustomValidity('') }}>
          {register && <label htmlFor="auth-name">Full name<input id="auth-name" name="name" autoComplete="name" placeholder="Your full name" required maxLength={100} /></label>}
          <label htmlFor="auth-email">Email address<input id="auth-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
          <label htmlFor="auth-password">Password<span className="auth-password"><input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} placeholder={register ? 'At least 8 characters' : 'Enter your password'} minLength={register ? 8 : undefined} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></span></label>
          {register && <label htmlFor="auth-confirm">Confirm password<input id="auth-confirm" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Re-enter your password" required /></label>}
          <button className="auth-submit" type="submit">{register ? 'Create account' : 'Login'}<FiArrowUpRight aria-hidden="true" /></button>
          <div className="auth-status" role="status">{message}</div>
        </form>
        <div className="auth-switch">{register ? 'Already have an account?' : 'New to SonaSathi?'} <Link to={register ? '/login' : '/register'}>{register ? 'Login' : 'Create an account'}</Link></div>
        <p className="auth-preview">Preview only. Login and registration are not connected yet.</p>
      </div>
    </section>
  </div>
}
