import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Recharge from '@/models/Recharge';
import { apiResponse, apiError } from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { nro_transaccion, grupo } = body;

    if (!nro_transaccion || !grupo) {
      return NextResponse.json(apiError('nro_transaccion y grupo son requeridos', '01'));
    }

    const tx = await Recharge.findOne({ nro_transaccion, grupo });
    if (!tx) {
      return NextResponse.json(apiError('Transacción no encontrada', '01'));
    }

    return NextResponse.json(
      apiResponse('00', 'Detalle de la transacción.', {
        transaccion: {
          nro_transaccion: tx.nro_transaccion,
          id_vendedor: tx.id_vendedor,
          id_producto: tx.id_producto,
          producto: tx.producto || tx.id_producto,
          cuenta: tx.cuenta,
          monto: tx.monto,
          grupo: tx.grupo,
          resultado: tx.resultado,
          error: tx.error || '',
          fecha: tx.fecha || tx.createdAt?.toISOString().split('T')[0],
          hora: tx.hora || tx.createdAt?.toISOString().split('T')[1]?.substring(0, 8),
        },
      })
    );
  } catch (error: any) {
    return NextResponse.json(apiError(error.message || 'Error en el servidor', '01'));
  }
}
