/* ═══════════════════════════════════════════════════════════════════════════════
   USE DRAG TO CLOSE - Swipe down gesture for bottom sheet
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useState } from "react"

// Design token: --filter-sheet-swipe-threshold: 6.25rem (100px)
const SWIPE_THRESHOLD_PX = 100

export function useDragToClose(onClose: () => void, isOpen: boolean) {
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setStartY(0)
      setCurrentY(0)
      setIsDragging(false)
    }
  }, [isOpen])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setIsDragging(true)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return
      const deltaY = e.touches[0].clientY - startY
      if (deltaY > 0) {
        setCurrentY(deltaY)
      }
    },
    [isDragging, startY]
  )

  const handleTouchEnd = useCallback(() => {
    if (currentY > SWIPE_THRESHOLD_PX) {
      onClose()
    }
    setIsDragging(false)
    setCurrentY(0)
  }, [currentY, onClose])

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    dragOffset: currentY,
  }
}
