/**
 * Context Monitor for GLM-4.7 Agent Handovers
 *
 * Continuously monitors context window usage and triggers handovers
 * when thresholds are reached.
 *
 * @author Coordinator System
 * @version 1.0.0
 */

import {
  type AgentHandoffState,
  type ChatMessage,
  type Decision,
  type FileRecord,
  HandoffStateBuilder,
  type Issue,
  saveHandoffState,
  serializeHandoffState,
} from "./handoff-protocol"
import {
  type ContextSnapshot,
  GLM_47_CONTEXT,
  calculateContextUsage,
  printContextReport,
  shouldTriggerHandover,
} from "./token-counter"

// ============================================================================
// MONITOR CONFIGURATION
// ============================================================================

/**
 * Context monitor configuration.
 */
export interface ContextMonitorConfig {
  /** Check interval in milliseconds (0 for manual only) */
  checkInterval: number
  /** Handover trigger threshold (0-1) */
  handoverThreshold: number
  /** Safe usage threshold (0-1) */
  safeThreshold: number
  /** Whether to print reports */
  verbose: boolean
  /** Handoff state storage directory */
  storageDirectory: string
  /** Maximum recent messages to preserve */
  maxRecentMessages: number
  /** Messages between summaries */
  summaryInterval: number
}

/** Default monitor configuration */
const DEFAULT_CONFIG: ContextMonitorConfig = {
  checkInterval: 0, // Manual only by default
  handoverThreshold: GLM_47_CONTEXT.HANDOVER_THRESHOLD,
  safeThreshold: GLM_47_CONTEXT.SAFE_THRESHOLD,
  verbose: true,
  storageDirectory: ".coordinator/handoffs",
  maxRecentMessages: 10,
  summaryInterval: 5,
}

// ============================================================================
// CONTEXT MONITOR CLASS
// ============================================================================

/**
 * Main context monitor class.
 *
 * Tracks token usage throughout an agent session and triggers
 * handovers when thresholds are reached.
 */
export class ContextMonitor {
  private config: ContextMonitorConfig
  private currentSnapshot: ContextSnapshot | null = null
  private conversationHistory: ChatMessage[] = []
  private decisions: Decision[] = []
  private issues: Issue[] = []
  private filesRead: FileRecord[] = []
  private filesModified: FileRecord[] = []
  private filesCreated: FileRecord[] = []
  private handoffCount = 0
  private sessionStartTime: string

  constructor(config: Partial<ContextMonitorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.sessionStartTime = new Date().toISOString()
  }

  // ========================================================================
  // TOKEN TRACKING
  // ========================================================================

  /**
   * Add tokens from documentation source.
   */
  trackDocumentation(tokens: number): void {
    this.updateSnapshot({ documentation: tokens })
  }

  /**
   * Add tokens from code source.
   */
  trackCode(tokens: number): void {
    this.updateSnapshot({ code: tokens })
  }

  /**
   * Add tokens from system prompt.
   */
  trackSystemPrompt(tokens: number): void {
    this.updateSnapshot({ systemPrompts: tokens })
  }

  /**
   * Add tokens from user message.
   */
  trackUserMessage(content: string): void {
    // Approximate token count (will be refined by actual tokenizer)
    const tokens = Math.ceil(content.length * 0.3)

    const message: ChatMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      index: this.conversationHistory.length,
    }

