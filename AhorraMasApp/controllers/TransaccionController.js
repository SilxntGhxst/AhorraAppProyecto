import { db } from "../database/DatabaseConnection";

export class TransaccionController {
  
  async agregar(userId, titulo, categoria, fecha, monto, tipo) {
    return await db.runAsync(
      "INSERT INTO transacciones (user_id, titulo, categoria, fecha, monto, tipo) VALUES (?, ?, ?, ?, ?, ?);",
      [userId, titulo, categoria, fecha, monto, tipo]
    );
  }

  async obtenerTodas(userId) {
    return await db.getAllAsync(
      "SELECT * FROM transacciones WHERE user_id = ? ORDER BY id DESC;",
      [userId]
    );
  }

  async actualizar(id, titulo, categoria, fecha, monto, tipo) {
    return await db.runAsync(
      "UPDATE transacciones SET titulo = ?, categoria = ?, fecha = ?, monto = ?, tipo = ? WHERE id = ?;",
      [titulo, categoria, fecha, monto, tipo, id]
    );
  }

  async eliminar(id) {
    return await db.runAsync("DELETE FROM transacciones WHERE id = ?;", [id]);
  }
}