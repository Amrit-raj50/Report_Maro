// middleware/rbac.middleware.js
const rbacMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Please login first',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions',
        requiredRole: allowedRoles,
        yourRole: req.user.role,
      });
    }

    next();
  };
};

module.exports = rbacMiddleware;