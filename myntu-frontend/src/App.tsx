import { useEffect, useRef, useState } from 'react'
import './index.css'
import { services, type ServiceItem } from './data/services'
import ServiceSections from './components/ServiceSections'
import Calendar from './components/Calendar'
import Admin from './components/Admin'
// import { incrementSiteView, trackClick } from './utils/analytics'
import logo from './data/logo.png'
// import logo from './data/logo_xmas.png'
import logo_night from './data/logo_night.png'
import { synonymsGroupsZh, synonymsGroupsEn } from './data/searchSynonyms'

// Collect PNG assets for About page marquee
// const aboutImageModules = import.meta.glob('./data/*.png', { eager: true }) as Record<string, any>
// const ABOUT_IMAGES: string[] = Object.values(aboutImageModules).map((mod: any) => mod.default ?? mod)

// snowfall effect
// interface Flake {
//   id: number
//   left: number
//   delay: number
//   duration: number
//   size: number
//   rotateDuration: number
//   clockwise: boolean
//   drift: number
// }

// function Snowfall() {
//   const flakesRef = useRef<Flake[]>([])
//   const width = typeof window !== 'undefined' ? window.innerWidth : 0
//   if (flakesRef.current.length === 0) {
//     const count = width > 600 ? width/35 : 20
//     const basesize = width > 600 ? 6 : 5
//     flakesRef.current = Array.from({ length: count }, (_, i) => ({
//       id: i,
//       left: Math.random() * 100,           // 0–100% 寬度隨機位置
//       delay: Math.random() * -20,          // 負的 delay 讓一載入就有不同進度的雪花
//       duration: 2 + Math.random() * 3,     // 6–12 秒落下一次
//       size: basesize + Math.random() * 3,         // 雪花基礎尺寸
//       rotateDuration: 10 + Math.random() * 4, // 4–8 秒轉一圈
//       clockwise: Math.random() < 0.5,        // 隨機順時針 / 逆時針
//       drift: (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 25), // 每片雪花的水平位移，左下或右下
//     }))
//   }

//   const flakes = flakesRef.current

//   return (
//     <div className="pointer-events-none fixed inset-0 max-[900px]:z-[20] z-[120] overflow-hidden">
//       {flakes.map((flake) => (
//         <div
//           key={flake.id}
//           className="snowflake"
//           style={{
//             left: `${flake.left}%`,
//             width: `${flake.size}px`,
//             height: `${flake.size}px`,
//             animationDuration: `${flake.duration}s`,
//             animationDelay: `${flake.delay}s`,
//             ['--snow-drift' as any]: `${flake.drift}px`,
//           }}
//         >
//           <div
//             className={
//               flake.clockwise
//                 ? 'snowflake-inner snowflake-inner--cw'
//                 : 'snowflake-inner snowflake-inner--ccw'
//             }
//             style={{
//               animationDuration: `${flake.rotateDuration}s`,
//             }}
//           >
//             <span className="snowflake-arm snowflake-arm--v" />
//             <span className="snowflake-arm snowflake-arm--d1" />
//             <span className="snowflake-arm snowflake-arm--d2" />
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }
// snowfall effect end

type Lang = 'zh' | 'en'
type View = 'home' | 'calendar' | 'about'

// function AboutMarquee() {
//   if (!ABOUT_IMAGES.length) return null
//   const rows = 5
//   const perRow = Math.ceil(ABOUT_IMAGES.length / rows) || 1

