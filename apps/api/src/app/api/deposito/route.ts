export const runtime = 'edge';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_vendedor, fecha, id_banco, nro_deposito, monto, grupo } = body as {
      id_vendedor: number;
      fecha: string;
      id_banco: number;
      nro_deposito: string;
      monto: number;
      grupo: string;
    };

    if (!id_vendedor || !fecha || !id_banco || !nro_deposito || !monto) {
      return apiError('Faltan campos requeridos.', '01', 400);
    }

    const id_deposito = Date.now();

    const deposito = await prisma.deposito.create({
      data: {
        id_deposito,
        id_vendedor,
        id_banco,
        nro_deposito,
        monto,
        fecha,
        estado: 'En TrÃ¡nsito',
      },
    });

    return apiSuccess({ id_deposito: deposito.id_deposito }, 'DepÃ³sito registrado exitosamente.');
  } catch (error) {
    console.error('[POST /api/deposito]', error);
    return apiError('Error al registrar el depÃ³sito.');
  }
}
