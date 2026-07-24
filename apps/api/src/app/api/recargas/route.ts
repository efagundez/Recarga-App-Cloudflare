import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Recharge from '../../../models/Recharge';
import { verifyAuth } from '../../../lib/auth';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    // Si es ADMIN, tal vez quiera ver todas, pero por ahora solo las del usuario
    const recharges = await Recharge.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: recharges.length,
      data: recharges
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumber, operator, amount } = body;

    if (!phoneNumber || !operator || !amount) {
      return NextResponse.json({ 
        success: false, 
        message: 'Por favor, provee phoneNumber, operator y amount' 
      }, { status: 400 });
    }

    const recharge = await Recharge.create({
      userId: user.id,
      phoneNumber,
      operator,
      amount,
      status: 'PENDING'
    });

    return NextResponse.json({
      success: true,
      data: recharge
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
