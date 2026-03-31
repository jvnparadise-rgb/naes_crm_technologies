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

function canWriteActivities(req) {
  const role = String(req.currentUser?.role || '').trim();
  return role === 'ADMIN' || role === 'EXECUTIVE' || role === 'SALES_MANAGER' || role === 'SALES_ASSOCIATE';
}

async function buildActivityReadWhere(req) {
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

function requireActivityWriteAccess(req, res, existingActivity = null) {
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
    if (!existingActivity) {
      return true;
    }

    if (existingActivity.ownerUserId === req.currentUser.id) {
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

router.get('/', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;

    const where = await buildActivityReadWhere(req);

    const rows = await prisma.activity.findMany({
      where,
      orderBy: [{ activityDate: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;

    const where = await buildActivityReadWhere(req);

    const allowed = await prisma.activity.findFirst({
      where: {
        ...where,
        id: req.params.id,
      },
      select: { id: true },
    });

    if (!allowed) {
      return res.status(404).json({ ok: false, error: 'Activity not found' });
    }

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
    if (!requireCurrentUser(req, res)) return;
    if (!canWriteActivities(req)) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    const parsed = createActivitySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid activity payload',
        details: parsed.error.flatten(),
      });
    }

    const payload = buildActivityCreateData(parsed.data);
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

    const created = await prisma.activity.create({
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

    const existing = await prisma.activity.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ ok: false, error: 'Activity not found' });
    }

    if (!requireActivityWriteAccess(req, res, existing)) return;

    const parsed = updateActivitySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid activity update payload',
        details: parsed.error.flatten(),
      });
    }

    const updateData = buildActivityUpdateData(parsed.data);
    const role = String(req.currentUser?.role || '').trim();

    if (role === 'SALES_ASSOCIATE') {
      delete updateData.ownerUserId;
      updateData.updatedByUserId = req.currentUser.id;
    } else {
      updateData.updatedByUserId = updateData.updatedByUserId ?? req.currentUser.id;
    }

    const updated = await prisma.activity.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
