import { Categoria } from '../models/categoriaModel.js'

export const getCategorias = async (req, res) => {
    const categoria = new Categoria()
    const allCategorias = await categoria.getCategorias()
    res.json(allCategorias)
}

export const createCategoria = async (req, res) => {
    const {nombre, descripcion} = req.body
    try {

        const newCategoria = new Categoria({
            nombre, descripcion
        })

        const categoriaSaved = await newCategoria.createCategoria()

        res.json({
            nombre : categoriaSaved.nombre,
            descripcion : categoriaSaved.descripcion
        })

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const getCategoria = async (req, res) => {
    const id = req.params.id

    try {
        const newCategoria = new Categoria({idCategoria : id})
        const categoriaFound = await newCategoria.getCategoriaById()
        if (!categoriaFound) return res.status(400).json({message : "Categoria no encontrada"})

        res.json({
            nombre : categoriaFound.nombre,
            descripcion : categoriaFound.descripcion
        })
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const editCategoria = async (req, res) => {
    const id = req.params.id
    const {nombre, descripcion} = req.body
    try {
        
        const newCategoria = new Categoria({
            idCategoria : id, nombre, descripcion
        })

        const categoriaEdited = await newCategoria.editCategoriaById()

        res.json({
            nombre : categoriaEdited.nombre,
            descripcion : categoriaEdited.descripcion
        })

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const deleteCategoria = async (req, res) => {
    const id = req.params.id

    try {
        const newCategoria = new Categoria({idCategoria : id})
        const deletedCategoria = await newCategoria.deleteCategoriaById()

        if (deletedCategoria.affectedRows == 0) return res.status(500).json({message : "No se pudo eliminar la categoria indicada"})

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}