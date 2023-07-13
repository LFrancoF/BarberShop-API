import { Router } from 'express';
import { getClients, createClient, getClient, editClient, deleteClient } from '../controllers/clienteController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/clients', getClients)

router.post('/clients', createClient)

router.get('/clients/:id', getClient)

router.put('/clients/:id', editClient)

router.delete('/clients/:id', deleteClient)


export default router