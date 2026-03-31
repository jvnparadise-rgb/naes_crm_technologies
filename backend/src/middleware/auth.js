const { prisma } = require('../db/prisma');

async function attachCurrentUser(req, _res, next) {
  try {
    const devUserId = String(req.headers['x-dev-user-id'] || '').trim();

    if (!devUserId) {
      req.currentUser = null;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: devUserId },
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
