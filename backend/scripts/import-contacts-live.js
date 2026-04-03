const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const filePath = path.join(process.cwd(), 'tmp', 'contacts_import_backend_ready.json');

function cleanString(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
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
    const linkedAccountName = cleanString(row.linkedAccountName);
    const firstName = cleanString(row.firstName);
    const lastName = cleanString(row.lastName);
    const fullName = cleanString(row.fullName) || [firstName, lastName].filter(Boolean).join(' ');

    if (!linkedAccountName) {
      throw new Error('Encountered contact row with missing linkedAccountName');
    }
    if (!firstName || !lastName) {
      throw new Error(`Encountered contact row with missing name for account ${linkedAccountName}`);
    }

    const account = await prisma.account.findFirst({
      where: { name: linkedAccountName },
      select: { id: true, name: true }
    });

    if (!account) {
      throw new Error(`Could not find account "${linkedAccountName}" for contact "${fullName}"`);
    }

    const payload = {
      accountId: account.id,
      firstName,
      lastName,
      fullName,
      jobTitle: cleanString(row.jobTitle),
      email: cleanString(row.email),
      phone: cleanString(row.phone),
      mobile: cleanString(row.mobile),
      preferredContactMethod: cleanString(row.preferredContactMethod),
      roleInBuyingProcess: cleanString(row.roleInBuyingProcess),
      decisionMaker: Boolean(row.decisionMaker),
      champion: Boolean(row.champion),
      primaryContact: Boolean(row.primaryContact),
      notes: cleanString(row.notes),
      ownerUserId: null,
      createdByUserId: null,
      updatedByUserId: null
    };

    const existing = await prisma.contact.findFirst({
      where: {
        accountId: account.id,
        fullName: fullName
      },
      select: { id: true }
    });

    if (existing) {
      await prisma.contact.update({
        where: { id: existing.id },
        data: payload
      });
      updated += 1;
      console.log(`UPDATED: ${fullName} -> ${linkedAccountName}`);
    } else {
      await prisma.contact.create({
        data: payload
      });
      inserted += 1;
      console.log(`INSERTED: ${fullName} -> ${linkedAccountName}`);
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
