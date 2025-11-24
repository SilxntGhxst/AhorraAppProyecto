// services/DBService.js
import * as SQLite from "expo-sqlite";


// Abre la base de datos
const db = SQLite.openDatabase("ahorraApp.db");

export const initDB = () => {
  db.transaction((tx) => {
    // Tabla Usuarios
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT UNIQUE, telefono TEXT, password TEXT);"
    );
    // Tabla Transacciones (CRUD Punto 2)
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS transacciones (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, titulo TEXT, categoria TEXT, fecha TEXT, monto REAL, tipo TEXT, FOREIGN KEY (user_id) REFERENCES usuarios(id));"
    );
    // Tabla Presupuestos (CRUD Punto 4)
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS presupuestos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, categoria TEXT, monto_limite REAL, monto_gastado REAL, mes TEXT, anio TEXT, FOREIGN KEY (user_id) REFERENCES usuarios(id));"
    );
  });
};

// --- USUARIOS (Punto 1) ---
export const registerUser = (nombre, email, telefono, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?);",
        [nombre, email, telefono, password],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const findUser = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM usuarios WHERE email = ? AND password = ?;",
        [email, password],
        (_, { rows }) => resolve(rows._array.length > 0 ? rows._array[0] : null),
        (_, error) => reject(error)
      );
    });
  });
};

// --- TRANSACCIONES (Punto 2) ---
export const addTransaction = (userId, titulo, categoria, fecha, monto, tipo) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO transacciones (user_id, titulo, categoria, fecha, monto, tipo) VALUES (?, ?, ?, ?, ?, ?);",
        [userId, titulo, categoria, fecha, monto, tipo],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getTransactions = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM transacciones WHERE user_id = ? ORDER BY id DESC;",
        [userId],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteTransaction = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM transacciones WHERE id = ?;", [id], (_, result) => resolve(result), (_, err) => reject(err));
    });
  });
};

// --- PRESUPUESTOS (Punto 4) ---
export const addBudget = (userId, categoria, montoLimite, mes, anio) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO presupuestos (user_id, categoria, monto_limite, monto_gastado, mes, anio) VALUES (?, ?, ?, 0, ?, ?);",
        [userId, categoria, montoLimite, mes, anio],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getBudgets = (userId, mes, anio) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM presupuestos WHERE user_id = ? AND mes = ? AND anio = ?;",
        [userId, mes, anio],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

// Actualizar gasto en presupuesto (Lógica extra para integrar puntos)
export const updateBudgetSpent = (userId, categoria, mes, anio, monto) => {
    db.transaction((tx) => {
        tx.executeSql(
            "UPDATE presupuestos SET monto_gastado = monto_gastado + ? WHERE user_id = ? AND categoria = ? AND mes = ? AND anio = ?;",
            [monto, userId, categoria, mes, anio]
        );
    });
}

export const updateTransaction = (id, titulo, categoria, fecha, monto, tipo) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE transacciones SET titulo = ?, categoria = ?, fecha = ?, monto = ?, tipo = ? WHERE id = ?;",
        [titulo, categoria, fecha, monto, tipo, id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};