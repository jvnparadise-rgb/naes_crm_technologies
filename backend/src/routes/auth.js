const express = require('express');
const { prisma } = require('../db/prisma');

const router = express.Router();

function decodeJwtPayload(token = '') {
  try {
    const parts = String(token || '').split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

router.get('/me', async (req, res) => {
  res.json({
    ok: true,
    data: req.currentUser || null,
  });
});

router.post('/cognito/exchange', express.json(), async (req, res, next) => {
  try {
    const code = String(req.body?.code || '').trim();
    if (!code) {
      return res.status(400).json({
        ok: false,
        error: 'missing_code',
      });
    }

    const domain = String(process.env.COGNITO_DOMAIN || '').trim();
    const clientId = String(process.env.COGNITO_CLIENT_ID || '').trim();
    const redirectUri = 'https://www.naestechnologiescrm.com/';

    if (!domain || !clientId || !redirectUri) {
      return res.status(500).json({
        ok: false,
        error: 'cognito_exchange_not_configured',
      });
    }

    const tokenUrl = `https://${domain}/oauth2/token`;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const rawText = await tokenResponse.text();
    let payload = null;

    try {
      payload = JSON.parse(rawText);
    } catch (error) {
      payload = { raw: rawText };
    }

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json({
        ok: false,
        error: 'cognito_token_exchange_failed',
        details: payload,
      });
    }

    const idClaims = decodeJwtPayload(payload?.id_token || '');
    const accessClaims = decodeJwtPayload(payload?.access_token || '');

    return res.json({
      ok: true,
      data: {
        token_type: payload?.token_type || null,
        expires_in: payload?.expires_in || null,
        id_claims: idClaims,
        access_claims: accessClaims,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/cognito/map-user', express.json(), async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const sub = String(req.body?.sub || '').trim();

    if (!email) {
      return res.status(400).json({
        ok: false,
        error: 'missing_email',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
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

    if (!user) {
      return res.json({
        ok: true,
        data: {
          mapped: false,
          provisioned: false,
          cognito: {
            email,
            sub,
          },
          crmUser: null,
        },
      });
    }

    const sessionPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    res.cookie('naes_crm_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    });

    req.currentUser = sessionPayload;

    return res.json({
      ok: true,
      data: {
        mapped: true,
        provisioned: true,
        cognito: {
          email,
          sub,
        },
        crmUser: user,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
