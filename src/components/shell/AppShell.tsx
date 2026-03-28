import AppHeader from './AppHeader'

export default function AppShell({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-base-bg text-text-primary">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6">
        {children}
      </main>
    </div>
  )
}

