import { Usuario } from '../models/usuarioModel.js'
import { Barbero } from '../models/barberoModel.js'
import { Cliente } from '../models/clienteModel.js'
import bcrypt from "bcryptjs"
import { createAccesToken } from "../libs/jwt.js"

export const register = async (req, res) => {
    const {nombre, apellido, email, telefono, password, idRol} = req.body

    try {
        //encrypt password
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new Usuario({
            email, nombre, apellido, telefono, password: passwordHash, idRol
        })

        const userSaved = await newUser.createUsuario()

        newUser.idUsuario = userSaved.idUsuario
        //if Role is Barber, create a Barber subClass instance
        if (idRol == 2 && req.body.especialidad){
            const newBarber = new Barbero({
                especialidad: req.body.especialidad, idUsuario: newUser.idUsuario
            })
            const barberSaved = await newBarber.createBarbero()
        }

        //if Role is Client, create a Client subClass instance
        if (idRol == 3){
            const newClient = new Cliente({
                preferencia: req.body.preferencia, idUsuario: newUser.idUsuario
            })
            const clienteSaved = await newClient.createCliente()
        }

        //create token for user
        const token = await createAccesToken({id : userSaved.idUsuario})
        res.cookie('token', token)
        
        res.json({
            id : userSaved.idUsuario,
            nombre : userSaved.nombre,
            apellido : userSaved.apellido,
            email : userSaved.email
        })
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
    
}

export const login = async (req, res) => {
    const {email, password} = req.body

    try {

        const newUser = new Usuario({
            email
        })

        const userFound = await newUser.getUsuarioByEmail()

        if (!userFound) return res.status(400).json({message : "Email incorrecto"})

        const passMatched = await bcrypt.compare(password, userFound.password)

        if (!passMatched) return res.status(400).json({message : "Contraseña incorrecta"})

        //create token for user
        const token = await createAccesToken({id : userFound.idUsuario})
        res.cookie('token', token)

        //if Admin rol, get the userFound data
        if (userFound.idRol == 1) {
            res.json({
                id :userFound.idUsuario,
                nombre : userFound.nombre,
                apellido : userFound.apellido,
                telefono : userFound.telefono,
                email : userFound.email,
                rol : 'Administrador'
            })
        }

        newUser.idUsuario = userFound.idUsuario
        //if Role is Client, get the Client subClass instance
        if (userFound.idRol == 3){
            const newClient = new Cliente({
                idUsuario : newUser.idUsuario
            })
            const clienteFound = await newClient.getClienteByIdUsuario()
            res.json({
                id : clienteFound.idUsuario,
                nombre : clienteFound.nombre,
                apellido : clienteFound.apellido,
                telefono : clienteFound.telefono,
                email : clienteFound.email,
                rol : clienteFound.rol,
                preferencia : clienteFound.preferencia
            })
        }

        //if Role is Barber, get the Barber subClass instance
        if (userFound.idRol == 2){
            const newBarber = new Barbero({
                idUsuario : newUser.idUsuario
            })
            const barberFound = await newBarber.getBarberoById()
            res.json({
                id : barberFound.idUsuario,
                nombre : barberFound.nombre,
                apellido : barberFound.apellido,
                telefono : barberFound.telefono,
                email : barberFound.email,
                rol : barberFound.rol,
                especialidad : barberFound.especialidad
            })
        }
        
    } catch (error) {
        res.status(500).json({ message : "Error en: " + error.message });
    }
}

export const logout = (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    })
    return res.sendStatus(200);
}

export const profile = async (req, res) => {
    try {

        //get id from decoded token in middleware to find user
        const id = req.user.id

        const newUser = new Usuario({
            idUsuario : id
        })

        const userFound = await newUser.getUsuarioById()
        if (!userFound) return res.status(400).json({message : "Usuario no encontrado"})

        return res.json({
            id : userFound.idUsuario,
            rol : userFound.idRol,
            nombre : userFound.nombre,
            apellido : userFound.apellido,
            email : userFound.email,
            telefono : userFound.telefono
        })

    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}