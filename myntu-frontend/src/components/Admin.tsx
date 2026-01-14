import { useEffect, useMemo, useState } from 'react'
// import { clearAnalytics } from '../utils/analytics'

export default function Admin() {
  const [authed, setAuthed] = useState<boolean>(false)
  const [user, setUser] = useState<string>('')
  const [pass, setPass] = useState<string>('')
  const [views, setViews] = useState<number>(0)
  const [clicks, setClicks] = useState<Record<string, number>>({})
  const [error, setError] = useState<string>('')

  // Replace these with your own credentials
  const ADMIN_USER = 'HenningY'
  const ADMIN_PASS = 'Henning9098'

  useEffect(() => {
    const load = async () => {
      try {
        setError('')
        const [rv, rc] = await Promise.all([
          fetch('/api/analytics/hit', { method: 'GET', headers: { 'Accept': 'application/json' } }),
          fetch('/api/analytics/click', { method: 'GET', headers: { 'Accept': 'application/json' } }),
        ])
        if (!rv.ok) {
          const txt = await rv.text().catch(() => '')
          setError(`Views request failed (${rv.status}): ${txt || 'no body'}`)
          return
        }
        if (!rc.ok) {
          const txt = await rc.text().catch(() => '')
          setError(`Clicks request failed (${rc.status}): ${txt || 'no body'}`)
          return
        }
        const jv = await rv.json().catch(() => null)
        const jc = await rc.json().catch(() => null)
        if (jv && jv.ok) setViews(jv.views || 0)
        else setError(`Views response not ok: ${JSON.stringify(jv)}`)
        if (jc && jc.ok) setClicks(jc.clicks || {})
        else setError(`Clicks response not ok: ${JSON.stringify(jc)}`)
      } catch (e: any) {
        setError(String(e?.message || e || 'Unknown error'))
      }
    }
    if (authed) load()
  }, [authed])

  const clickEntries = useMemo(() => {
    return Object.entries(clicks).sort((a, b) => b[1] - a[1])
  }, [clicks])

  if (!authed) {
    return (
      <div className="mx-auto min-h-screen max-w-screen-sm px-6 pt-28 text-[var(--text-color)]">
        <h1 className="mb-6 text-2xl font-semibold">Admin Login</h1>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (user === ADMIN_USER && pass === ADMIN_PASS) {
              setAuthed(true)
            } else {
              // simple feedback
              alert('Invalid credentials')
            }
          }}
        >
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input value={user} onChange={(e) => setUser(e.target.value)} className="w-full rounded-md border border-[var(--nav-border)] bg-transparent px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full rounded-md border border-[var(--nav-border)] bg-transparent px-3 py-2 outline-none" />
          </div>
          <button type="submit" className="mt-2 rounded-md border border-[var(--nav-border)] px-4 py-2 hover:bg-[var(--title-hover-color)]">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 pt-28 pb-20 text-[var(--text-color)]">
      <h1 className="mb-6 text-2xl font-semibold">Analytics</h1>
      {error ? (
        <div className="mb-6 rounded-md border border-red-400 bg-red-50/10 px-3 py-2 text-sm text-red-500">
          {error}
        </div>
      ) : null}
      <div className="mb-6 rounded-lg border border-[var(--nav-border)] bg-[var(--body-bg)] p-4">
        <div className="text-sm text-[var(--muted)]">Total Site Views</div>
        <div className="text-3xl font-bold">{views}</div>
      </div>
      <div className="rounded-lg border border-[var(--nav-border)] bg-[var(--body-bg)]">
        <div className="border-b border-[var(--nav-border)] px-4 py-3 text-sm font-semibold text-[var(--muted)]">Clicks by URL</div>
        <ul className="divide-y divide-[var(--nav-border)]">
          {clickEntries.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[var(--text-500)]">No data</li>
          ) : (
            clickEntries.map(([url, n]) => (
              <li key={url} className="px-4 py-3 text-sm">
                <span className="text-[var(--text-500)]">{n}</span>
                <span className="ml-3 break-all">{url}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <button
        type="button"
        className="mt-6 rounded-md border border-[var(--nav-border)] px-3 py-1 text-sm hover:bg-[var(--title-hover-color)]"
        // onClick={() => { clearAnalytics(); setViews(0); setClicks({}) }}
      >
        Clear data
      </button>
    </div>
  )
}


