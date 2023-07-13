import { Usuario } from '../models/usuarioModel.js'
import { Barbero } from '../models/barberoModel.js'
import bcrypt from "bcryptjs"

export const getBarbers = async (req, res) => {
    try {
        const barber = new Barbero()
        const allBarbers = await barber.getBarberos()
        res.json(allBarbers)
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const createBarber = async (req, res) => {
    const {nombre, apellido, email, telefono, password} = req.body
    try {
        //encrypt password
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new Usuario({
            email, nombre, apellido, telefono, password: passwordHash, idRol : 2
        })

        const userSaved = await newUser.createUsuario()
        newUser.idUsuario = userSaved.idUsuario

        if (!req.body.especialidad) return res.status(500).json(["No se pudo crear barbero, no hay especialidad"])
        //create a Barber instance to insert in DB
        const newBarber = new Barbero({
            especialidad: req.body.especialidad, idUsuario: newUser.idUsuario
        })
        const barberoSaved = await newBarber.createBarbero()
        res.json({
            id : userSaved.idUsuario,
            nombre : userSaved.nombre,
            apellido : userSaved.apellido,
            email : userSaved.email,
            especialidad : barberoSaved.especialidad
        })

    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const getBarber = async (req, res) => {
    const id = req.params.id

    try {
        const newBarber = new Barbero({idUsuario : id})
        const barberFound = await newBarber.getBarberoByIdUsuario()
        if (!barberFound) return res.status(400).json(["Barbero no encontrado"])

        res.json({
            id : barberFound.idUsuario,
            nombre : barberFound.nombre,
            apellido : barberFound.apellido,
            telefono : barberFound.telefono,
            email : barberFound.email,
            creado_en : barberFound.created_at,
            especialidad : barberFound.especialidad
        })
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const editBarber = async (req, res) => {
    const id = req.params.id
    const {nombre, apellido, email, telefono, especialidad} = req.body
    try {

        //create a User instance to edit in DB
        const newUser = new Usuario({
            idUsuario : id, email, nombre, apellido, telefono
        })

        const userEdited = await newUser.editUsuarioById()

        //then, create a Barber instance to edit in DB
        const newBarber = new Barbero({
            idUsuario: id, especialidad
        })
        const barberEdited = await newBarber.editBarberoByIdUsuario()
        res.json({
            id : userEdited.idUsuario,
            nombre : userEdited.nombre,
            apellido : userEdited.apellido,
            email : userEdited.email,
            editado_en : userEdited.updated_at,
            especialidad : barberEdited.especialidad
        })

    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const deleteBarber = async (req, res) => {
    const id = req.params.id

    try {
        const newBarber = new Barbero({idUsuario : id})
        const deletedBarber = await newBarber.deleteBarberoByIdUsuario()
        if (deletedBarber.affectedRows == 0) return res.status(500).json(["No se pudo eliminar el barbero"])

        const newUser = new Usuario({idUsuario : id})
        const deletedUser = await newUser.deleteUsuarioByIdUsuario()
        if (deletedUser.affectedRows == 0) return res.status(500).json(["No se pudo eliminar la cuenta de usuario"])

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).json([error.message]);
    }
}