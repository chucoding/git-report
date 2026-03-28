import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Git Report',
  description: 'Generate shareable reports from GitHub commit diffs.'
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

