import { Router } from "express";
import {
  logout,
  login,
  signup,
  updateProfile,
  checkAuth
} from "../controllers/auth.contoller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.get("/logout", logout);

authRoutes.put("/updateProfile", protectRoute, updateProfile);

authRoutes.get("/check", protectRoute, checkAuth)

export default authRoutes;