    this.conversationHistory.push(message)
    this.updateSnapshot({ userMessages: tokens })
  }

  /**
   * Add tokens from assistant response.
   */
  trackAssistantMessage(content: string, toolCalls?: ChatMessage["toolCalls"]): void {
    const tokens = Math.ceil(content.length * 0.3)

    const message: ChatMessage = {
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
      index: this.conversationHistory.length,
      toolCalls,
    }

    this.conversationHistory.push(message)
    this.updateSnapshot({ assistantResponses: tokens })
  }

  /**
   * Track file read operation.
   */
  trackFileRead(filepath: string, content: string): void {
    const tokens = Math.ceil(content.length * 0.286) // Code ratio

    const record: FileRecord = {
      path: filepath,
      tokens,
      lastModified: new Date().toISOString(),
      status: "read",
    }

    this.filesRead.push(record)
    this.updateSnapshot({ code: tokens })
  }

  /**
   * Track file modification.
   */
  trackFileModified(filepath: string, content: string): void {
    const tokens = Math.ceil(content.length * 0.286)

    const record: FileRecord = {
      path: filepath,
      tokens,
      lastModified: new Date().toISOString(),
      status: "modified",
    }

    this.filesModified.push(record)
  }

  /**
   * Track file creation.
   */
  trackFileCreated(filepath: string, content: string): void {
    const tokens = Math.ceil(content.length * 0.286)

    const record: FileRecord = {
      path: filepath,
      tokens,
      lastModified: new Date().toISOString(),
      status: "created",
    }

    this.filesCreated.push(record)
  }

  // ========================================================================
  // CONTEXT UPDATES
  // ========================================================================

  /**
   * Update context snapshot with new token counts.
   */
  private updateSnapshot(additionalTokens: {
    documentation?: number
    code?: number
    systemPrompts?: number
    userMessages?: number
    assistantResponses?: number
    other?: number
  }): void {
    const base = this.currentSnapshot || {
      documentation: 0,
      code: 0,
      systemPrompts: 0,
      userMessages: 0,
      assistantResponses: 0,
      other: 0,
    }

    const updated = {
      documentation: base.documentation + (additionalTokens.documentation || 0),
      code: base.code + (additionalTokens.code || 0),
      systemPrompts: base.systemPrompts + (additionalTokens.systemPrompts || 0),
      userMessages: base.userMessages + (additionalTokens.userMessages || 0),
      assistantResponses: base.assistantResponses + (additionalTokens.assistantResponses || 0),
      other: base.other + (additionalTokens.other || 0),
    }

    this.currentSnapshot = calculateContextUsage(updated)

    if (this.config.verbose) {
      this.checkAndWarn()
    }
  }

  /**
   * Check if warning should be displayed.
   */
  private checkAndWarn(): void {
    if (!this.currentSnapshot) return

    const { status, usagePercentage } = this.currentSnapshot

    if (status === "handover") {
      console.warn("\n⚠️  HANDOVER THRESHOLD REACHED")
      console.warn(`   Usage: ${(usagePercentage * 100).toFixed(1)}%`)
      console.warn("   Prepare for handover to new agent instance.\n")
    } else if (status === "critical") {
      console.error("\n🚨 CRITICAL CONTEXT LEVEL")
      console.error(`   Usage: ${(usagePercentage * 100).toFixed(1)}%`)
      console.error("   Handover REQUIRED immediately.\n")
    }
  }

  // ========================================================================
  // DECISION & ISSUE TRACKING
  // ========================================================================

  /**
   * Record a decision made during the session.
   */
  recordDecision(decision: Omit<Decision, "timestamp">): void {
    this.decisions.push({
      ...decision,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Record an issue and its resolution.
   */
  recordIssue(issue: Omit<Issue, "timestamp">): void {
    this.issues.push({
      ...issue,
      timestamp: new Date().toISOString(),
    })
  }

  // ========================================================================
  // HANDOFF TRIGGERING
  // ========================================================================

  /**
   * Check if handover should be triggered.
   */
  shouldHandover(): boolean {
    return this.currentSnapshot ? shouldTriggerHandover(this.currentSnapshot) : false
  }

  /**
   * Get current context snapshot.
   */
  getSnapshot(): ContextSnapshot | null {
    return this.currentSnapshot
  }

  /**
   * Print current context report.
   */
  printReport(): void {
    if (this.currentSnapshot) {
      printContextReport(this.currentSnapshot)
    } else {
      console.log("No context data available.")
    }
  }

  /**
   * Generate handoff state from current session.
   */
  generateHandoffState(
    agentId: string,
    agentRole: string,
    taskContext: Parameters<HandoffStateBuilder["withTask"]>[0]
  ): AgentHandoffState {
    if (!this.currentSnapshot) {
      throw new Error("No context snapshot available")
    }

    const builder = new HandoffStateBuilder()

    // Build source info
    builder.withSource({
      agentId,
      agentRole,
      sessionId: this.sessionStartTime,
      messageCount: this.conversationHistory.length,
      tokenUsage: {
        total: this.currentSnapshot.totalTokens,
        input:
          this.currentSnapshot.breakdown.userMessages +
          this.currentSnapshot.breakdown.systemPrompts +
          this.currentSnapshot.breakdown.documentation +
          this.currentSnapshot.breakdown.code,
        output: this.currentSnapshot.breakdown.assistantResponses,
        percentage: this.currentSnapshot.usagePercentage,
      },
    })

    // Add task context
    builder.withTask(taskContext)

    // Add recent messages
    const recentMessages = this.conversationHistory.slice(-this.config.maxRecentMessages)
    for (const msg of recentMessages) {
      builder.addMessage(msg)
    }

    // Add decisions
    for (const decision of this.decisions) {
      builder.addDecision(decision)
    }

    // Add issues
    for (const issue of this.issues) {
      builder.addIssue(issue)
    }

    // Add file tracking
    for (const file of this.filesRead) {
      builder.addFile(file, "read")
    }
    for (const file of this.filesModified) {
      builder.addFile(file, "modified")
    }
    for (const file of this.filesCreated) {
      builder.addFile(file, "created")
    }

    // Build and return
    return builder.build()
  }

  /**
   * Execute handover - save state and prepare for transfer.
   */
  async executeHandover(
    agentId: string,
    agentRole: string,
    taskContext: Parameters<HandoffStateBuilder["withTask"]>[0]
  ): Promise<string> {
    const state = this.generateHandoffState(agentId, agentRole, taskContext)

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `handoff-${agentId}-${timestamp}.json`
    const filepath = `${this.config.storageDirectory}/${filename}`

    // Save state
    saveHandoffState(state, filepath)

    this.handoffCount++

    if (this.config.verbose) {
      console.log("\n✅ HANDOFF STATE CREATED")
      console.log(`   ID: ${state.handoffId}`)
      console.log(`   File: ${filepath}`)
      console.log(`   Tokens: ${state.source.tokenUsage.total}`)
      console.log(`   Messages: ${state.conversation.messageCount}`)
      console.log(
        `   Files: ${this.filesRead.length + this.filesModified.length + this.filesCreated.length}`
      )
    }

    return state.handoffId
  }

  // ========================================================================
  // SESSION STATISTICS
  // ========================================================================

  /**
   * Get session statistics.
   */
  getStats() {
    return {
      sessionStartTime: this.sessionStartTime,
      handoffCount: this.handoffCount,
      messageCount: this.conversationHistory.length,
      decisionCount: this.decisions.length,
      issueCount: this.issues.length,
      filesRead: this.filesRead.length,
      filesModified: this.filesModified.length,
      filesCreated: this.filesCreated.length,
      currentSnapshot: this.currentSnapshot,
    }
  }
}

// ============================================================================
// GLOBAL MONITOR INSTANCE
// ============================================================================

/**
 * Global context monitor instance.
 * In a real implementation, this would be managed by the runtime.
 */
let globalMonitor: ContextMonitor | null = null

/**
 * Initialize the global context monitor.
 */
export function initContextMonitor(config?: Partial<ContextMonitorConfig>): ContextMonitor {
  if (!globalMonitor) {
    globalMonitor = new ContextMonitor(config)
  }
  return globalMonitor
}

/**
 * Get the global context monitor instance.
 */
export function getContextMonitor(): ContextMonitor | null {
  return globalMonitor
}

/**
 * Check if global monitor exists and should handover.
 */
export function checkHandoverNeeded(): boolean {
  return globalMonitor ? globalMonitor.shouldHandover() : false
}
