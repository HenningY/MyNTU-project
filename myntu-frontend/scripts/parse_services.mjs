import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const defaultHtmlPath = path.join(root, 'src', 'test_html.html')
const servicesPath = path.join(root, 'src', 'data', 'services.ts')
const defaultEnHtmlPath = path.join(root, 'src', 'test_en.html')

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
}

function escapeTsString(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ')
}

function slugFromUrl(href) {
  try {
    const u = new URL(href)
    const slug = (u.hostname + u.pathname).replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    return slug || 'service'
  } catch {
    return href.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'service'
  }
}

function parseSections(html, lang) {
  const results = []
  const sectionRegex = /<div\s+id="servtitle">[\s\S]*?<img[^>]*alt="([^"]*?)"[^>]*>\s*<\/div>\s*<ul\s+id="servlist">([\s\S]*?)<\/ul>/g
  let secMatch
  while ((secMatch = sectionRegex.exec(html)) !== null) {
    let catZh = (secMatch[1] || '').replace(/\s*>\s*$/, '').trim()
    const ul = secMatch[2]
    const linkRegex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g
    let aMatch
    while ((aMatch = linkRegex.exec(ul)) !== null) {
      const anchorTag = aMatch[0]
      const href = aMatch[1]
      const inner = aMatch[2]
      const relMatch = /\brel="([^"]+)"/i.exec(anchorTag)
      const rel = relMatch ? relMatch[1] : ''
      const imgMatch = /<img[^>]*src="([^"]+)"/i.exec(inner)
      const imgSrc = imgMatch ? imgMatch[1] : ''
      const brIdx = inner.lastIndexOf('<br')
      let nameZh = ''
      if (brIdx !== -1) {
        nameZh = inner.slice(brIdx).replace(/<br\s*\/?>([\s\S]*)/i, '$1')
      } else {
        nameZh = inner.replace(/<[^>]+>/g, '')
      }
      nameZh = nameZh.replace(/\s+/g, ' ').trim()
      if (!nameZh || !href) continue
      results.push({ href, nameZh, catZh, imgSrc, rel, lang })
    }
  }
  return results
}

function ensureLogoImport(ts) {
  if (!ts.includes("import logo from './logo.svg'")) {
    const importIdx = ts.indexOf('\nexport const services:')
    return ts.slice(0, importIdx) + "import logo from './logo.svg'\n\n" + ts.slice(importIdx)
  }
  return ts
}

function groupByRel(items) {
  const merged = new Map()
  for (const it of items) {
    const key = it.rel || slugFromUrl(it.href)
    if (!merged.has(key)) {
      merged.set(key, {
        rel: it.rel || '',
        nameZh: '',
        nameEn: '',
        urlZh: '',
        urlEn: '',
        subZh: '',
        subEn: '',
      })
    }
    const m = merged.get(key)
    if (it.lang === 'zh') {
      m.nameZh = it.nameZh || m.nameZh
      m.urlZh = it.href || m.urlZh
      m.subZh = it.catZh || m.subZh
    } else if (it.lang === 'en') {
      m.nameEn = it.nameZh || m.nameEn // nameZh var holds parsed text; here it's en text
      m.urlEn = it.href || m.urlEn
      m.subEn = it.catZh || m.subEn
    }
  }
  return [...merged.values()]
}

function findBlockById(ts, id) {
  const idNeedle = `id: '${escapeTsString(id)}'`
  const idx = ts.indexOf(idNeedle)
  if (idx === -1) return null
  const startObj = ts.lastIndexOf('\n  {', idx)
  let endObj = ts.indexOf('\n  },', idx)
  if (startObj === -1 || endObj === -1) return null
  endObj += '\n  },'.length
  const block = ts.slice(startObj, endObj)
  return { startObj, endObj, block }
}

function removeAllBlocksById(ts, id) {
  const needle = `id: '${escapeTsString(id)}'`
  let idx = ts.indexOf(needle)
  while (idx !== -1) {
    const startObj = ts.lastIndexOf('\n  {', idx)
    let endObj = ts.indexOf('\n  },', idx)
    if (startObj === -1 || endObj === -1) break
    endObj += '\n  },'.length
    ts = ts.slice(0, startObj) + ts.slice(endObj)
    idx = ts.indexOf(needle)
  }
  return ts
}

function removeBlocksByUrl(ts, href) {
  if (!href) return ts
  const esc = escapeTsString(href)
  const needles = [
    `url: { zh: '${esc}'`,
    `url: { en: '${esc}'`,
    `url: '${esc}'`,
  ]
  for (const needle of needles) {
    let idx = ts.indexOf(needle)
    while (idx !== -1) {
      const startObj = ts.lastIndexOf('\n  {', idx)
      let endObj = ts.indexOf('\n  },', idx)
      if (startObj === -1 || endObj === -1) break
      endObj += '\n  },'.length
      ts = ts.slice(0, startObj) + ts.slice(endObj)
      idx = ts.indexOf(needle)
    }
  }
  return ts
}

