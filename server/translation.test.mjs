import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createTranslationHandler } from './translation.mjs'

async function withService(options, check) {
  const server = createServer(createTranslationHandler(options))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const post = (body) => fetch(`http://127.0.0.1:${server.address().port}/api/translate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  try { await check(post) } finally { await new Promise(resolve => server.close(resolve)) }
}

test('translates in order, deduplicates and caches requests, keeps key server-side', async () => {
  let calls = 0
  await withService({ apiKey: () => 'test-private-key', request: async (url, options) => {
    calls++
    assert.equal(url, 'https://translation.googleapis.com/language/translate/v2')
    assert.equal(options.headers['X-goog-api-key'], 'test-private-key')
    const body = JSON.parse(options.body)
    assert.equal(body.source, 'en')
    assert.equal(body.format, 'text')
    assert.deepEqual(body.q, ['Hello', 'Jewellery'])
    return Response.json({ data: { translations: body.q.map(text => ({ translatedText: `${body.target}:${text}` })) } })
  } }, async post => {
    for (const target of ['bn', 'hi', 'bn']) {
      const response = await post({ target, texts: ['Hello', 'Jewellery', 'Hello'] })
      assert.equal(response.status, 200)
      const body = await response.json()
      assert.deepEqual(body.data.translations, [`${target}:Hello`, `${target}:Jewellery`, `${target}:Hello`])
      assert.ok(!JSON.stringify(body).includes('test-private-key'))
    }
    assert.equal(calls, 2)
  })
})

test('rejects invalid languages, oversized batches and missing configuration', async () => {
  await withService({ apiKey: () => '' }, async post => {
    for (const body of [{ target: 'xx', texts: ['Hello'] }, { target: 'bn', texts: [] }, { target: 'hi', texts: Array(129).fill('Hello') }, { target: 'bn', texts: ['a'.repeat(5001)] }]) {
      assert.equal((await post(body)).status, 400)
    }
    const response = await post({ target: 'bn', texts: ['Hello'] })
    assert.equal(response.status, 503)
    assert.match((await response.json()).error.message, /not configured/)
  })
})

test('handles Google failure without exposing provider details or caching failure', async () => {
  let calls = 0
  await withService({ apiKey: () => 'private-key', request: async () => {
    calls++
    if (calls === 1) return Response.json({ error: 'private provider details' }, { status: 403 })
    return Response.json({ data: { translations: [{ translatedText: 'নমস্কার' }] } })
  } }, async post => {
    const failed = await post({ target: 'bn', texts: ['Hello'] })
    assert.equal(failed.status, 502)
    assert.ok(!(await failed.text()).includes('private'))
    const retry = await post({ target: 'bn', texts: ['Hello'] })
    assert.equal(retry.status, 200)
    assert.deepEqual((await retry.json()).data.translations, ['নমস্কার'])
  })
})
