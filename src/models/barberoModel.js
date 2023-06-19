import {pool} from '../db.js'
import { Usuario } from "./usuarioModel.js"

export let Barbero = class extends Usuario{
    constructor({idUsuario, especialidad} = {}){
        super({idUsuario})
        this.especialidad = especialidad;
    }

    async createBarbero(){
        try {
            const query = 'INSERT INTO barbero (especialidad, idUsuario) VALUES (?,?)';
            const values = [this.especialidad, this.idUsuario]
            const [result] = await pool.query(query, values)

            //return created register
            const queryID = 'SELECT * FROM barbero WHERE idBarbero = ?';
            const [barberSaved] = await pool.query(queryID, [result.insertId]);
            return barberSaved[0];
        } catch (error) {
            throw new Error('Error al crear el barbero: ' + error.message);
        }
    }

    async getBarberos(){
        try {
            const query = 'SELECT u.idUsuario, u.nombre as nombre, u.apellido, u.telefono, u.email, r.nombre as rol, b.especialidad '
                        +'FROM barbero b '
                        +'JOIN usuario u ON b.idUsuario = u.idUsuario '
                        +'JOIN rol r ON u.idRol = r.idRol'
            const [result] = await pool.query(query)
            return result;
            
        } catch (error) {
            throw new Error('Error al obtener los barberos: ' + error.message);
        }
    }

    async getBarberoById(){
        try {
            const query = 'SELECT u.idUsuario, u.nombre as nombre, u.apellido, u.telefono, u.email, r.nombre as rol, b.especialidad '
                        +'FROM barbero b '
                        +'JOIN usuario u ON b.idUsuario = u.idUsuario '
                        +'JOIN rol r ON u.idRol = r.idRol '
                        +'WHERE b.idUsuario = ?';
            const values = [this.idUsuario]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error('Error al obtener el barbero: ' + error.message);
        }
    }

    async getBarberoByIdUsuario(){
        try {
            const query = 'SELECT u.idUsuario, u.nombre as nombre, u.apellido, u.telefono, u.email, u.created_at, r.nombre as rol, b.especialidad '
                        +'FROM barbero b '
                        +'JOIN usuario u ON b.idUsuario = u.idUsuario '
                        +'JOIN rol r ON u.idRol = r.idRol '
                        +'WHERE b.idUsuario = ?';
            const values = [this.idUsuario]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error('Error al obtener el barbero: ' + error.message);
        }
    }

    async editBarberoByIdUsuario(){
        try {
            const query = 'UPDATE barbero SET especialidad=? WHERE idUsuario=?';
            const values = [this.especialidad, this.idUsuario]
            await pool.query(query, values)

            //return edited register
            const queryID = 'SELECT * FROM barbero WHERE idUsuario = ?';
            const [barberEdited] = await pool.query(queryID, [this.idUsuario]);
            return barberEdited[0];
        } catch (error) {
            throw new Error('Error al editar el barbero: ' + error.message);
        }
    }

    async deleteBarberoByIdUsuario(){
        try {
        const query = 'DELETE FROM barbero WHERE idUsuario = ?';
        const values = [this.idUsuario]
        const [deleted] = await pool.query(query, values)
        return deleted;
        } catch (error) {
            throw new Error('Error al eliminar el barbero: ' + error.message);
        }
    }
}