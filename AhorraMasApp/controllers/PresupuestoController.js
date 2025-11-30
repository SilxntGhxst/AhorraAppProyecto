import { db } from "../database/DatabaseConnection";

export class PresupuestoController {
  
  async agregar(userId, categoria, montoLimite, mes, anio) {
    return await db.runAsync(
      "INSERT INTO presupuestos (user_id, categoria, monto_limite, mes, anio) VALUES (?, ?, ?, ?, ?);",
      [userId, categoria, montoLimite, mes, anio]
    );
  }

  // --- CORRECCIÓN AQUÍ: Comparación insensible a mayúsculas/minúsculas ---
  async obtenerConGasto(userId, mes, anio) {
    const presupuestos = await db.getAllAsync(
      "SELECT * FROM presupuestos WHERE user_id = ? AND mes = ? AND anio = ?;",
      [userId, mes, anio]
    );

    const transacciones = await db.getAllAsync(
      "SELECT * FROM transacciones WHERE user_id = ?;",
      [userId]
    );
    
    const mesBusqueda = mes.toLowerCase();
    const anioBusqueda = anio.toString();

    return presupuestos.map(b => {

      const catPresupuesto = b.categoria.trim().toLowerCase();

      const gastado = transacciones
        .filter(t => {
          const esGasto = t.tipo === 'expense' || t.monto < 0;
          
          // 1. Normalizar datos de la transacción
          const catTransaccion = t.categoria.trim().toLowerCase();
          const fechaTransaccion = t.fecha.toLowerCase();

          const coincideCategoria = catTransaccion === catPresupuesto;
          const coincideFecha = fechaTransaccion.includes(mesBusqueda) && fechaTransaccion.includes(anioBusqueda);

          return esGasto && coincideCategoria && coincideFecha;
        })
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

  async obtenerTodos(userId) {
    return await db.getAllAsync(
      "SELECT * FROM presupuestos WHERE user_id = ?;",
      [userId]
    );
  }
}