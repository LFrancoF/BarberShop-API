import { Usuario } from '../models/usuarioModel.js'
import { Barbero } from '../models/barberoModel.js'
import { Cliente } from '../models/clienteModel.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from "../config.js"
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

        //verify if email already exists
        if (userSaved == "El email ingresado ya existe") return res.status(409).json([userSaved]);

        newUser.idUsuario = userSaved.idUsuario

        //create token for user
        const token = await createAccesToken({id : userSaved.idUsuario})
        res.cookie('token', token)

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
                await newUser.deleteUsuarioByIdUsuario()
                return res.status(400).json(["Ingrese una especialidad"]);
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

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        
        const newUser = new Usuario({
            email
        })

        const userFound = await newUser.getUsuarioByEmail()

        if (!userFound) return res.status(400).json(["Email incorrecto"])

        const passMatched = await bcrypt.compare(password, userFound.password)

        if (!passMatched) return res.status(400).json(["Contraseña incorrecta"])

        //create token for user
        const token = await createAccesToken({id : userFound.idUsuario})
        res.cookie('token', token, {httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000})

        //Get idBarber or idClient
        const userWithRol = new Usuario({
            idUsuario: userFound.idUsuario
        })

        if (userFound.rol == "Barbero"){
            const userIdBarber = await userWithRol.getIdBarber()
            return res.json({
                id : userFound.idUsuario,
                idBarbero : userIdBarber.idBarbero,
                nombre : userFound.nombre,
                apellido : userFound.apellido,
                telefono : userFound.telefono,
                email : userFound.email,
                rol : userFound.rol,
                token : token
            })
        }

        if (userFound.rol == "Cliente"){
            const userIdClient = await userWithRol.getIdClient()
            return res.json({
                id : userFound.idUsuario,
                idCliente : userIdClient.idCliente,
                nombre : userFound.nombre,
                apellido : userFound.apellido,
                telefono : userFound.telefono,
                email : userFound.email,
                rol : userFound.rol,
                token : token
            })
        }

        res.json({
            id : userFound.idUsuario,
            nombre : userFound.nombre,
            apellido : userFound.apellido,
            telefono : userFound.telefono,
            email : userFound.email,
            rol : userFound.rol,
            token : token
        })
        
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const logout = (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    })
    return res.sendStatus(200);
}

export const verifyToken = (req, res) => {
    const { token } = req.cookies
    if (!token) return res.status(401).json(["Sin autorizacion"])

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json(["No tiene autorizacion"])
        const newUser = new Usuario( {idUsuario : user.id})
        const userFound = await newUser.getUsuarioById()
        if (!userFound) return res.status(401).json(["Usuario no autorizado"])
        res.json({
            id : userFound.idUsuario,
            nombre : userFound.nombre,
            apellido : userFound.apellido,
            telefono : userFound.telefono,
            email : userFound.email,
            rol : userFound.rol
        })
    })
}

export const profile = async (req, res) => {
    try {

        //get id from decoded token in middleware to find user
        const id = req.user.id

        const newUser = new Usuario({
            idUsuario : id
        })

        const userFound = await newUser.getUsuarioById()
        if (!userFound) return res.status(400).json(["Usuario no encontrado"])

        return res.json({
            id : userFound.idUsuario,
            rol : userFound.idRol,
            nombre : userFound.nombre,
            apellido : userFound.apellido,
            email : userFound.email,
            telefono : userFound.telefono
        })

    } catch (error) {
        res.status(500).json([error.message]);
    }
}