const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const targets = [
  { accountName: 'CLEANCAPITAL', fullName: 'Fred Taylor' },
  { accountName: 'HANWHA', fullName: 'Danny Avrith' },
  { accountName: 'NAUTILUS SOLAR', fullName: 'Cheyenne Whiting' },
  { accountName: 'ONYX', fullName: 'Danny Avrith' },
  { accountName: 'VALTA', fullName: 'Iliana Trujillo' }
];

async function main() {
  let deleted = 0;
  let missing = 0;

  for (const target of targets) {
    const row = await prisma.contact.findFirst({
      where: {
        fullName: target.fullName,
        account: {
          name: target.accountName
        }
      },
      select: {
        id: true,
        fullName: true,
        account: { select: { name: true } }
      }
    });

    if (!row) {
      missing += 1;
      console.log(`MISSING: ${target.fullName} -> ${target.accountName}`);
      continue;
    }

    await prisma.contact.delete({
      where: { id: row.id }
    });

    deleted += 1;
    console.log(`DELETED: ${row.fullName} -> ${row.account.name}`);
  }

  console.log('\n--- delete complete ---');
  console.log(`deleted: ${deleted}`);
  console.log(`missing: ${missing}`);
  console.log(`total targeted: ${targets.length}`);
}

main()
  .catch(async (err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
