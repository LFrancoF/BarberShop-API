import { Cita } from '../models/citaModel.js'
import { Historial } from '../models/historialModel.js'
import moment from 'moment'

export const getAllCitas = async (req, res) => {
    try {
        const cita = new Cita()
        const allCitas = await cita.getAllCitas()
        res.json(allCitas)
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const getMyCitas = async (req, res) => {
    try {
        const {id, user} = req.params
        let cita
        if (user == "Cliente"){
            cita = new Cita({idCliente: id})
        }else{//Barbero
            cita = new Cita({idBarbero: id})
        }
        const MyCitas = await cita.getMyCitas()
        res.json(MyCitas)
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const getCita = async (req, res) => {
    const id = req.params.id

    try {
        const newCita = new Cita({idCita : id})
        const citaFound = await newCita.getCitaById()
        if (!citaFound) return res.status(400).json(["Cita no encontrada"])

        res.json(citaFound)
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const createCita = async (req, res) => {
    const {fecha, hora, nota, estado, costo, idCliente, idBarbero, idServicio, idForm} = req.body
    
    try {

        const newCita = new Cita({
            fecha, hora, estado, nota, costo, idCliente, idBarbero, idServicio, idForm
        })

        const citaSaved = await newCita.createCita()

        const newHistorial = new Historial({
            fecha, hora, estado, nota, idBarbero, idCliente, idCita: citaSaved.idCita
        })

        const historialSaved = await newHistorial.createHistorial()

        res.json({
            idCita : citaSaved.idCita,
            cliente: citaSaved.cliente,
            barbero: citaSaved.barbero,
            servicio: citaSaved.servicio,
            fecha: citaSaved.fecha,
            hora: citaSaved.hora,
            estado : historialSaved.estado,
            message : "cita creada" 
        })

    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const editCita = async (req, res) => {
    const id = req.params.id
    const {nota, estado} = req.body
    try {
        
        const newCita = new Cita({
            idCita : id, nota, estado
        })

        newCita.editCitaById()

        //get all columns from edited cita
        const cita = new Cita({idCita : id})
        const citaEdited = await cita.getCitaById()

        //create a new register from historial
        let fecha = moment().format('YYYY-MM-DD')
        const hora = moment().format('HH:mm');

        const newHistorial = new Historial({
            fecha, hora, estado, nota, idBarbero: citaEdited.idBarbero, idCliente: citaEdited.idCliente, idCita: id
        })

        const historialSaved = await newHistorial.createHistorial()
        res.json(historialSaved)

    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const deleteCita = async (req, res) => {
    const id = req.params.id

    try {

        const newHistorial = new Historial({idCita : id})
        const deletedHistorial = await newHistorial.deleteHistorialByIdCita()
        if (deletedHistorial.affectedRows == 0) return res.status(500).json([ "No se pudo eliminar el historial de la cita indicada"])

        const newCita = new Cita({idCita : id})
        const deletedCita = await newCita.deleteCitaById()
        if (deletedCita.affectedRows == 0) return res.status(500).json([ "No se pudo eliminar la cita"])

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).json([error.message]);
    }
}