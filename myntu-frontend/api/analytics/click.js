export default async function handler(req, res) {
  const base = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!base || !token) {
    res.status(500).json({ error: 'Missing Upstash env vars' })
    return
  }
  try {
    if (req.method === 'POST') {
      const { url } = req.body || {}
      if (!url || typeof url !== 'string') {
        res.status(400).json({ error: 'Missing url' })
        return
      }
      const r = await fetch(`${base}/pipeline`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([["HINCRBY", "clicks:byUrl", url, 1]])
      })
      const data = await r.json()
      res.status(200).json({ ok: true, result: data })
      return
    }
    if (req.method === 'GET') {
      // Disable cache to always get fresh numbers
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
      res.setHeader('CDN-Cache-Control', 'no-store')
      res.setHeader('Vercel-CDN-Cache-Control', 'no-store')
      const r = await fetch(`${base}/hgetall/clicks:byUrl`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await r.json()
      const arr = Array.isArray(data?.result) ? data.result : []
      const clicks = {}
      for (let i = 0; i < arr.length; i += 2) {
        const k = String(arr[i] ?? '')
        const v = parseInt(String(arr[i + 1] ?? '0'), 10) || 0
        if (k) clicks[k] = v
      }
      res.status(200).json({ ok: true, clicks })
      return
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}


