import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("ahorraapp.db");

export const initDB = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT UNIQUE, telefono TEXT, password TEXT);
      CREATE TABLE IF NOT EXISTS transacciones (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, titulo TEXT, categoria TEXT, fecha TEXT, monto REAL, tipo TEXT, FOREIGN KEY (user_id) REFERENCES usuarios(id));
      CREATE TABLE IF NOT EXISTS presupuestos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, categoria TEXT, monto_limite REAL, mes TEXT, anio TEXT, FOREIGN KEY (user_id) REFERENCES usuarios(id));
    `);
  } catch (error) {
    console.error("DB Init Error:", error);
  }
};

// --- USUARIOS ---
export const registerUser = async (nombre, email, telefono, password) => {
  return await db.runAsync(
    "INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?);",
    [nombre, email, telefono, password]
  );
};

export const findUser = async (email, password) => {
  return await db.getFirstAsync(
    "SELECT * FROM usuarios WHERE email = ? AND password = ?;",
    [email, password]
  );
};

export const checkEmailExists = async (email) => {
  return await db.getFirstAsync("SELECT * FROM usuarios WHERE email = ?;", [email]);
};

export const updateUserPassword = async (email, newPassword) => {
  return await db.runAsync("UPDATE usuarios SET password = ? WHERE email = ?;", [newPassword, email]);
};

// --- TRANSACCIONES ---
export const addTransaction = async (userId, titulo, categoria, fecha, monto, tipo) => {
  return await db.runAsync(
    "INSERT INTO transacciones (user_id, titulo, categoria, fecha, monto, tipo) VALUES (?, ?, ?, ?, ?, ?);",
    [userId, titulo, categoria, fecha, monto, tipo]
  );
};

export const getTransactions = async (userId) => {
  return await db.getAllAsync(
    "SELECT * FROM transacciones WHERE user_id = ? ORDER BY id DESC;",
    [userId]
  );
};

export const updateTransaction = async (id, titulo, categoria, fecha, monto, tipo) => {
  return await db.runAsync(
    "UPDATE transacciones SET titulo = ?, categoria = ?, fecha = ?, monto = ?, tipo = ? WHERE id = ?;",
    [titulo, categoria, fecha, monto, tipo, id]
  );
};

export const deleteTransaction = async (id) => {
  return await db.runAsync("DELETE FROM transacciones WHERE id = ?;", [id]);
};

// --- PRESUPUESTOS ---
export const addBudget = async (userId, categoria, montoLimite, mes, anio) => {
  return await db.runAsync(
    "INSERT INTO presupuestos (user_id, categoria, monto_limite, mes, anio) VALUES (?, ?, ?, ?, ?);",
    [userId, categoria, montoLimite, mes, anio]
  );
};

export const getBudgets = async (userId, mes, anio) => {
  // Obtenemos los presupuestos definidos
  const budgets = await db.getAllAsync(
    "SELECT * FROM presupuestos WHERE user_id = ? AND mes = ? AND anio = ?;",
    [userId, mes, anio]
  );

  // Obtenemos todas las transacciones para calcular el gasto real
  const transactions = await getTransactions(userId);

  // Calculamos cuánto se ha gastado por categoría
  const budgetsWithSpent = budgets.map(b => {
    const spent = transactions
      .filter(t => 
        t.tipo === 'expense' && 
        t.categoria.toLowerCase() === b.categoria.toLowerCase() &&
        t.fecha.includes(mes) && t.fecha.includes(anio) // Filtro simple por fecha string
      )
      .reduce((sum, t) => sum + Math.abs(t.monto), 0);
    
    return { ...b, monto_gastado: spent };
  });

  return budgetsWithSpent;
};

export const updateBudget = async (id, categoria, montoLimite) => {
  return await db.runAsync(
    "UPDATE presupuestos SET categoria = ?, monto_limite = ? WHERE id = ?;",
    [categoria, montoLimite, id]
  );
};

export const deleteBudget = async (id) => {
  return await db.runAsync("DELETE FROM presupuestos WHERE id = ?;", [id]);
};