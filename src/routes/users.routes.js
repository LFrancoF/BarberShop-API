import { Router } from 'express';
import { getUsers, createUser, getUser, editUser, deleteUser } from '../controllers/usuarioController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/users', getUsers)

router.post('/users', createUser)

router.get('/users/:id', getUser)

router.put('/users/:id', editUser)

router.delete('/users/:id', deleteUser)


export default router