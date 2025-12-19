import { Router } from "express";
import { checkUser, login, register } from "../handlers/auth.js";
import { validateBodySchema } from "../middlewares/validations.js";
import { loginSchema, userSchema } from "../validation/users.js";
import { CheckAuth } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.get("/", CheckAuth, checkUser);
authRouter.post("/login", validateBodySchema(loginSchema), login);
authRouter.post("/register", validateBodySchema(userSchema), register);

export default authRouter;
