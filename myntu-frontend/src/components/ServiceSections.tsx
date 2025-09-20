import type { ServiceItem } from '../data/services'

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
}

function ServiceCard({ item, lang }: { item: ServiceItem; lang: Lang }) {
  const localizedName = lang === 'zh' ? item.name.zh : item.name.en
  const localizedDesc = lang === 'zh' ? item.description.zh : item.description.en
  const href = typeof item.url === 'string' ? item.url : (lang === 'zh' ? item.url.zh : item.url.en)
  return (
    <a
      key={item.id}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="h-25 flex items-center border-0 border-[#e5e7eb] rounded-[20px] gap-3 bg-transparent px-4 py-4 transition-all duration-200 hover:bg-[var(--bg-slate-50)] max-[900px]:px-2 max-[900px]:py-1 max-[900px]:h-auto"
    >
      <img src={item.icon} alt="icon" className="h-12 w-12 rounded-lg shadow-sm border border-[var(--nav-border)] max-[900px]:h-10 max-[900px]:w-10" />
      <div className="text-left">
        <div className="text-lg line-clamp-2 leading-tight font-medium text-[var(--text-color)] max-[900px]:text-[17px]">{localizedName}</div>
        <div className="text-sm line-clamp-2 leading-tight mt-1 font-light text-[var(--text-500)] max-[900px]:text-xs max-[900px]:mt-0">{localizedDesc}</div>
      </div>
    </a>
  )
}

export default function ServiceSections(props: ServiceSectionsProps) {
  const { lang, isSearching, searchTerm, selectedCategory, visibleServices, groups, hotTitle, resultTitle } = props

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

  return (
    <div className="mx-auto my-8 w-full max-w-screen-xl px-0 space-y-6">
      {isSearching && searchTerm ? (
        <section className="w-full">
          <div className="mb-2 text-left font-semibold text-[var(--muted)] px-3 max-[600px]:text-sm max-[600px]:mb-4">{resultTitle}</div>
          {listForSearch.length === 0 ? (
            <div className="px-3 py-10 text-center text-lg max-[600px]:text-base text-[var(--text-500)]">{emptySearchText}</div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-[600px]:px-1 max-[1200px]:grid-cols-2 max-[900px]:grid-cols-1">
              {listForSearch.map((s) => (
                <ServiceCard key={s.id} item={s} lang={lang} />
              ))}
            </div>
          )}
        </section>
      ) : (!selectedCategory ? (
        <section className="w-full">
          <div className="mb-2 text-left font-semibold text-[var(--muted)] px-3 max-[600px]:text-sm max-[600px]:mb-4">{hotTitle}</div>
          <div className="grid grid-cols-3 gap-2 max-[600px]:px-1 max-[1200px]:grid-cols-2 max-[900px]:grid-cols-1">
            {visibleServices.map((s) => (
              <ServiceCard key={s.id} item={s} lang={lang} />
            ))}
          </div>
        </section>
      ) : (
        Array.from(groups.entries()).map(([subLabel, items]) => (
          <section key={subLabel} className="w-full">
            <div className="mb-2 text-left font-semibold text-[var(--muted)] px-3 max-[600px]:text-sm max-[600px]:mb-4">{subLabel}</div>
            <div className="grid grid-cols-3 gap-2 max-[600px]:px-1 max-[1200px]:grid-cols-2 max-[900px]:grid-cols-1">
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


