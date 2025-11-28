export class Presupuesto {
  constructor(id, userId, categoria, montoLimite, montoGastado, mes, anio) {
    this.id = id;
    this.user_id = userId;
    this.categoria = categoria;
    this.monto_limite = montoLimite;
    this.monto_gastado = montoGastado;
    this.mes = mes;
    this.anio = anio;
  }
}