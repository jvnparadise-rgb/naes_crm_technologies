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

router.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.contact.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
    res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
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
    const parsed = createContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid contact payload',
        details: parsed.error.flatten(),
      });
    }

    const created = await prisma.contact.create({
      data: buildContactCreateData(parsed.data),
    });

    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const parsed = updateContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid contact update payload',
        details: parsed.error.flatten(),
      });
    }

    const existing = await prisma.contact.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ ok: false, error: 'Contact not found' });
    }

    const updated = await prisma.contact.update({
      where: { id: req.params.id },
      data: buildContactUpdateData(parsed.data, existing),
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