function upsertServices(ts, items) {
  ts = ensureLogoImport(ts)
  const arrayStart = ts.indexOf('export const services')
  if (arrayStart === -1) throw new Error('services array not found')

  for (const { rel, nameZh, nameEn, urlZh, urlEn, subZh, subEn } of items) {
    const id = rel ? `rel-${escapeTsString(rel)}` : slugFromUrl(urlZh || urlEn)

    // Read previous values if exists
    const existing = findBlockById(ts, id)
    const rx = existing && {
      nameZh: /name:\s*\{\s*zh:\s*'([^']*)'/,
      nameEn: /name:\s*\{[\s\S]*?en:\s*'([^']*)'/,
      urlZh: /url:\s*\{\s*zh:\s*'([^']*)'/,
      urlEn: /url:\s*\{[\s\S]*?en:\s*'([^']*)'/,
      subZh: /subcategory:\s*\{\s*zh:\s*'([^']*)'/,
      subEn: /subcategory:\s*\{[\s\S]*?en:\s*'([^']*)'/,
      imgSrc: /imgSrc:\s*'([^']*)'/,
    }
    const prev = (key) => {
      if (!existing || !rx) return ''
      const m = rx[key].exec(existing.block)
      return m ? m[1] : ''
    }
    const merged = {
      nameZh: escapeTsString(nameZh || prev('nameZh')),
      nameEn: escapeTsString(nameEn || prev('nameEn')),
      urlZh: escapeTsString(urlZh || prev('urlZh')),
      urlEn: escapeTsString(urlEn || prev('urlEn')),
      subZh: escapeTsString(subZh || prev('subZh')),
      subEn: escapeTsString(subEn || prev('subEn')),
    }

    // Remove all existing blocks with same id and any legacy by URL
    ts = removeAllBlocksById(ts, id)
    ts = removeBlocksByUrl(ts, merged.urlZh)
    ts = removeBlocksByUrl(ts, merged.urlEn)

    const objStr =
`  {
    id: '${escapeTsString(id)}',
    icon: logo,
    name: { zh: '${merged.nameZh}', en: '${merged.nameEn}' },
    url: { zh: '${merged.urlZh}', en: '${merged.urlEn}' },
    description: { zh: '', en: '' },
    subcategory: { zh: '${merged.subZh}', en: '${merged.subEn}' },
    category: { zh: '意見交流', en: 'Opinions' },
  },`

    const closeIdx = ts.lastIndexOf('\n]')
    if (closeIdx === -1) throw new Error('services array closing not found')
    ts = ts.slice(0, closeIdx) + objStr + '\n]' + ts.slice(closeIdx + 2)
  }
  return ts
}

function main() {
  const args = process.argv.slice(2)
  const langArgIdx = args.indexOf('--lang')
  const fileArgIdx = args.indexOf('--file')
  const both = args.includes('--both')
  const lang = langArgIdx !== -1 ? (args[langArgIdx + 1] || 'zh') : 'zh'
  const file = fileArgIdx !== -1 ? args[fileArgIdx + 1] : defaultHtmlPath

  const ts = readFile(servicesPath)

  if (both || (langArgIdx === -1 && fileArgIdx === -1)) {
    const zhHtml = readFile(defaultHtmlPath)
    const enHtml = fs.existsSync(defaultEnHtmlPath) ? readFile(defaultEnHtmlPath) : ''
    const zhItems = parseSections(zhHtml, 'zh')
    const enItems = enHtml ? parseSections(enHtml, 'en') : []
    const combined = [...zhItems, ...enItems]
    if (combined.length === 0) {
      console.error('No items parsed from HTML (both)')
      process.exit(1)
    }
    const grouped = groupByRel(combined)
    const updated = upsertServices(ts, grouped)
    writeFile(servicesPath, updated)
    console.log(`Updated services.ts with ${grouped.length} grouped items from both zh/en sources`)
    return
  }

  const html = readFile(file)
  const rawItems = parseSections(html, lang)
  if (rawItems.length === 0) {
    console.error('No items parsed from HTML')
    process.exit(1)
  }
  const grouped = groupByRel(rawItems)
  const updated = upsertServices(ts, grouped)
  writeFile(servicesPath, updated)
  console.log(`Updated services.ts with ${grouped.length} grouped items from ${path.basename(file)} (${lang})`)
}

main()


