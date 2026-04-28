const express = require('express');
const { prisma } = require('../db/prisma');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.user.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
    res.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const row = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        ownedAccounts: true,
        ownedContacts: true,
        ownedOpportunities: true,
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



// CREATE USER
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;

    const created = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        nickname: data.nickname || null,
        title: data.title || null,
        role: data.role || 'SALES_ASSOCIATE',
        teamName: data.teamName || null,
        profilePhotoUrl: data.profilePhotoUrl || null,
        isActive: data.isActive !== false
      }
    });

    res.json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
});

// UPDATE USER
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        nickname: data.nickname || null,
        title: data.title || null,
        role: data.role,
        teamName: data.teamName || null,
        profilePhotoUrl: data.profilePhotoUrl || null,
        isActive: data.isActive
      }
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE USER
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
