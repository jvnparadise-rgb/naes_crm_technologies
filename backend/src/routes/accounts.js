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

router.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.account.findMany({
      orderBy: [{ name: 'asc' }],
    });
    res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const row = await prisma.account.findUnique({
      where: { id: req.params.id },
      include: {
        owner: true,
        contacts: true,
        opportunities: true,
        tasks: true,
        activities: true,
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
    const parsed = createAccountSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid account payload',
        details: parsed.error.flatten(),
      });
    }

    const created = await prisma.account.create({
      data: buildAccountCreateData(parsed.data),
    });

    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const parsed = updateAccountSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid account update payload',
        details: parsed.error.flatten(),
      });
    }

    const existing = await prisma.account.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ ok: false, error: 'Account not found' });
    }

    const updated = await prisma.account.update({
      where: { id: req.params.id },
      data: buildAccountUpdateData(parsed.data),
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
