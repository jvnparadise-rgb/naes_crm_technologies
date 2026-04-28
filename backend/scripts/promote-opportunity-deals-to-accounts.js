const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function clean(v) {
  return String(v || '').trim()
}

function normalizeService(v) {
  const s = clean(v)
  if (s === 'Renewables O&M') return 'Renewables'
  if (s === 'Other O&M / Custom Services') return 'Other O&M'
  if (s === 'Both') return 'Renewables, StratoSight'
  return s || 'Renewables'
}

function accountNameFromDeal(name) {
  let s = clean(name)
  s = s.replace(/^\d{5}-\d{3}\s*\|\s*/i, '')
  s = s.replace(/^(OM|PM Services|PM|O&M Services)\s*[-–]\s*/i, '')
  s = s.replace(/^(OM|PM)[-–]/i, '')
  return clean(s)
}

async function main() {
  const opportunities = await prisma.opportunity.findMany({
    select: {
      id: true,
      name: true,
      serviceLine: true,
      account: { select: { name: true } },
    }
  })

  let inserted = 0
  let updated = 0
  let skipped = 0

  for (const opp of opportunities) {
    const name = clean(opp.account?.name) || accountNameFromDeal(opp.name)
    if (!name) {
      skipped++
      continue
    }

    const interestedServices = normalizeService(opp.serviceLine)

    const existing = await prisma.account.findFirst({ where: { name } })

    if (existing) {
      await prisma.account.update({
        where: { id: existing.id },
        data: {
          interestedServices,
          primaryAccountOwner: 'Megan Smethurst',
        }
      })
      updated++
    } else {
      await prisma.account.create({
        data: {
          name,
          accountType: 'Customer',
          interestedServices,
          primaryAccountOwner: 'Megan Smethurst',
        }
      })
      inserted++
    }
  }

  const total = await prisma.account.count()
  console.log({ opportunities: opportunities.length, inserted, updated, skipped, totalAccounts: total })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
