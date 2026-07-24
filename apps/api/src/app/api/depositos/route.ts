import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Deposito from '../../../models/Deposito';
import { apiResponse, apiError } from '../../../lib/apiResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id_vendedor, grupo } = body;

    if (id_vendedor === undefined || !grupo) {
      return apiError('Faltan parámetros requeridos (id_vendedor, grupo)', '01', 400);
    }

    const depositos = await Deposito.find({
      id_vendedor: Number(id_vendedor),
      grupo,
      estado: 'En Tránsito'
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return apiResponse({
      codigo: '00',
      mensaje: 'Últimos depósitos en tránsito recuperados.',
      depositos
    });
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor.', '99', 500);
  }
}
