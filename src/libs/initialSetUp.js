import {pool} from '../db.js'
import { daTetimeSQL } from "./datetime.js"
import bcrypt from "bcryptjs"

export const createAdminAndRoles = async () => {
  try {
    // Verifiy rows in "rol" table
    const query = 'SELECT COUNT(*) as total FROM rol';
    const [result] = await pool.query(query)

    // if empty, insert default rols
    if (result[0].total === 0) {
      await pool.query('INSERT INTO rol (nombre, descripcion) VALUES ("Administrador","usuario con todos los privilegios del sistema")')
      await pool.query('INSERT INTO rol (nombre, descripcion) VALUES ("Barbero","usuario barbero con acceso a solicitudes de citas y consultas de clientes")')
      await pool.query('INSERT INTO rol (nombre, descripcion) VALUES ("Cliente","usuario cliente con acceso a agendar cita y generar recomendacion")')
      
    }

    //verify rows in "usuario" table
    const query2 = 'SELECT COUNT(*) as total FROM usuario';
    const [result2] = await pool.query(query2)

    // if empty, insert default admin
    if (result2[0].total === 0) {
      //create a default admin user
      const dateTime = daTetimeSQL(new Date())
      const insertAdmin = 'INSERT INTO usuario (email, nombre, apellido, telefono, password, created_at, updated_at, idRol) VALUES (?,?,?,?,?,?,?,?)'
      //encrypt password
      const passwordHash = await bcrypt.hash("123456", 10)
      const values = ["admin@admin.com", "Administrador", "SuperUser", "76422510", passwordHash, dateTime, dateTime, 1]
      await pool.query(insertAdmin, values)
    }

  } catch (error) {
    console.error('Error al insertar admin y roles por defecto:', error)
  }
};
