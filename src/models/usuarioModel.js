import {pool} from '../db.js'
import { daTetimeSQL } from "../libs/datetime.js"

export let Usuario = class{
    constructor({idUsuario, email, nombre, apellido, telefono, password, created_at, updated_at, idRol} = {}){
        this.idUsuario = idUsuario;
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.idRol = idRol;
    }

    async createUsuario(){
        try {
            const dateTime = daTetimeSQL(new Date())
            this.created_at = dateTime
            this.updated_at = dateTime
            const query = 'INSERT INTO usuario (email, nombre, apellido, telefono, password, created_at, updated_at, idRol) VALUES (?,?,?,?,?,?,?,?)';
            const values = [this.email, this.nombre, this.apellido, this.telefono, this.password, this.created_at, this.updated_at, this.idRol]
            const [result] = await pool.query(query, values)

            //return created register
            const queryID = 'SELECT * FROM usuario WHERE idUsuario = ?';
            const [userSaved] = await pool.query(queryID, [result.insertId]);
            return userSaved[0];
        } catch (error) {
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    }

    async getUsuarioById(){
        try {

            const query = 'SELECT * FROM usuario WHERE idUsuario = ?';
            const values = [this.idUsuario]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error('Error al obtener el usuario: ' + error.message);
        }
    }

    async getUsuarioByEmail(){
        try {

            const query = 'SELECT * FROM usuario WHERE email = ?';
            const values = [this.email]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error('Error al obtener el usuario: ' + error.message);
        }
    }

    async editUsuarioById(){
        try {
            const dateTime = daTetimeSQL(new Date())
            this.updated_at = dateTime
            const query = 'UPDATE usuario SET email=?, nombre=?, apellido=?, telefono=?, updated_at=? WHERE idUsuario = ?';
            const values = [this.email, this.nombre, this.apellido, this.telefono, this.updated_at, this.idUsuario]
            await pool.query(query, values)

            //return updated register
            const queryID = 'SELECT * FROM usuario WHERE idUsuario = ?';
            const [userSaved] = await pool.query(queryID, [this.idUsuario]);
            return userSaved[0];
        } catch (error) {
            throw new Error('Error al editar el usuario: ' + error.message);
        }
    }

    async deleteUsuarioByIdUsuario(){
        try {
            const query = 'DELETE FROM usuario WHERE idUsuario = ?';
            const values = [this.idUsuario]
            const [deleted] = await pool.query(query, values)
            return deleted;
        } catch (error) {
            throw new Error('Error al eliminar el usuario: ' + error.message);
        }
    }

}