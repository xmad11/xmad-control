/* ═══════════════════════════════════════════════════════════════════════════════
   DASHBOARD LAYOUT - Shared layout for all dashboard pages
   Role-aware Header and SideMenu, consistent structure
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import Header, { type UserRole } from "@/components/layout/Header"
import { useCallback, useState } from "react"

export interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: UserRole
  role?: UserRole
  showRoleBadge?: boolean
  title?: string
  subtitle?: string
}

/**
 * DashboardLayout - Shared layout for all dashboard pages
 *
 * Features:
 * - Role-aware Header
 * - Consistent spacing and structure
 *
 * @example
 * <DashboardLayout userRole="user">
 *   <div>Your dashboard content</div>
 * </DashboardLayout>
 */
export function DashboardLayout({
  children,
  userRole,
  role,
  showRoleBadge = true,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const resolvedRole = userRole || role || "user"

  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-[var(--color-primary)]/30">
      {/* UI Infrastructure - Header */}
      <Header role={resolvedRole} showRoleBadge={showRoleBadge} title={title} subtitle={subtitle} />

      {/* Main Content */}
      <main id="main-content" className="relative pt-0 pb-[var(--spacing-4xl)]">
        {children}
      </main>
    </div>
  )
}
