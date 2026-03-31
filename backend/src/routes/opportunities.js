const express = require('express');
const { z } = require('zod');
const { prisma } = require('../db/prisma');
const { OpportunityStage, ForecastCategory } = require('@prisma/client');

const router = express.Router();

const createOpportunitySchema = z.object({
  accountId: z.string().trim().min(1).optional().nullable(),
  primaryContactId: z.string().trim().min(1).optional().nullable(),
  name: z.string().trim().min(1),
  serviceLine: z.string().trim().optional().nullable(),
  marketSegment: z.string().trim().optional().nullable(),
  opportunityType: z.string().trim().optional().nullable(),
  stage: z.nativeEnum(OpportunityStage).optional(),
  forecastCategory: z.nativeEnum(ForecastCategory).optional(),
  forecastProbability: z.number().int().min(0).max(100).optional().nullable(),
  forecastPeriod: z.string().trim().optional().nullable(),
  expectedCloseDate: z.string().datetime().optional().nullable(),
  annualRevenue: z.union([z.number(), z.string()]).optional().nullable(),
  arr: z.union([z.number(), z.string()]).optional().nullable(),
  oneTimeRevenue: z.union([z.number(), z.string()]).optional().nullable(),
  totalEstimatedRevenue: z.union([z.number(), z.string()]).optional().nullable(),
  ctsPercent: z.union([z.number(), z.string()]).optional().nullable(),
  marginPercent: z.union([z.number(), z.string()]).optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  ownerUserId: z.string().trim().min(1).optional().nullable(),
  createdByUserId: z.string().trim().min(1).optional().nullable(),
  updatedByUserId: z.string().trim().min(1).optional().nullable(),
});

const updateOpportunitySchema = z.object({
  accountId: z.string().trim().min(1).nullable().optional(),
  primaryContactId: z.string().trim().min(1).nullable().optional(),
  name: z.string().trim().min(1).optional(),
  serviceLine: z.string().trim().nullable().optional(),
  marketSegment: z.string().trim().nullable().optional(),
  opportunityType: z.string().trim().nullable().optional(),
  stage: z.nativeEnum(OpportunityStage).optional(),
  forecastCategory: z.nativeEnum(ForecastCategory).optional(),
  forecastProbability: z.number().int().min(0).max(100).nullable().optional(),
  forecastPeriod: z.string().trim().nullable().optional(),
  expectedCloseDate: z.string().datetime().nullable().optional(),
  annualRevenue: z.union([z.number(), z.string()]).nullable().optional(),
  arr: z.union([z.number(), z.string()]).nullable().optional(),
  oneTimeRevenue: z.union([z.number(), z.string()]).nullable().optional(),
  totalEstimatedRevenue: z.union([z.number(), z.string()]).nullable().optional(),
  ctsPercent: z.union([z.number(), z.string()]).nullable().optional(),
  marginPercent: z.union([z.number(), z.string()]).nullable().optional(),
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

function normalizeNullableDate(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return new Date(value);
}

function normalizeNullableNumber(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === 'number') return value.toString();
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function buildOpportunityCreateData(input) {
  return {
    accountId: normalizeNullableString(input.accountId),
    primaryContactId: normalizeNullableString(input.primaryContactId),
    name: input.name.trim(),
    serviceLine: normalizeNullableString(input.serviceLine),
    marketSegment: normalizeNullableString(input.marketSegment),
    opportunityType: normalizeNullableString(input.opportunityType),
    stage: input.stage ?? OpportunityStage.PROSPECTING,
    forecastCategory: input.forecastCategory ?? ForecastCategory.PIPELINE,
    forecastProbability: input.forecastProbability ?? null,
    forecastPeriod: normalizeNullableString(input.forecastPeriod),
    expectedCloseDate: normalizeNullableDate(input.expectedCloseDate),
    annualRevenue: normalizeNullableNumber(input.annualRevenue),
    arr: normalizeNullableNumber(input.arr),
    oneTimeRevenue: normalizeNullableNumber(input.oneTimeRevenue),
    totalEstimatedRevenue: normalizeNullableNumber(input.totalEstimatedRevenue),
    ctsPercent: normalizeNullableNumber(input.ctsPercent),
    marginPercent: normalizeNullableNumber(input.marginPercent),
    notes: input.notes === undefined ? undefined : normalizeNullableString(input.notes),
    ownerUserId: normalizeNullableString(input.ownerUserId),
    createdByUserId: normalizeNullableString(input.createdByUserId),
    updatedByUserId: normalizeNullableString(input.updatedByUserId),
  };
}

function buildOpportunityUpdateData(input) {
  const data = {};

  for (const [key, value] of Object.entries(input)) {
    if (key === 'name') {
      data.name = value.trim();
    } else if (key === 'stage' || key === 'forecastCategory' || key === 'forecastProbability') {
      data[key] = value;
    } else if (key === 'expectedCloseDate') {
      data[key] = normalizeNullableDate(value);
    } else if (
      key === 'annualRevenue' ||
      key === 'arr' ||
      key === 'oneTimeRevenue' ||
      key === 'totalEstimatedRevenue' ||
      key === 'ctsPercent' ||
      key === 'marginPercent'
    ) {
      data[key] = normalizeNullableNumber(value);
    } else {
      data[key] = normalizeNullableString(value);
    }
  }

  return data;
}

router.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.opportunity.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
    res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const row = await prisma.opportunity.findUnique({
      where: { id: req.params.id },
      include: {
        account: true,
        primaryContact: true,
        owner: true,
        stageHistory: {
          orderBy: [{ changedAt: 'desc' }],
        },
        tasks: true,
        activities: true,
      },
    });

    if (!row) {
      return res.status(404).json({ ok: false, error: 'Opportunity not found' });
    }

    res.json({ ok: true, data: row });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = createOpportunitySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid opportunity payload',
        details: parsed.error.flatten(),
      });
    }

    const created = await prisma.opportunity.create({
      data: buildOpportunityCreateData(parsed.data),
    });

    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const parsed = updateOpportunitySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid opportunity update payload',
        details: parsed.error.flatten(),
      });
    }

    const existing = await prisma.opportunity.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ ok: false, error: 'Opportunity not found' });
    }

    const updated = await prisma.opportunity.update({
      where: { id: req.params.id },
      data: buildOpportunityUpdateData(parsed.data),
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
