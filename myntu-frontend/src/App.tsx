import { useEffect, useState } from 'react'
import './index.css'
import { services, type ServiceItem } from './data/services'
import ServiceSections from './components/ServiceSections'
import logo from './data/logo.svg'

type Lang = 'zh' | 'en'

function App() {
  const [lang, setLang] = useState<Lang>('zh')

  const t = {
    zh: {
      title: 'myNTU 校園服務整合平台',
      subtitle: '一站式快速連結所有常用校務與學習資源',
      links: ['聯絡資訊', '最新消息', '台大首頁', '計中首頁'],
      toggle: 'EN',
      logo: 'myNTU',
      search: '搜尋服務 …',
      buttons: [
        '學生專區',
        '課程學習',
        '教職申辦',
        '教學',
        '圖書研究',
        '帳務財務',
        '場館交通',
        '校園資源',
        '消息公告',
        '意見交流',
      ],
    },
    en: {
      title: 'myNTU Unified Campus Services',
      subtitle: 'One-stop access to academic and campus resources',
      links: ['Contact', 'News', 'NTU Website', 'C&INC Website'],
      toggle: '中文',
      logo: 'myNTU',
      search: 'Search services …',
      buttons: [
        'Students',
        'Courses',
        'Faculty & Staff',
        'Teaching',
        'Research',
        'Accounts',
        'Facilities',
        'Resource',
        'Bulletin',
        'Opinions',
      ],
    },
  }[lang]

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [searchOpen, setSearchOpen] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [committedQuery, setCommittedQuery] = useState<string>('')
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem('theme') as 'system' | 'light' | 'dark' | null
    if (saved) return saved
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })
  // Placeholder hot IDs after renumbering; adjust as you like
  const hotIds: string[] = ['30','22','186','10','12','11','206','76','84','77']
  const hotSet = new Set(hotIds)

  const navLinks = lang === 'zh'
    ? [
        { label: '聯絡資訊', href: 'https://www.ntu.edu.tw/contact.html' },
        { label: '最新消息', href: 'https://ann.cc.ntu.edu.tw' },
        { label: '台大首頁', href: 'https://www.ntu.edu.tw' },
        { label: '計中首頁', href: 'https://www.cc.ntu.edu.tw/chinese/index.asp' },
      ]
    : [
        { label: 'Contact', href: 'https://www.ntu.edu.tw/english/contact.html' },
        { label: 'News', href: 'https://ann.cc.ntu.edu.tw/eng/index.asp' },
        { label: 'NTU Website', href: 'https://www.ntu.edu.tw/english/' },
        { label: 'C&INC Website', href: 'https://www.cc.ntu.edu.tw/english/index.asp' },
      ]

  const menuItems = [
    ...navLinks,
    { label: t.toggle, isToggle: true } as { label: string; isToggle: true }
  ]

  useEffect(() => {
    setSelectedCategory(null)
    setIsSearching(false)
    setCommittedQuery('')
  }, [lang])

  const cancelLabel = lang === 'zh' ? '取消' : 'Cancel'

  useEffect(() => {
    try {
      // Prefer UA-CH when available
      const uaDataMobile = (navigator as any).userAgentData?.mobile
      const ua = navigator.userAgent || ''
      const uaMobile = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(ua)
      setIsMobile(Boolean(uaDataMobile ?? uaMobile))
    } catch {
      setIsMobile(false)
    }
  }, [])

  // Apply theme to html root and persist (system = rely on media query)
  useEffect(() => {
    const root = document.documentElement
    // reset attributes
    root.removeAttribute('data-theme')
    if (theme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    } else {
      // system
      root.classList.remove('dark')
      // clear explicit flag; media query controls dark variant
    }
    window.localStorage.setItem('theme', theme)
  }, [theme])

  // Helpers
  const hasLocalizedData = (s: ServiceItem) => {
    const localizedName = lang === 'zh' ? s.name.zh : s.name.en
    const localizedUrl = typeof s.url === 'string' ? s.url : (lang === 'zh' ? s.url.zh : s.url.en)
    return Boolean(localizedName && localizedName.trim() && localizedUrl && String(localizedUrl).trim())
  }

  const isSubsequence = (needleRaw: string, hayRaw: string) => {
    const needle = (needleRaw || '').toLowerCase()
    const hay = (hayRaw || '').toLowerCase()
    if (!needle) return false
    let i = 0
    for (let j = 0; j < hay.length && i < needle.length; j += 1) {
      if (hay[j] === needle[i]) i += 1
    }
    return i === needle.length
  }

  // Compute visible services based on current language, hot list, and selected category
  const searchTerm = committedQuery.trim()
  const visibleServices: ServiceItem[] = (isSearching && searchTerm)
    ? services.filter((s: ServiceItem) => {
        if (!hasLocalizedData(s)) return false
        const localizedName = lang === 'zh' ? s.name.zh : s.name.en
        if (lang === 'zh') {
          return isSubsequence(searchTerm, localizedName)
        }
        return (localizedName || '').toLowerCase().includes(searchTerm.toLowerCase())
      })
    : (!selectedCategory
      ? hotIds
          .map((id) => services.find((s) => s.id === id))
          .filter((s): s is ServiceItem => Boolean(s))
          .filter(hasLocalizedData)
      : services.filter((s: ServiceItem) => {
          if (!hasLocalizedData(s)) return false
          const localizedCategory = s.category ? (lang === 'zh' ? s.category.zh : s.category.en) : ''
          return localizedCategory === selectedCategory
        }))

  // Group by localized subcategory label, fall back to zh if en missing
  const groups: Map<string, ServiceItem[]> = new Map()
  if (!(isSearching && searchTerm)) {
    for (const s of visibleServices) {
      const subLabel = s.subcategory ? (lang === 'zh' ? s.subcategory.zh : (s.subcategory.en || s.subcategory.zh)) : ''
      if (!subLabel) continue
      const arr = groups.get(subLabel) || []
      arr.push(s)
      groups.set(subLabel, arr)
    }
  }
  const hotTitle = lang === 'zh' ? '熱門項目' : 'Popular'
  const resultTitle = lang === 'zh' ? `${searchTerm} : 搜尋結果` : `${searchTerm} : Results`

  return (
      <div>
      <nav className="mx-auto max-w-screen-2xl fixed inset-x-0 top-0 z-[80] h-16 flex items-center bg-transparent">
        <div className={`mx-5 mt-10 rounded-lg border ${menuOpen ? 'border-transparent' : 'border-[#e5e7eb]'}  flex h-16 w-full items-center justify-between px-3 bg-[rgba(255,255,255,0.8)] backdrop-blur-xs max-[900px]:px-1.5 max-[900px]:mt-3 max-[900px]:mx-4 max-[900px]:h-12`}>
          <a className="inline-flex items-center gap-2 font-bold text-lg text-slate-900" href="#home" aria-label="logo" onClick={(e) => { e.preventDefault(); setIsSearching(false); setCommittedQuery(''); setSelectedCategory(null); setSearchOpen(false); setMenuOpen(false); (window as any)?.scrollTo?.({ top: 0, behavior: 'smooth' }) }}>
            <img src={logo} alt="logo" className="h-12 w-12 max-[900px]:h-9 max-[900px]:w-9" />
            {/* {t.logo} */}
          </a>
          <div className="flex items-center gap-2">
            <div className="items-center gap-2 max-[900px]:hidden flex">
              {menuItems.map((l) => (
                l.isToggle ? (
                  <button
                    key="lang-toggle-desktop"
                    type="button"
                    className="font-medium text-lg text-slate-900 cursor-pointer hover:bg-[#f5f5f5] rounded-md px-3 py-1"
                    onClick={() => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))}
                  >
                    {l.label}
                  </button>
                ) : (
                  <a
                    key={l.label}
                    className="font-medium text-lg text-slate-900 cursor-pointer hover:bg-[#f5f5f5] rounded-md px-3 py-1"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {l.label}
                  </a>
                )
              ))}
            </div>
            {/* Mobile search icon based on device detection, placed left to burger */}
            {isMobile && (
              <button
                type="button"
                aria-label="open search"
                className="bg-transparent items-center justify-center rounded-md p-2 fixed right-11 top-1.5 z-[90] max-[900px]:flex"
                onClick={() => { setSearchOpen(true); setMenuOpen(false) }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-slate-900">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="22" y1="22" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}

            <button
              type="button"
              className="hidden max-[900px]:flex bg-transparent items-center justify-center rounded-md p-2 max-[900px]:fixed max-[900px]:right-1 max-[900px]:top-2 max-[900px]:z-[90]"
              aria-label="menu"
              aria-expanded={menuOpen}
              onClick={() => { setMenuOpen((v) => !v); setSearchOpen(false) }}
            >
              <div className="relative h-4 w-6">
                <span
                  className={`absolute left-0 top-0 block h-[2px] w-5 bg-slate-900 transition-transform duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[2px] w-5 -translate-y-1/2 bg-slate-900 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
                />
                <span
                  className={`absolute bottom-0 left-0 block h-[2px] w-5 bg-slate-900 transition-transform duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-sm">
          {/* Keep a translucent bar at top to visually preserve navbar with logo and burger */}
          <div className="pointer-events-none fixed inset-x-0 top-0 h-16 bg-transparent" />
          <div className="flex flex-col h-full w-full items-start justify-center">
            <div className="flex flex-col items-start gap-6 px-6">
              {menuItems.map((l) => (
                l.isToggle ? (
                  <button
                    key="lang-toggle-mobile"
                    type="button"
                    onClick={() => {
                      setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))
                      setMenuOpen(false)
                    }}
                    className="text-2xl font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {l.label}
                  </button>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {l.label}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-white">
          <form
            className="mx-auto w-full max-w-screen-sm px-3 pt-16 max-[900px]:pt-6"
            onSubmit={(e) => { e.preventDefault(); setCommittedQuery(query); setIsSearching(Boolean(query.trim())); setQuery(''); setSearchOpen(false); setMenuOpen(false); (window as any)?.scrollTo?.({ top: 0, behavior: 'smooth' }); (document.activeElement as HTMLElement | null)?.blur() }}
            role="search"
            aria-label="site search"
          >
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="back"
                onClick={() => setSearchOpen(false)}
                className="shrink-0 rounded-md p-2 text-slate-900"
              >
                {/* Left arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h- w-5">
                  <polyline points="19 21 9 12 19 3" />
                </svg>
              </button>
              <label className="sr-only" htmlFor="mobile-search-input">{t.search}</label>
              <input
                id="mobile-search-input"
                type="search"
                enterKeyHint="search"
                inputMode="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search}
                className="w-full h-10 rounded-none border-b border-[#e5e7eb] px-2 text-lg outline-none"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="clear"
                  onClick={() => setQuery('')}
                  className="shrink-0 rounded-md p-2 text-slate-500"
                >
                  {/* Close (x) */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ) : null}
            </div>
          </form>
        </div>
      )}

      <header className="relative flex flex-col min-h-screen items-center pt-40 bg-[#ffffff] text-center max-[600px]:pt-25">
        <div className="mx-auto px-6 w-full max-[600px]:mx-0 max-[600px]:px-1.5">
          <h1 className="m-0 text-[40px] font-medium font-sans leading-tight text-slate-900 max-[600px]:text-[24px]">{t.title}</h1>
          <p className="mb-8 text-lg text-[#6b7280] max-[600px]:text-sm max-[600px]:mb-4">{t.subtitle}</p>
          <div className="relative mx-auto mt-6 max-w-[600px]">
            <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 px-0 max-[600px]:flex-nowrap max-[600px]:overflow-x-auto max-[600px]:overflow-y-hidden max-[600px]:justify-start max-[600px]:gap-y-0 max-[600px]:px-6 scrollbar-none">
              {t.buttons.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-lg font-base shadow-xs cursor-pointer transition-colors max-[600px]:text-base max-[600px]:flex-none max-[600px]:whitespace-nowrap max-[600px]:rounded-lg ${
                    selectedCategory === name
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-[#e5e7eb] bg-white text-slate-900 hover:bg-slate-50'
                  }`}
                  aria-pressed={selectedCategory === name}
                  onClick={() => { setSelectedCategory((prev) => (prev === name ? null : name)); setIsSearching(false); setCommittedQuery(''); setSearchOpen(false) }}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-6 bg-gradient-to-r from-white to-transparent max-[600px]:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-6 bg-gradient-to-l from-white to-transparent max-[600px]:block" />
      </div>
          {!isMobile && (
            <form
              className="mx-auto mt-6 w-full max-w-3xl h-14 mb-16"
              onSubmit={(e) => { e.preventDefault(); setCommittedQuery(query); setIsSearching(Boolean(query.trim())); setQuery(''); (window as any)?.scrollTo?.({ top: 0, behavior: 'smooth' }) }}
              role="search"
              aria-label="site search"
            >
              <label className="relative flex items-center gap-3 rounded-[14px] h-full border border-[#e5e7eb] bg-[#f5f5f5] px-1 py-2 inset-shadow-sm">
                <input
                  type="search"
                  placeholder={t.search}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-10 rounded-md px-3 pr-10 text-lg outline-none bg-transparent transition-[box-shadow,border-color] placeholder:text-[#6b7280]"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="clear"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 hover:text-slate-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
        </button>
                ) : null}
              </label>
            </form>
          )}

          <ServiceSections
            lang={lang}
            isSearching={isSearching}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            visibleServices={visibleServices}
            groups={groups}
            hotTitle={hotTitle}
            resultTitle={resultTitle}
          />
          
        </div>
      </header>
      <footer className="mx-auto w-full max-w-screen-2xl px-10 py-18 text-sm text-slate-500 max-[600px]:px-5 max-[600px]:py-6">
        <div className="grid grid-cols-2 gap-y-4">
          <div className="justify-self-start self-start">
            Not affiliated with NTU; only links to public services from my.ntu.edu.tw.
          </div>
          <div className="justify-self-end self-start">
            <button
              type="button"
              className="rounded-md border border-[#e5e7eb] px-3 py-1 text-slate-700 hover:bg-slate-50"
              onClick={() => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))}
            >
              {lang === 'zh' ? 'English' : '中文'}
            </button>
          </div>
          <div className="justify-self-start self-end col-span-2 sm:col-span-1">
            henning9098@gmail.com <br /> @2025 Made by HenningY
          </div>
          <div className="justify-self-end self-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Use system theme"
                className={`rounded-md border px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 ${theme==='system' ? 'bg-slate-100 dark:bg-slate-800' : 'border-[#e5e7eb] dark:border-slate-700'}`}
                onClick={() => setTheme('system')}
                title={lang==='zh' ? '依系統' : 'System'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <rect x="3" y="4" width="18" height="12" rx="2" ry="2" />
                  <line x1="8" y1="20" x2="16" y2="20" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Use light theme"
                className={`rounded-md border px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 ${theme==='light' ? 'bg-slate-100 dark:bg-slate-800' : 'border-[#e5e7eb] dark:border-slate-700'}`}
                onClick={() => setTheme('light')}
                title={lang==='zh' ? '淺色' : 'Light'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Use dark theme"
                className={`rounded-md border px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 ${theme==='dark' ? 'bg-slate-100 dark:bg-slate-800' : 'border-[#e5e7eb] dark:border-slate-700'}`}
                onClick={() => setTheme('dark')}
                title={lang==='zh' ? '深色' : 'Dark'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
      </div>
  )
}

export default App
