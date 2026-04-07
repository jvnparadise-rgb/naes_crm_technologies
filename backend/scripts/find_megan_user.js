const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: 'Megan', mode: 'insensitive' } },
        { lastName: { contains: 'Smethurst', mode: 'insensitive' } },
        { email: { contains: 'megan', mode: 'insensitive' } },
        { nickname: { contains: 'megan', mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      nickname: true,
      teamName: true,
      role: true,
      isActive: true
    },
    orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
  });

  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
})().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
