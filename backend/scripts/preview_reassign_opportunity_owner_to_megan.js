const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const MEGAN_USER_ID = 'cmnjlcmwa0000it0sswzgqwhj';

  const megan = await prisma.user.findUnique({
    where: { id: MEGAN_USER_ID },
    select: { id: true, firstName: true, lastName: true, email: true, teamName: true, role: true }
  });

  console.log('\\n--- Megan target user ---');
  console.log(JSON.stringify(megan, null, 2));

  const rows = await prisma.opportunity.findMany({
    where: {
      NOT: {
        name: { in: ['Walmart', 'Prologis'] }
      }
    },
    orderBy: [{ createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      ownerUserId: true,
      owner: { select: { id: true, firstName: true, lastName: true, email: true } },
      account: { select: { id: true, name: true } }
    }
  });

  console.log('\\n--- opportunities that WOULD be reassigned to Megan ---');
  console.log(JSON.stringify({
    count: rows.length,
    sample: rows.slice(0, 25),
    excluded: ['Walmart', 'Prologis']
  }, null, 2));

  await prisma.$disconnect();
})().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
