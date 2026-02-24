import User from "../models/User.js";

export const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
    try {
    const user = await User.findById(req.session.userId);

    if (!user || user.role !== "admin") { // we need !user because if user is not found, user will be null and null.role will throw an error 
    // and also checking for userId in cookie is not enough because user might be deleted from database but cookie is still not expired
    // , so we need to check if user exists in database and if it has admin role
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}