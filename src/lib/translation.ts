export type Language = 'en' | 'bn' | 'hi'
const storageKey = 'sonasathi-language'
function savedLanguage(): Language {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved === 'bn' || saved === 'hi' ? saved : 'en'
  } catch { return 'en' }
}
let state = { language: savedLanguage(), loading: false, error: '' }
const listeners = new Set<() => void>()
export const translationSnapshot = () => state
export function subscribeTranslation(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
function update(next: Partial<typeof state>) {
  state = { ...state, ...next }
  listeners.forEach(listener => listener())
}
let refresh = () => {}
export function selectLanguage(language: Language) {
  try { localStorage.setItem(storageKey, language) } catch { /* Session selection still works. */ }
  update({ language, error: '' })
  refresh()
}

// Change text nodes in place: Google-style wrapper elements would interfere with
// React's ownership of the DOM when a filter, route, or modal changes.
export function startTranslation() {
  const root = document.getElementById('root')!
  const excluded = 'script,style,textarea,input,code,pre,[contenteditable], [translate="no"],.notranslate'
  const originals = new WeakMap<Node, Map<string, { source: string; rendered: string }>>()
  const cache = new Map<string, string>()
  let timer: ReturnType<typeof setTimeout>
  let running = false
  let pending = false
  let stopped = false
  let revision = 0
  let controller: AbortController | undefined
  type Entry = { node: Text | Element; attribute: string; source: string; rendered: string; write: (value: string) => void }

  function entries() {
    const result: Entry[] = []
    function add(node: Text | Element, attribute = '') {
      const current = node instanceof Text ? node.data : node.getAttribute(attribute) ?? ''
      let records = originals.get(node)
      if (!current.trim() || current.length > 5000 || (!records?.has(attribute) && !/[a-zA-Z]/.test(current))) return
      if (!records) { records = new Map(); originals.set(node, records) }
      let record = records.get(attribute)
      if (!record || record.rendered !== current) {
        record = { source: current, rendered: current }
        records.set(attribute, record)
      }
      const saved = record
      result.push({ node, attribute, ...saved, write(value) {
        if (node instanceof Text) node.data = value
        else node.setAttribute(attribute, value)
        saved.rendered = value
      } })
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode as Text
      if (!node.parentElement?.closest(excluded)) add(node)
    }
    root.querySelectorAll('[placeholder],[title],[alt],[aria-label]').forEach(node => {
      if (node.closest('[translate="no"],.notranslate')) return
      for (const attribute of ['placeholder', 'title', 'alt', 'aria-label']) if (node.hasAttribute(attribute)) add(node, attribute)
    })
    return result
  }
  const options: MutationObserverInit = { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'alt', 'aria-label'] }
  const observer = new MutationObserver(() => { if (!state.error) schedule() })
  function write(items: Entry[], language: Language) {
    observer.disconnect()
    for (const item of items) {
      const current = item.node instanceof Text ? item.node.data : item.node.getAttribute(item.attribute)
      if (!item.node.isConnected || current !== item.rendered) continue
      item.write(language === 'en' ? item.source : cache.get(`${language}:${item.source}`) ?? item.source)
    }
    observer.observe(root, options)
  }
  async function run() {
    if (running) { pending = true; return }
    const language = state.language
    const version = revision
    const items = entries()
    if (language === 'en') { write(items, 'en'); document.documentElement.lang = 'en'; update({ loading: false }); return }
    running = true
    controller = new AbortController()
    update({ loading: true, error: '' })
    try {
      const missing = [...new Set(items.map(item => item.source))].filter(text => !cache.has(`${language}:${text}`))
      while (missing.length) {
        const batch: string[] = []
        let size = 0
        while (missing.length && batch.length < 128 && size + missing[0].length <= 20000) {
          const text = missing.shift()!
          batch.push(text); size += text.length
        }
        const response = await fetch('/api/translate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: language, texts: batch }), signal: controller.signal,
        })
        const body = await response.json()
        if (!response.ok || !body.success) throw new Error(body.error?.message ?? 'Translation is unavailable. Please try again.')
        const translated: unknown = body.data?.translations
        if (!Array.isArray(translated) || translated.length !== batch.length || translated.some(text => typeof text !== 'string')) throw new Error('Invalid translation response.')
        batch.forEach((text, index) => cache.set(`${language}:${text}`, translated[index]))
      }
      if (stopped || version !== revision) return
      write(items, language)
      document.documentElement.lang = language
    } catch (error) {
      if (!stopped && version === revision) update({ error: error instanceof Error ? error.message : 'Translation is unavailable. Please try again.' })
    } finally {
      running = false
      if (!stopped) {
        update({ loading: false })
        if (pending) { pending = false; schedule() }
      }
    }
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(() => { void run() }, 180) }
  refresh = () => {
    revision++
    controller?.abort()
    write(entries(), 'en')
    document.documentElement.lang = 'en'
    schedule()
  }
  observer.observe(root, options)
  schedule()
  return () => {
    stopped = true
    controller?.abort()
    clearTimeout(timer)
    observer.disconnect()
    refresh = () => {}
  }
}
