const express = require('express');
const { z } = require('zod');
const { prisma } = require('../db/prisma');

const router = express.Router();

const createContactSchema = z.object({
  accountId: z.string().trim().min(1).optional().nullable(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  fullName: z.string().trim().optional().nullable(),
  jobTitle: z.string().trim().optional().nullable(),
  email: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  mobile: z.string().trim().optional().nullable(),
  preferredContactMethod: z.string().trim().optional().nullable(),
  roleInBuyingProcess: z.string().trim().optional().nullable(),
  decisionMaker: z.boolean().optional(),
  champion: z.boolean().optional(),
  primaryContact: z.boolean().optional(),
  notes: z.string().trim().optional().nullable(),
  ownerUserId: z.string().trim().min(1).optional().nullable(),
  createdByUserId: z.string().trim().min(1).optional().nullable(),
  updatedByUserId: z.string().trim().min(1).optional().nullable(),
});

const updateContactSchema = z.object({
  accountId: z.string().trim().min(1).nullable().optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  fullName: z.string().trim().nullable().optional(),
  jobTitle: z.string().trim().nullable().optional(),
  email: z.string().trim().nullable().optional(),
  phone: z.string().trim().nullable().optional(),
  mobile: z.string().trim().nullable().optional(),
  preferredContactMethod: z.string().trim().nullable().optional(),
  roleInBuyingProcess: z.string().trim().nullable().optional(),
  decisionMaker: z.boolean().optional(),
  champion: z.boolean().optional(),
  primaryContact: z.boolean().optional(),
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

function buildContactCreateData(input) {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  return {
    accountId: normalizeNullableString(input.accountId),
    firstName,
    lastName,
    fullName:
      input.fullName === undefined
        ? `${firstName} ${lastName}`
        : normalizeNullableString(input.fullName),
    jobTitle: normalizeNullableString(input.jobTitle),
    email: normalizeNullableString(input.email),
    phone: normalizeNullableString(input.phone),
    mobile: normalizeNullableString(input.mobile),
    preferredContactMethod: normalizeNullableString(input.preferredContactMethod),
    roleInBuyingProcess: normalizeNullableString(input.roleInBuyingProcess),
    decisionMaker: input.decisionMaker ?? false,
    champion: input.champion ?? false,
    primaryContact: input.primaryContact ?? false,
    notes: input.notes === undefined ? undefined : normalizeNullableString(input.notes),
    ownerUserId: normalizeNullableString(input.ownerUserId),
    createdByUserId: normalizeNullableString(input.createdByUserId),
    updatedByUserId: normalizeNullableString(input.updatedByUserId),
  };
}

function buildContactUpdateData(input, existing) {
  const data = {};

  for (const [key, value] of Object.entries(input)) {
    if (key === 'firstName' || key === 'lastName') {
      data[key] = value.trim();
    } else if (
      key === 'decisionMaker' ||
      key === 'champion' ||
      key === 'primaryContact'
    ) {
      data[key] = value;
    } else {
      data[key] = normalizeNullableString(value);
    }
  }

  const nextFirstName = data.firstName ?? existing.firstName;
  const nextLastName = data.lastName ?? existing.lastName;

  if (!('fullName' in data)) {
    data.fullName = `${nextFirstName} ${nextLastName}`;
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

function canWriteContacts(req) {
  const role = String(req.currentUser?.role || '').trim();
  return role === 'ADMIN' || role === 'EXECUTIVE' || role === 'SALES_MANAGER' || role === 'SALES_ASSOCIATE';
}

async function buildContactReadWhere(req) {
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

function requireContactWriteAccess(req, res, existingContact = null) {
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
    if (!existingContact) {
      return true;
    }

    if (existingContact.ownerUserId === req.currentUser.id) {
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

    const where = await buildContactReadWhere(req);

    const rows = await prisma.contact.findMany({
      where,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;

    const where = await buildContactReadWhere(req);

    const allowed = await prisma.contact.findFirst({
      where: {
        ...where,
        id: req.params.id,
      },
      select: { id: true },
    });

    if (!allowed) {
      return res.status(404).json({ ok: false, error: 'Contact not found' });
    }

    const row = await prisma.contact.findUnique({
      where: { id: req.params.id },
      include: {
        account: true,
        owner: true,
        opportunities: true,
        tasks: true,
        activities: true,
      },
    });

    if (!row) {
      return res.status(404).json({ ok: false, error: 'Contact not found' });
    }

    res.json({ ok: true, data: row });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;
    if (!canWriteContacts(req)) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    const parsed = createContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid contact payload',
        details: parsed.error.flatten(),
      });
    }

    const payload = buildContactCreateData(parsed.data);
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

    const created = await prisma.contact.create({
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

    const existing = await prisma.contact.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ ok: false, error: 'Contact not found' });
    }

    if (!requireContactWriteAccess(req, res, existing)) return;

    const parsed = updateContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid contact update payload',
        details: parsed.error.flatten(),
      });
    }

    const updateData = buildContactUpdateData(parsed.data, existing);
    const role = String(req.currentUser?.role || '').trim();

    if (role === 'SALES_ASSOCIATE') {
      delete updateData.ownerUserId;
      updateData.updatedByUserId = req.currentUser.id;
    } else {
      updateData.updatedByUserId = updateData.updatedByUserId ?? req.currentUser.id;
    }

    const updated = await prisma.contact.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
