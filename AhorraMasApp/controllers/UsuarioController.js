import { db } from "../database/DatabaseConnection";
import { Usuario } from "../models/Usuario";

export class UsuarioController {
  
  async registrar(nombre, email, telefono, password) {
    
    Usuario.validarRegistro(nombre, email, password);
    
    return await db.runAsync(
      "INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?);",
      [nombre, email, telefono, password]
    );
  }

  async login(email, password) {
    return await db.getFirstAsync(
      "SELECT * FROM usuarios WHERE email = ? AND password = ?;",
      [email, password]
    );
  }

  async buscarPorEmail(email) {
    return await db.getFirstAsync(
      "SELECT * FROM usuarios WHERE email = ?;",
      [email]
    );
  }

  async actualizarPassword(email, newPassword) {
    return await db.runAsync(
      "UPDATE usuarios SET password = ? WHERE email = ?;",
      [newPassword, email]
    );
  }
}