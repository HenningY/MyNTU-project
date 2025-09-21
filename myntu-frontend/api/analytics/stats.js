export default async function handler(req, res) {
  if (req.method !== 'GET') {
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
    // Pipeline: GET views:total, HGETALL clicks:byUrl
    const r = await fetch(`${base}/pipeline`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([["GET", "views:total"], ["HGETALL", "clicks:byUrl"]])
    })
    const data = await r.json()
    // data.result is array of results per command
    const viewsRaw = Array.isArray(data.result) && data.result[0] ? data.result[0] : null
    const clicksArr = Array.isArray(data.result) && Array.isArray(data.result[1]) ? data.result[1] : []
    const views = Number.isFinite(parseInt(viewsRaw, 10)) ? parseInt(viewsRaw, 10) : 0
    const clicks = {}
    for (let i = 0; i < clicksArr.length; i += 2) {
      const k = String(clicksArr[i] ?? '')
      const v = parseInt(clicksArr[i + 1] ?? '0', 10) || 0
      if (k) clicks[k] = v
    }
    res.status(200).json({ ok: true, views, clicks })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}


