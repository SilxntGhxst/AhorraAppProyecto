export class Usuario {
  constructor(id, nombre, email, telefono, password) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.password = password;
  }

  static validarRegistro(nombre, email, password) {
    if (!nombre || !email || !password) throw new Error("Datos incompletos");
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(email)) throw new Error("Correo inválido");
  }
}