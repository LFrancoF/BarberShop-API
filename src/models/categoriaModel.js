import {pool} from '../db.js'

export let Categoria = class{
    constructor({idCategoria, nombre, descripcion} = {}){
        this.idCategoria = idCategoria;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    async createCategoria(){
        try {
            const query = 'INSERT INTO categoria (nombre, descripcion) VALUES (?,?)';
            const values = [this.nombre, this.descripcion]
            const [result] = await pool.query(query, values)

            //return created register
            const queryID = 'SELECT * FROM categoria WHERE idCategoria = ?';
            const [userSaved] = await pool.query(queryID, [result.insertId]);
            return userSaved[0];
        } catch (error) {
            throw new Error('Error al crear la categoria: ' + error.message);
        }
    }

    async getCategorias(){
        try {
            const query = 'SELECT * FROM categoria';
            const [result] = await pool.query(query)
            return result;
            
        } catch (error) {
            throw new Error('Error al obtener las categorias: ' + error.message);
        }
    }

    async getCategoriaById(){
        try {

            const query = 'SELECT * FROM categoria WHERE idCategoria = ?';
            const values = [this.idCategoria]
            const [result] = await pool.query(query, values)
            return result[0];
            
        } catch (error) {
            throw new Error('Error al obtener la categoria: ' + error.message);
        }
    }

    async editCategoriaById(){
        try {
            const query = 'UPDATE categoria SET nombre=?, descripcion=? WHERE idCategoria = ?';
            const values = [this.nombre, this.descripcion, this.idCategoria]
            await pool.query(query, values)

            //return updated register
            const queryID = 'SELECT * FROM categoria WHERE idCategoria = ?';
            const [catSaved] = await pool.query(queryID, [this.idCategoria]);
            return catSaved[0];
        } catch (error) {
            throw new Error('Error al editar la categoria: ' + error.message);
        }
    }

    async deleteCategoriaById(){
        try {
            const query = 'DELETE FROM categoria WHERE idCategoria = ?';
            const values = [this.idCategoria]
            const [deleted] = await pool.query(query, values)
            return deleted;
        } catch (error) {
            throw new Error('Error al eliminar la categoria: ' + error.message);
        }
    }

}