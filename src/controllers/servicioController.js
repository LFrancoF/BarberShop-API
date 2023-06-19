import { Servicio } from '../models/servicioModel.js'

export const getServicios = async (req, res) => {
    const servicio = new Servicio()
    const allServicios = await servicio.getServicios()
    res.json(allServicios)
}

export const createServicio = async (req, res) => {
    const {nombre, precio, duracion, descripcion, idCategoria} = req.body
    try {

        const newServicio = new Servicio({
            nombre, precio, duracion, descripcion, idCategoria
        })

        const servicioSaved = await newServicio.createServicio()

        res.json({
            nombre : servicioSaved.nombre,
            categoria : servicioSaved.categoria,
            precio : servicioSaved.precio,
            duracion : servicioSaved.duracion,
            descripcion : servicioSaved.descripcion
        })

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const getServicio = async (req, res) => {
    const id = req.params.id

    try {
        const newServicio = new Servicio({idServicio : id})
        const servicioFound = await newServicio.getServicioById()
        if (!servicioFound) return res.status(400).json({message : "Servicio no encontrado"})

        res.json({
            nombre : servicioFound.nombre,
            categoria : servicioFound.categoria,
            precio : servicioFound.precio,
            duracion : servicioFound.duracion,
            descripcion : servicioFound.descripcion
        })
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const editServicio = async (req, res) => {
    const id = req.params.id
    const {nombre, precio, duracion, descripcion, idCategoria} = req.body
    try {
        
        const newServicio = new Servicio({
            idServicio : id, nombre, precio, duracion, descripcion, idCategoria
        })

        const servicioEdited = await newServicio.editServicioById()

        res.json({
            nombre : servicioEdited.nombre,
            categoria : servicioEdited.categoria,
            precio : servicioEdited.precio,
            duracion : servicioEdited.duracion,
            descripcion : servicioEdited.descripcion
        })

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const deleteServicio = async (req, res) => {
    const id = req.params.id

    try {
        const newServicio = new Servicio({idServicio : id})
        const deletedServicio = await newServicio.deleteServicioById()
        if (deletedServicio.affectedRows == 0) return res.status(500).json({message : "No se pudo eliminar el servicio indicado"})

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}