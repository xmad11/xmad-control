/**
 * PWA Components - Index
 *
 * Barrel export for all PWA-related components.
 * All components use design tokens exclusively - NO hardcoded values.
 * Proper TypeScript - NO `any` types.
 */

// Main components
export { InstallPrompt, usePWAInstall } from "./InstallPrompt"
export type { InstallPromptProps } from "./InstallPrompt"

export { OfflineBanner, useOnlineStatus } from "./OfflineBanner"
export type { OfflineBannerProps } from "./OfflineBanner"

export { OfflineSupport } from "./OfflineSupport"
export type { OfflineAction, OfflineSupportProps } from "./OfflineSupport"
