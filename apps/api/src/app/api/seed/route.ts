export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { seedPrismaDatabase } from '@/lib/seedPrisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';

/**
 * POST /api/seed
 * Populates the database with initial mock data.
 * Protected by X-Seed-Key header matching MIGRATE_SECRET env var.
 */
export async function POST(req: NextRequest) {
  const seedKey = req.headers.get('x-seed-key');
  const expectedKey = process.env.MIGRATE_SECRET;

  if (!expectedKey) {
    return apiError('MIGRATE_SECRET no estÃ¡ configurado en el servidor.', '99', 500);
  }
  if (seedKey !== expectedKey) {
    return apiError('No autorizado. Header X-Seed-Key invÃ¡lido.', '01', 401);
  }

  try {
    await seedPrismaDatabase();
    return apiSuccess({}, 'Base de datos inicializada correctamente.');
  } catch (error: any) {
    console.error('[seed] Error durante el seed:', error);
    return apiError(`Error durante el seed: ${error?.message ?? 'Error desconocido'}`, '99', 500);
  }
}

/**
 * GET /api/seed (for health check / auto-seed on cold start)
 * Only runs seed if no data exists (idempotent).
 */
export async function GET() {
  try {
    await seedPrismaDatabase();
    return NextResponse.json({ ok: true, message: 'Seed check completed.' });
  } catch (error: any) {
    console.error('[seed] Error durante el seed GET:', error);
    return NextResponse.json({ ok: false, error: error?.message }, { status: 500 });
  }
}
