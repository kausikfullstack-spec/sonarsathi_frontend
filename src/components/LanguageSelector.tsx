import { useSyncExternalStore } from 'react'
import { FiGlobe } from 'react-icons/fi'
import Select from './ui/Select'
import './language-selector.css'
import { selectLanguage, subscribeTranslation, translationSnapshot } from '../lib/translation'
import type { Language } from '../lib/translation'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'hi', label: 'हिन्दी' },
]
export default function LanguageSelector() {
  const { language, loading, error } = useSyncExternalStore(subscribeTranslation, translationSnapshot)
  return <div className="language-selector notranslate" translate="no" aria-busy={loading}>
    <FiGlobe aria-hidden="true" />
    <Select variant="header" aria-label="Preferred language" value={language} onChange={event => selectLanguage(event.target.value as Language)}>
      {languages.map(({ code, label }) => <option key={code} value={code} lang={code}>{label}</option>)}
    </Select>
    {loading && <span className="language-status" role="status">Translating…</span>}
    {error && <div className="language-error" role="alert">{error} <button type="button" onClick={() => selectLanguage(language)}>Retry</button></div>}
    {language !== 'en' && !error && !loading && <span className="language-attribution">Translated by Google</span>}
  </div>
}
