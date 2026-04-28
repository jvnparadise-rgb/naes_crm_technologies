const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const filePath = path.join(process.cwd(), 'tmp', 'opportunities_import_backend_ready_first10.json');

function cleanString(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function cleanNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function main() {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('No opportunity rows found in payload.');
  }

  let inserted = 0;
  let updated = 0;

  for (const row of rows) {
    const name = cleanString(row.name);
    const linkedAccountName = cleanString(row.linkedAccountName);
    const linkedPrimaryContactFullName = cleanString(row.linkedPrimaryContactFullName);

    if (!name) throw new Error('Encountered opportunity with missing name');
    if (!linkedAccountName) throw new Error(`Opportunity "${name}" missing linkedAccountName`);

    const account = await prisma.account.findFirst({
      where: { name: linkedAccountName },
      select: { id: true, name: true }
    });

    if (!account) {
      throw new Error(`Could not find account "${linkedAccountName}" for opportunity "${name}"`);
    }

    let primaryContactId = null;
    if (linkedPrimaryContactFullName) {
      const contact = await prisma.contact.findFirst({
        where: {
          accountId: account.id,
          fullName: linkedPrimaryContactFullName
        },
        select: { id: true, fullName: true }
      });

      if (!contact) {
        throw new Error(`Could not find primary contact "${linkedPrimaryContactFullName}" for opportunity "${name}" under account "${linkedAccountName}"`);
      }

      primaryContactId = contact.id;
    }

    const payload = {
      accountId: account.id,
      primaryContactId,
      name,
      serviceLine: cleanString(row.serviceLine),
      marketSegment: cleanString(row.marketSegment),
      opportunityType: cleanString(row.opportunityType),
      stage: row.stage,
      forecastCategory: row.forecastCategory,
      forecastProbability: cleanNumber(row.forecastProbability),
      forecastPeriod: null,
      expectedCloseDate: row.expectedCloseDate ? new Date(`${row.expectedCloseDate}T00:00:00.000Z`) : null,
      annualRevenue: cleanNumber(row.annualRevenue),
      arr: cleanNumber(row.arr),
      oneTimeRevenue: cleanNumber(row.oneTimeRevenue),
      totalEstimatedRevenue: cleanNumber(row.totalEstimatedRevenue),
      ctsPercent: null,
      marginPercent: null,
      notes: cleanString(row.notes),
      ownerUserId: null,
      createdByUserId: null,
      updatedByUserId: null
    };

    const existing = await prisma.opportunity.findFirst({
      where: {
        accountId: account.id,
        name
      },
      select: { id: true }
    });

    if (existing) {
      await prisma.opportunity.update({
        where: { id: existing.id },
        data: payload
      });
      updated += 1;
      console.log(`UPDATED: ${name} -> ${linkedAccountName}`);
    } else {
      await prisma.opportunity.create({
        data: payload
      });
      inserted += 1;
      console.log(`INSERTED: ${name} -> ${linkedAccountName}`);
    }
  }

  console.log('\n--- import complete ---');
  console.log(`inserted: ${inserted}`);
  console.log(`updated: ${updated}`);
  console.log(`total processed: ${inserted + updated}`);
}

main()
  .catch(async (err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
