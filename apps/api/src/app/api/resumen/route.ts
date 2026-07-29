import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';

async function getResumen(id_vendedor: number) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const fecha = now.toISOString().split('T')[0];

  const [user, transacciones, depositos] = await Promise.all([
    prisma.user.findFirst({ where: { id_vendedor } }),
    prisma.recharge.findMany({ where: { id_vendedor, createdAt: { gte: startOfDay } } }),
    prisma.deposito.findMany({ where: { id_vendedor, createdAt: { gte: startOfDay } } }),
  ]);

  if (!user) {
    return null;
  }

  const ventas = transacciones.reduce((acc: number, t: { monto: number }) => acc + (t.monto ?? 0), 0);
  const comisiones = transacciones.reduce((acc: number, t: { comision: number }) => acc + (t.comision ?? 0), 0);
  const depositos_monto = depositos.reduce((acc: number, d: { monto: number }) => acc + (d.monto ?? 0), 0);

  return {
    fecha,
    saldo_actual: user.saldo,
    depositos: depositos_monto,
    ventas,
    comisiones,
    saldo_final: user.saldo,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id_vendedor = Number(searchParams.get('id_vendedor'));

    if (!id_vendedor) {
      return apiError('Faltan campos requeridos.', '01', 400);
    }

    const resumen = await getResumen(id_vendedor);
    if (!resumen) {
      return apiError('Vendedor no encontrado.', '04', 404);
    }

    return apiSuccess(resumen, 'Resumen del día.');
  } catch (error) {
    console.error('[GET /api/resumen]', error);
    return apiError('Error al obtener el resumen.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_vendedor, fecha, grupo } = body as {
      id_vendedor: number;
      fecha?: string;
      grupo: string;
    };

    if (!id_vendedor) {
      return apiError('Faltan campos requeridos.', '01', 400);
    }

    const resumen = await getResumen(id_vendedor);
    if (!resumen) {
      return apiError('Vendedor no encontrado.', '04', 404);
    }

    return apiSuccess(resumen, 'Resumen del día.');
  } catch (error) {
    console.error('[POST /api/resumen]', error);
    return apiError('Error al obtener el resumen.');
  }
}
