import { Router } from 'express';
import { getClients, createClient, getClient, editClient, deleteClient } from '../controllers/clienteController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/clients', authRequired, getClients)

router.get('/clients/:id', authRequired, getClient)

router.post('/clients', authRequired, createClient)

router.put('/clients/:id', authRequired, editClient)

router.delete('/clients/:id', authRequired, deleteClient)


export default router