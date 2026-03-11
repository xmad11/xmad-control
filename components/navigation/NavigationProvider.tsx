/* ═══════════════════════════════════════════════════════════════════════════════
   NAVIGATION PROVIDER - UI-only navigation state
   Manages panel state (menu/theme) for Header/SideMenu/ThemeModal
   Imported ONLY by app/layout.tsx
   NOT part of global Providers (Theme/Language/Auth)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { type ReactNode, createContext, useCallback, useContext, useState } from "react"

export type ActivePanel = "none" | "menu" | "theme"

interface NavigationContextType {
  activePanel: ActivePanel
  setActivePanel: (panel: ActivePanel) => void
  openMenu: () => void
  openTheme: () => void
  closeAll: () => void
  showBackButton: boolean
  showBackButtonInHeader: () => void
  hideBackButton: () => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider")
  }
  return context
}

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>("none")
  const [showBackButton, setShowBackButton] = useState(false)

  const openMenu = useCallback(() => setActivePanel("menu"), [])
  const openTheme = useCallback(() => setActivePanel("theme"), [])
  const closeAll = useCallback(() => setActivePanel("none"), [])
  const showBackButtonInHeader = useCallback(() => setShowBackButton(true), [])
  const hideBackButton = useCallback(() => setShowBackButton(false), [])

  return (
    <NavigationContext.Provider
      value={{
        activePanel,
        setActivePanel,
        openMenu,
        openTheme,
        closeAll,
        showBackButton,
        showBackButtonInHeader,
        hideBackButton,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
