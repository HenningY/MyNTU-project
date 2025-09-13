import { useEffect, useState } from 'react'
import './index.css'
import { services, type ServiceItem } from './data/services'

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
      search: '搜尋服務、公告、地圖…',
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
      title: 'MyNTU Unified Campus Services',
      subtitle: 'One-stop access to academic and campus resources',
      links: ['Contact', 'News', 'NTU Website', 'C&INC Website'],
      toggle: '中文',
      logo: 'myNTU',
      search: 'Search services, news, map…',
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

  useEffect(() => {
    setSelectedCategory(null)
  }, [lang])

  return (
    <div>
      <nav className="fixed inset-x-0 top-0 z-50 h-16 flex items-center bg-transparent">
        <div className="mx-auto max-w-screen-2xl flex h-16 w-full items-center justify-between px-6 bg-transparent">
          <a className="inline-flex items-center gap-2 font-bold text-lg text-slate-900" href="#home" aria-label="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="#2563eb" />
              <path d="M12 6L8 8.5V12.5L12 15L16 12.5V8.5L12 6Z" fill="white" />
            </svg>
            {t.logo}
          </a>
          <div className="flex items-center gap-2">
            {t.links.map((label) => (
              <a key={label} className="font-medium text-lg text-slate-900 cursor-pointer hover:bg-[#f5f5f5] rounded-md px-3 py-1" href="#">
                {label}
              </a>
            ))}
            <button
              type="button"
              className="rounded-full border border-black/10 bg-white/60 px-3 py-1 backdrop-blur-sm cursor-pointer hover:bg-[#f5f5f5]"
              onClick={() => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))}
            >
              {t.toggle}
            </button>
          </div>
        </div>
      </nav>

      <header className="relative flex flex-col min-h-screen items-center pt-40 bg-[#ffffff] text-center">
        <div className="mx-auto px-6 w-full">
          <h1 className="m-0 text-[40px] font-medium font-sans leading-tight text-slate-900 max-[600px]:text-[24px]">{t.title}</h1>
          <p className="mb-8 text-lg text-[#6b7280] max-[600px]:text-base">{t.subtitle}</p>
          <div className="mx-auto mt-6 flex max-w-[600px] flex-wrap items-center justify-center gap-x-1 gap-y-1.5 px-0">
            {t.buttons.map((name) => (
              <button
                key={name}
                type="button"
                className={`rounded-full border px-3 py-1 text-lg font-light shadow-xs cursor-pointer transition-colors max-[600px]:text-base ${
                  selectedCategory === name
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-[#e5e7eb] bg-white text-slate-900 hover:bg-slate-50'
                }`}
                aria-pressed={selectedCategory === name}
                onClick={() => setSelectedCategory((prev) => (prev === name ? null : name))}
              >
                {name}
              </button>
            ))}
          </div>
          <form
            className="mx-auto mt-6 w-full max-w-3xl h-14 mb-16"
            onSubmit={(e) => e.preventDefault()}
            role="search"
            aria-label="site search"
          >
            <label className="flex items-center gap-3 rounded-[14px] h-full border border-[#e5e7eb] bg-[#f5f5f5] px-1 py-2 inset-shadow-sm">
              <input
                type="search"
                placeholder={t.search}
                className="w/full h-10 rounded-md px-3 text-lg outline-none bg-transparent transition-[box-shadow,border-color] placeholder:text-[#6b7280]"
              />
            </label>
          </form>

          <div className="mx-auto my-8 grid w-full max-w-screen-xl grid-cols-1 gap-3 px-0 lg:grid-cols-2 xl:grid-cols-4">
            {services
              .filter((s: ServiceItem) => {
                const localizedName = lang === 'zh' ? s.name.zh : s.name.en
                const localizedUrl = typeof s.url === 'string' ? s.url : (lang === 'zh' ? s.url.zh : s.url.en)
                if (!localizedName || !localizedName.trim()) return false
                if (!localizedUrl || !localizedUrl.trim()) return false

                if (!selectedCategory) return true
                const localizedCategory = s.category ? (lang === 'zh' ? s.category.zh : s.category.en) : ''
                return localizedCategory === selectedCategory
              })
              .map((s: ServiceItem) => {
                const localizedName = lang === 'zh' ? s.name.zh : s.name.en
                const localizedDesc = lang === 'zh' ? s.description.zh : s.description.en
                const href = typeof s.url === 'string' ? s.url : (lang === 'zh' ? s.url.zh : s.url.en)
                return (
                  <a
                    key={s.id + s.category.en}
                    href={href}
                    className="flex items-center gap-3 rounded-[14px] border border-[#e5e7eb] bg-white p-4 hover:bg-slate-50"
                  >
                    <img src={s.icon} alt="icon" className="h-12 w-12" />
                    <div className="text-left">
                      <div className="text-lg font-medium text-slate-900">{localizedName}</div>
                      <div className="text-sm font-light text-slate-500">{localizedDesc}</div>
                    </div>
                  </a>
                )
              })}
          </div>
          
        </div>
      </header>
    </div>
  )
}

export default App
