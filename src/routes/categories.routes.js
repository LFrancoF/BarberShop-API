import { Router } from 'express';
import { getCategorias, getCategoria, createCategoria, editCategoria, deleteCategoria } from '../controllers/categoriaController.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.get('/categories', getCategorias)

router.post('/categories', createCategoria)

router.get('/categories/:id', getCategoria)

router.put('/categories/:id', editCategoria)

router.delete('/categories/:id', deleteCategoria)


export default router