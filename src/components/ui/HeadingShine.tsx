import { Children, cloneElement, isValidElement } from 'react'
import type { ReactNode } from 'react'
import ShinyText from './ShinyText'

/** Preserve heading markup and the inherited colors of emphasized words. */
export default function HeadingShine({ children }: { children: ReactNode }) {
  return <>{Children.map(children, child => {
    if (typeof child === 'string' || typeof child === 'number') {
      if (typeof child === 'string' && !child.trim()) return child
      return <ShinyText speed={3} delay={4} shineWidth={28} softness={.9} direction="right" trigger="loop">{child}</ShinyText>
    }
    if (isValidElement<{ children?: ReactNode }>(child) && typeof child.type === 'string' && ['em', 'strong', 'span', 'a'].includes(child.type)) {
      return cloneElement(child, {}, <HeadingShine>{child.props.children}</HeadingShine>)
    }
    return child
  })}</>
}
