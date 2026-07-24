import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Recharge from '@/models/Recharge';
import { verifyAuth } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/apiResponse';
import { PRODUCTOS_CATALOGO } from '@/lib/productos';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const authUser = await verifyAuth(request);

    if (!authUser) {
      return NextResponse.json(apiError('No autorizado', '99'));
    }

    const body = await request.json();
    const { id_vendedor, id_producto, cuenta, monto, grupo } = body;

    if (!id_vendedor || !id_producto || !cuenta || monto === undefined || !grupo) {
      return NextResponse.json(apiError('Datos incompletos para la venta', '99'));
    }

    const numericMonto = Number(monto);
    if (isNaN(numericMonto) || numericMonto <= 0) {
      return NextResponse.json(apiError('Monto inválido', '99'));
    }

    // Buscar producto
    const producto = PRODUCTOS_CATALOGO.find(
      (p) => p.id_producto === id_producto || p.operadora.toUpperCase() === String(id_producto).toUpperCase()
    );

    if (producto) {
      if (numericMonto < producto.monto_min || numericMonto > producto.monto_max) {
        return NextResponse.json(
          apiError(`El monto debe estar entre ${producto.monto_min} y ${producto.monto_max}`, '99')
        );
      }
      if (numericMonto % producto.multiplo !== 0) {
        return NextResponse.json(
          apiError(`El monto debe ser múltiplo de ${producto.multiplo}`, '99')
        );
      }
    }

    // Buscar vendedor
    const user = await User.findOne({ id_vendedor, grupo });
    if (!user) {
      return NextResponse.json(apiError('Vendedor no encontrado', '99'));
    }

    if (user.saldo < numericMonto) {
      return NextResponse.json(apiError('Saldo insuficiente', '98'));
    }

    // Descontar saldo
    user.saldo -= numericMonto;
    await user.save();

    // Generar número de transacción único
    const nro_transaccion = `TX${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];

    const newRecharge = await Recharge.create({
      nro_transaccion,
      id_vendedor,
      id_producto,
      producto: producto ? producto.nombre : id_producto,
      cuenta,
      monto: numericMonto,
      grupo,
      resultado: 'EXITOSA',
      error: '',
      fecha,
      hora,
      userId: user._id,
    });

    return NextResponse.json(
      apiResponse('00', 'Recarga exitosa.', {
        nro_transaccion: newRecharge.nro_transaccion,
        saldo: user.saldo,
      })
    );
  } catch (error: any) {
    return NextResponse.json(apiError(error.message || 'Error al procesar la venta', '99'));
  }
}
