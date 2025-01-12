import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsers,
  getMessages,
  sendMessage,
  deleteMessageForAll,
  deleteChatForMe,
  deleteMessageForMe
} from "../controllers/messages.controller.js";

const messagesRoutes = Router();

messagesRoutes.get("/users", protectRoute, getUsers);
messagesRoutes.get("/:id", protectRoute, getMessages);

messagesRoutes.post("/send/:id", protectRoute, sendMessage);

messagesRoutes.delete("/deleteMessageForMe/:id", protectRoute, deleteMessageForMe);
messagesRoutes.post("/deleteMessageForAll", protectRoute, deleteMessageForAll);

messagesRoutes.delete("/deleteChatForMe/:id", protectRoute, deleteChatForMe);

export default messagesRoutes;