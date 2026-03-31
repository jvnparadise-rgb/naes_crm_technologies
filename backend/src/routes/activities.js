const express = require('express');
const { z } = require('zod');
const { prisma } = require('../db/prisma');
const { ActivityType } = require('@prisma/client');

const router = express.Router();

const createActivitySchema = z.object({
  accountId: z.string().trim().min(1).optional().nullable(),
  contactId: z.string().trim().min(1).optional().nullable(),
  opportunityId: z.string().trim().min(1).optional().nullable(),
  activityType: z.nativeEnum(ActivityType).optional(),
  subject: z.string().trim().min(1),
  description: z.string().trim().optional().nullable(),
  activityDate: z.string().datetime().optional().nullable(),
  ownerUserId: z.string().trim().min(1).optional().nullable(),
  createdByUserId: z.string().trim().min(1).optional().nullable(),
  updatedByUserId: z.string().trim().min(1).optional().nullable(),
});

const updateActivitySchema = z.object({
  accountId: z.string().trim().min(1).nullable().optional(),
  contactId: z.string().trim().min(1).nullable().optional(),
  opportunityId: z.string().trim().min(1).nullable().optional(),
  activityType: z.nativeEnum(ActivityType).optional(),
  subject: z.string().trim().min(1).optional(),
  description: z.string().trim().nullable().optional(),
  activityDate: z.string().datetime().nullable().optional(),
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

function normalizeNullableDate(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return new Date(value);
}

function buildActivityCreateData(input) {
  return {
    accountId: normalizeNullableString(input.accountId),
    contactId: normalizeNullableString(input.contactId),
    opportunityId: normalizeNullableString(input.opportunityId),
    activityType: input.activityType ?? ActivityType.OTHER,
    subject: input.subject.trim(),
    description: input.description === undefined ? undefined : normalizeNullableString(input.description),
    activityDate: input.activityDate === undefined ? undefined : normalizeNullableDate(input.activityDate),
    ownerUserId: normalizeNullableString(input.ownerUserId),
    createdByUserId: normalizeNullableString(input.createdByUserId),
    updatedByUserId: normalizeNullableString(input.updatedByUserId),
  };
}

function buildActivityUpdateData(input) {
  const data = {};

  for (const [key, value] of Object.entries(input)) {
    if (key === 'subject') {
      data.subject = value.trim();
    } else if (key === 'activityType') {
      data.activityType = value;
    } else if (key === 'activityDate') {
      data.activityDate = normalizeNullableDate(value);
    } else {
      data[key] = normalizeNullableString(value);
    }
  }

  return data;
}

router.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.activity.findMany({
      orderBy: [{ activityDate: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const row = await prisma.activity.findUnique({
      where: { id: req.params.id },
      include: {
        account: true,
        contact: true,
        opportunity: true,
        owner: true,
      },
    });

    if (!row) {
      return res.status(404).json({ ok: false, error: 'Activity not found' });
    }

    res.json({ ok: true, data: row });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = createActivitySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid activity payload',
        details: parsed.error.flatten(),
      });
    }

    const created = await prisma.activity.create({
      data: buildActivityCreateData(parsed.data),
    });

    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const parsed = updateActivitySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid activity update payload',
        details: parsed.error.flatten(),
      });
    }

    const existing = await prisma.activity.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ ok: false, error: 'Activity not found' });
    }

    const updated = await prisma.activity.update({
      where: { id: req.params.id },
      data: buildActivityUpdateData(parsed.data),
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
