import './global.css';

export const metadata = {
  title: 'Recarga App API',
  description: 'API REST de Visual Recarga - Sistema de Transacciones',
};

// Auto-seed on cold start only at runtime (not during build)
if (process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
  import('@/lib/seedPrisma').then(({ seedPrismaDatabase }) => {
    seedPrismaDatabase().catch((err: Error) => {
      console.error('[layout] Auto-seed failed:', err?.message ?? err);
    });
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
