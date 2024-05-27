import { Router } from 'express';
import { getBarbers, getBarber, createBarber, editBarber, deleteBarber } from '../controllers/barberoController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/barbers', authRequired, getBarbers)

router.post('/barbers', authRequired, createBarber)

router.get('/barbers/:id', authRequired, getBarber)

router.put('/barbers/:id', authRequired, editBarber)

router.delete('/barbers/:id', authRequired, deleteBarber)


export default router