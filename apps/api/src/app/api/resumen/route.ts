import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import Deposito from '../../../models/Deposito';
import Recharge from '../../../models/Recharge';
import TransaccionCuenta from '../../../models/TransaccionCuenta';
import { apiResponse, apiError } from '../../../lib/apiResponse';

async function calcularResumen(params: { id_vendedor?: any; fecha?: string; grupo?: string }) {
  const { id_vendedor, fecha, grupo } = params;

  if (id_vendedor === undefined || id_vendedor === null || id_vendedor === '') {
    return apiError('El parámetro id_vendedor es requerido.', '01', 400);
  }

  const numIdVendedor = Number(id_vendedor);

  // Buscar usuario vendedor
  const vendedor = await User.findOne({ id_vendedor: numIdVendedor });
  if (!vendedor) {
    return apiError('Vendedor no encontrado.', '02', 404);
  }

  // Rango de fecha (por defecto hoy)
  const targetDate = fecha ? new Date(fecha) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Suma de depósitos conciliados en el día
  const depositosRes = await Deposito.aggregate([
    {
      $match: {
        id_vendedor: numIdVendedor,
        estado: 'Conciliado',
        updatedAt: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$monto' }
      }
    }
  ]);
  const totalDepositos = depositosRes[0]?.total || 0;

  // Suma de ventas (recargas completadas) en el día
  const ventasRes = await Recharge.aggregate([
    {
      $match: {
        userId: vendedor._id,
        status: 'COMPLETED',
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  const totalVentas = ventasRes[0]?.total || 0;

  // Calcular comisiones del día (por porcentaje asignado al vendedor o transacciones)
  const comisionesRes = await TransaccionCuenta.aggregate([
    {
      $match: {
        id_vendedor: numIdVendedor,
        tipo: 'COMISION',
        fecha: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$monto' }
      }
    }
  ]);
  const totalComisiones = comisionesRes[0]?.total || ((totalVentas * (vendedor.comision || 0)) / 100);

  const saldo_final = vendedor.saldo || 0;
  // saldo_apertura = saldo_final - depositos + ventas - comisiones
  const saldo_apertura = saldo_final - totalDepositos + totalVentas - totalComisiones;

  return apiResponse({
    codigo: '00',
    mensaje: 'Resumen financiero calculado exitosamente.',
    resumen: {
      id_vendedor: numIdVendedor,
      fecha: targetDate.toISOString().split('T')[0],
      saldo_apertura,
      depositos: totalDepositos,
      ventas: totalVentas,
      comisiones: totalComisiones,
      saldo_final
    }
  });
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id_vendedor = searchParams.get('id_vendedor');
    const fecha = searchParams.get('fecha') || undefined;
    const grupo = searchParams.get('grupo') || undefined;

    return await calcularResumen({ id_vendedor, fecha, grupo });
  } catch (error: any) {
    return apiError(error.message || 'Error al calcular resumen financiero.', '99', 500);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id_vendedor, fecha, grupo } = body;

    return await calcularResumen({ id_vendedor, fecha, grupo });
  } catch (error: any) {
    return apiError(error.message || 'Error al calcular resumen financiero.', '99', 500);
  }
}
