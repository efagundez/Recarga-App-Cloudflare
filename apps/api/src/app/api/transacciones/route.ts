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

    const todayStr = new Date().toISOString().split('T')[0];
    const startOfDay = new Date(todayStr + 'T00:00:00.000Z');
    const endOfDay = new Date(todayStr + 'T23:59:59.999Z');

    const transactions = await Recharge.find({
      id_vendedor,
      grupo,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });

    const formattedList = transactions.map((tx) => ({
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
    }));

    return NextResponse.json(
      apiResponse('00', 'Transacciones realizadas hoy.', {
        transacciones: formattedList,
      })
    );
  } catch (error: any) {
    return NextResponse.json(apiError(error.message || 'Error en el servidor', '01'));
  }
}
