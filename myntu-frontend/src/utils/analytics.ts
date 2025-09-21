export type ClicksByUrl = Record<string, number>

const VIEWS_KEY = 'analytics:siteViews'
const CLICKS_KEY = 'analytics:clicksByUrl'

export function incrementSiteView(): void {
  try {
    const n = parseInt(window.localStorage.getItem(VIEWS_KEY) || '0', 10)
    window.localStorage.setItem(VIEWS_KEY, String(Number.isFinite(n) ? n + 1 : 1))
  } catch {
    // ignore storage errors
  }
}

export function getSiteViews(): number {
  try {
    const n = parseInt(window.localStorage.getItem(VIEWS_KEY) || '0', 10)
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

export function trackClick(rawUrl: string): void {
  try {
    const url = String(rawUrl || '').trim()
    if (!url) return
    const raw = window.localStorage.getItem(CLICKS_KEY)
    const obj: ClicksByUrl = raw ? JSON.parse(raw) : {}
    obj[url] = (obj[url] || 0) + 1
    window.localStorage.setItem(CLICKS_KEY, JSON.stringify(obj))
  } catch {
    // ignore
  }
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


