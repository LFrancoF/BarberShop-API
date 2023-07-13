import { Router } from 'express';
import { getRoles, getRole, createRole, editRole, deleteRole } from '../controllers/rolController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/roles', getRoles)

router.get('/roles/:id', getRole)

router.post('/roles', createRole)

router.put('/roles/:id', editRole)

router.delete('/roles/:id', deleteRole)


export default router