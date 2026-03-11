"use client"

import { useEffect, useState } from "react"

interface Props {
  phrases: string[]
  typingSpeed?: number
  phraseDelay?: number
  className?: string
  showCursor?: boolean
}

export default function TypingAnimation({
  phrases,
  typingSpeed = 50,
  phraseDelay = 2000,
  className = "",
  showCursor = true,
}: Props) {
  const [t, setT] = useState("")
  const [i, setI] = useState(0)
  const [d, setD] = useState(false)

  useEffect(() => {
    const c = phrases[i]
    const x = setTimeout(
      () =>
        d
          ? t
            ? setT(t.slice(0, -1))
            : (() => {
                setD(false)
                setI((x) => (x + 1) % phrases.length)
              })()
          : t.length < c.length
            ? setT(c.slice(0, t.length + 1))
            : setTimeout(() => setD(true), phraseDelay),
      d ? typingSpeed / 2 : typingSpeed
    )
    return () => clearTimeout(x)
  }, [t, i, d, phrases, typingSpeed, phraseDelay])
  return (
    <span className={`inline-block typing-text ${className}`}>
      {t}
      {showCursor && (
        <span
          className="ml-[var(--cursor-gap)] inline-block w-[var(--cursor-width)] h-[calc(var(--cursor-height-ratio)*1em)] bg-[var(--fg)] animate-[cursor-blink_var(--cursor-blink-duration)_step-end_infinite]"
          aria-hidden="true"
        />
      )}
    </span>
  )
}
