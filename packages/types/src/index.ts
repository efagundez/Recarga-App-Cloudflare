/**
 * Contratos de datos compartidos de la API Visual Recarga.
 * Estructuras 100% compatibles con la especificación PDF de Visual Recarga.
 */

export interface IApiBaseResponse {
  codigo: string;
  mensaje: string;
  server_datetime: string;
}

export interface ILoginRequest {
  grupo: string;
  usuario: string;
  contrasenia: string;
}

export interface ILoginResponse extends IApiBaseResponse {
  token?: string;
  grupo?: string;
  vendedor?: number;
  saldo?: number;
}

export interface IVentaRequest {
  id_vendedor: number;
  id_producto: number;
  cuenta: string;
  monto: number;
  grupo: string;
}

export interface IVentaResponse extends IApiBaseResponse {
  nro_transaccion?: number;
  saldo?: number;
}

export interface IProducto {
  id_producto: number;
  nombre: string;
  monto_minimo: number;
  monto_maximo: number;
  multiplo: number;
  maximo_diario_tlf?: number;
  maximo_mensual_tlf?: number;
  limites?: string;
}

export interface IProductosResponse extends IApiBaseResponse {
  productos?: IProducto[];
}

export interface ISaldoRequest {
  id_vendedor: number;
  grupo: string;
}

export interface ISaldoResponse extends IApiBaseResponse {
  saldo_actual?: number;
}

export interface IUltimaTransaccionResponse extends IApiBaseResponse {
  nro_transaccion?: number;
  fecha?: string;
  hora?: string;
  producto?: string;
  cuenta?: string;
  monto?: number;
  resultado?: string;
  error?: string | null;
}

export interface IBanco {
  id_banco: number;
  nombre: string;
}

export interface IBancosResponse extends IApiBaseResponse {
  bancos?: IBanco[];
}

export interface IDepositoRequest {
  id_vendedor: number;
  fecha: string;
  id_banco: number;
  nro_deposito: string;
  monto: number;
  grupo: string;
}

export interface IDepositoResponse extends IApiBaseResponse {
  id_deposito?: number;
  saldo_al_conciliar?: number;
}

export interface IDepositoItem {
  id_deposito: number;
  fecha: string;
  nro_deposito: string;
  monto: number;
  banco: string;
  verificado_el?: string | null;
  verificado_por?: string | null;
}

export interface IDepositosListResponse extends IApiBaseResponse {
  depositos?: IDepositoItem[];
  conciliados?: IDepositoItem[];
}

export interface IMsgCountResponse extends IApiBaseResponse {
  conteo?: number;
}

export interface IMensajeItem {
  id_mensaje: number;
  titulo: string;
  mensaje: string;
  fecha_envio: string;
  leido: boolean;
}

export interface IMensajesResponse extends IApiBaseResponse {
  mensajes?: IMensajeItem[];
}

export interface IResumenResponse extends IApiBaseResponse {
  fecha?: string;
  saldo_apertura?: number;
  depositos?: number;
  ventas?: number;
  comisiones?: number;
  saldo_final?: number;
}
