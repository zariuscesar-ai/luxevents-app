import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'LuxEvents — Find Premium Event Providers',
  description: 'Connect with the best event vendors in your city. Venues, caterers, photographers, DJs, florists, and more. Book directly through our platform.',
  keywords: 'event vendors, wedding vendors, event planning, caterers, photographers, DJs, venues',
  openGraph: {
    title: 'LuxEvents — Find Premium Event Providers',
    description: 'Connect with top-rated event vendors in your city.',
    url: 'https://www.luxevents.app',
    siteName: 'LuxEvents',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  )
}
