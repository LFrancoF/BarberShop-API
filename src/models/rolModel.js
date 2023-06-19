import {pool} from '../db.js'

export let Rol = class{
    constructor({idRol, nombre, descripcion} = {}){
        this.idRol = idRol;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    async createRol(){
        try {
            const query = 'INSERT INTO rol (nombre, descripcion) VALUES (?,?)';
            const values = [this.nombre, this.descripcion]
            const [result] = await pool.query(query, values)

            //return created register
            const queryID = 'SELECT * FROM rol WHERE idRol = ?';
            const [userSaved] = await pool.query(queryID, [result.insertId]);
            return userSaved[0];
        } catch (error) {
            throw new Error('Error al crear el rol: ' + error.message);
        }
    }

    async getRoles(){
        try {
            const query = 'SELECT * FROM rol';
            const [result] = await pool.query(query)
            return result;
            
        } catch (error) {
            throw new Error('Error al obtener los roles: ' + error.message);
        }
    }

    async getRolById(){
        try {

            const query = 'SELECT * FROM rol WHERE idRol = ?';
            const values = [this.idRol]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error('Error al obtener el rol: ' + error.message);
        }
    }

    async editRolById(){
        try {
            const query = 'UPDATE rol SET nombre=?, descripcion=? WHERE idRol = ?';
            const values = [this.nombre, this.descripcion, this.idRol]
            await pool.query(query, values)

            //return updated register
            const queryID = 'SELECT * FROM rol WHERE idRol = ?';
            const [userSaved] = await pool.query(queryID, [this.idRol]);
            return userSaved[0];
        } catch (error) {
            throw new Error('Error al editar el rol: ' + error.message);
        }
    }

    async deleteRolById(){
        try {
            const query = 'DELETE FROM rol WHERE idRol = ?';
            const values = [this.idRol]
            const [deleted] = await pool.query(query, values)
            return deleted;
        } catch (error) {
            throw new Error('Error al eliminar el rol: ' + error.message);
        }
    }

}