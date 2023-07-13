import { Router } from 'express';
import { createRecomend } from '../controllers/recomendacionController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.post('/formrecomend', authRequired, createRecomend)


export default router