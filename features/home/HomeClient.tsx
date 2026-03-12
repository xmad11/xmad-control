/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CLIENT - XMAD Control Simple Template
   Clean layout with header, side menu, and theme toggle
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

export function HomeClient() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <main id="main-content" className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-[var(--spacing-xl)]">
        <h1 className="text-[var(--font-size-5xl)] font-bold">
          XMAD Control
        </h1>
        <p className="text-[var(--font-size-lg)] text-[var(--fg-muted)] mt-[var(--spacing-md)]">
          Your starter template is ready
        </p>
      </main>
    </div>
  )
}

export default HomeClient
