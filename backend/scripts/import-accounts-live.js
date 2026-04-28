const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const filePath = path.join(process.cwd(), 'tmp', 'accounts_import_backend_ready.json');

function cleanString(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function buildNotes(row) {
  const parts = [];

  const totalMw = row.total_mwdc !== null && row.total_mwdc !== undefined && row.total_mwdc !== ''
    ? `Total MWDC: ${row.total_mwdc}`
    : null;

  const source = cleanString(row.notes);

  if (totalMw) parts.push(totalMw);
  if (source) parts.push(source);

  return parts.join(' | ') || null;
}

async function main() {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  const records = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(records)) {
    throw new Error('Payload must be an array.');
  }

  let inserted = 0;
  let updated = 0;

  for (const row of records) {
    const name = cleanString(row.account_name);
    if (!name) {
      throw new Error('Encountered record with missing account_name');
    }

    const payload = {
      name,
      accountType: cleanString(row.portfolio_type),
      industry: 'Renewables',
      marketSegment: cleanString(row.general_footprint_region),
      website: cleanString(row.website),
      phone: cleanString(row.main_phone),
      email: cleanString(row.general_email),
      address1: cleanString(row.main_address),
      address2: null,
      city: cleanString(row.city),
      state: cleanString(row.state),
      postalCode: cleanString(row.zip),
      country: cleanString(row.country) || 'USA',
      notes: buildNotes(row),
      ownerUserId: null,
      createdByUserId: null,
      updatedByUserId: null
    };

    const existing = await prisma.account.findFirst({
      where: { name }
    });

    if (existing) {
      await prisma.account.update({
        where: { id: existing.id },
        data: payload
      });
      updated += 1;
      console.log(`UPDATED: ${name}`);
    } else {
      await prisma.account.create({
        data: payload
      });
      inserted += 1;
      console.log(`INSERTED: ${name}`);
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
