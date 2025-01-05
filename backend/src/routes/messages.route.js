import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsers, getMessages, sendMessage } from "../controllers/messages.controller.js";

const messagesRoutes= Router();

messagesRoutes.get("/users", protectRoute, getUsers);
messagesRoutes.get("/:id", protectRoute, getMessages);

messagesRoutes.post("/send/:id", protectRoute, sendMessage)

export default messagesRoutes;