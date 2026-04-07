const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const users = [
  {
    firstName: 'Megan',
    lastName: 'Smethurst',
    email: 'megan.smethurst@naes.com',
    title: 'Business Development Manager',
    role: 'SALES_MANAGER',
    teamName: 'Business Development',
    isActive: true,
  },
  {
    firstName: 'Paul',
    lastName: 'Baltadonis',
    email: 'paul.baltadonis@naes.com',
    title: 'SVP of Technology',
    role: 'EXECUTIVE',
    teamName: 'Technologies',
    isActive: true,
  },
  {
    firstName: 'Phil',
    lastName: 'Duran',
    email: 'phil.duran@naes.com',
    title: 'VP of Business Development',
    role: 'EXECUTIVE',
    teamName: 'Business Development',
    isActive: true,
  },
  {
    firstName: 'Clinton',
    lastName: 'Chadwick',
    email: 'clinton.chadwick@naes.com',
    title: 'Director of Technology',
    role: 'EXECUTIVE',
    teamName: 'Technologies',
    isActive: true,
  },
  {
    firstName: 'Nick',
    lastName: 'Bright',
    email: 'nick.bright@naes.com',
    title: 'Principal Programmer',
    role: 'ADMIN',
    teamName: 'Technologies',
    isActive: true,
  },
  {
    firstName: 'Jordan',
    lastName: 'Chen',
    email: 'jordan.chen@naes.com',
    title: 'Principal Programmer',
    role: 'ADMIN',
    teamName: 'Technologies',
    isActive: true,
  },
  {
    firstName: 'Wesley',
    lastName: 'Morris',
    email: 'wesley.morris@naes.com',
    title: 'Director of Finance',
    role: 'EXECUTIVE',
    teamName: 'Finance',
    isActive: true,
  },
  {
    firstName: 'Ashley',
    lastName: 'Williams',
    email: 'ashley.williams@naes.com',
    title: 'Chief of Staff',
    role: 'EXECUTIVE',
    teamName: 'Technologies',
    isActive: true,
  },
  {
    firstName: 'Joseph',
    lastName: 'Buttice',
    email: 'joseph.buttice@naes.com',
    title: 'Director of Operations',
    role: 'EXECUTIVE',
    teamName: 'Renewables',
    isActive: true,
  },
  {
    firstName: 'Charles',
    lastName: 'Kania',
    email: 'charles.kania@naes.com',
    title: 'Sr. Manager',
    role: 'EXECUTIVE',
    teamName: 'Renewables',
    isActive: true,
  },
];

(async () => {
  const results = [];

  for (const user of users) {
    const existing = await prisma.user.findFirst({
      where: {
        email: { equals: user.email, mode: 'insensitive' }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        title: true,
        role: true,
        teamName: true,
        isActive: true,
      }
    });

    if (existing) {
      results.push({
        action: 'already_exists',
        user: existing,
      });
      continue;
    }

    const created = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        title: user.title,
        role: user.role,
        teamName: user.teamName,
        nickname: null,
        profilePhotoUrl: null,
        isActive: user.isActive,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        title: true,
        role: true,
        teamName: true,
        isActive: true,
      }
    });

    results.push({
      action: 'created',
      user: created,
    });
  }

  console.log(JSON.stringify({ ok: true, count: results.length, results }, null, 2));
  await prisma.$disconnect();
})().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
