import { Router } from 'express';
import { getAllCitas, getMyCitas, getCita, createCita, editCita, deleteCita } from '../controllers/citaController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/citas', getAllCitas)

router.get('/citas/:id/:user', getMyCitas)

router.get('/citas/:id', getCita)

router.post('/citas', createCita)

router.put('/citas/:id', editCita)

router.delete('/citas/:id', deleteCita)


export default router