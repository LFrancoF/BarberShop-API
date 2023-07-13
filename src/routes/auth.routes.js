import { Router } from 'express';
import { login, register, logout, verifyToken, profile } from '../controllers/authController.js';
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router()

router.post('/register', validateSchema(registerSchema), register)

router.post('/login', validateSchema(loginSchema), login)

router.post('/logout', logout)

router.get('/verifyToken', verifyToken)

router.get('/profile', profile)

export default router