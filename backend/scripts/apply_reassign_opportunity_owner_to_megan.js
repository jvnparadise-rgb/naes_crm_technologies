const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const MEGAN_USER_ID = 'cmnjlcmwa0000it0sswzgqwhj';
  const EXCLUDED_NAMES = ['Walmart', 'Prologis'];

  const megan = await prisma.user.findUnique({
    where: { id: MEGAN_USER_ID },
    select: { id: true, firstName: true, lastName: true, email: true, teamName: true, role: true }
  });

  if (!megan) {
    throw new Error(`Megan user not found for id ${MEGAN_USER_ID}`);
  }

  console.log('\n--- Megan target user ---');
  console.log(JSON.stringify(megan, null, 2));

  const before = await prisma.opportunity.findMany({
    where: {
      NOT: {
        name: { in: EXCLUDED_NAMES }
      }
    },
    select: {
      id: true,
      name: true,
      ownerUserId: true,
      account: { select: { id: true, name: true } }
    },
    orderBy: [{ createdAt: 'desc' }]
  });

  console.log('\n--- rows to update ---');
  console.log(JSON.stringify({
    count: before.length,
    excluded: EXCLUDED_NAMES,
    sample: before.slice(0, 20)
  }, null, 2));

  const result = await prisma.opportunity.updateMany({
    where: {
      NOT: {
        name: { in: EXCLUDED_NAMES }
      }
    },
    data: {
      ownerUserId: MEGAN_USER_ID
    }
  });

  console.log('\n--- update result ---');
  console.log(JSON.stringify(result, null, 2));

  const after = await prisma.opportunity.findMany({
    where: {
      NOT: {
        name: { in: EXCLUDED_NAMES }
      }
    },
    select: {
      id: true,
      name: true,
      ownerUserId: true,
      owner: { select: { id: true, firstName: true, lastName: true, email: true } },
      account: { select: { id: true, name: true } }
    },
    orderBy: [{ createdAt: 'desc' }],
    take: 20
  });

  console.log('\n--- post-update sample ---');
  console.log(JSON.stringify(after, null, 2));

  const excluded = await prisma.opportunity.findMany({
    where: {
      name: { in: EXCLUDED_NAMES }
    },
    select: {
      id: true,
      name: true,
      ownerUserId: true,
      owner: { select: { id: true, firstName: true, lastName: true, email: true } }
    },
    orderBy: [{ name: 'asc' }]
  });

  console.log('\n--- excluded rows (should remain untouched) ---');
  console.log(JSON.stringify(excluded, null, 2));

  await prisma.$disconnect();
})().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
