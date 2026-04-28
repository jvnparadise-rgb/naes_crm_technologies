const cookie = require('cookie');
const { prisma } = require('../db/prisma');

async function attachCurrentUser(req, _res, next) {
  try {
    const devUserId = String(req.headers['x-dev-user-id'] || '').trim();

    let resolvedUserId = devUserId;

    if (!resolvedUserId) {
      const parsedCookies = cookie.parse(req.headers.cookie || '');
      const rawSession = String(parsedCookies.naes_crm_session || '').trim();

      if (rawSession) {
        try {
          const sessionJson = Buffer.from(decodeURIComponent(rawSession), 'base64').toString('utf8');
          const sessionPayload = JSON.parse(sessionJson);
          resolvedUserId = String(sessionPayload?.id || '').trim();
        } catch (_error) {
          resolvedUserId = '';
        }
      }
    }

    if (!resolvedUserId) {
      req.currentUser = null;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: resolvedUserId },
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

    req.currentUser = user || null;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  attachCurrentUser,
};
