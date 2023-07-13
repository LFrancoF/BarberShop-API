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
            //verify if email already exists
            const queryEmail = 'SELECT email FROM usuario WHERE email = ?';
            const valueEmail = [this.email]
            const [resultEmail] = await pool.query(queryEmail, valueEmail)
            if (resultEmail.length >= 1) return "El email ingresado ya existe";

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
            throw new Error(['Error al crear el usuario: ' + error.message]);
        }
    }

    async getUsuarios(){
        try {
            const query = 'SELECT u.idUsuario, u.nombre as nombre, u.apellido, u.telefono, r.nombre as rol '
                        + 'FROM usuario u '
                        + 'JOIN rol r ON u.idRol = r.idRol'
            const [result] = await pool.query(query)
            return result;
            
        } catch (error) {
            throw new Error(['Error al obtener los usuarios: ' + error.message]);
        }
    }

    async getUsuarioById(){
        try {
            const query = 'SELECT u.*, r.nombre as rol '
                        + 'FROM usuario u '
                        + 'JOIN rol r ON u.idRol = r.idRol '
                        + 'WHERE u.idUsuario = ?';
            const values = [this.idUsuario]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error(['Error al obtener el usuario: ' + error.message]);
        }
    }

    async getUsuarioByEmail(){
        try {
            const query = 'SELECT u.*, r.nombre as rol '
                        + 'FROM usuario u '
                        + 'JOIN rol r ON u.idRol = r.idRol '
                        + 'WHERE u.email = ?';
            const values = [this.email]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error(['Error al obtener el usuario: ' + error.message]);
        }
    }

    async getIdClient(){
        try {
            const query = 'SELECT c.idCliente '
                        + 'FROM cliente c '
                        + 'JOIN usuario u ON c.idUsuario = u.idUsuario '
                        + 'WHERE c.idUsuario = ?';
            const values = [this.idUsuario]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error(['Error al obtener el idCliente: ' + error.message]);
        }
    }

    async getIdBarber(){
        try {
            const query = 'SELECT b.idBarbero '
                        + 'FROM barbero b '
                        + 'JOIN usuario u ON b.idUsuario = u.idUsuario '
                        + 'WHERE b.idUsuario = ?';
            const values = [this.idUsuario]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error(['Error al obtener el idBarbero: ' + error.message]);
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
            throw new Error(['Error al editar el usuario: ' + error.message]);
        }
    }

    async deleteUsuarioByIdUsuario(){
        try {
            const query = 'DELETE FROM usuario WHERE idUsuario = ?';
            const values = [this.idUsuario]
            const [deleted] = await pool.query(query, values)
            return deleted;
        } catch (error) {
            throw new Error(['Error al eliminar el usuario: ' + error.message]);
        }
    }

}