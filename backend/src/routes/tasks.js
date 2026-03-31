const express = require('express');
const { z } = require('zod');
const { prisma } = require('../db/prisma');
const { TaskStatus, TaskPriority } = require('@prisma/client');

const router = express.Router();

const createTaskSchema = z.object({
  accountId: z.string().trim().min(1).optional().nullable(),
  contactId: z.string().trim().min(1).optional().nullable(),
  opportunityId: z.string().trim().min(1).optional().nullable(),
  title: z.string().trim().min(1),
  description: z.string().trim().optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  ownerUserId: z.string().trim().min(1).optional().nullable(),
  createdByUserId: z.string().trim().min(1).optional().nullable(),
  updatedByUserId: z.string().trim().min(1).optional().nullable(),
});

const updateTaskSchema = z.object({
  accountId: z.string().trim().min(1).nullable().optional(),
  contactId: z.string().trim().min(1).nullable().optional(),
  opportunityId: z.string().trim().min(1).nullable().optional(),
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().nullable().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  completedAt: z.string().datetime().nullable().optional(),
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

function buildTaskCreateData(input) {
  return {
    accountId: normalizeNullableString(input.accountId),
    contactId: normalizeNullableString(input.contactId),
    opportunityId: normalizeNullableString(input.opportunityId),
    title: input.title.trim(),
    description: input.description === undefined ? undefined : normalizeNullableString(input.description),
    status: input.status ?? TaskStatus.NOT_STARTED,
    priority: input.priority ?? TaskPriority.MEDIUM,
    dueDate: normalizeNullableDate(input.dueDate),
    completedAt: normalizeNullableDate(input.completedAt),
    ownerUserId: normalizeNullableString(input.ownerUserId),
    createdByUserId: normalizeNullableString(input.createdByUserId),
    updatedByUserId: normalizeNullableString(input.updatedByUserId),
  };
}

function buildTaskUpdateData(input) {
  const data = {};

  for (const [key, value] of Object.entries(input)) {
    if (key === 'title') {
      data.title = value.trim();
    } else if (key === 'status' || key === 'priority') {
      data[key] = value;
    } else if (key === 'dueDate' || key === 'completedAt') {
      data[key] = normalizeNullableDate(value);
    } else {
      data[key] = normalizeNullableString(value);
    }
  }

  return data;
}

router.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.task.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
    res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const row = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        account: true,
        contact: true,
        opportunity: true,
        owner: true,
      },
    });

    if (!row) {
      return res.status(404).json({ ok: false, error: 'Task not found' });
    }

    res.json({ ok: true, data: row });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid task payload',
        details: parsed.error.flatten(),
      });
    }

    const created = await prisma.task.create({
      data: buildTaskCreateData(parsed.data),
    });

    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid task update payload',
        details: parsed.error.flatten(),
      });
    }

    const existing = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ ok: false, error: 'Task not found' });
    }

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: buildTaskUpdateData(parsed.data),
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
