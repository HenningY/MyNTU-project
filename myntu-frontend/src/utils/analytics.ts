export type ClicksByUrl = Record<string, number>

const VIEWS_KEY = 'analytics:siteViews'
const CLICKS_KEY = 'analytics:clicksByUrl'
const SESSION_HIT_KEY = 'analytics:sessionHit'

export async function incrementSiteView(): Promise<void> {
  try {
    // Count only once per browser tab session
    const already = window.sessionStorage.getItem(SESSION_HIT_KEY)
    if (already) return
    window.sessionStorage.setItem(SESSION_HIT_KEY, '1')
    // local optimistic update
    const n = parseInt(window.localStorage.getItem(VIEWS_KEY) || '0', 10)
    window.localStorage.setItem(VIEWS_KEY, String(Number.isFinite(n) ? n + 1 : 1))
    try {
      await fetch('/api/analytics/hit', { method: 'POST' })
    } catch {}
  } catch {}
}

export function getSiteViews(): number {
  try {
    const n = parseInt(window.localStorage.getItem(VIEWS_KEY) || '0', 10)
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

export async function trackClick(rawUrl: string): Promise<void> {
  let url = ''
  try {
    url = String(rawUrl || '').trim()
    if (!url) return
    const raw = window.localStorage.getItem(CLICKS_KEY)
    const obj: ClicksByUrl = raw ? JSON.parse(raw) : {}
    obj[url] = (obj[url] || 0) + 1
    window.localStorage.setItem(CLICKS_KEY, JSON.stringify(obj))
  } catch {}
  try {
    if (url) {
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
    }
  } catch {}
}

export function getClicks(): ClicksByUrl {
  try {
    const raw = window.localStorage.getItem(CLICKS_KEY)
    return raw ? (JSON.parse(raw) as ClicksByUrl) : {}
  } catch {
    return {}
  }
}

export function clearAnalytics(): void {
  try {
    window.localStorage.removeItem(VIEWS_KEY)
    window.localStorage.removeItem(CLICKS_KEY)
  } catch {
    // ignore
  }
}


