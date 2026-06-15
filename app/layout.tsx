import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import './globals.css'

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant-garamond',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fructul Bucovinei | Oameni și o poveste',
  description: 'Descoperă livada Fructul Bucovinei din inima Bucovinei. Adoptă un pom, participă la evenimente și trăiește experiența autentică a naturii românești.',
  keywords: ['livadă', 'Bucovina', 'pomicultură', 'adoptă un pom', 'natură', 'tradiție', 'fructe', 'evenimente'],
  authors: [{ name: 'Fructul Bucovinei' }],
  icons: {
    icon: '/logo&favicon/logofructulbucovinei.png',
    shortcut: '/logo&favicon/logofructulbucovinei.png',
    apple: '/logo&favicon/logofructulbucovinei.png',
  },
  openGraph: {
    title: 'Fructul Bucovinei | Oameni și o poveste',
    description: 'Descoperă livada Fructul Bucovinei din inima Bucovinei.',
    type: 'website',
    locale: 'ro_RO',
  },
}

export const viewport: Viewport = {
  themeColor: '#22382D',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ro"
      data-scroll-behavior="smooth"
      className={`${cormorantGaramond.variable} ${manrope.variable} bg-cream`}
    >
      <body className="font-sans antialiased overflow-x-hidden">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
