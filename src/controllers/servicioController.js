import { Servicio } from '../models/servicioModel.js'
import cloudinary from '../libs/cloudinary.js';

export const getServicios = async (req, res) => {
    try {
        const servicio = new Servicio()
        const allServicios = await servicio.getServicios()
        res.json(allServicios)
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const createServicio = async (req, res) => {
    const {nombre, imagen, precio, duracion, descripcion, idCategoria} = req.body
    
    try {

        let urlImagen
        if (imagen){
            const uploadRes = await cloudinary.uploader.upload(imagen, {
                upload_preset: "servicios-qd935gt5"
            })
            urlImagen = uploadRes.secure_url
        }

        const newServicio = new Servicio({
            nombre, imagen: urlImagen, precio, duracion, descripcion, idCategoria
        })

        const servicioSaved = await newServicio.createServicio()

        res.json({
            nombre : servicioSaved.nombre,
            imagen : servicioSaved.imagen,
            categoria : servicioSaved.categoria,
            precio : servicioSaved.precio,
            duracion : servicioSaved.duracion,
            descripcion : servicioSaved.descripcion
        })

    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const getServicio = async (req, res) => {
    const id = req.params.id

    try {
        const newServicio = new Servicio({idServicio : id})
        const servicioFound = await newServicio.getServicioById()
        if (!servicioFound) return res.status(400).json(["Servicio no encontrado"])

        res.json({
            idServicio: servicioFound.idServicio,
            nombre : servicioFound.nombre,
            imagen: servicioFound.imagen,
            idCategoria : servicioFound.idCategoria,
            categoria: servicioFound.categoria,
            precio : servicioFound.precio,
            duracion : servicioFound.duracion,
            descripcion : servicioFound.descripcion
        })
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const editServicio = async (req, res) => {
    const id = req.params.id
    const {nombre, imagen, precio, duracion, descripcion, idCategoria} = req.body
    try {

        let urlImagen = imagen
        if (imagen){
            const uploadRes = await cloudinary.uploader.upload(imagen, {
                upload_preset: "servicios-qd935gt5"
            })
            urlImagen = uploadRes.secure_url
        }
        
        const newServicio = new Servicio({
            idServicio : id, nombre, imagen: urlImagen, precio, duracion, descripcion, idCategoria
        })

        const servicioEdited = await newServicio.editServicioById()

        res.json({
            nombre : servicioEdited.nombre,
            image: servicioEdited.imagen,
            categoria : servicioEdited.categoria,
            precio : servicioEdited.precio,
            duracion : servicioEdited.duracion,
            descripcion : servicioEdited.descripcion
        })

    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const deleteServicio = async (req, res) => {
    const id = req.params.id

    try {
        const newServicio = new Servicio({idServicio : id})
        const deletedServicio = await newServicio.deleteServicioById()
        if (deletedServicio.affectedRows == 0) return res.status(500).json(["No se pudo eliminar el servicio indicado"])

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).json([error.message]);
    }
}