const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const megan = await prisma.user.findFirst({
    where: {
      OR: [
        { firstName: { equals: 'Megan', mode: 'insensitive' }, lastName: { equals: 'Smethurst', mode: 'insensitive' } },
        { email: { contains: 'megan', mode: 'insensitive' } }
      ]
    },
    select: { id: true, firstName: true, lastName: true, email: true, teamName: true, role: true }
  });

  console.log('\\n--- Megan match ---');
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

  console.log('\\n--- opportunities that WOULD be reassigned (excluding Walmart/Prologis) ---');
  console.log(JSON.stringify(rows, null, 2));

  await prisma.$disconnect();
})().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
