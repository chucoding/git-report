'use client'

import Link from 'next/link'

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-base-border/80 bg-base-bg/40 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="relative font-display text-[15px] font-semibold tracking-tight text-text-primary after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-accent after:opacity-90 after:transition hover:after:scale-x-100"
          >
            Git Report
          </Link>
          <span className="hidden text-xs text-text-muted sm:inline">
            GitHub diff → AI report
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <a
            className="rounded-md px-3 py-1.5 text-sm text-text-muted transition hover:bg-white/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
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

