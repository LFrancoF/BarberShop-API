import { Usuario } from '../models/usuarioModel.js'
import { Barbero } from '../models/barberoModel.js'
import { Cliente } from '../models/clienteModel.js'
import bcrypt from "bcryptjs"

export const getUsers = async (req, res) => {
    try {
        const user = new Usuario()
        const allUsers = await user.getUsuarios()
        res.json(allUsers)
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const createUser = async (req, res) => {
    const {nombre, apellido, email, telefono, password, idRol} = req.body

    try {
        //encrypt password
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new Usuario({
            email, nombre, apellido, telefono, password: passwordHash, idRol
        })

        const userSaved = await newUser.createUsuario()

        //verify if email already exists
        if (userSaved == "El email ingresado ya existe") return res.status(409).json([userSaved]);

        newUser.idUsuario = userSaved.idUsuario

        //if role is Admin send user data
        if (idRol == 1){
            res.json({
                id : userSaved.idUsuario,
                nombre : userSaved.nombre,
                apellido : userSaved.apellido,
                email : userSaved.email,
                telefono : userSaved.telefono,
                rol : "Administrador",
            })
        }

        //if Role is Barber, create a Barber subClass instance
        if (idRol == 2){
            if (!req.body.especialidad){
                req.body.especialidad = "sin especialidad"
            } 
            const newBarber = new Barbero({
                especialidad: req.body.especialidad, idUsuario: newUser.idUsuario
            })
            const barberSaved = await newBarber.createBarbero()
            res.json({
                id : userSaved.idUsuario,
                nombre : userSaved.nombre,
                apellido : userSaved.apellido,
                email : userSaved.email,
                telefono : userSaved.telefono,
                rol : "Barbero",
                especialidad : barberSaved.especialidad
            })
        }

        //if Role is Client, create a Client subClass instance
        if (idRol == 3){
            const newClient = new Cliente({
                preferencia: req.body.preferencia, idUsuario: newUser.idUsuario
            })
            const clienteSaved = await newClient.createCliente()
            res.json({
                id : userSaved.idUsuario,
                nombre : userSaved.nombre,
                apellido : userSaved.apellido,
                email : userSaved.email,
                telefono : userSaved.telefono,
                rol : "Cliente",
                preferencia : clienteSaved.preferencia
            })
        }
    } catch (error) {
        res.status(500).json([error.message]);
    }
    
}

export const getUser = async (req, res) => {
    const id = req.params.id

    try {
        const newUser = new Usuario({idUsuario : id})
        const userFound = await newUser.getUsuarioById()
        if (!userFound) return res.status(400).json(["Usuario no encontrado"])

        res.json({
            idUsuario : userFound.idUsuario,
            nombre : userFound.nombre,
            apellido : userFound.apellido,
            telefono : userFound.telefono,
            email : userFound.email,
            creado_en : userFound.created_at,
            editado_en : userFound.updated_at,
            idRol : userFound.idRol,
            rol : userFound.rol
        })
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const editUser = async (req, res) => {
    const id = req.params.id
    const {nombre, apellido, email, telefono} = req.body
    try {

        //create a User instance to edit in DB
        const newUser = new Usuario({
            idUsuario : id, email, nombre, apellido, telefono
        })

        const userEdited = await newUser.editUsuarioById()

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id

    try {

        const newUser = new Usuario({idUsuario : id})
        const userFound = await newUser.getUsuarioById()
        if (!userFound) return res.status(400).json(["Usuario no encontrado"])

        //if user is Client, delete the specific client row from DB
        if (userFound.idRol == 3){
            const newClient = new Cliente({idUsuario : id})
            const deletedClient = await newClient.deleteClienteByIdUsuario()
            if (deletedClient.affectedRows == 0) return res.status(500).json(["No se pudo eliminar el cliente indicado"])
        }

        //if user is Barber, delete the specific barber row from DB
        if (userFound.idRol == 2){
            const newBarber = new Barbero({idUsuario : id})
            const deletedBarber = await newBarber.deleteBarberoByIdUsuario()
            if (deletedBarber.affectedRows == 0) return res.status(500).json(["No se pudo eliminar el barbero"])
        }
        
        const deletedUser = await newUser.deleteUsuarioByIdUsuario()
        if (deletedUser.affectedRows == 0) return res.status(500).json(["No se pudo eliminar la cuenta de usuario indicada"])

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).json([error.message]);
    }
}