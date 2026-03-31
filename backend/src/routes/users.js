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

module.exports = router;
