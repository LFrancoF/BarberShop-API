import {pool} from '../db.js'

export let FormRecomendacion = class{
    constructor({idForm, imagen, fecha, hora, idCategoria, idCliente} = {}){
        this.idForm = idForm;
        this.imagen = imagen;
        this.fecha = fecha;
        this.hora = hora;
        this.idCategoria = idCategoria;
        this.idCliente = idCliente;
    }

    async createFormRecomendacion(){
        try {
            const query = 'INSERT INTO formrecomendacion (imagen, fecha, hora, idCategoria, idCliente) VALUES (?,?,?,?,?)';
            const values = [this.imagen, this.fecha, this.hora, this.idCategoria, this.idCliente]
            const [result] = await pool.query(query, values)

            //return created register
            const queryID =   'SELECT * '
                            + 'FROM formrecomendacion '
                            + 'WHERE idForm = ?';
            const [formSaved] = await pool.query(queryID, [result.insertId]);
            return formSaved[0];
        } catch (error) {
            throw new Error('Error al crear el formRecomendacion: ' + error.message);
        }
    }

}