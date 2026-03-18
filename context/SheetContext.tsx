/* ═══════════════════════════════════════════════════════════════════════════════
   SHEET CONTEXT - Global sheet state for AppHeader + HomeClient
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { createContext, useCallback, useContext, useState } from "react"
import type { ReactNode } from "react"

export type SheetDirection = "top" | "bottom" | "left" | "right"

interface SheetContextValue {
  /** Currently open sheet direction (null = all closed) */
  activeSheet: SheetDirection | null
  /** Open a specific sheet direction */
  openSheet: (direction: SheetDirection) => void
  /** Close the currently active sheet */
  closeSheet: () => void
  /** Toggle a specific sheet direction */
  toggleSheet: (direction: SheetDirection) => void
  /** Check if a specific sheet is open */
  isSheetOpen: (direction: SheetDirection) => boolean
}

const SheetContext = createContext<SheetContextValue | null>(null)

export function SheetProvider({ children }: { children: ReactNode }) {
  const [activeSheet, setActiveSheet] = useState<SheetDirection | null>(null)

  const openSheet = useCallback((direction: SheetDirection) => {
    setActiveSheet(direction)
  }, [])

  const closeSheet = useCallback(() => {
    setActiveSheet(null)
  }, [])

  const toggleSheet = useCallback((direction: SheetDirection) => {
    setActiveSheet((current) => (current === direction ? null : direction))
  }, [])

  const isSheetOpen = useCallback(
    (direction: SheetDirection) => {
      return activeSheet === direction
    },
    [activeSheet]
  )

  return (
    <SheetContext.Provider
      value={{
        activeSheet,
        openSheet,
        closeSheet,
        toggleSheet,
        isSheetOpen,
      }}
    >
      {children}
    </SheetContext.Provider>
  )
}

export function useSheetContext(): SheetContextValue {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error("useSheetContext must be used within a SheetProvider")
  }
  return context
}

export default SheetContext
