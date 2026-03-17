/* ═══════════════════════════════════════════════════════════════════════════════
   ELEVENLABS UI COMPONENTS - Index
   Voice and conversation components from ElevenLabs UI library
   ═══════════════════════════════════════════════════════════════════════════════ */

// Live Waveform - Real-time canvas-based audio waveform visualizer
export { LiveWaveform, type LiveWaveformProps } from "./live-waveform"

// Conversation Bar - Complete voice conversation interface
export {
  ConversationBar,
  type ConversationBarProps,
  type ConnectionState,
} from "./conversation-bar"

// Conversation - Scrolling container with auto-scroll
export {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  type ConversationProps,
  type ConversationContentProps,
  type ConversationEmptyStateProps,
  type ConversationScrollButtonProps,
} from "./conversation"

// Response - Streaming markdown renderer
export { Response, type ResponseProps } from "./response"

// Shimmering Text - Animated gradient text effect
export { ShimmeringText, type ShimmeringTextProps } from "./shimmering-text"
