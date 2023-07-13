import {pool} from '../db.js'

export let Servicio = class{
    constructor({idServicio, nombre, imagen, precio, duracion, descripcion, idCategoria} = {}){
        this.idServicio = idServicio;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.duracion = duracion;
        this.descripcion = descripcion;
        this.idCategoria = idCategoria;
    }

    async createServicio(){
        try {
            const query = 'INSERT INTO servicio (nombre, imagen, precio, duracion, descripcion, idCategoria) VALUES (?,?,?,?,?,?)';
            const values = [this.nombre, this.imagen, this.precio, this.duracion, this.descripcion, this.idCategoria]
            const [result] = await pool.query(query, values)

            //return created register
            const queryID =   'SELECT s.nombre, s.imagen, c.nombre as categoria, s.precio, s.duracion, s.descripcion '
                            + 'FROM servicio s '
                            + 'JOIN categoria c ON s.idCategoria = c.idCategoria '
                            + 'WHERE s.idServicio = ?';
            const [userSaved] = await pool.query(queryID, [result.insertId]);
            return userSaved[0];
        } catch (error) {
            throw new Error('Error al crear el servicio: ' + error.message);
        }
    }

    async getServicios(){
        try {
            const query = 'SELECT s.idServicio, s.nombre, s.imagen, c.nombre as categoria, s.precio, s.duracion, s.descripcion '
                        + 'FROM servicio s '
                        + 'JOIN categoria c ON s.idCategoria = c.idCategoria';
            const [result] = await pool.query(query)
            return result;
            
        } catch (error) {
            throw new Error('Error al obtener los servicios: ' + error.message);
        }
    }

    async getServicioById(){
        try {
            const query = 'SELECT s.nombre, s.imagen, c.idCategoria, c.nombre as categoria, s.precio, s.duracion, s.descripcion '
                        + 'FROM servicio s '
                        + 'JOIN categoria c ON s.idCategoria = c.idCategoria '
                        + 'WHERE s.idServicio = ?'
            const values = [this.idServicio]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error('Error al obtener el servicio: ' + error.message);
        }
    }

    async editServicioById(){
        try {
            if (this.imagen){
                const query = 'UPDATE servicio SET nombre=?, imagen=?, precio=?, duracion=?, descripcion=?, idCategoria=? WHERE idServicio = ?';
                const values = [this.nombre, this.imagen, this.precio, this.duracion, this.descripcion, this.idCategoria, this.idServicio]
                await pool.query(query, values)
            }else{
                const query = 'UPDATE servicio SET nombre=?, precio=?, duracion=?, descripcion=?, idCategoria=? WHERE idServicio = ?';
                const values = [this.nombre, this.precio, this.duracion, this.descripcion, this.idCategoria, this.idServicio]
                await pool.query(query, values)
            }

            //return updated register
            const queryID =   'SELECT s.nombre, s.imagen, c.nombre as categoria, s.precio, s.duracion, s.descripcion '
                            + 'FROM servicio s '
                            + 'JOIN categoria c ON s.idCategoria = c.idCategoria '
                            + 'WHERE s.idServicio = ?';
            const [userSaved] = await pool.query(queryID, [this.idServicio]);
            return userSaved[0];
        } catch (error) {
            throw new Error('Error al editar el servicio: ' + error.message);
        }
    }

    async deleteServicioById(){
        try {
            const query = 'DELETE FROM servicio WHERE idServicio = ?';
            const values = [this.idServicio]
            const [deleted] = await pool.query(query, values)
            return deleted;
        } catch (error) {
            throw new Error('Error al eliminar el servicio: ' + error.message);
        }
    }

}