import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './shopping-pages.css'

export default function ShoppingPage({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <section className="container section shopping-page"><Link className="text-link shopping-back" to="/">Home / {title}</Link><div className="shopping-intro"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{children}</section>
}
