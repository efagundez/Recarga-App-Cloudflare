import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Mensaje from '../../../models/Mensaje';
import { apiResponse, apiError } from '../../../lib/apiResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id_vendedor, grupo } = body;

    if (id_vendedor === undefined || !grupo) {
      return apiError('Faltan parámetros requeridos (id_vendedor, grupo)', '01', 400);
    }

    const mensajes = await Mensaje.find({
      id_vendedor: Number(id_vendedor),
      grupo
    }).sort({ fecha: -1 });

    return apiResponse({
      codigo: '00',
      mensaje: 'Lista de mensajes recuperada exitosamente.',
      mensajes
    });
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '99', 500);
  }
}
