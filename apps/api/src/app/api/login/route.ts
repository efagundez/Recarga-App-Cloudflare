import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { JWT_SECRET } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { grupo, usuario, contrasenia } = body;

    if (!grupo || !usuario || !contrasenia) {
      return NextResponse.json(
        apiError('Parámetros de entrada inválidos (grupo, usuario y contrasenia son requeridos)', '01')
      );
    }

    const user = await User.findOne({ usuario, grupo }).select('+password');
    if (!user) {
      return NextResponse.json(apiError('Credenciales inválidas.', '01'));
    }

    const isMatch = await bcrypt.compare(contrasenia, user.password);
    if (!isMatch) {
      return NextResponse.json(apiError('Credenciales inválidas.', '01'));
    }

    const token = jwt.sign(
      {
        id: user._id,
        id_vendedor: user.id_vendedor,
        grupo: user.grupo,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json(
      apiResponse('00', 'Entrada exitosa.', {
        token,
        grupo: user.grupo,
        vendedor: user.id_vendedor,
        saldo: user.saldo,
      })
    );
  } catch (error: any) {
    return NextResponse.json(apiError(error.message || 'Error en el servidor', '01'));
  }
}
