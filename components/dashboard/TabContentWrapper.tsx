/**
 * Tab Content Wrapper Component
 * Provides consistent vertical spacing for all dashboard tabs
 * Uses design tokens for unified spacing system
 */

import { ReactNode } from "react"

interface TabContentWrapperProps {
  children: ReactNode
  className?: string
  id?: string
}

export function TabContentWrapper({ children, className = "", id }: TabContentWrapperProps) {
  return (
    <div
      id={id}
      className={`
        mb-[var(--spacing-lg)] md:mb-[var(--spacing-xl)]
        ${className}
      `}
    >
      {children}
    </div>
  )
}
