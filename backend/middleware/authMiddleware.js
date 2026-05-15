const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
// const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("[AUTH DEBUG] Full Header:", authHeader);

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      console.log("[AUTH DEBUG] Token missing or invalid Bearer format");
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(/\s+/)[1];
    
    if (!token) {
      console.log("[AUTH DEBUG] Token string is empty after split");
      return res.status(401).json({
        success: false,
        message: "Not authorized, token empty",
      });
    }

    try {
      // Decode without verification first to see what's inside
      const decodedInfo = jwt.decode(token);
      console.log("[AUTH DEBUG] Raw Decoded (No Verification):", decodedInfo);
      console.log("[AUTH DEBUG] JWT_SECRET Exists:", !!process.env.JWT_SECRET);
      console.log("[AUTH DEBUG] JWT_SECRET Length:", process.env.JWT_SECRET?.length || 0);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[AUTH DEBUG] Token Verified Successfully. ID:", decoded.id);

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
        console.log("[AUTH DEBUG] User not found for ID:", decoded.id);
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error("[AUTH DEBUG] JWT ERROR:", jwtError.name, jwtError.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
        debug: jwtError.message
      });
    }
  } catch (error) {
    console.error("[AUTH DEBUG] GLOBAL ERROR:", error);
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