//   return (
//     <div className="mt-8 mb-12 flex gap-4">
//       {Array.from({ length: rows }).map((_, rowIdx) => {
//         const start = rowIdx * perRow
//         const end = start + perRow
//         const slice = ABOUT_IMAGES.slice(start, end)
//         const imgs = slice.length > 0 ? slice : ABOUT_IMAGES
//         const isOddRow = rowIdx % 2 === 0 // 0,2,4 => odd rows visually
//         const rowClass = isOddRow ? 'about-marquee-row-up' : 'about-marquee-row-down'
//         return (
//           <div key={rowIdx} className="relative h-50 w-20 overflow-hidden bg-[var(--body-bg)]/60">
//             <div className={`absolute inset-0 flex flex-col items-center justify-start gap-3 ${rowClass}`}>
//               {imgs.concat(imgs).map((src, i) => (
//                 <img
//                   key={`${rowIdx}-${i}`}
//                   src={src}
//                   alt=""
//                   className="h-12 w-12 object-contain opacity-85 rounded-lg border border-[var(--nav-border)]"
//                 />
//               ))}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// Simple About page
function AboutPage({ lang }: { lang: Lang }) {
  const title1 = lang === 'zh' ? '告別過時，迎接直覺：' : 'Out with the old, in with the intuitive.'
  const title2 = lang === 'zh' ? '這是我們期待已久的 myNTU。' : 'The myNTU experience we\'ve all been waiting for.'
  const feedback = lang === 'zh' ? '歡迎留下您的回饋！' : 'Your feedback matters!'
  const content1 = lang === 'zh' ? '我的初衷：源於不便，始於改變。' : 'The Vision: Built by Students, for Students'
  const content1_1 = lang === 'zh' ? '這是一個專為台大人打造的非營利數位空間。起因很單純：原本的校園服務系統已顯過時，操作上的種種繁雜不便，激發了我從學生視角重新定義校園入口的想法。我的初衷，是打造一個簡潔、現代且直覺的平台，讓繁瑣的操作流程變得流暢且賞心悅目。' : 'This is a non-profit platform dedicated to the NTU community. It all started with a simple realization: the official campus services were outdated and cumbersome. From a student\'s perspective, I envisioned a modern, intuitive portal that simplifies campus life. My mission is to transform clunky workflows into a seamless, aesthetically pleasing digital experience.'
  const content2 = lang === 'zh' ? '成長與演進：不斷優化的旅程' : 'Journey & Impact: A Continuous Evolution'
  const content2_1 = lang === 'zh' ? '本專案自 2025 年 9 月中旬啟動，並於 9 月 21 日正式上線。自上線以來，我不曾停止更新與優化，致力於讓每一位使用者都能感到便利與舒適。至今，網站已累積超過 30,000+ 瀏覽人次，以及破萬次的服務點擊。目前提供完整的校園行事曆與全方位的臺大校園服務，並全面支援中英文雙語介面。' : 'Launched on September 21, 2025, after a week of intense development, this project has never stopped evolving. Since day one, I have been continuously refining the platform to ensure the best user experience. To date, we have reached over 30,000+ views and 20,000+ link clicks. The platform now features a comprehensive campus calendar and NTU school services, fully localized in both Chinese and English.'
  const content3 = lang === 'zh' ? '匠心細節：親手繪製的溫度' : 'Craftsmanship: A Personal Touch'
  const content3_1 = lang === 'zh' ? '為了追求視覺的一致性與美感，站內各項服務的標誌 (Logo) 皆由我親手繪製而成。由於這是一個獨立開發的專案，部分功能與設計仍持續補完中，若有未盡完善之處，還請各位見諒，我會持續努力完善細節。' : 'To ensure visual harmony and a modern aesthetic, I have personally hand-drawn the logos for each service. As this is a solo-developed project, some features and designs are still works in progress. I appreciate your patience and feedback as I continue to polish every detail.'
  const content4 = lang === 'zh' ? '重要說明：關於權限與個人化功能' : 'FTransparency: Permissions & Privacy'
  const content4_1 = lang === 'zh' ? '本專案已獲得學校長官的重視與支持，並在開發過程中提供相關協助。然而，本站本質上仍屬於非官方的專案。為了保障資訊安全，本站並未取得校方計資中心的系統登入權限。因此，我無法提供需要登入的個人化服務（例如：個人喜好設定、服務使用紀錄等）。這雖然帶來些許不便，但也確保了您的登入資料完全留存於官方系統，請大家放心使用。' : 'This project has gained recognition and support from university officials, who have provided assistance during development. However, this remains an unofficial initiative. To ensure maximum security, this site does not have access to NTU C&INC\'s login systems. Consequently, personalized features that require authentication (such as favorites settings or usage history) are currently unavailable. While this is a limitation, it also ensures your login credentials remain securely within official channels.'

  return (
    <div className="mx-auto max-w-screen-xl px-6 pt-35 max-[900px]:pt-30 max-[600px]:pt-28 pb-20 text-[var(--text-color)] min-h-screen">
      <h1 className="mb-5 text-[36px] max-[900px]:text-[28px] max-[600px]:text-[26px] font-semibold leading-tight">{title1}<br />{title2}</h1>
      {/* <AboutMarquee /> */}
      <div className="flex justify-between max-[900px]:flex-col max-[900px]:gap-y-2 mb-15 max-[900px]:mb-10 max-[900px]:items-start">
        <div className="flex gap-x-2 max-[900px]:mb-5 items-center">
          <h5 className="text-sm font-base text-[var(--muted)] border-l border-[var(--nav-border)] px-2 py-1">Since 2025.09.21</h5>
          <h5 className="text-sm font-base text-[var(--muted)] border-l border-[var(--nav-border)] px-2 py-1">30,000+ views</h5>
          <h5 className="text-sm font-base text-[var(--muted)] border-l border-[var(--nav-border)] px-2 py-1">20,000+ link clicks</h5>
        </div>
        <a 
          href="https://forms.gle/pKnxg6bwGXEV1oob8" 
          target="_blank" 
          rel="noreferrer noopener" 
          className="text-base font-base transition-all duration-300 hover:text-[var(--text-color)] hover:bg-[var(--body-bg)] border border-[var(--text-color)] bg-[var(--text-color)] text-[var(--body-bg)] rounded-full px-3 py-1">{feedback}
        </a>
      </div>
      <div className="flex justify-between border-t border-[var(--nav-border)] pt-8">
        <h5 className="text-lg font-semibold max-[900px]:hidden">About myNTU</h5>
        <div className="flex flex-col gap-y-10 w-2/3 max-[1200px]:w-3/4 max-[900px]:w-full">
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {content1}
            </h4>
            <p className="text-base font-light">
              {content1_1}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {content2}
            </h4>
            <p className="text-base font-light">
              {content2_1}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {content3}
            </h4>
            <p className="text-base font-light">
              {content3_1}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {content4}
            </h4>
            <p className="text-base font-light">
              {content4_1}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [lang, setLang] = useState<Lang>('zh')

  const t = {
    zh: {
      title: 'myNTU 臺大校務整合平台',
      subtitle: '快速連結所有常用校務與學習資源',
      links: ['聯絡資訊', '最新消息', '臺大首頁', '計中首頁'],
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
      subtitle: 'Access to academic and campus resources',
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
  const hotIds: string[] = ['77','78','11','20','28','85','187','12','10','207', '255']
  // const hotSet = new Set(hotIds)
  // Recent added IDs (configurable)
  const recentIds: string[] = []

  const [hasScrolled, setHasScrolled] = useState<boolean>(false)
  // const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth < 600 : false))
  const [view, setView] = useState<View>('home')

  // Mobile category scroller centering
  const catScrollRef = useRef<HTMLDivElement | null>(null)
  const centerCategoryButton = (btn: HTMLButtonElement) => {
    try {
      const container = catScrollRef.current
      if (!container) return
      const desired = btn.offsetLeft + (btn.offsetWidth / 2) - (container.clientWidth / 2)
      const minLeft = 0
      const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth)
      const nextLeft = Math.min(maxLeft, Math.max(minLeft, desired))
      container.scrollTo({ left: nextLeft, behavior: 'smooth' })
    } catch {
      // ignore
    }
  }

  const buildPath = (viewForPath: View, langForPath: Lang): string => {
    const base =
      viewForPath === 'calendar'
        ? '/calendar'
        : viewForPath === 'about'
          ? '/about'
          : '/'
    if (langForPath === 'zh') return base
    return base === '/' ? '/en' : `${base}/en`
  }

  const toggleLang = () => {
    setLang((prev) => {
      const nextLang: Lang = prev === 'zh' ? 'en' : 'zh'
      try {
        const currentView = view
        const url = buildPath(currentView, nextLang)
        window.history.replaceState({ view: currentView, lang: nextLang }, '', url)
      } catch {
        // ignore
      }
      return nextLang
    })
  }

  const navItems = [
    {
      key: 'home',
      type: 'view' as const,
      view: 'home' as View,
      label: lang === 'zh' ? '首頁' : 'Home',
    },
    {
      key: 'calendar',
      type: 'view' as const,
      view: 'calendar' as View,
      label: lang === 'zh' ? '行事曆' : 'Calendar',
    },
    {
      key: 'about',
      type: 'view' as const,
      view: 'about' as View,
      label: lang === 'zh' ? '關於' : 'About',
    },
    {
      key: 'ntu',
      type: 'external' as const,
      href: lang === 'zh' ? 'https://www.ntu.edu.tw' : 'https://www.ntu.edu.tw/english/',
      label: lang === 'zh' ? '臺大首頁' : 'NTU Website',
    },
    {
      key: 'cinc',
      type: 'external' as const,
      href: lang === 'zh'
        ? 'https://www.cc.ntu.edu.tw/chinese/index.asp'
        : 'https://www.cc.ntu.edu.tw/english/index.asp',
      label: lang === 'zh' ? '計中首頁' : 'C&INC Website',
    },
    {
      key: 'lang',
      type: 'lang' as const,
      label: t.toggle,
    },
  ]

  const goToView = (next: View, replace = false) => {
    setView(next)
    try {
      const url = buildPath(next, lang)
      if (replace) {
        window.history.replaceState({ view: next, lang }, '', url)
      } else {
        window.history.pushState({ view: next, lang }, '', url)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    setSelectedCategory(null)
    setIsSearching(false)
    setCommittedQuery('')
  }, [lang])

  // const cancelLabel = lang === 'zh' ? '取消' : 'Cancel'

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

  useEffect(() => {
    // Count a view once per load/navigation
    // try { incrementSiteView() } catch {}
    const onScroll = () => setHasScrolled(window.scrollY > 0)
    // const onResize = () => setIsSmallScreen(window.innerWidth < 600)
    onScroll()
    // onResize()
    window.addEventListener('scroll', onScroll, { passive: true } as any)
    // window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      // window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    const handleResizeCloseMenu = () => {
      if (window.innerWidth >= 900) {
        setMenuOpen(false)
      }
    }
    handleResizeCloseMenu()
    window.addEventListener('resize', handleResizeCloseMenu)
    return () => window.removeEventListener('resize', handleResizeCloseMenu)
  }, [])

  // Initialize view from URL and handle back/forward
  useEffect(() => {
    try {
      const parsePath = (rawPath: string) => {
        let path = rawPath || '/'
        let langFromPath: Lang = 'zh'
        if (path.length > 1 && path.endsWith('/')) {
          path = path.slice(0, -1) || '/'
        }
        if (path.endsWith('/en')) {
          langFromPath = 'en'
          path = path.slice(0, -3) || '/'
        }
        const viewFromPath: View =
          path.startsWith('/admin')
            ? 'calendar'
            : path.startsWith('/calendar')
              ? 'calendar'
              : path.startsWith('/about')
                ? 'about'
                : 'home'
        return { path, langFromPath, viewFromPath }
      }

      const rawPath = window.location.pathname || '/'
      const { path, langFromPath, viewFromPath } = parsePath(rawPath)

      setLang(langFromPath)
      setView(viewFromPath)

      const canonicalPath = path.startsWith('/admin')
        ? path
        : buildPath(viewFromPath, langFromPath)

      window.history.replaceState({ view: viewFromPath, lang: langFromPath }, '', canonicalPath)

      const onPop = () => {
        const p = window.location.pathname || '/'
        const { langFromPath: popLang, viewFromPath: popView } = parsePath(p)
        setMenuOpen(false)
        setSearchOpen(false)
        setIsSearching(false)
        setCommittedQuery('')
        setSelectedCategory(null)
        setLang(popLang)
        setView(popView)
      }
      window.addEventListener('popstate', onPop)
      return () => window.removeEventListener('popstate', onPop)
    } catch {
      // ignore
    }
    return () => {}
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

    // Sync browser / PWA theme-color with current effective theme
    try {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const effectiveTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme
      let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'theme-color'
        document.head.appendChild(meta)
      }
      meta.content = effectiveTheme === 'dark' ? '#141414' : '#ffffff'
    } catch {
      // ignore
    }
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
  const recentTitle = lang === 'zh' ? '近期新增項目' : 'Recently Added'
  const recentServices: ServiceItem[] = (!selectedCategory && !(isSearching && searchTerm))
    ? recentIds
        .map((id) => services.find((s) => s.id === id))
        .filter((s): s is ServiceItem => Boolean(s))
        .filter(hasLocalizedData)
    : []

  // Alternative results via synonym groups: replace matched synonym inside the query
  const synonymGroups = lang === 'zh' ? synonymsGroupsZh : synonymsGroupsEn
  const altQueries = (() => {
    const q = searchTerm.trim()
    if (!q) return [] as string[]
    const baseLower = q.toLowerCase()
    const out = new Set<string>()
    for (const group of synonymGroups) {
      const lowerGroup = group.map((g) => g.toLowerCase())
      const matched = lowerGroup.find((w) => baseLower.includes(w))
      if (!matched) continue
      // Build case-insensitive regex to replace all occurrences of matched token
      const re = new RegExp(matched.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      for (const alt of lowerGroup) {
        if (alt === matched) continue
        const replaced = baseLower.replace(re, alt)
        if (replaced !== baseLower) out.add(replaced)
      }
    }
    return Array.from(out)
  })()
  const altResults: ServiceItem[] = (isSearching && searchTerm && altQueries.length > 0)
    ? (() => {
        const matched: ServiceItem[] = []
        const seen = new Set<string>()
        for (const altQ of altQueries) {
          for (const s of services) {
            if (!hasLocalizedData(s)) continue
            const nm = lang === 'zh' ? s.name.zh : s.name.en
            const ok = lang === 'zh' ? isSubsequence(altQ, nm) : (nm || '').toLowerCase().includes(altQ)
            if (!ok) continue
            if (seen.has(s.id)) continue
            const inMain = visibleServices.some((v) => v.id === s.id)
            if (inMain) continue
            seen.add(s.id)
            matched.push(s)
          }
        }
        return matched
      })()
    : []
  const altResultsTitle = lang === 'zh' ? '其他可能搜尋結果' : 'Other possible results'

  const [spinLogo, setSpinLogo] = useState(false)

  return (
      <div>
      <nav className="mx-auto max-w-screen-2xl fixed inset-x-0 top-0 z-[80] h-14 flex items-center bg-transparent">
        <div className={`mx-5 mt-8 rounded-lg border ${isMobile ? (menuOpen ? 'border-transparent' : 'border-[var(--nav-border)]') : (hasScrolled ? (menuOpen ? 'border-transparent' : 'border-[var(--nav-border)]') : 'border-transparent')} transition-all duration-300 flex h-13 w-full items-center justify-between px-2 bg-[var(--nav-bg)] backdrop-blur-xs max-[900px]:px-1.5 max-[900px]:mt-3 max-[900px]:mx-3 max-[900px]:h-12 max-[600px]:mt-1`}>
          <a className="inline-flex items-center gap-2 font-bold text-lg text-[var(--text-color)]" href="#home" aria-label="logo" onClick={(e) => { 
            e.preventDefault();
            setIsSearching(false);
            setCommittedQuery('');
            setSelectedCategory(null);
            setSearchOpen(false);
            setMenuOpen(false);
            goToView('home');
            setView('home'); (window as any)?.scrollTo?.({ top: 0, behavior: 'smooth' });
            setSpinLogo(true);
            window.setTimeout(() => setSpinLogo(false), 650);
          }}>
            <img src={theme === 'dark' ? logo_night : logo} alt="logo" className={`h-9 w-9 rounded-md max-[900px]:h-9 max-[900px]:w-9 ${spinLogo ? 'spin-once' : ''}`} />
            {/* {t.logo} */}
          </a>
          <div className="flex items-center gap-2">
            <div className="items-center gap-0.5 max-[900px]:hidden flex">
              {navItems.map((item) => {
                if (item.type === 'lang') {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className="font-medium text-base text-[var(--text-color)] cursor-pointer hover:bg-[var(--title-hover-color)] rounded-md px-3 py-1"
                      onClick={toggleLang}
                    >
                      {item.label}
                    </button>
                  )
                }
                if (item.type === 'view') {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className="font-medium text-base text-[var(--text-color)] cursor-pointer hover:bg-[var(--title-hover-color)] rounded-md px-3 py-1"
                      onClick={() => { goToView(item.view); (window as any)?.scrollTo?.({ top: 0, behavior: 'smooth' }); }}
                    >
                      <span className="relative inline-blocks">
                        {item.label}
                        {item.key === 'about' && (
                          <span className="absolute top-[-4px] right-[-8px] inline-block h-1.5 w-1.5 rounded-full bg-[var(--bg-red)] shadow-[0_0_5px_rgba(210,0,0,1)]" />
                        )}
                      </span>
                    </button>
                  )
                }
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className="font-medium text-base text-[var(--text-color)] cursor-pointer hover:bg-[var(--title-hover-color)] rounded-md px-3 py-1"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>
            {/* Mobile search icon based on device detection, placed left to burger */}
            {isMobile && view === 'home' && (
              <button
                type="button"
                aria-label="open search"
                className="cursor-pointer bg-transparent items-center justify-center rounded-md p-2 fixed right-11 top-1.5 z-[90] max-[900px]:flex"
                onClick={() => { setSearchOpen(true); setMenuOpen(false) }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-[var(--text-color)]">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="22" y1="22" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}

            <button
              type="button"
              className="hidden cursor-pointer max-[900px]:flex bg-transparent items-center justify-center rounded-md p-2 max-[900px]:fixed max-[900px]:right-1 max-[900px]:top-2 max-[900px]:z-[90]"
              aria-label="menu"
              aria-expanded={menuOpen}
              onClick={() => { setMenuOpen((v) => !v); setSearchOpen(false) }}
            >
              <div className="relative h-4 w-6">
                <span
                  className={`absolute left-0 top-0 block h-[2px] w-5 bg-[var(--text-color)] transition-transform duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[2px] w-5 -translate-y-1/2 bg-[var(--text-color)] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
                />
                <span
                  className={`absolute bottom-0 left-0 block h-[2px] w-5 bg-[var(--text-color)] transition-transform duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[var(--body-bg)] backdrop-blur-sm">
          {/* Keep a translucent bar at top to visually preserve navbar with logo and burger */}
          <div className="pointer-events-none fixed inset-x-0 top-0 h-16 bg-transparent" />
          <div className="flex flex-col h-full w-full items-start justify-center">
            <div className="flex flex-col items-start gap-6 px-6">
              {navItems.map((item) => {
                if (item.type === 'lang') {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        toggleLang()
                        setMenuOpen(false)
                      }}
                      className="cursor-pointer text-2xl font-semibold text-[var(--text-color)] hover:text-[var(--border-blue)]"
                    >
                      {item.label}
                    </button>
                  )
                }
                if (item.type === 'view') {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => { goToView(item.view); setMenuOpen(false); (window as any)?.scrollTo?.({ top: 0, behavior: 'smooth' }); }}
                      className="cursor-pointer text-2xl font-semibold text-[var(--text-color)] hover:text-[var(--border-blue)]"
                    >
                      <span className="relative inline-flex items-center">
                        {item.label}
                        {item.key === 'about' && (
                          <span className="absolute top-[-2px] right-[-10px] inline-block h-1.5 w-1.5 rounded-full bg-[var(--bg-red)] shadow-[0_0_5px_rgba(210,0,0,1)]" />
                        )}
                      </span>
                    </button>
                  )
                }
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-semibold text-[var(--text-color)] hover:text-[var(--border-blue)]"
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {searchOpen && view === 'home' && (
        <div className="fixed inset-0 z-[100] bg-[var(--body-bg)]">
          <form
            className="mx-auto w-full max-w-screen-sm px-3 pt-16 max-[900px]:pt-5"
            onSubmit={(e) => { e.preventDefault(); setCommittedQuery(query); setIsSearching(Boolean(query.trim())); setSelectedCategory(null); setQuery(''); setSearchOpen(false); setMenuOpen(false); (window as any)?.scrollTo?.({ top: 0, behavior: 'smooth' }); (document.activeElement as HTMLElement | null)?.blur() }}
            role="search"
            aria-label="site search"
          >
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="back"
                onClick={() => setSearchOpen(false)}
                className="shrink-0 rounded-md p-2 text-[var(--text-color)]"
              >
                {/* Left arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
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
                className="w-full h-10 mr-2 rounded-none border-b border-[var(--nav-border)] px-2 text-[var(--text-color)] text-lg outline-none placeholder:text-[var(--placeholder)]"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="clear"
                  onClick={() => setQuery('')}
                  className="shrink-0 rounded-md p-2 text-[var(--text-color)]"
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

      {(() => {
        const path = typeof window !== 'undefined' ? window.location.pathname : '/'
        if (path.startsWith('/admin')) return <Admin />
        if (view === 'about' || path.startsWith('/about')) return <AboutPage lang={lang} />
        if (view === 'calendar' || path.startsWith('/calendar')) return <Calendar lang={lang} />
        return (
      // snowfall effect start
      // <>
      // <Snowfall />
      // {/* snowfall effect end */}
      <header className="relative flex flex-col min-h-screen items-center pt-32 bg-[var(--body-bg)] text-center max-[900px]:pt-30 max-[600px]:pt-25">
        <div className="mx-auto px-6 w-full max-[600px]:mx-0 max-[600px]:px-1.5">
          <h1 className="m-0 text-[36px] font-medium font-sans leading-tight text-[var(--text-color)] max-[900px]:text-[32px] max-[600px]:text-[24px]">{t.title}</h1>
          <p className="mb-8 text-lg text-[var(--muted)] max-[900px]:text-base max-[600px]:text-sm max-[600px]:mb-4">{t.subtitle}</p>
          <div className="relative mx-auto mt-6 max-w-[600px]">
            <div ref={isMobile ? catScrollRef : undefined} className={`flex items-center gap-x-1 scrollbar-none ${isMobile ? 'flex-nowrap overflow-x-auto overflow-y-hidden justify-start gap-y-0 px-6' : 'flex-wrap justify-center gap-y-1.5 px-0'}`}>
              {t.buttons.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`border px-3 py-1 text-base font-base shadow-xs cursor-pointer transition-colors ${isMobile ? 'flex-none whitespace-nowrap rounded-lg' : 'rounded-full max-[600px]:text-sm max-[600px]:px-2.5'} ${
                    selectedCategory === name
                      ? 'border-[var(--border-blue)] bg-[var(--bg-blue)] text-[var(--border-blue)]'
                      : 'border-[var(--border)] bg-[var(--body-bg)] text-[var(--text-color)] hover:bg-[var(--title-hover-color)]'
                  }`}
                  aria-pressed={selectedCategory === name}
                  onClick={(e) => { setSelectedCategory((prev) => (prev === name ? null : name)); setIsSearching(false); setCommittedQuery(''); setSearchOpen(false); if (isMobile) centerCategoryButton(e.currentTarget as HTMLButtonElement) }}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className={`pointer-events-none absolute inset-y-0 left-0 z-[1] w-6 bg-gradient-to-r from-[var(--body-bg)] to-transparent ${isMobile ? 'block' : 'hidden'}`} />
            <div className={`pointer-events-none absolute inset-y-0 right-0 z-[1] w-6 bg-gradient-to-l from-[var(--body-bg)] to-transparent ${isMobile ? 'block' : 'hidden'}`} />
      </div>
          {!isMobile && (
            <form
              className="mx-auto mt-6 w-full px-3 max-w-3xl h-14 mb-16 max-[900px]:h-12"
              onSubmit={(e) => { e.preventDefault(); setCommittedQuery(query); setIsSearching(Boolean(query.trim())); setSelectedCategory(null); setQuery(''); (window as any)?.scrollTo?.({ top: 0, behavior: 'smooth' }) }}
              role="search"
              aria-label="site search"
            >
              <label className="relative flex items-center gap-3 rounded-[14px] max-[600px]:rounded-[10px] h-full border border-[var(--nav-border)] bg-[var(--title-hover-color)] px-1 py-2 inset-shadow-sm">
                <input
                  type="search"
                  placeholder={t.search}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-10 rounded-md px-3 pr-10 text-[var(--text-color)] text-lg max-[900px]:text-base outline-none bg-transparent transition-[box-shadow,border-color] placeholder:text-[var(--placeholder)]"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="clear"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[var(--text-color)] hover:text-[var(--x-hover)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 cursor-pointer">
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
            recentTitle={recentTitle}
            recentServices={recentServices}
            altResultsTitle={altResultsTitle}
            altResults={altResults}
          />
          
        </div>
      </header>
      // {/* snowfall effect start */}
      // </>
      // snowfall effect end
        )
      })()}
      <footer className="mx-auto w-full max-w-screen-2xl px-10 pt-30 pb-15 text-sm text-[var(--text-500)] max-[600px]:px-5 max-[600px]:pb-6 max-[600px]:pt-15">
        <div className="grid grid-cols-[3fr_2fr] gap-y-10 max-[600px]:gap-y-10">
          <div className="justify-self-start self-start flex flex-col gap-y-2">
            <span className="block">Not affiliated with NTU; only links to public services from my.ntu.edu.tw.</span>
            <span className="block flex gap-x-3 max-[600px]:gap-x-2">
              <a href="https://www.ntu.edu.tw" target="_blank" rel="noreferrer noopener" className="text-[var(--text-color)] hover:text-[var(--border-blue)] border-r-1 border-[var(--nav-border)] pr-3 max-[600px]:pr-2">{lang==='zh' ? '臺大首頁' : 'NTU'}</a>
              <a href="https://www.cc.ntu.edu.tw" target="_blank" rel="noreferrer noopener" className="text-[var(--text-color)] hover:text-[var(--border-blue)] border-r-1 border-[var(--nav-border)] pr-3 max-[600px]:pr-2">{lang==='zh' ? '計中首頁' : 'C&INC'}</a>
              <a href="https://www.ntu.edu.tw/contact.html" target="_blank" rel="noreferrer noopener" className="text-[var(--text-color)] hover:text-[var(--border-blue)] ">{lang==='zh' ? '聯絡我們' : 'Contact'}</a>
            </span>
          </div>
          <div className="justify-self-end self-start">
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-[var(--nav-border)] px-3 py-1 text-[var(--text-500)] hover:bg-[var(--title-hover-color)]"
              onClick={toggleLang}
            >
              {lang === 'zh' ? 'English' : '中文'}
            </button>
          </div>
          <div className="justify-self-start self-end">
            henning9098@gmail.com <br /> Copyright © 2025 HenningY
          </div>
          <div className="justify-self-end self-end">
            <div className="flex items-center gap-1">
              {/* <button
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
              </button> */}
              <button
                type="button"
                aria-label="Use light theme"
                className={`cursor-pointer rounded-lg border px-1.5 py-1 text-slate-600 ${theme==='light' ? 'bg-slate-0' : 'border-[#333333] hover:text-slate-300 hover:border-[#666666]'}`}
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
                className={`cursor-pointer rounded-lg border px-1.5 py-1 text-slate-400 ${theme==='light' ? 'bg-slate-100 hover:text-slate-700' : 'border-[#666666]'}`}
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
