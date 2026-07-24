import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Deposito from '../../../models/Deposito';
import { apiResponse, apiError } from '../../../lib/apiResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { grupo, id_vendedor } = body;

    if (!grupo) {
      return apiError('El parámetro grupo es requerido.', '01', 400);
    }

    const query: any = { grupo, estado: 'Conciliado' };
    if (id_vendedor !== undefined) {
      query.id_vendedor = Number(id_vendedor);
    }

    const conciliados = await Deposito.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(10);

    return apiResponse({
      codigo: '00',
      mensaje: 'Últimos depósitos conciliados recuperados.',
      conciliados
    });
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor.', '99', 500);
  }
}
