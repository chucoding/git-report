import AppHeader from './AppHeader'

export default function AppShell({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh text-text-primary">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(184,255,90,0.10),transparent_60%)]" />
      </div>
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6">
        {children}
      </main>
    </div>
  )
}

