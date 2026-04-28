const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function clean(v) {
  return String(v || '').trim()
}

function normService(v) {
  const s = clean(v)
  if (s === 'Renewables O&M') return 'Renewables'
  if (s === 'Other O&M / Custom Services') return 'Other O&M'
  if (s === 'Both') return 'Renewables, StratoSight'
  return s || 'Renewables'
}

async function main() {
  const tmpDir = path.join(process.cwd(), 'tmp')
  const files = fs.readdirSync(tmpDir).filter(f => f.startsWith('opportunities_import') && f.endsWith('.json'))

  const byAccount = new Map()

  for (const file of files) {
    const rows = JSON.parse(fs.readFileSync(path.join(tmpDir, file), 'utf8'))
    for (const row of rows) {
      const name = clean(row.linkedAccountName || row.accountName || row.account)
      if (!name) continue
      const services = byAccount.get(name) || new Set()
      services.add(normService(row.serviceLine))
      byAccount.set(name, services)
    }
  }

  let inserted = 0
  let updated = 0

  for (const [name, services] of byAccount.entries()) {
    const interestedServices = Array.from(services).join(', ') || 'Renewables'
    const existing = await prisma.account.findFirst({ where: { name } })

    const data = {
      name,
      accountType: 'Customer',
      interestedServices,
      primaryAccountOwner: 'Megan Smethurst',
      updatedByUserId: null,
    }

    if (existing) {
      await prisma.account.update({ where: { id: existing.id }, data })
      updated++
    } else {
      await prisma.account.create({ data: { ...data, createdByUserId: null } })
      inserted++
    }
  }

  const total = await prisma.account.count()
  console.log(JSON.stringify({
    sourceFiles: files,
    uniqueAccountsFromOpportunities: byAccount.size,
    inserted,
    updated,
    totalAccountsNow: total
  }, null, 2))
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
