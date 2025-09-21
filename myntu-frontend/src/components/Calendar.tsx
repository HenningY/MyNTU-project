import { useEffect, useMemo, useState } from 'react'
import { calendarEvents, type CalendarEvent as StoredEvent } from '../data/calendarEvents'

type Lang = 'zh' | 'en'

type CalendarProps = {
  lang: Lang
}

type CalendarEvent = {
  date: string
  title: string
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d: Date, m: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + m, 1)
}

function addDays(d: Date, delta: number): Date {
  const nd = new Date(d)
  nd.setDate(nd.getDate() + delta)
  return nd
}

function getCalendarGrid(forMonth: Date): Date[] {
  // Sunday-first 6x7 grid
  const first = startOfMonth(forMonth)
  const firstWeekday = first.getDay() // 0=Sun, 6=Sat
  const gridStart = addDays(first, -firstWeekday)
  const cells: Date[] = []
  for (let i = 0; i < 42; i += 1) cells.push(addDays(gridStart, i))
  return cells
}

export default function Calendar({ lang }: CalendarProps) {
  const [cursor, setCursor] = useState<Date>(() => startOfMonth(new Date()))
  const todayKey = useMemo(() => toKey(new Date()), [])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const monthLabel = useMemo(() => {
    const year = cursor.getFullYear()
    const monthIdx = cursor.getMonth()
    const monthNames = lang === 'zh'
      ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[monthIdx]} ${year}`
  }, [cursor, lang])

  const weekNames = lang === 'zh'
    ? ['日', '一', '二', '三', '四', '五', '六']
    : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  // Localize events from external data file
  const sampleEvents: CalendarEvent[] = useMemo(() => {
    return calendarEvents.map((e: StoredEvent) => ({
      date: e.date,
      title: lang === 'zh' ? e.title.zh : e.title.en,
    }))
  }, [lang])

  const dateToEvents = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const ev of sampleEvents) {
      const arr = map.get(ev.date) || []
      arr.push(ev)
      map.set(ev.date, arr)
    }
    return map
  }, [sampleEvents])

  const cells = useMemo(() => getCalendarGrid(cursor), [cursor])
  const inMonth = (d: Date) => d.getMonth() === cursor.getMonth()

  const monthKeyPrefix = `${cursor.getFullYear()}-${pad2(cursor.getMonth() + 1)}-`
  const monthlyEvents = useMemo(() => {
    return sampleEvents
      .filter((e) => e.date.startsWith(monthKeyPrefix))
      .sort((a, b) => (a.date < b.date ? -1 : 1))
  }, [sampleEvents, monthKeyPrefix])

  useEffect(() => {
    if (selectedDate && !selectedDate.startsWith(monthKeyPrefix)) {
      setSelectedDate(null)
    }
  }, [monthKeyPrefix, selectedDate])

  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-28 pb-12 text-[var(--text-color)] w-full">
      <div className="mb-10 w-100 max-[900px]:w-full flex items-start justify-between gap-10 px-4 max-[900px]:px-2">
        <div>
          <div className="text-3xl font-extrabold leading-tight">{monthLabel}</div>
          <div className="mt-1 text-sm text-[var(--text-500)]">
            {lang === 'zh' ? '近期活動一覽。' : 'Recent events at a glance.'}
          </div>
        </div>
        <div className="flex items-center gap-2 border-b-1 border-[var(--nav-border)] pt-0 pb-1">
          <button
            type="button"
            aria-label="prev month"
            className="cursor-pointer text-[24px] rounded-md border-0 border-[var(--nav-border)] px-2 py-0 hover:bg-[var(--title-hover-color)]"
            onClick={() => setCursor((c) => addMonths(c, -1))}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="next month"
            className="cursor-pointer text-[24px] rounded-md border-0 border-[var(--nav-border)] px-2 py-0 hover:bg-[var(--title-hover-color)]"
            onClick={() => setCursor((c) => addMonths(c, 1))}
          >
            ›
          </button>
          <button
            type="button"
            className="ml-3 cursor-pointer rounded-lg border-0 border-[var(--nav-border)] bg-[var(--body-bg)] px-2 py-1 hover:bg-[var(--title-hover-color)]"
            onClick={() => setCursor(startOfMonth(new Date()))}
          >
            {lang === 'zh' ? '今天' : 'Today'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-15 items-start px-4 max-[1200px]:gap-10 max-[900px]:px-0">
        {/* Left: compact calendar */}
        <div className="col-span-10 max-[900px]:col-span-10 min-[900px]:col-span-4">
          <div className="grid grid-cols-7 gap-0">
            {weekNames.map((w) => (
              <div key={w} className="px-0 pb-8 mb-6 max-[900px]:mb-4 max-[900px]:pb-6 text-sm font-medium uppercase text-center tracking-wide text-[var(--text-500)] border-b-2 border-[var(--text-color)]">
                {w}
              </div>
            ))}
            {cells.map((d) => {
              const key = toKey(d)
              const evs = dateToEvents.get(key) || []
              const isToday = key === todayKey
              const faded = !inMonth(d)
              const isSelected = selectedDate === key
              const hasEvents = evs.length > 0
              return (
                <div
                  key={key}
                  className={`h-16 rounded-md px-0 py-2 m-[2px] transition-colors text-center max-[900px]:h-13 ${
                    isSelected
                      ? 'bg-[var(--title-hover-color)]'
                      : (isToday ? 'bg-[var(--bg-blue)] border-1 border-[var(--border-blue)]' : 'bg-transparent hover:bg-[var(--title-hover-color)]')
                  } ${faded ? 'opacity-50' : ''} ${hasEvents ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => { if (!hasEvents) return; setSelectedDate((prev) => (prev === key ? null : key)) }}
                >
                  <div className={`mb-1 text-sm font-semibold ${isToday ? 'text-[var(--border-blue)]' : 'text-[var(--text-color)]'}`}>
                    {pad2(d.getDate())}
                  </div>
                  <div className="mt-1 flex justify-center">
                    <div className="inline-grid grid-cols-3 gap-[2px] justify-items-center place-content-center">
                      {evs.map((_, idx) => (
                        <span
                          key={`${key}-dot-${idx}`}
                          className={`inline-block h-1 w-1 rounded-full ${isToday ? 'bg-[var(--border-blue)]' : 'bg-[var(--text-500)]'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: monthly list */}
        <div className="col-span-10 max-[900px]:col-span-10 min-[900px]:col-span-6">
          <div className="rounded-lg border border-[var(--nav-border)] bg-[var(--body-bg)]">
            <div className="border-b border-[var(--nav-border)] px-4 py-3 text-sm font-semibold text-[var(--muted)]">
              {lang === 'zh' ? '本月活動' : 'This Month'}
            </div>
            <ul className="divide-y divide-[var(--nav-border)]">
              {(selectedDate ? monthlyEvents.filter((e) => e.date === selectedDate) : monthlyEvents).length === 0 ? (
                <li className="px-4 py-4 text-sm text-[var(--text-500)]">{lang === 'zh' ? '本月沒有活動' : 'No events this month'}</li>
              ) : (
                (selectedDate ? monthlyEvents.filter((e) => e.date === selectedDate) : monthlyEvents).map((ev, idx) => (
                  <li key={`${ev.date}-${idx}`} className="px-4 py-3 hover:bg-[var(--title-hover-color)]">
                    <div className="flex items-center gap-3">
                      <div className="mt-0.5 shrink-0 rounded-md border border-[var(--nav-border)] px-2 py-1 text-xs text-[var(--text-500)]">
                        <span className="max-[600px]:hidden inline">{ev.date}</span>
                        <span className="min-[601px]:hidden inline">{ev.date.slice(5)}</span>
                      </div>
                      <div className="text-sm text-[var(--text-color)] leading-snug">
                        {ev.title}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


