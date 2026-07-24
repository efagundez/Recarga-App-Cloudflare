import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { apiResponse, apiError } from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id_vendedor, grupo } = body;

    if (!id_vendedor || !grupo) {
      return NextResponse.json(apiError('id_vendedor y grupo son requeridos', '01'));
    }

    const user = await User.findOne({ id_vendedor, grupo });
    if (!user) {
      return NextResponse.json(apiError('Vendedor no encontrado', '01'));
    }

    return NextResponse.json(
      apiResponse('00', 'Saldo actual.', {
        saldo_actual: user.saldo,
      })
    );
  } catch (error: any) {
    return NextResponse.json(apiError(error.message || 'Error en el servidor', '01'));
  }
}
