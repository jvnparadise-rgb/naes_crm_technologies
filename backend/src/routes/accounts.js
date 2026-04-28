const express = require('express');
const { z } = require('zod');
const { prisma } = require('../db/prisma');

const router = express.Router();

const createAccountSchema = z.object({
  name: z.string().trim().min(1),
  accountType: z.string().trim().min(1).optional().nullable(),
  industry: z.string().trim().min(1).optional().nullable(),
  marketSegment: z.string().trim().min(1).optional().nullable(),
  website: z.string().trim().min(1).optional().nullable(),
  phone: z.string().trim().min(1).optional().nullable(),
  email: z.string().trim().min(1).optional().nullable(),
  address1: z.string().trim().min(1).optional().nullable(),
  address2: z.string().trim().min(1).optional().nullable(),
  city: z.string().trim().min(1).optional().nullable(),
  state: z.string().trim().min(1).optional().nullable(),
  postalCode: z.string().trim().min(1).optional().nullable(),
  country: z.string().trim().min(1).optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  legalBusinessName: z.string().trim().optional().nullable(),
  businessType: z.string().trim().optional().nullable(),
  linkedin: z.string().trim().optional().nullable(),
  primaryAccountOwner: z.string().trim().optional().nullable(),
  interestedServices: z.string().trim().optional().nullable(),
  totalMw: z.string().trim().optional().nullable(),
  portfolioType: z.string().trim().optional().nullable(),
  generalFootprintRegion: z.string().trim().optional().nullable(),
  estimatedBuildingCount: z.string().trim().optional().nullable(),
  estimatedSquareFootage: z.string().trim().optional().nullable(),
  generalSiteType: z.string().trim().optional().nullable(),
    strategicAccount: z.string().trim().optional().nullable(),
    relationshipStatus: z.string().trim().optional().nullable(),
    decisionComplexity: z.string().trim().optional().nullable(),
    procurementType: z.string().trim().optional().nullable(),
    customerDifficulty: z.string().trim().optional().nullable(),
    geographicSpread: z.string().trim().optional().nullable(),
  accountStatus: z.string().trim().optional().nullable(),

  ownerUserId: z.string().trim().min(1).optional().nullable(),
  createdByUserId: z.string().trim().min(1).optional().nullable(),
  updatedByUserId: z.string().trim().min(1).optional().nullable(),
});

const updateAccountSchema = z.object({
  name: z.string().trim().min(1).optional(),
  accountType: z.string().trim().min(1).nullable().optional(),
  industry: z.string().trim().min(1).nullable().optional(),
  marketSegment: z.string().trim().min(1).nullable().optional(),
  website: z.string().trim().min(1).nullable().optional(),
  phone: z.string().trim().min(1).nullable().optional(),
  email: z.string().trim().min(1).nullable().optional(),
  address1: z.string().trim().min(1).nullable().optional(),
  address2: z.string().trim().min(1).nullable().optional(),
  city: z.string().trim().min(1).nullable().optional(),
  state: z.string().trim().min(1).nullable().optional(),
  postalCode: z.string().trim().min(1).nullable().optional(),
  country: z.string().trim().min(1).nullable().optional(),
  notes: z.string().trim().nullable().optional(),
  legalBusinessName: z.string().trim().nullable().optional(),
  businessType: z.string().trim().nullable().optional(),
  linkedin: z.string().trim().nullable().optional(),
  primaryAccountOwner: z.string().trim().nullable().optional(),
  interestedServices: z.string().trim().nullable().optional(),
  totalMw: z.string().trim().nullable().optional(),
  portfolioType: z.string().trim().nullable().optional(),
  generalFootprintRegion: z.string().trim().nullable().optional(),
  estimatedBuildingCount: z.string().trim().nullable().optional(),
  estimatedSquareFootage: z.string().trim().nullable().optional(),
  generalSiteType: z.string().trim().nullable().optional(),
    strategicAccount: z.string().trim().optional().nullable(),
    relationshipStatus: z.string().trim().optional().nullable(),
    decisionComplexity: z.string().trim().optional().nullable(),
    procurementType: z.string().trim().optional().nullable(),
    customerDifficulty: z.string().trim().optional().nullable(),
    geographicSpread: z.string().trim().optional().nullable(),
  accountStatus: z.string().trim().optional().nullable(),

  ownerUserId: z.string().trim().min(1).nullable().optional(),
  updatedByUserId: z.string().trim().min(1).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required for update',
});

