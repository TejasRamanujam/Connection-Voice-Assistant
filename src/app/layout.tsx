import type { Metadata, Viewport } from 'next'
import { Fraunces, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Connection — Signal on Paper',
  description:
    'A field-station voice assistant. Speak down the wire — Gemini answers with web search, todos, calendar and time, traced live on the chart recorder.',
}

export const viewport: Viewport = {
  themeColor: '#F2EDE0',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plexMono.variable} h-full`}>
      <body className="h-full m-0 overflow-hidden font-mono bg-paper text-ink">
        {children}
      </body>
    </html>
  )
}
