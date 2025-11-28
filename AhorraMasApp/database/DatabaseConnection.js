
import * as SQLite from "expo-sqlite";


export const db = SQLite.openDatabaseSync("ahorraapp.db");


export const initDB = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT UNIQUE, telefono TEXT, password TEXT);
      CREATE TABLE IF NOT EXISTS transacciones (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, titulo TEXT, categoria TEXT, fecha TEXT, monto REAL, tipo TEXT, FOREIGN KEY (user_id) REFERENCES usuarios(id));
      CREATE TABLE IF NOT EXISTS presupuestos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, categoria TEXT, monto_limite REAL, monto_gastado REAL, mes TEXT, anio TEXT, FOREIGN KEY (user_id) REFERENCES usuarios(id));
    `);
    console.log("Tablas inicializadas correctamente");
  } catch (error) {
    console.error("Error al inicializar la BD:", error);
  }
};