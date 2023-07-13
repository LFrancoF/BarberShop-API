import { Router } from 'express';
import { getServicios, getServicio, createServicio, editServicio, deleteServicio } from '../controllers/servicioController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/services', getServicios)

router.get('/services/:id', getServicio)

router.post('/services', createServicio)

router.put('/services/:id', editServicio)

router.delete('/services/:id', deleteServicio)


export default router