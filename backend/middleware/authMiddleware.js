const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
// const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("[AUTH DEBUG] Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("[AUTH DEBUG] Token missing or invalid format");
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("[AUTH DEBUG] Token Extracted:", token ? (token.substring(0, 10) + "...") : "null");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[AUTH DEBUG] Decoded Payload:", decoded);

      const { data: user, error } = await supabase
        .from('users')
        .select(`
          *,
          role:roles (
            name,
            permissions
          )
        `)
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        console.log("[AUTH DEBUG] User not found in database:", decoded.id);
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      if (user.status !== "active") {
        return res.status(403).json({
          success: false,
          message: "User account is inactive",
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error("[AUTH DEBUG] JWT Verification Failed:", jwtError.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  } catch (error) {
    console.error("[AUTH DEBUG] Unexpected Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role?.name !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only",
    });
  }

  next();
};

const checkPermission = (permission) => (req, res, next) => {
  const permissions = req.user?.role?.permissions || [];

  if (req.user?.role?.name === "admin" || permissions.includes(permission)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: `Access denied. Missing permission: ${permission}`,
  });
};

module.exports = {
  protect,
  adminOnly,
  checkPermission,
};
