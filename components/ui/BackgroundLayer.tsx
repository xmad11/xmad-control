/* ═══════════════════════════════════════════════════════════════════════════════
   BACKGROUND LAYER — XMAD Dashboard
   Pixel-perfect background from ein-ui with gradient and animated blobs
   ═══════════════════════════════════════════════════════════════════════════════ */

import { BACKGROUND } from "@/config/dashboard"

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function BackgroundLayer() {
  return (
    <>
      {/* Base gradient */}
      <div
        className={`fixed inset-0 z-0 bg-gradient-to-br ${BACKGROUND.GRADIENT}`}
      />

      {/* Animated blobs */}
      {BACKGROUND.BLOBS.map((blob, index) => (
        <div
          key={index}
          className={`fixed ${blob.position} ${blob.size} ${blob.color} ${blob.blur} animate-pulse z-0`}
          style={{ animationDelay: `${index * 500}ms` }}
        />
      ))}
    </>
  )
}

export default BackgroundLayer
