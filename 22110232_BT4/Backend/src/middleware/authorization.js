// Authorization middleware - check if user has required role
export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          EC: 1,
          EM: 'Authentication required',
          DT: null,
        });
      }

      const userRole = req.user.role || 'user';

      if (!roles.includes(userRole)) {
        return res.status(403).json({
          EC: 1,
          EM: 'Access denied. Insufficient permissions.',
          DT: null,
        });
      }

      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      return res.status(500).json({
        EC: -1,
        EM: 'Authorization error',
        DT: null,
      });
    }
  };
};

// Middleware to check if user is admin
export const requireAdmin = authorize('admin');

// Middleware to check if user is regular user or admin
export const requireUser = authorize('user', 'admin');

