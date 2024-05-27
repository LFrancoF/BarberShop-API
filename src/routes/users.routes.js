import { Router } from 'express';
import { getUsers, createUser, getUser, editUser, deleteUser } from '../controllers/usuarioController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/users', authRequired, getUsers)

router.post('/users', authRequired, createUser)

router.get('/users/:id', authRequired, getUser)

router.put('/users/:id', authRequired, editUser)

router.delete('/users/:id', authRequired, deleteUser)


export default router