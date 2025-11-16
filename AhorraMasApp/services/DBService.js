import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";

//1. Abrir la base de datos
const db = SQLite.openDatabase("ahorraapp.db");

//2. Inicializar todas las tablas necesarias
export const initDB = () => {
  db.transaction((tx) => {

    // TABLA DE USUARIOS (Punto 1 de Rúbrica)
    // La contraseña debe ser almacenada de forma segura (simulación de hash simple)
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT UNIQUE, telefono TEXT, password TEXT);",
      [],
      () => console.log("Tabla de usuarios creada o ya existe."),
      (_, error) => console.error("Error al crear tabla de usuarios:", error)
    );

    // TABLA DE TRANSACCIONES (Punto 3 de Rúbrica - Preparación)
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS transacciones (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, monto REAL, categoria TEXT, fecha TEXT, descripcion TEXT, tipo TEXT, FOREIGN KEY (user_id) REFERENCES usuarios(id));",
      [],
      () => console.log("Tabla de transacciones creada o ya existe."),
      (_, error) =>
        console.error("Error al crear tabla de transacciones:", error)
    );

    // TABLA DE PRESUPUESTOS (Punto 7 de Rúbrica - Preparación)
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS presupuestos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, categoria TEXT, monto REAL, fechaInicio TEXT, fechaFin TEXT, FOREIGN KEY (user_id) REFERENCES usuarios(id));",
      [],
      () => console.log("Tabla de presupuestos creada o ya existe."),
      (_, error) =>
        console.error("Error al crear tabla de presupuestos:", error)
    );
  });
};

// 3. Registrar un nuevo usuario (Usado en RegistrarScreen.js)
export const registerUser = (nombre, email, telefono, password) => {
  return new Promise((resolve, reject) => {
    // En una app real, usarías bcrypt para hashear el password.
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?);",
        [nombre, email, telefono, password],
        (_, result) => resolve(result),
        (_, error) => reject(error) // Rechaza si el email es duplicado
      );
    });
  });
};

// 4. Autenticar (Login) (Usado en IniciarSesionScreen.js)
export const findUser = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM usuarios WHERE email = ? AND password = ?;",
        [email, password],
        (_, { rows }) => {
          if (rows._array.length > 0) {
            // Aquí, el ID del usuario se guardaría en SecureStore para mantener la sesión
            // SecureStore.setItemAsync('user_id', rows._array[0].id.toString());
            resolve(rows._array[0]); // Devuelve el objeto completo del usuario
          } else {
            resolve(null); // No encontrado
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

// 5. Encontrar usuario por email (Usado en Recuperación de Contraseña)
export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM usuarios WHERE email = ?;",
        [email],
        (_, { rows }) => {
          resolve(rows._array.length > 0 ? rows._array[0] : null);
        },
        (_, error) => reject(error)
      );
    });
  });
};
