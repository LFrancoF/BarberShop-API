import { Router } from 'express';
import { getBarbers, getBarber, createBarber, editBarber, deleteBarber } from '../controllers/barberoController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/barbers', getBarbers)

router.post('/barbers', createBarber)

router.get('/barbers/:id', getBarber)

router.put('/barbers/:id', editBarber)

router.delete('/barbers/:id', deleteBarber)


export default router