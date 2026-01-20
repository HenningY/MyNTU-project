import type { ServiceItem } from '../data/services'
// import { trackClick } from '../utils/analytics'

type Lang = 'zh' | 'en'

type ServiceSectionsProps = {
  lang: Lang
  isSearching: boolean
  searchTerm: string
  selectedCategory: string | null
  visibleServices: ServiceItem[]
  groups: Map<string, ServiceItem[]>
  hotTitle: string
  resultTitle: string
  recentTitle: string
  recentServices: ServiceItem[]
  altResultsTitle: string
  altResults: ServiceItem[]
}

function ServiceCard({ item, lang }: { item: ServiceItem; lang: Lang }) {
  const localizedName = lang === 'zh' ? item.name.zh : item.name.en
  const localizedDesc = lang === 'zh' ? item.description.zh : item.description.en
  const href = typeof item.url === 'string' ? item.url : (lang === 'zh' ? item.url.zh : item.url.en)
  // course icon
  const courseText1 = lang === 'zh' ? '一階 1/19-1/21' : '1st phase 1/19-1/21'
  const courseText2 = lang === 'zh' ? '二階 1/26-1/27' : '2nd phase 1/26-1/27'
  if (item.id === '28' || item.id === '29' || item.id === '83' || item.id === '84') {
    return (
      <a
        key={item.id}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        // onClick={() => trackClick(href)}
        className="h-22 max-[1200px]:h-20 flex items-center border-0 border-[#e5e7eb] rounded-[20px] gap-3 bg-transparent px-4 py-4 transition-all duration-200 hover:bg-[var(--bg-slate-50)] max-[750px]:px-2 max-[750px]:py-1 max-[750px]:h-auto max-[900px]:rounded-lg"
      >
        <img src={item.icon} alt="icon" className="h-14 w-14 rounded-xl shadow-sm border border-[var(--nav-border)] max-[1200px]:h-12 max-[1200px]:w-12 max-[600px]:h-10 max-[600px]:w-10 max-[1200px]:rounded-lg" />
        <div className="text-left">
          <div className="flex items-center gap-1 flex-wrap">
            <div className="text-lg line-clamp-2 leading-tight font-medium text-[var(--text-color)] max-[1200px]:text-[17px] mr-2">{localizedName}</div>
            <div className="flex items-center gap-1">
              <div className="text-xs leading-tight font-medium text-[var(--text-500)] bg-[var(--body-bg)] max-[1200px]:text-[12px] border border-[var(--nav-border)] rounded-md px-1 py-0.5">{courseText1}</div>
              <div className="text-xs leading-tight font-medium text-[var(--text-500)] bg-[var(--body-bg)] max-[1200px]:text-[12px] border border-[var(--nav-border)] rounded-md px-1 py-0.5">{courseText2}</div>
            </div>
          </div>
          <div className="text-sm line-clamp-2 leading-tight mt-1 font-light text-[var(--text-500)] max-[1200px]:text-xs max-[1200px]:mt-0">{localizedDesc}</div>
        </div>
      </a>
    )
  }
  return (
    <a
      key={item.id}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      // onClick={() => trackClick(href)}
      className="h-22 max-[1200px]:h-20 flex items-center border-0 border-[#e5e7eb] rounded-[20px] gap-3 bg-transparent px-4 py-4 transition-all duration-200 hover:bg-[var(--bg-slate-50)] max-[750px]:px-2 max-[750px]:py-1 max-[750px]:h-auto max-[900px]:rounded-lg"
    >
      <img src={item.icon} alt="icon" className="h-14 w-14 rounded-xl shadow-sm border border-[var(--nav-border)] max-[1200px]:h-12 max-[1200px]:w-12 max-[600px]:h-10 max-[600px]:w-10 max-[1200px]:rounded-lg" />
      <div className="text-left">
        <div className="text-lg line-clamp-2 leading-tight font-medium text-[var(--text-color)] max-[1200px]:text-[17px]">{localizedName}</div>
        <div className="text-sm line-clamp-2 leading-tight mt-1 font-light text-[var(--text-500)] max-[1200px]:text-xs max-[1200px]:mt-0">{localizedDesc}</div>
      </div>
    </a>
  )
}

