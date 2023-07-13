import {pool} from '../db.js'

export let Cita = class{
    constructor({idCita, fecha, hora, estado, nota, costo, idCliente, idBarbero, idServicio, idForm} = {}){
        this.idCita = idCita;
        this.fecha = fecha;
        this.estado = estado;
        this.hora = hora;
        this.nota = nota;
        this.costo = costo;
        this.idCliente = idCliente;
        this.idBarbero = idBarbero;
        this.idServicio = idServicio;
        this.idForm = idForm;
    }

    async createCita(){
        try {
            const query = 'INSERT INTO cita (fecha, hora, estado, nota, costo, idCliente, idBarbero, idServicio, idForm) VALUES (?,?,?,?,?,?,?,?,?)';
            const values = [this.fecha, this.hora, this.estado, this.nota, this.costo, this.idCliente, this.idBarbero, this.idServicio, this.idForm]
            const [result] = await pool.query(query, values)

            //return created register
            const queryID =   'SELECT c.idCita, c.fecha, c.hora, ucliente.nombre as cliente, ubarbero.nombre as barbero, s.nombre as servicio, c.idForm as form_recomendacion '
                        + 'FROM cita c '
                        + 'JOIN cliente cl ON c.idCliente = cl.idCliente '
                        + 'JOIN barbero b ON c.idBarbero = b.idBarbero '
                        + 'JOIN usuario ucliente ON cl.idUsuario = ucliente.idUsuario '
                        + 'JOIN usuario ubarbero ON b.idUsuario = ubarbero.idUsuario '
                        + 'JOIN servicio s ON c.idServicio = s.idServicio '
                        + 'WHERE c.idCita = ?';
            const [citaSaved] = await pool.query(queryID, [result.insertId]);
            return citaSaved[0];
        } catch (error) {
            throw new Error(['Error al crear la cita: ' + error.message]);
        }
    }

    async getAllCitas(){
        try {
            const query = 'SELECT c.idCita, c.estado, c.fecha, c.hora, CONCAT(ucliente.nombre, " " , ucliente.apellido) as cliente, b.idBarbero, CONCAT(ubarbero.nombre, " " , ubarbero.apellido) as barbero, s.nombre as servicio, c.idForm as form_recomendacion '
                        + 'FROM cita c '
                        + 'JOIN cliente cl ON c.idCliente = cl.idCliente '
                        + 'JOIN barbero b ON c.idBarbero = b.idBarbero '
                        + 'JOIN usuario ucliente ON cl.idUsuario = ucliente.idUsuario '
                        + 'JOIN usuario ubarbero ON b.idUsuario = ubarbero.idUsuario '
                        + 'JOIN servicio s ON c.idServicio = s.idServicio';
            const [result] = await pool.query(query)
            return result;
            
        } catch (error) {
            throw new Error('Error al obtener las citas: ' + error.message);
        }
    }

    async getMyCitas(){
        try {
            let query = 'SELECT c.idCita, c.estado, c.fecha, c.hora, CONCAT(ucliente.nombre, " " , ucliente.apellido) as cliente, b.idBarbero, CONCAT(ubarbero.nombre, " " , ubarbero.apellido) as barbero, s.nombre as servicio, c.idForm as form_recomendacion '
                        + 'FROM cita c '
                        + 'JOIN cliente cl ON c.idCliente = cl.idCliente '
                        + 'JOIN barbero b ON c.idBarbero = b.idBarbero '
                        + 'JOIN usuario ucliente ON cl.idUsuario = ucliente.idUsuario '
                        + 'JOIN usuario ubarbero ON b.idUsuario = ubarbero.idUsuario '
                        + 'JOIN servicio s ON c.idServicio = s.idServicio ';
            //If user is a Client
            let values;
            if (this.idCliente){
                query +=  'WHERE cl.idUsuario = ?';
                values = [this.idCliente]
            }else{//If user is a barber
                query +=  'WHERE b.idUsuario = ?';
                values = [this.idBarbero]
            }
            
            const [result] = await pool.query(query, values)
            return result;
            
        } catch (error) {
            throw new Error('Error al obtener mis citas: ' + error.message);
        }
    }

    async getCitaById(){
        try {
            const query = 'SELECT c.idCita, c.estado, c.fecha, c.hora, c.nota, c.costo, cl.idCliente, CONCAT(ucliente.nombre, " " , ucliente.apellido) as cliente, b.idBarbero, CONCAT(ubarbero.nombre, " " , ubarbero.apellido) as barbero, s.nombre as servicio, c.idForm as form_recomendacion '
                        + 'FROM cita c '
                        + 'JOIN cliente cl ON c.idCliente = cl.idCliente '
                        + 'JOIN barbero b ON c.idBarbero = b.idBarbero '
                        + 'JOIN usuario ucliente ON cl.idUsuario = ucliente.idUsuario '
                        + 'JOIN usuario ubarbero ON b.idUsuario = ubarbero.idUsuario '
                        + 'JOIN servicio s ON c.idServicio = s.idServicio '
                        + 'WHERE c.idCita = ?';
            const values = [this.idCita]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error('Error al obtener la cita: ' + error.message);
        }
    }

    async editCitaById(){
        try {
            
            const query = 'UPDATE cita SET nota=?, estado=? WHERE idCita = ?';
            const values = [this.nota, this.estado, this.idCita]
            await pool.query(query, values)
        } catch (error) {
            throw new Error('Error al editar la cita: ' + error.message);
        }
    }

    async deleteCitaById(){
        try {
            const query = 'DELETE FROM cita WHERE idCita = ?';
            const values = [this.idCita]
            const [deleted] = await pool.query(query, values)
            return deleted;
        } catch (error) {
            throw new Error('Error al eliminar el servicio: ' + error.message);
        }
    }

}