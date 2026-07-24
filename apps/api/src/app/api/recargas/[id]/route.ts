import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Recharge from '../../../../models/Recharge';
import { verifyAuth } from '../../../../lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/recargas/:id
 * Obtiene una recarga por su ID.
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    await dbConnect();
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const recharge = await Recharge.findById(id);

    if (!recharge) {
      return NextResponse.json(
        { success: false, message: 'Recarga no encontrada' },
        { status: 404 }
      );
    }

    // Solo el dueño o ADMIN puede ver la recarga
    if (recharge.userId.toString() !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: recharge });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/recargas/:id
 * Actualiza el estado de una recarga (solo ADMIN).
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    await dbConnect();
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Solo administradores pueden actualizar recargas' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'COMPLETED', 'FAILED'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Estado inválido. Usa: PENDING, COMPLETED o FAILED' },
        { status: 400 }
      );
    }

    const recharge = await Recharge.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!recharge) {
      return NextResponse.json(
        { success: false, message: 'Recarga no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: recharge });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recargas/:id
 * Elimina una recarga (solo ADMIN).
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    await dbConnect();
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Solo administradores pueden eliminar recargas' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const recharge = await Recharge.findByIdAndDelete(id);

    if (!recharge) {
      return NextResponse.json(
        { success: false, message: 'Recarga no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Recarga eliminada correctamente',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
