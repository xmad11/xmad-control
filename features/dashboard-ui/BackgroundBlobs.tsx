/* ═══════════════════════════════════════════════════════════════════════════════
   BACKGROUND BLOBS - Animated gradient background elements
   GPU-optimized: transform-based animation, will-change, >=18s duration
   ═══════════════════════════════════════════════════════════════════════════════ */

export function BackgroundBlobs() {
  return (
    <>
      {/* Base gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
      {/* Blue blob - top left */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl z-0 animate-blob-pulse" />
      {/* Purple blob - bottom right */}
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl z-0 animate-blob-pulse animate-blob-pulse-delay-1" />
      {/* Cyan blob - center */}
      <div className="fixed top-1/2 left-1/2 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl z-0 animate-blob-pulse animate-blob-pulse-delay-2" />
    </>
  )
}

export default BackgroundBlobs
