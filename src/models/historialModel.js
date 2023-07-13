import {pool} from '../db.js'

export let Historial = class{
    constructor({idHistorial, fecha, hora, estado, nota, idBarbero, idCliente, idCita} = {}){
        this.idHistorial = idHistorial;
        this.fecha = fecha;
        this.hora = hora;
        this.estado = estado;
        this.nota = nota;
        this.idBarbero = idBarbero;
        this.idCliente = idCliente;
        this.idCita = idCita;
    }

    async createHistorial(){
        try {
            const query = 'INSERT INTO historial (fecha, hora, nota, estado, idCliente, idBarbero, idCita) VALUES (?,?,?,?,?,?,?)';
            const values = [this.fecha, this.hora, this.nota, this.estado, this.idCliente, this.idBarbero, this.idCita]
            const [result] = await pool.query(query, values)

            //return created register
            const queryID =   'SELECT idCita, estado '
                            + 'FROM historial '
                            + 'WHERE idHistorial = ?';
            const [historialSaved] = await pool.query(queryID, [result.insertId]);
            return historialSaved[0];
        } catch (error) {
            throw new Error('Error al crear el historial: ' + error.message);
        }
    }

    async deleteHistorialByIdCita(){
        try {
        const query = 'DELETE FROM historial WHERE idCita = ?';
        const values = [this.idCita]
        const [deleted] = await pool.query(query, values)
        return deleted;
        } catch (error) {
            throw new Error(['Error al eliminar el historial: ' + error.message]);
        }
    }

}