export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const base = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!base || !token) {
      res.status(500).json({ error: 'Missing Upstash env vars' })
      return
    }
    const r = await fetch(`${base}/pipeline`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([["INCR", "views:total"]])
    })
    const data = await r.json()
    res.status(200).json({ ok: true, result: data })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}


