import { FormRecomendacion } from '../models/formRecomendacionModel.js'
import cloudinary from '../libs/cloudinary.js';
import { nowDateSQL, nowTimeSQL } from "../libs/datetime.js";

export const createRecomend = async (req, res) => {
    const {imagen, idCategoria, idCliente} = req.body
    
    try {

        const fecha = nowDateSQL()
        const hora = nowTimeSQL()

        const newForm = new FormRecomendacion({
            imagen, fecha, hora, idCategoria, idCliente
        })

        const formSaved = await newForm.createFormRecomendacion()

        res.json(formSaved)

    } catch (error) {
        res.status(500).json([error.message]);
    }
}