const express = require('express');
const { z } = require('zod');
const { prisma } = require('../db/prisma');

const router = express.Router();

const updateProfileSchema = z.object({
  nickname: z.string().trim().max(100).nullable().optional(),
  profilePhotoUrl: z.string().trim().max(1000).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required for update',
});

function normalizeNullableString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
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

function requireSelf(req, res) {
  if (!req.currentUser) {
    res.status(401).json({
      ok: false,
      error: 'Authentication required',
    });
    return false;
  }

  if (req.currentUser.id !== req.params.id) {
    res.status(403).json({
      ok: false,
      error: 'Forbidden',
    });
    return false;
  }

  return true;
}

router.get('/:id', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;
    if (!requireSelf(req, res)) return;

    const row = await prisma.user.findUnique({
      where: { id: req.currentUser.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        nickname: true,
        title: true,
        role: true,
        teamName: true,
        profilePhotoUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!row) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    res.json({ ok: true, data: row });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    if (!requireCurrentUser(req, res)) return;
    if (!requireSelf(req, res)) return;

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid profile update payload',
        details: parsed.error.flatten(),
      });
    }

    const existing = await prisma.user.findUnique({
      where: { id: req.currentUser.id },
      select: { id: true },
    });

    if (!existing) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const updated = await prisma.user.update({
      where: { id: req.currentUser.id },
      data: {
        nickname: normalizeNullableString(parsed.data.nickname),
        profilePhotoUrl: normalizeNullableString(parsed.data.profilePhotoUrl),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        nickname: true,
        title: true,
        role: true,
        teamName: true,
        profilePhotoUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
