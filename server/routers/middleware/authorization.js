// يتحقق من صلاحية هذا المستخدم
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.length || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: "Not authorized for this action" });
  };
};

module.exports = authorize;