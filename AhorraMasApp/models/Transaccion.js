export class Transaccion {
  constructor(id, userId, titulo, categoria, fecha, monto, tipo) {
    this.id = id;
    this.user_id = userId;
    this.titulo = titulo;
    this.categoria = categoria;
    this.fecha = fecha;
    this.monto = monto;
    this.tipo = tipo;
  }
}