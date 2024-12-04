import { Router } from "express";
import { login, signup, getUserInfo } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoute = Router();

authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.get("/user-info", verifyToken, getUserInfo);

export default authRoute;
