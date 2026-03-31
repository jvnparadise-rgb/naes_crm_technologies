const { PrismaClient, UserRole, OpportunityStage, ForecastCategory, TaskStatus, TaskPriority, ActivityType } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.opportunityStageHistory.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const adminUser = await prisma.user.create({
    data: {
      email: 'jeff.admin@naescrm.local',
      firstName: 'Jeff',
      lastName: 'Yarbrough',
      nickname: 'Jeff',
      title: 'Admin',
      role: UserRole.ADMIN,
      teamName: 'Leadership',
      isActive: true,
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'ashley.smith@naescrm.local',
      firstName: 'Ashley',
      lastName: 'Smith',
      nickname: 'Ashley',
      title: 'Sales Associate',
      role: UserRole.SALES_ASSOCIATE,
      teamName: 'Renewables',
      isActive: true,
    },
  });

  const account1 = await prisma.account.create({
    data: {
      name: 'Onyx Renewables',
      accountType: 'Customer',
      industry: 'Renewable Energy',
      marketSegment: 'DG',
      website: 'https://example.com',
      city: 'Phoenix',
      state: 'AZ',
      country: 'USA',
      ownerUserId: salesUser.id,
      createdByUserId: adminUser.id,
      updatedByUserId: adminUser.id,
      notes: 'Strategic DG portfolio customer.',
    },
  });

  const account2 = await prisma.account.create({
    data: {
      name: 'MN8 Energy',
      accountType: 'Customer',
      industry: 'Renewable Energy',
      marketSegment: 'USS',
      city: 'Dallas',
      state: 'TX',
      country: 'USA',
      ownerUserId: salesUser.id,
      createdByUserId: adminUser.id,
      updatedByUserId: adminUser.id,
      notes: 'Utility scale portfolio target.',
    },
  });

  const contact1 = await prisma.contact.create({
    data: {
      accountId: account1.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      fullName: 'Sarah Johnson',
      jobTitle: 'Director of Asset Management',
      email: 'sarah.johnson@onyx.local',
      phone: '602-555-0101',
      preferredContactMethod: 'Email',
      roleInBuyingProcess: 'Decision Maker',
      decisionMaker: true,
      primaryContact: true,
      ownerUserId: salesUser.id,
      createdByUserId: adminUser.id,
      updatedByUserId: adminUser.id,
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      accountId: account2.id,
      firstName: 'Michael',
      lastName: 'Turner',
      fullName: 'Michael Turner',
      jobTitle: 'VP Operations',
      email: 'michael.turner@mn8.local',
      phone: '214-555-0199',
      preferredContactMethod: 'Phone',
      roleInBuyingProcess: 'Champion',
      champion: true,
      primaryContact: true,
      ownerUserId: salesUser.id,
      createdByUserId: adminUser.id,
      updatedByUserId: adminUser.id,
    },
  });

  const opportunity1 = await prisma.opportunity.create({
    data: {
      accountId: account1.id,
      primaryContactId: contact1.id,
      name: 'Onyx DG O&M Portfolio Expansion',
      serviceLine: 'Renewables',
      marketSegment: 'DG',
      opportunityType: 'Expansion',
      stage: OpportunityStage.COMMERCIALS,
      forecastCategory: ForecastCategory.BEST_CASE,
      forecastProbability: 70,
      forecastPeriod: '2026-Q2',
      annualRevenue: '425000.00',
      arr: '425000.00',
      oneTimeRevenue: '25000.00',
      totalEstimatedRevenue: '450000.00',
      ctsPercent: '62.50',
      marginPercent: '37.50',
      ownerUserId: salesUser.id,
      createdByUserId: adminUser.id,
      updatedByUserId: adminUser.id,
      notes: 'Pricing under review.',
    },
  });

  const opportunity2 = await prisma.opportunity.create({
    data: {
      accountId: account2.id,
      primaryContactId: contact2.id,
      name: 'MN8 StratoSight Annual Inspection Program',
      serviceLine: 'StratoSight',
      marketSegment: 'USS',
      opportunityType: 'New Customer',
      stage: OpportunityStage.DISCOVERY,
      forecastCategory: ForecastCategory.PIPELINE,
      forecastProbability: 30,
      forecastPeriod: '2026-Q3',
      annualRevenue: '180000.00',
      arr: '180000.00',
      oneTimeRevenue: '40000.00',
      totalEstimatedRevenue: '220000.00',
      ctsPercent: '58.00',
      marginPercent: '42.00',
      ownerUserId: salesUser.id,
      createdByUserId: adminUser.id,
      updatedByUserId: adminUser.id,
      notes: 'Initial scoping underway.',
    },
  });

  await prisma.opportunityStageHistory.createMany({
    data: [
      {
        opportunityId: opportunity1.id,
        fromStage: OpportunityStage.SOLUTION_FIT,
        toStage: OpportunityStage.COMMERCIALS,
        changeReason: 'Advanced after pricing workshop.',
        changedByUserId: adminUser.id,
      },
      {
        opportunityId: opportunity2.id,
        fromStage: OpportunityStage.QUALIFIED,
        toStage: OpportunityStage.DISCOVERY,
        changeReason: 'Moved into technical discovery.',
        changedByUserId: adminUser.id,
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        accountId: account1.id,
        contactId: contact1.id,
        opportunityId: opportunity1.id,
        title: 'Review O&M pricing assumptions',
        description: 'Validate DG labor model and margin targets.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        ownerUserId: salesUser.id,
        createdByUserId: adminUser.id,
        updatedByUserId: adminUser.id,
      },
      {
        accountId: account2.id,
        contactId: contact2.id,
        opportunityId: opportunity2.id,
        title: 'Schedule discovery call',
        description: 'Confirm scope, site count, and inspection frequency.',
        status: TaskStatus.NOT_STARTED,
        priority: TaskPriority.MEDIUM,
        ownerUserId: salesUser.id,
        createdByUserId: adminUser.id,
        updatedByUserId: adminUser.id,
      },
    ],
  });

  await prisma.activity.createMany({
    data: [
      {
        accountId: account1.id,
        contactId: contact1.id,
        opportunityId: opportunity1.id,
        activityType: ActivityType.MEETING,
        subject: 'Commercial review meeting',
        description: 'Reviewed DG expansion pricing and staffing assumptions.',
        ownerUserId: salesUser.id,
        createdByUserId: adminUser.id,
        updatedByUserId: adminUser.id,
      },
      {
        accountId: account2.id,
        contactId: contact2.id,
        opportunityId: opportunity2.id,
        activityType: ActivityType.CALL,
        subject: 'Introductory discovery call',
        description: 'Discussed annual inspection cadence and deliverables.',
        ownerUserId: salesUser.id,
        createdByUserId: adminUser.id,
        updatedByUserId: adminUser.id,
      },
    ],
  });

  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
