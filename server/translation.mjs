import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'

export function createTranslationHandler({ apiKey = () => process.env.GOOGLE_TRANSLATE_API_KEY, request = fetch } = {}) {
  const cache = new Map()
  const clients = new Map()
  return async (req, res) => {
    const send = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      res.end(JSON.stringify(body))
    }
    const fail = (status, message) => send(status, { success: false, error: { message } })
    if (req.url !== '/api/translate' || req.method !== 'POST') return fail(404, 'Not found')
    // Bound both memory and requests per client without trusting forwarded IP headers.
    const now = Date.now()
    for (const [ip, value] of clients) if (value.expires <= now) clients.delete(ip)
    const ip = req.socket.remoteAddress
    const client = clients.get(ip) ?? { expires: now + 60000, count: 0 }
    if (clients.size >= 10000 && !clients.has(ip)) return fail(429, 'Please try again later.')
    clients.set(ip, client)
    if (++client.count > 60) return fail(429, 'Too many translation requests. Please try again later.')
    try {
      let raw = ''
      req.setEncoding('utf8')
      for await (const chunk of req) {
        raw += chunk.toString()
        if (Buffer.byteLength(raw) > 150000) return fail(413, 'Translation request is too large.')
      }
      let body
      try { body = JSON.parse(raw) } catch { return fail(400, 'Invalid translation request.') }
      const { target, texts } = body ?? {}
      if (!['bn', 'hi'].includes(target) || !Array.isArray(texts) || !texts.length || texts.length > 128 || texts.some(text => typeof text !== 'string' || !text.length || text.length > 5000) || texts.join('').length > 20000) return fail(400, 'Invalid translation request.')
      const key = apiKey()
      if (!key) return fail(503, 'Website translation is not configured yet.')
      const missing = [...new Set(texts)].filter(text => !cache.has(`${target}:${text}`))
      if (missing.length) {
        const response = await request('https://translation.googleapis.com/language/translate/v2', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key },
          body: JSON.stringify({ q: missing, source: 'en', target, format: 'text' }),
          signal: AbortSignal.timeout(15000),
        })
        if (!response.ok) return fail(502, 'Translation is unavailable. Please try again.')
        const data = await response.json()
        const translations = data.data?.translations
        if (!Array.isArray(translations) || translations.length !== missing.length || translations.some(item => typeof item?.translatedText !== 'string')) return fail(502, 'Invalid translation response.')
        missing.forEach((text, index) => cache.set(`${target}:${text}`, translations[index].translatedText))
      }
      const translations = texts.map(text => cache.get(`${target}:${text}`))
      while (cache.size > 10000) cache.delete(cache.keys().next().value)
      return send(200, { success: true, data: { translations } })
    } catch { return fail(502, 'Translation is unavailable. Please try again.') }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createServer(createTranslationHandler()).listen(Number(process.env.TRANSLATION_PORT || 4000), '127.0.0.1', () => {
    console.log('Translation service listening on http://127.0.0.1:' + (process.env.TRANSLATION_PORT || 4000))
  })
}
