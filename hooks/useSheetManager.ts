/* ═══════════════════════════════════════════════════════════════════════════════
   SHEET MANAGER HOOK - Unified sheet state management
   Manages all 4 sheet directions (top, bottom, left, right)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useState } from "react"

export type SheetDirection = "top" | "bottom" | "left" | "right"

interface SheetState {
  /** Currently open sheet direction (null = all closed) */
  activeSheet: SheetDirection | null
  /** Bottom sheet (chat) state - kept separate for backward compat */
  isBottomSheetOpen: boolean
}

interface SheetActions {
  /** Open a specific sheet direction */
  openSheet: (direction: SheetDirection) => void
  /** Close the currently active sheet */
  closeSheet: () => void
  /** Toggle a specific sheet direction */
  toggleSheet: (direction: SheetDirection) => void
  /** Check if a specific sheet is open */
  isSheetOpen: (direction: SheetDirection) => boolean
  /** Legacy: open bottom sheet (chat) */
  openChatSheet: () => void
  /** Legacy: close bottom sheet (chat) */
  closeChatSheet: () => void
}

export type UseSheetManagerReturn = SheetState & SheetActions

export function useSheetManager(): UseSheetManagerReturn {
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

  // Legacy aliases for backward compatibility with AiChatSheet
  const openChatSheet = useCallback(() => openSheet("bottom"), [openSheet])
  const closeChatSheet = useCallback(() => {
    if (activeSheet === "bottom") {
      closeSheet()
    }
  }, [activeSheet, closeSheet])

  return {
    activeSheet,
    isBottomSheetOpen: activeSheet === "bottom",
    openSheet,
    closeSheet,
    toggleSheet,
    isSheetOpen,
    openChatSheet,
    closeChatSheet,
  }
}

export default useSheetManager
