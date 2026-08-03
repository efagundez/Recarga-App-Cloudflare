import './global.css';

export const metadata = {
  title: 'Recarga App API',
  description: 'API REST de Visual Recarga - Sistema de Transacciones',
};

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
