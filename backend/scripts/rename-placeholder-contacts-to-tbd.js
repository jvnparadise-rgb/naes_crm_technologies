const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const placeholderNames = [
  'Danny Avrith',
  'Rachel Coulter',
  'Shelley Rogers',
  'Fred Taylor',
  'Iliana Trujillo',
  'Cheyenne Whiting',
  'Unknown IGS SOLAR TPM'
];

async function main() {
  const rows = await prisma.contact.findMany({
    where: {
      OR: [
        { fullName: { in: placeholderNames } },
        { notes: { contains: 'Internal NAES stakeholder derived from DG OM Contracts' } },
        { jobTitle: 'Technical Program Manager' }
      ]
    },
    select: {
      id: true,
      fullName: true,
      firstName: true,
      lastName: true,
      jobTitle: true,
      notes: true,
      account: { select: { name: true } }
    },
    orderBy: [
      { firstName: 'asc' },
      { lastName: 'asc' }
    ]
  });

  console.log('matched placeholder rows:', rows.length);
  console.log(JSON.stringify(rows.map(r => ({
    id: r.id,
    fullName: r.fullName,
    jobTitle: r.jobTitle,
    account: r.account?.name || null
  })), null, 2));

  let updated = 0;

  for (const row of rows) {
    await prisma.contact.update({
      where: { id: row.id },
      data: {
        firstName: 'TBD',
        lastName: '',
        fullName: 'TBD',
        jobTitle: 'TBD'
      }
    });
    updated += 1;
    console.log(`UPDATED: ${row.fullName} -> ${row.account?.name || 'NO ACCOUNT'} => TBD`);
  }

  console.log('\n--- rename complete ---');
  console.log(`updated: ${updated}`);
}

main()
  .catch(async (err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
