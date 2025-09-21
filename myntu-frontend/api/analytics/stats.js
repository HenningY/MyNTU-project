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
    // Normalize Upstash pipeline results (can be raw or wrapped {result})
    const unwrap = (x) => (x && typeof x === 'object' && 'result' in x ? x.result : x)
    const arr = Array.isArray(data?.result) ? data.result.map(unwrap) : []
    const viewsRaw = arr[0]
    const clicksRaw = arr[1]
    const viewsNum = parseInt(String(viewsRaw ?? '0'), 10)
    const views = Number.isFinite(viewsNum) ? viewsNum : 0
    const clicks = {}
    if (Array.isArray(clicksRaw)) {
      for (let i = 0; i < clicksRaw.length; i += 2) {
        const k = String(clicksRaw[i] ?? '')
        const v = parseInt(String(clicksRaw[i + 1] ?? '0'), 10) || 0
        if (k) clicks[k] = v
      }
    } else if (clicksRaw && typeof clicksRaw === 'object') {
      for (const [k, v] of Object.entries(clicksRaw)) {
        clicks[String(k)] = parseInt(String(v ?? '0'), 10) || 0
      }
    }
    res.status(200).json({ ok: true, views, clicks })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}


