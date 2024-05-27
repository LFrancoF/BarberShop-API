import { Router } from 'express';
import { getCategorias, getCategoria, createCategoria, editCategoria, deleteCategoria } from '../controllers/categoriaController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/categories', authRequired, getCategorias)

router.post('/categories', authRequired, createCategoria)

router.get('/categories/:id', authRequired, getCategoria)

router.put('/categories/:id', authRequired, editCategoria)

router.delete('/categories/:id', authRequired, deleteCategoria)


export default router