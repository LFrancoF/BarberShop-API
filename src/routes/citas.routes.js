import { Router } from 'express';
import { getAllCitas, getMyCitas, getCita, createCita, editCita, deleteCita } from '../controllers/citaController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/citas', authRequired, getAllCitas)

router.get('/citas/:id/:user', authRequired, getMyCitas)

router.get('/citas/:id', authRequired, getCita)

router.post('/citas', authRequired, createCita)

router.put('/citas/:id', authRequired, editCita)

router.delete('/citas/:id', authRequired, deleteCita)


export default router