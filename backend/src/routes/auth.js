const express = require('express');

const router = express.Router();

router.get('/me', async (req, res) => {
  res.json({
    ok: true,
    data: req.currentUser || null,
  });
});

module.exports = router;
