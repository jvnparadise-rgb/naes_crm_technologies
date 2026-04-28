const express = require('express');
const { prisma } = require('../db/prisma');

const router = express.Router();

function cleanString(value) {
  const text = String(value || '').trim();
  return text || null;
}

function userData(body = {}) {
  return {
    email: String(body.email || '').trim(),
    firstName: String(body.firstName || '').trim(),
    lastName: String(body.lastName || '').trim(),
    nickname: cleanString(body.nickname),
    title: cleanString(body.title),
    role: String(body.role || 'SALES_ASSOCIATE').trim(),
    teamName: cleanString(body.teamName),
    profilePhotoUrl: cleanString(body.profilePhotoUrl),
    isActive: body.isActive !== false
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.user.findMany({
      where: {
        NOT: {
          teamName: {
            startsWith: '__DELETED__'
          }
        }
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
    });
    return res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = userData(req.body);

    if (!data.email || !data.firstName || !data.lastName) {
      return res.status(400).json({ ok: false, error: 'Email, first name, and last name are required.' });
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } });

    if (existing) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data
      });
      return res.json({ ok: true, data: updated, mode: 'updated-existing-email' });
    }

    const created = await prisma.user.create({ data });
    return res.status(201).json({ ok: true, data: created, mode: 'created' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const data = userData(req.body);

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data
    });

    return res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const id = String(req.params.id || '').trim();

    if (!id) {
      return res.status(400).json({ ok: false, error: 'Missing user id.' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    return res.json({ ok: true, deletedId: id, data: updated, mode: 'soft-delete' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
