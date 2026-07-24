export interface ProductoCatalogItem {
  id_producto: string;
  nombre: string;
  operadora: string;
  monto_min: number;
  monto_max: number;
  multiplo: number;
  activo: boolean;
}

export const PRODUCTOS_CATALOGO: ProductoCatalogItem[] = [
  {
    id_producto: 'MOVISTAR_PRE',
    nombre: 'Movistar Prepago',
    operadora: 'Movistar',
    monto_min: 50,
    monto_max: 5000,
    multiplo: 10,
    activo: true,
  },
  {
    id_producto: 'DIGITEL_PRE',
    nombre: 'Digitel Prepago',
    operadora: 'Digitel',
    monto_min: 50,
    monto_max: 5000,
    multiplo: 10,
    activo: true,
  },
  {
    id_producto: 'MOVILNET_PRE',
    nombre: 'Movilnet Prepago',
    operadora: 'Movilnet',
    monto_min: 20,
    monto_max: 3000,
    multiplo: 5,
    activo: true,
  },
];