function normalizeNullableString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function buildAccountCreateData(input) {
  return {
    name: input.name.trim(),
    accountType: normalizeNullableString(input.accountType),
    industry: normalizeNullableString(input.industry),
    marketSegment: normalizeNullableString(input.marketSegment),
    website: normalizeNullableString(input.website),
    phone: normalizeNullableString(input.phone),
    email: normalizeNullableString(input.email),
    address1: normalizeNullableString(input.address1),
    address2: normalizeNullableString(input.address2),
    city: normalizeNullableString(input.city),
    state: normalizeNullableString(input.state),
    postalCode: normalizeNullableString(input.postalCode),
    country: normalizeNullableString(input.country),
    notes: input.notes === undefined ? undefined : normalizeNullableString(input.notes),
    legalBusinessName: normalizeNullableString(input.legalBusinessName),
    businessType: normalizeNullableString(input.businessType),
    linkedin: normalizeNullableString(input.linkedin),
    primaryAccountOwner: normalizeNullableString(input.primaryAccountOwner),
    interestedServices: normalizeNullableString(input.interestedServices),
    totalMw: normalizeNullableString(input.totalMw),
    portfolioType: normalizeNullableString(input.portfolioType),
    generalFootprintRegion: normalizeNullableString(input.generalFootprintRegion),
    estimatedBuildingCount: normalizeNullableString(input.estimatedBuildingCount),
    estimatedSquareFootage: normalizeNullableString(input.estimatedSquareFootage),
    generalSiteType: normalizeNullableString(input.generalSiteType),
      strategicAccount: normalizeNullableString(input.strategicAccount),
      relationshipStatus: normalizeNullableString(input.relationshipStatus),
      decisionComplexity: normalizeNullableString(input.decisionComplexity),
      procurementType: normalizeNullableString(input.procurementType),
      customerDifficulty: normalizeNullableString(input.customerDifficulty),
      geographicSpread: normalizeNullableString(input.geographicSpread),
    accountStatus: normalizeNullableString(input.accountStatus),

    ownerUserId: normalizeNullableString(input.ownerUserId),
    createdByUserId: normalizeNullableString(input.createdByUserId),
    updatedByUserId: normalizeNullableString(input.updatedByUserId),
  };
}

function buildAccountUpdateData(input) {
  const data = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === 'name') {
      data.name = value.trim();
    } else {
      data[key] = normalizeNullableString(value);
    }
  }
  return data;
}

function requireCurrentUser(req, res) {
  if (!req.currentUser) {
    res.status(401).json({
      ok: false,
      error: 'Authentication required',
    });
    return false;
  }
  return true;
}

function canWriteAccounts(req) {
  const role = String(req.currentUser?.role || '').trim();
  return role === 'ADMIN' || role === 'EXECUTIVE' || role === 'SALES_MANAGER' || role === 'SALES_ASSOCIATE';
}

async function buildAccountReadWhere(req) {
  const currentUser = req.currentUser;
  const role = String(currentUser?.role || '').trim();
  const teamName = String(currentUser?.teamName || '').trim();

  if (role === 'ADMIN' || role === 'EXECUTIVE') {
    return {};
  }

  if (role === 'SALES_MANAGER') {
    const teamUsers = await prisma.user.findMany({
      where: {
        teamName,
        isActive: true,
      },
      select: { id: true },
    });

    const teamUserIds = teamUsers.map((user) => user.id).filter(Boolean);

    if (!teamUserIds.length) {
      return { id: '__NO_MATCH__' };
    }

    return {
      ownerUserId: {
        in: teamUserIds,
      },
    };
  }

  if (role === 'SALES_ASSOCIATE') {
    return {
      ownerUserId: currentUser.id,
    };
  }

  return { id: '__NO_MATCH__' };
}

