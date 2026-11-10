import { useEffect, useRef, useState } from 'react'
import { FiGlobe } from 'react-icons/fi'
import './language-selector.css'

type TranslateWindow = Window & {
  sonasathiTranslateInit?: () => void
  google?: { translate?: { TranslateElement: new (options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean }, element: HTMLElement) => unknown } }
}

export default function LanguageSelector() {
  const host = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const translateWindow = window as TranslateWindow
    let active = true
    const initialize = () => {
      if (!active || !host.current || !translateWindow.google?.translate) return
      host.current.replaceChildren()
      new translateWindow.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,bn,hi,as,gu,kn,ml,mr,or,pa,ta,te,ur',
        autoDisplay: false,
      }, host.current)
      const select = host.current.querySelector('select')
      select?.setAttribute('aria-label', 'Select website language')
    }
    translateWindow.sonasathiTranslateInit = initialize
    let script = document.getElementById('sonasathi-google-translate') as HTMLScriptElement | null
    const onError = () => { if (active) setFailed(true) }
    if (translateWindow.google?.translate) initialize()
    else {
      if (!script) {
        script = document.createElement('script')
        script.id = 'sonasathi-google-translate'
        script.src = 'https://translate.google.com/translate_a/element.js?cb=sonasathiTranslateInit'
        script.async = true
        document.head.appendChild(script)
      }
      script.addEventListener('error', onError)
    }
    const timeout = window.setTimeout(() => {
      if (active && !host.current?.querySelector('select')) setFailed(true)
    }, 12000)
    return () => { active = false; script?.removeEventListener('error', onError); window.clearTimeout(timeout) }
  }, [])

  return <div className="language-selector notranslate" translate="no">
    <FiGlobe aria-hidden="true" />
    <div ref={host} className="language-selector-widget" />
    {failed && <small role="status">Translation unavailable</small>}
  </div>
}
