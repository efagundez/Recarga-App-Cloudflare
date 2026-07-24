import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Por favor, provee email y contraseña' }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Ese correo ya está registrado' }, { status: 400 });
    }

    // Crear nuevo usuario (la contraseña se encripta automáticamente por el pre-save en User.ts)
    const user = await User.create({ name: name || 'Usuario', email, password });

    // Generar token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret-temporario', {
      expiresIn: '1d'
    });

    return NextResponse.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