function requireAccountWriteAccess(req, res, existingAccount = null) {
  if (!req.currentUser) {
    res.status(401).json({
      ok: false,
      error: 'Authentication required',
    });
    return false;
  }

  const role = String(req.currentUser?.role || '').trim();

  if (role === 'ADMIN' || role === 'EXECUTIVE' || role === 'SALES_MANAGER') {
    return true;
  }

  if (role === 'SALES_ASSOCIATE') {
    if (!existingAccount) {
      return true;
    }

    if (existingAccount.ownerUserId === req.currentUser.id) {
      return true;
    }

    res.status(403).json({
      ok: false,
      error: 'Forbidden',
    });
    return false;
  }

  res.status(403).json({
    ok: false,
    error: 'Forbidden',
  });
  return false;
}

async function buildAccountScalarSelect() {
  const rows = await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'accounts'
    ORDER BY ordinal_position
  `);

  const existing = new Set(rows.map((row) => String(row.column_name || '')));
  const candidateFields = [
    'id',
    'name',
    'accountType',
    'industry',
    'marketSegment',
    'website',
    'phone',
    'email',
    'address1',
    'address2',
    'city',
    'state',
    'postalCode',
    'country',
    'notes',
    'ownerUserId',
    'createdByUserId',
    'updatedByUserId',
    'createdAt',
    'updatedAt',
  ];

  const select = {};
  for (const field of candidateFields) {
    if (existing.has(field)) {
      select[field] = true;
    }
  }

  return select;
}

router.get('/', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;

    const where = await buildAccountReadWhere(req);

    const select = await buildAccountScalarSelect();

    const rows = await prisma.account.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: [{ name: 'asc' }],
    });

    res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;
    const { id } = req.params;
    console.log('[ACCOUNT_DELETE] deleting', id);

    const result = await prisma.$executeRawUnsafe(
      'DELETE FROM accounts WHERE id = $1',
      id
    );

    if (result === 0) {
      return res.status(404).json({ ok: false, error: 'Account not found in DB' });
    }

    return res.json({ ok: true, deletedId: id });
  } catch (error) {
    console.error('[ACCOUNT_DELETE] error', error);
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;

    const where = await buildAccountReadWhere(req);

    const allowed = await prisma.account.findFirst({
      where: {
        ...where,
        id: req.params.id,
      },
      select: { id: true },
    });

    if (!allowed) {
      return res.status(404).json({ ok: false, error: 'Account not found' });
    }

    const select = await buildAccountScalarSelect();

    const row = await prisma.account.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
    });

    if (!row) {
      return res.status(404).json({ ok: false, error: 'Account not found' });
    }

    res.json({ ok: true, data: row });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;
    if (!canWriteAccounts(req)) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    const parsed = createAccountSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid account payload',
        details: parsed.error.flatten(),
      });
    }

    const payload = buildAccountCreateData(parsed.data);
    const role = String(req.currentUser?.role || '').trim();

    if (role === 'SALES_ASSOCIATE') {
      payload.ownerUserId = req.currentUser.id;
      payload.createdByUserId = req.currentUser.id;
      payload.updatedByUserId = req.currentUser.id;
    } else {
      payload.ownerUserId = payload.ownerUserId ?? req.currentUser.id;
      payload.createdByUserId = payload.createdByUserId ?? req.currentUser.id;
      payload.updatedByUserId = payload.updatedByUserId ?? req.currentUser.id;
    }

    const created = await prisma.account.create({
      data: payload,
    });

    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;

    const existing = await prisma.account.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ ok: false, error: 'Account not found' });
    }

    if (!requireAccountWriteAccess(req, res, existing)) return;

    const parsed = updateAccountSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid account update payload',
        details: parsed.error.flatten(),
      });
    }

    const updateData = buildAccountUpdateData(parsed.data);
    const role = String(req.currentUser?.role || '').trim();

    if (role === 'SALES_ASSOCIATE') {
      delete updateData.ownerUserId;
      updateData.updatedByUserId = req.currentUser.id;
    } else {
      updateData.updatedByUserId = updateData.updatedByUserId ?? req.currentUser.id;
    }

    const updated = await prisma.account.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
