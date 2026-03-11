"use client"

import { MagnifyingGlassIcon, XMarkIcon } from "@/components/icons"
import { useCallback, useRef, useState } from "react"

interface BlogSearchProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function BlogSearch({ onSearch, placeholder = "Search blogs..." }: BlogSearchProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = useCallback(() => {
    setQuery("")
    inputRef.current?.focus()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      onSearch?.(value)
    },
    [onSearch]
  )

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-[var(--spacing-md)] top-1/2 -translate-y-1/2 h-[var(--icon-size-md)] w-[var(--icon-size-md)] opacity-[var(--opacity-medium)]" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-[var(--spacing-2xl)] pr-[var(--spacing-2xl)] py-[var(--spacing-md)] bg-[var(--bg)] border border-[var(--fg)]/20 rounded-[var(--radius-xl)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--fg)] placeholder:opacity-[var(--opacity-medium)]"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-[var(--spacing-md)] top-1/2 -translate-y-1/2 p-[var(--spacing-xs)] rounded-full bg-[var(--fg)]/10 hover:bg-[var(--fg)]/20 transition-colors"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
        </button>
      )}
    </div>
  )
}
