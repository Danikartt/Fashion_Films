export const metadata = {
  title: 'Fashion Films',
  description: 'Panel principal y login',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="es">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#f0f2f5', // Un gris azulado suave (estilo Facebook/Google)
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
      {children}
      </body>
      </html>
  )
}