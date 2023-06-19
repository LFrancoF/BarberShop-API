import {pool} from '../db.js'
import { Usuario } from "./usuarioModel.js"

export let Cliente = class extends Usuario{
    constructor( {idUsuario, preferencia} = {} ){
        super({idUsuario})
        this.preferencia = preferencia
    }

    async createCliente(){
        try {
            const query = 'INSERT INTO cliente (preferencia, idUsuario) VALUES (?,?)';
            const values = [this.preferencia, this.idUsuario]
            const [result] = await pool.query(query, values)

            //return created register
            const queryID = 'SELECT * FROM cliente WHERE idCliente = ?';
            const [clientSaved] = await pool.query(queryID, [result.insertId]);
            return clientSaved[0];
        } catch (error) {
            throw new Error('Error al crear el cliente: ' + error.message);
        }
    }

    async getClientes(){
        try {
            const query = 'SELECT u.idUsuario, u.nombre as nombre, u.apellido, u.telefono, u.email, r.nombre as rol, c.preferencia '
                        +'FROM cliente c '
                        +'JOIN usuario u ON c.idUsuario = u.idUsuario '
                        +'JOIN rol r ON u.idRol = r.idRol'
            const [result] = await pool.query(query)
            return result;
            
        } catch (error) {
            throw new Error('Error al obtener los clientes: ' + error.message);
        }
    }
    
    async getClienteByIdUsuario(){
        try {
            const query = 'SELECT u.idUsuario, u.nombre as nombre, u.apellido, u.telefono, u.email, u.created_at, r.nombre as rol, c.preferencia '
                        +'FROM cliente c '
                        +'JOIN usuario u ON c.idUsuario = u.idUsuario '
                        +'JOIN rol r ON u.idRol = r.idRol '
                        +'WHERE c.idUsuario = ?';
            const values = [this.idUsuario]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error('Error al obtener el cliente: ' + error.message);
        }
    }

    async editClienteByIdUsuario(){
        try {
            const query = 'UPDATE cliente SET preferencia=? WHERE idUsuario=?';
            const values = [this.preferencia, this.idUsuario]
            await pool.query(query, values)

            //return edited register
            const queryID = 'SELECT * FROM cliente WHERE idUsuario = ?';
            const [clientEdited] = await pool.query(queryID, [this.idUsuario]);
            return clientEdited[0];
        } catch (error) {
            throw new Error('Error al editar el cliente: ' + error.message);
        }
    }

    async deleteClienteByIdUsuario(){
        try {
            const query = 'DELETE FROM cliente WHERE idUsuario = ?';
            const values = [this.idUsuario]
            const [deleted] = await pool.query(query, values)
            return deleted;
        } catch (error) {
            throw new Error('Error al eliminar el cliente: ' + error.message);
        }
        
    }

}