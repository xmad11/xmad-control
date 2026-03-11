/* ═══════════════════════════════════════════════════════════════════════════════
   SUN WARM ICON - Custom warm mode icon (5 rays)
   ═══════════════════════════════════════════════════════════════════════════════ */

export interface SunWarmIconProps {
  className?: string
}

export function SunWarmIcon({ className = "" }: SunWarmIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <title>Warm Sun</title>
      <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
      <path d="M12 2v2.5" />
      <path d="M12 19.5v2.5" />
      <path d="M2 12h2.5" />
      <path d="M5.4 5.4l1.7 1.7" />
      <path d="M5.4 18.6l1.7-1.7" />
    </svg>
  )
}
