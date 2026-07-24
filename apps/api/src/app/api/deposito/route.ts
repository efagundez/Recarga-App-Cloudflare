import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Deposito from '../../../models/Deposito';
import { apiResponse, apiError } from '../../../lib/apiResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id_vendedor, fecha, id_banco, nro_deposito, monto, grupo } = body;

    if (id_vendedor === undefined || !fecha || !id_banco || !nro_deposito || monto === undefined || !grupo) {
      return apiError('Faltan datos obligatorios para registrar el depósito.', '01', 400);
    }

    const nuevoDeposito = await Deposito.create({
      id_vendedor: Number(id_vendedor),
      fecha,
      id_banco,
      nro_deposito,
      monto: Number(monto),
      grupo,
      estado: 'En Tránsito'
    });

    return apiResponse({
      codigo: '00',
      mensaje: 'Depósito registrado exitosamente en estado En Tránsito.',
      deposito: nuevoDeposito
    });
  } catch (error: any) {
    return apiError(error.message || 'Error al registrar el depósito.', '99', 500);
  }
}
