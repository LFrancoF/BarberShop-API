import { Usuario } from '../models/usuarioModel.js'
import { Cliente } from '../models/clienteModel.js'
import bcrypt from "bcryptjs"

export const getClients = async (req, res) => {
    const client = new Cliente()
    const allClients = await client.getClientes()
    res.json(allClients)
}

export const createClient = async (req, res) => {
    const {nombre, apellido, email, telefono, password} = req.body
    try {
        //encrypt password
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new Usuario({
            email, nombre, apellido, telefono, password: passwordHash, idRol : 3
        })

        const userSaved = await newUser.createUsuario()
        newUser.idUsuario = userSaved.idUsuario

        //create a Client instance to insert in DB
        const newClient = new Cliente({
            preferencia: req.body.preferencia, idUsuario: newUser.idUsuario
        })
        const clienteSaved = await newClient.createCliente()
        res.json({
            id : userSaved.idUsuario,
            nombre : userSaved.nombre,
            apellido : userSaved.apellido,
            email : userSaved.email,
            preferencia : clienteSaved.preferencia
        })

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const getClient = async (req, res) => {
    const id = req.params.id

    try {
        const newClient = new Cliente({idUsuario : id})
        const clientFound = await newClient.getClienteByIdUsuario()
        if (!clientFound) return res.status(400).json({message : "Cliente no encontrado"})

        res.json({
            id : clientFound.idUsuario,
            nombre : clientFound.nombre,
            apellido : clientFound.apellido,
            telefono : clientFound.telefono,
            email : clientFound.email,
            creado_en : clientFound.created_at,
            preferencia : clientFound.preferencia
        })
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const editClient = async (req, res) => {
    const id = req.params.id
    const {nombre, apellido, email, telefono, preferencia} = req.body
    try {

        //create a User instance to edit in DB
        const newUser = new Usuario({
            idUsuario : id, email, nombre, apellido, telefono
        })

        const userEdited = await newUser.editUsuarioById()

        //then, create a Client instance to edit in DB
        const newClient = new Cliente({
            idUsuario: id, preferencia
        })
        const clientEdited = await newClient.editClienteByIdUsuario()
        res.json({
            id : userEdited.idUsuario,
            nombre : userEdited.nombre,
            apellido : userEdited.apellido,
            email : userEdited.email,
            editado_en : userEdited.updated_at,
            preferencia : clientEdited.preferencia
        })

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const deleteClient = async (req, res) => {
    const id = req.params.id

    try {
        const newClient = new Cliente({idUsuario : id})
        const deletedClient = await newClient.deleteClienteByIdUsuario()
        if (!deletedClient) return res.status(500).json({message : "No se pudo eliminar el cliente"})

        const newUser = new Usuario({idUsuario : id})
        const deletedUser = await newUser.deleteUsuarioByIdUsuario()
        if (!deletedUser) return res.status(500).json({message : "No se pudo eliminar la cuenta de usuario"})

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}