import { Router } from 'express';
import { getRoles, getRole, createRole, editRole, deleteRole } from '../controllers/rolController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/roles', authRequired, getRoles)

router.get('/roles/:id', authRequired, getRole)

router.post('/roles', authRequired, createRole)

router.put('/roles/:id', authRequired, editRole)

router.delete('/roles/:id', authRequired, deleteRole)


export default router