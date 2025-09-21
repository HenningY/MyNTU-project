export default async function handler(req, res) {
  const base = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!base || !token) {
    res.status(500).json({ error: 'Missing Upstash env vars' })
    return
  }

  try {
    if (req.method === 'POST') {
      // increment
      const r = await fetch(`${base}/pipeline`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([["INCR", "views:total"]])
      })
      const data = await r.json()
      // res.status(200).json({ ok: true, result: data })
      return
    }
    if (req.method === 'GET') {
      // no cache, always fresh
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
      res.setHeader('CDN-Cache-Control', 'no-store')
      res.setHeader('Vercel-CDN-Cache-Control', 'no-store')
      const r = await fetch(`${base}/get/views:total`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await r.json()
      const val = data?.result ?? data
      const viewsNum = parseInt(String(val ?? '0'), 10)
      const views = Number.isFinite(viewsNum) ? viewsNum : 0
      res.status(200).json({ ok: true, views })
      return
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}


