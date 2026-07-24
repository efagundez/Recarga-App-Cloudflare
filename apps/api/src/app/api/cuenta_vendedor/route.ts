import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import TransaccionCuenta from '../../../models/TransaccionCuenta';
import { apiResponse, apiError } from '../../../lib/apiResponse';

async function getCuentaHistorial(params: { id_vendedor?: any; cuenta?: string; fecha?: string; grupo?: string }) {
  const { id_vendedor, cuenta, fecha, grupo } = params;
  const filter: any = {};

  if (id_vendedor !== undefined && id_vendedor !== null && id_vendedor !== '') {
    filter.id_vendedor = Number(id_vendedor);
  }
  if (grupo) {
    filter.grupo = grupo;
  }
  if (cuenta) {
    filter.cuenta = cuenta;
  }
  if (fecha) {
    const start = new Date(fecha);
    start.setHours(0, 0, 0, 0);
    const end = new Date(fecha);
    end.setHours(23, 59, 59, 999);
    filter.fecha = { $gte: start, $lte: end };
  }

  const transacciones = await TransaccionCuenta.find(filter).sort({ fecha: -1 });

  return apiResponse({
    codigo: '00',
    mensaje: 'Historial de la cuenta recuperado exitosamente.',
    transacciones
  });
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id_vendedor = searchParams.get('id_vendedor');
    const cuenta = searchParams.get('cuenta') || undefined;
    const fecha = searchParams.get('fecha') || undefined;
    const grupo = searchParams.get('grupo') || undefined;

    return await getCuentaHistorial({ id_vendedor, cuenta, fecha, grupo });
  } catch (error: any) {
    return apiError(error.message || 'Error al obtener historial.', '99', 500);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id_vendedor, cuenta, fecha, grupo } = body;

    return await getCuentaHistorial({ id_vendedor, cuenta, fecha, grupo });
  } catch (error: any) {
    return apiError(error.message || 'Error al obtener historial.', '99', 500);
  }
}
