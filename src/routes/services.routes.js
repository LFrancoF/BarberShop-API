import { Router } from 'express';
import { getServicios, getServicio, createServicio, editServicio, deleteServicio } from '../controllers/servicioController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/services', authRequired, getServicios)

router.get('/services/:id', authRequired, getServicio)

router.post('/services', authRequired, createServicio)

router.put('/services/:id', authRequired, editServicio)

router.delete('/services/:id', authRequired, deleteServicio)


export default router