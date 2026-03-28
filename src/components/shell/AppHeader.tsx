'use client'

import Link from 'next/link'

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-base-border bg-base-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight">
            Git Report
          </Link>
          <span className="hidden text-xs text-text-muted sm:inline">
            GitHub diff → OpenAI report
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <a
            className="rounded-md px-3 py-1.5 text-sm text-text-muted hover:bg-white/5 hover:text-text-primary"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}

