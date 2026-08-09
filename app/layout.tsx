import type { Metadata } from "next";
import { Nunito } from 'next/font/google';
import { resolveServerLocale, localeMetadata } from "@/lib/locale/server/server-metadata";
import { LocaleProvider } from "@/components/locale/LocaleProvider";
import { SkipLink } from "@/components/locale/SkipLink";
import "./globals.css";

const nunito = Nunito({
  subsets: ['latin'],          // Carga solo el subconjunto que necesitas
  weight: ['400', '600', '700', '800', '900'], // Los pesos que usas
  display: 'swap',             // Para mejorar el rendimiento
  variable: '--font-nunito',   // Crea una variable CSS para usarla en Tailwind
});

export async function generateMetadata(): Promise<Metadata> {
  const meta = await localeMetadata();

  return {
    title: meta.title,
    description: meta.description,
    icons: {
      icon: [
        { url: '/favicon/favicon.ico', sizes: 'any' },
        { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: [
        { url: '/favicon/apple-touch-icon.png', sizes: '180x180' },
      ],
    },
    manifest: '/favicon/site.webmanifest',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await resolveServerLocale();

  return (
    <html
      lang={locale}
      className={`${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LocaleProvider>
          <SkipLink />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}