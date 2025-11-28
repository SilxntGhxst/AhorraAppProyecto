import { db } from "../database/DatabaseConnection";
import { TransaccionController } from "./TransaccionController"; // Reutilizamos lógica si es necesario

export class PresupuestoController {
  
  async agregar(userId, categoria, montoLimite, mes, anio) {
    return await db.runAsync(
      "INSERT INTO presupuestos (user_id, categoria, monto_limite, mes, anio) VALUES (?, ?, ?, ?, ?);",
      [userId, categoria, montoLimite, mes, anio]
    );
  }

  // Lógica compleja: Obtener presupuestos Y calcular gasto real
  async obtenerConGasto(userId, mes, anio) {
    // 1. Obtener presupuestos
    const presupuestos = await db.getAllAsync(
      "SELECT * FROM presupuestos WHERE user_id = ? AND mes = ? AND anio = ?;",
      [userId, mes, anio]
    );

    
    const transacciones = await db.getAllAsync(
      "SELECT * FROM transacciones WHERE user_id = ?;",
      [userId]
    );

    
    return presupuestos.map(b => {
      const gastado = transacciones
        .filter(t => 
          (t.tipo === 'expense' || t.monto < 0) && 
          t.categoria.toLowerCase() === b.categoria.toLowerCase() &&
          t.fecha.includes(mes) && t.fecha.includes(anio)
        )
        .reduce((sum, t) => sum + Math.abs(t.monto), 0);
      
      return { ...b, monto_gastado: gastado };
    });
  }

  async actualizar(id, categoria, montoLimite) {
    return await db.runAsync(
      "UPDATE presupuestos SET categoria = ?, monto_limite = ? WHERE id = ?;",
      [categoria, montoLimite, id]
    );
  }

  async eliminar(id) {
    return await db.runAsync("DELETE FROM presupuestos WHERE id = ?;", [id]);
  }
}