export default function ServiceSections(props: ServiceSectionsProps) {
  const { lang, isSearching, searchTerm, selectedCategory, visibleServices, groups, hotTitle, resultTitle, recentTitle, recentServices, altResultsTitle, altResults } = props

  // Deduplicate by localized name when searching
  const listForSearch = (() => {
    if (!isSearching) return visibleServices
    const seen = new Set<string>()
    const unique: ServiceItem[] = []
    for (const s of visibleServices) {
      const nmRaw = lang === 'zh' ? s.name.zh : s.name.en
      const key = (nmRaw || '').trim().toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      unique.push(s)
    }
    return unique
  })()

  const emptySearchText = lang === 'zh' ? '抱歉，無符合的搜尋結果' : 'Sorry, no matching results'

  // Deduplicate alt results by localized name as well
  const altListForSearch = (() => {
    if (!isSearching) return altResults
    const seen = new Set<string>()
    const unique: ServiceItem[] = []
    for (const s of altResults) {
      const nmRaw = lang === 'zh' ? s.name.zh : s.name.en
      const key = (nmRaw || '').trim().toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      unique.push(s)
    }
    return unique
  })()

  return (
    <div className="mx-auto my-8 w-full max-w-screen-xl px-0 space-y-6">
      {isSearching && searchTerm ? (
        <section className="w-full">
          <div className="overflow-hidden text-ellipsis mb-2 text-left font-semibold text-[var(--muted)] px-3 max-[600px]:text-sm max-[600px]:mb-4">{resultTitle}</div>
          {listForSearch.length === 0 ? (
            <div className="px-3 py-10 text-center text-lg max-[600px]:text-base text-[var(--text-500)]">{emptySearchText}</div>
          ) : (
            <div className="grid grid-cols-3 gap-1 max-[600px]:px-1 max-[1200px]:grid-cols-2 max-[750px]:grid-cols-1 max-[750px]:gap-2">
              {listForSearch.map((s) => (
                <ServiceCard key={s.id} item={s} lang={lang} />
              ))}
            </div>
          )}
          {isSearching && searchTerm && altListForSearch.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 text-left font-semibold text-[var(--muted)] px-3 max-[600px]:text-sm max-[600px]:mb-4">{altResultsTitle}</div>
              <div className="grid grid-cols-3 gap-1 max-[600px]:px-1 max-[1200px]:grid-cols-2 max-[750px]:grid-cols-1 max-[750px]:gap-2">
                {altListForSearch.map((s) => (
                  <ServiceCard key={`alt-${s.id}`} item={s} lang={lang} />
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (!selectedCategory ? (
        <>
          <section className="w-full">
            <div className="mb-2 text-left font-semibold text-[var(--muted)] px-3 max-[600px]:text-sm max-[600px]:mb-4">{hotTitle}</div>
            <div className="grid grid-cols-3 gap-1 max-[600px]:px-1 max-[1200px]:grid-cols-2 max-[750px]:grid-cols-1 max-[750px]:gap-2">
              {visibleServices.map((s) => (
                <ServiceCard key={s.id} item={s} lang={lang} />
              ))}
            </div>
          </section>
          {recentServices.length > 0 && (
            <section className="w-full mt-10">
              <div className="mb-2 text-left font-semibold text-[var(--muted)] px-3 max-[600px]:text-sm max-[600px]:mb-4">{recentTitle}</div>
              <div className="grid grid-cols-3 gap-1 max-[600px]:px-1 max-[1200px]:grid-cols-2 max-[750px]:grid-cols-1 max-[750px]:gap-2">
                {recentServices.map((s) => (
                  <ServiceCard key={s.id} item={s} lang={lang} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        Array.from(groups.entries()).map(([subLabel, items]) => (
          <section key={subLabel} className="w-full">
            <div className="mb-2 text-left font-semibold text-[var(--muted)] px-3 max-[600px]:text-sm max-[600px]:mb-4">{subLabel}</div>
            <div className="mb-8 grid grid-cols-3 gap-1 max-[600px]:px-1 max-[1200px]:grid-cols-2 max-[750px]:grid-cols-1 max-[750px]:gap-2">
              {items.map((s) => (
                <ServiceCard key={s.id} item={s} lang={lang} />
              ))}
            </div>
          </section>
        ))
      ))}
    </div>
  )
}


