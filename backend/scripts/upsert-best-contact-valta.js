const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const filePath = path.join(process.cwd(), 'tmp', 'contact_best_match_valta.json');

function cleanString(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function cleanBool(value) {
  return value === true;
}

async function main() {
  const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let inserted = 0;
  let updated = 0;

  for (const row of rows) {
    const account = await prisma.account.findFirst({
      where: { name: cleanString(row.linked_account_name) },
      select: { id: true, name: true }
    });

    if (!account) throw new Error(`Could not find account "${row.linked_account_name}"`);

    const firstName = cleanString(row.first_name);
    const lastName = cleanString(row.last_name);
    const fullName = `${firstName} ${lastName}`.trim();

    const payload = {
      accountId: account.id,
      firstName,
      lastName,
      fullName,
      jobTitle: cleanString(row.job_title),
      email: cleanString(row.email),
      phone: cleanString(row.office_phone),
      mobile: cleanString(row.mobile_phone),
      preferredContactMethod: cleanString(row.preferred_contact_method),
      roleInBuyingProcess: cleanString(row.role_in_buying_process),
      decisionMaker: cleanBool(row.decision_maker),
      champion: cleanBool(row.influencer_or_champion),
      primaryContact: cleanBool(row.primary_contact),
      notes: cleanString(row.notes),
      ownerUserId: null,
      createdByUserId: null,
      updatedByUserId: null
    };

    const existing = await prisma.contact.findFirst({
      where: {
        accountId: account.id,
        OR: [
          { fullName },
          { phone: payload.phone || undefined }
        ]
      },
      select: { id: true }
    });

    if (existing) {
      await prisma.contact.update({
        where: { id: existing.id },
        data: payload
      });
      updated += 1;
      console.log(`UPDATED: ${fullName} -> ${account.name}`);
    } else {
      await prisma.contact.create({ data: payload });
      inserted += 1;
      console.log(`INSERTED: ${fullName} -> ${account.name}`);
    }
  }

  console.log('\n--- upsert complete ---');
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
