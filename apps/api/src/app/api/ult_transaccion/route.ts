import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Recharge from '@/models/Recharge';
import { apiResponse, apiError } from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id_vendedor, grupo } = body;

    if (!id_vendedor || !grupo) {
      return NextResponse.json(apiError('id_vendedor y grupo son requeridos', '01'));
    }

    const lastTx = await Recharge.findOne({ id_vendedor, grupo }).sort({ createdAt: -1 });
    if (!lastTx) {
      return NextResponse.json(apiError('No se encontraron transacciones para este vendedor', '01'));
    }

    return NextResponse.json(
      apiResponse('00', 'Última transacción realizada.', {
        nro_transaccion: lastTx.nro_transaccion,
        fecha: lastTx.fecha || lastTx.createdAt?.toISOString().split('T')[0],
        hora: lastTx.hora || lastTx.createdAt?.toISOString().split('T')[1]?.substring(0, 8),
        producto: lastTx.producto || lastTx.id_producto,
        cuenta: lastTx.cuenta,
        monto: lastTx.monto,
        resultado: lastTx.resultado,
        error: lastTx.error || '',
      })
    );
  } catch (error: any) {
    return NextResponse.json(apiError(error.message || 'Error en el servidor', '01'));
  }
}
