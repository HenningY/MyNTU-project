import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const servicesPath = path.join(root, 'src', 'data', 'services.ts')

function renumberIds(filePath) {
  let ts = fs.readFileSync(filePath, 'utf8')
  const arrayStart = ts.indexOf('export const services')
  const arrayClose = ts.lastIndexOf('\n]')
  if (arrayStart === -1 || arrayClose === -1 || arrayClose < arrayStart) {
    throw new Error('services array bounds not found')
  }

  let counter = 0
  const before = ts.slice(0, arrayStart)
  const segment = ts.slice(arrayStart, arrayClose + 2)
  const after = ts.slice(arrayClose + 2)

  const updatedSegment = segment.replace(/id:\s*'[^']*'/g, () => {
    counter += 1
    return `id: '${counter}'`
  })

  fs.writeFileSync(filePath, before + updatedSegment + after, 'utf8')
  return counter
}

const count = renumberIds(servicesPath)
console.log(`Renumbered ${count} ids in services.ts`)


