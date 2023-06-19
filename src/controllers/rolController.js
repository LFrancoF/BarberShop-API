import { Rol } from '../models/rolModel.js'

export const getRoles = async (req, res) => {
    const role = new Rol()
    const allRoles = await role.getRoles()
    res.json(allRoles)
}

export const createRole = async (req, res) => {
    const {nombre, descripcion} = req.body
    try {

        const newRole = new Rol({
            nombre, descripcion
        })

        const roleSaved = await newRole.createRol()

        res.json({
            nombre : roleSaved.nombre,
            descripcion : roleSaved.descripcion
        })

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const getRole = async (req, res) => {
    const id = req.params.id

    try {
        const newRole = new Rol({idRol : id})
        const roleFound = await newRole.getRolById()
        if (!roleFound) return res.status(400).json({message : "Rol no encontrado"})

        res.json({
            nombre : roleFound.nombre,
            descripcion : roleFound.descripcion
        })
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const editRole = async (req, res) => {
    const id = req.params.id
    const {nombre, descripcion} = req.body
    try {
        
        const newRole = new Rol({
            idRol : id, nombre, descripcion
        })

        const roleEdited = await newRole.editRolById()

        res.json({
            nombre : roleEdited.nombre,
            descripcion : roleEdited.descripcion
        })

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const deleteRole = async (req, res) => {
    const id = req.params.id

    try {
        const newRole = new Rol({idRol : id})
        const deletedRole = await newRole.deleteRolById()
        if (!deletedRole) return res.status(500).json({message : "No se pudo eliminar el rol"})

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}