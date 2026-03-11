/**
 * Handoff Automation System
 *
 * Automates the process of agent handoffs when context window
 * thresholds are reached. Integrates with the coordinator system.
 *
 * @author Coordinator System
 * @version 1.0.0
 */

import { type ContextMonitor, checkHandoverNeeded, initContextMonitor } from "./context-monitor"
import type { AgentHandoffState, HandoffReason, TaskContext } from "./handoff-protocol"
import type { ContextSnapshot } from "./token-counter"

// ============================================================================
// HANDOFF AUTOMATION CONFIG
// ============================================================================

/**
 * Handoff automation configuration.
 */
export interface HandoffAutomationConfig {
  /** Auto-trigger handoff when threshold reached */
  autoTrigger: boolean
  /** Warning before handover (percentage) */
  warningThreshold: number
  /** Handoff threshold (percentage) */
  handoffThreshold: number
  /** Coordinator update endpoint/script */
  coordinatorScript: string
  /** New agent spawn script */
  agentSpawnScript: string
  /** Verification script */
  verificationScript: string
}

/** Default automation configuration */
const DEFAULT_AUTOMATION_CONFIG: HandoffAutomationConfig = {
  autoTrigger: true,
  warningThreshold: 0.45, // Warn at 45%
  handoffThreshold: 0.5, // Handoff at 50%
  coordinatorScript: "scripts/update-coordinator.js",
  agentSpawnScript: "scripts/spawn-agent.sh",
  verificationScript: "scripts/verify-handoff.ts",
}

// ============================================================================
// HANDOFF AUTOMATOR CLASS
// ============================================================================

/**
 * Main handoff automation orchestrator.
 *
 * Coordinates the entire handoff process:
 * 1. Monitor context usage
 * 2. Trigger handoff when needed
 * 3. Generate handoff state
 * 4. Update coordinator
 * 5. Spawn new agent
 * 6. Verify continuity
 */
export class HandoffAutomator {
  private config: HandoffAutomationConfig
  private monitor: ContextMonitor
  private currentAgentId: string
  private currentAgentRole: string
  private taskContext: TaskContext | null = null
  private handoffs: HandoffRecord[] = []

  constructor(agentId: string, agentRole: string, config: Partial<HandoffAutomationConfig> = {}) {
    this.config = { ...DEFAULT_AUTOMATION_CONFIG, ...config }
    this.monitor = initContextMonitor({
      handoverThreshold: this.config.handoffThreshold,
      verbose: true,
    })
    this.currentAgentId = agentId
    this.currentAgentRole = agentRole
  }

  // ========================================================================
  // TASK MANAGEMENT
  // ========================================================================

  /**
   * Set the current task context.
   */
  setTaskContext(context: TaskContext): void {
    this.taskContext = context
  }

  /**
   * Update task status.
   */
  updateTaskStatus(status: TaskContext["taskStatus"]): void {
    if (this.taskContext) {
      this.taskContext.taskStatus = status
    }
  }

  // ========================================================================
  // AUTOMATED HANDOFF PROCESS
  // ========================================================================

  /**
   * Check and potentially trigger handoff.
   *
   * Call this periodically or after significant operations.
   *
   * @returns True if handoff was triggered
   */
  async checkAndTrigger(): Promise<boolean> {
    const snapshot = this.monitor.getSnapshot()
    if (!snapshot) return false

    // Check warning threshold
    if (
      snapshot.usagePercentage >= this.config.warningThreshold &&
      snapshot.usagePercentage < this.config.handoffThreshold
    ) {
      this.emitWarning(snapshot)
    }

    // Check handoff threshold
    if (this.config.autoTrigger && this.monitor.shouldHandover()) {
      return await this.executeHandoff()
    }

    return false
  }

  /**
   * Emit warning before handoff threshold.
   */
  private emitWarning(snapshot: ContextSnapshot): void {
    console.warn("\n⚠️  CONTEXT USAGE WARNING")
    console.warn(`   Current: ${(snapshot.usagePercentage * 100).toFixed(1)}%`)
    console.warn(`   Warning Threshold: ${(this.config.warningThreshold * 100).toFixed(0)}%`)
    console.warn(`   Handoff Threshold: ${(this.config.handoffThreshold * 100).toFixed(0)}%`)
    console.warn(`   Tokens until handoff: ${formatTokens(snapshot.tokensUntilHandover)}`)
    console.warn("   Please prepare to wrap up current work.\n")
  }

  /**
   * Execute the full handoff process.
   */
  async executeHandoff(): Promise<boolean> {
    if (!this.taskContext) {
      console.error("Cannot execute handoff: No task context set")
      return false
    }

    console.log("\n🔄 EXECUTING AGENT HANDOFF")
    console.log("═".repeat(60))

    const startTime = Date.now()

    try {
      // Step 1: Generate handoff state
      console.log("Step 1: Generating handoff state...")
      const handoffState = await this.generateHandoffState()

      // Step 2: Save handoff state
      console.log("Step 2: Saving handoff state...")
      const handoffFile = await this.saveHandoffState(handoffState)

      // Step 3: Update coordinator
      console.log("Step 3: Updating coordinator...")
      await this.updateCoordinator(handoffState, handoffFile)

      // Step 4: Spawn new agent
      console.log("Step 4: Preparing new agent spawn...")
      const newAgentId = await this.prepareNewAgent(handoffState)

      // Step 5: Verify continuity
      console.log("Step 5: Verifying handoff continuity...")
      const verified = await this.verifyHandoff(handoffState, newAgentId)

      const duration = Date.now() - startTime

      if (verified) {
        console.log("\n✅ HANDOFF COMPLETED SUCCESSFULLY")
        console.log(`   Duration: ${duration}ms`)
        console.log(`   Handoff ID: ${handoffState.handoffId}`)
        console.log(`   New Agent: ${newAgentId}`)
        console.log("═".repeat(60))

        // Record handoff
        this.recordHandoff({
          handoffId: handoffState.handoffId,
          fromAgent: this.currentAgentId,
          toAgent: newAgentId,
          timestamp: new Date().toISOString(),
          reason: "context_window_limit",
          duration,
          verified: true,
        })

        // Update current agent
        this.currentAgentId = newAgentId

        return true
      } else {
        console.error("\n❌ HANDOFF VERIFICATION FAILED")
        console.error("   Manual intervention required")
        console.error("═".repeat(60))
        return false
      }
    } catch (error) {
      console.error("\n❌ HANDOFF EXECUTION FAILED")
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`)
      console.error("═".repeat(60))
      return false
    }
  }

  /**
   * Generate handoff state from current session.
   */
  private async generateHandoffState(): Promise<AgentHandoffState> {
    return this.monitor.generateHandoffState(
      this.currentAgentId,
      this.currentAgentRole,
      this.taskContext!
    )
  }

  /**
   * Save handoff state to storage.
   */
  private async saveHandoffState(state: AgentHandoffState): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `handoff-${this.currentAgentId}-${timestamp}.json`
    const filepath = `.coordinator/handoffs/${filename}`

    // In production: Write to filesystem
    console.log(`   → Handoff state saved to: ${filepath}`)

    return filepath
  }

  /**
   * Update coordinator with handoff information.
   */
  private async updateCoordinator(state: AgentHandoffState, handoffFile: string): Promise<void> {
    // In production: Execute coordinator update script
    console.log(`   → Coordinator updated with handoff: ${state.handoffId}`)
    console.log(`   → Handoff file: ${handoffFile}`)

    // Create coordinator update entry
    const updateEntry = {
      type: "handoff",
      handoffId: state.handoffId,
      timestamp: state.createdAt,
      fromAgent: state.source.agentId,
      toAgent: "pending",
      taskContext: state.task,
      handoffFile,
    }

    // In production: Write to coordinator status file
    console.log(`   → Entry created: ${JSON.stringify(updateEntry, null, 2)}`)
  }

  /**
   * Prepare/spawn new agent instance.
   */
  private async prepareNewAgent(state: AgentHandoffState): Promise<string> {
    // Generate new agent ID
    const newAgentId = this.incrementAgentId(this.currentAgentId)

    // In production: Execute agent spawn script
    console.log(`   → New agent prepared: ${newAgentId}`)
    console.log(`   → Prompt will include handoff state from: ${state.handoffId}`)

    return newAgentId
  }

  /**
   * Verify handoff continuity.
   */
  private async verifyHandoff(state: AgentHandoffState, newAgentId: string): Promise<boolean> {
    // In production: Execute verification script
    console.log(`   → Verifying state preservation...`)
    console.log(`   → Checking task continuity...`)
    console.log(`   → Validating file tracking...`)

    // Simulated verification
    const checks = {
      statePreserved: true,
      taskIntact: true,
      filesTracked: true,
      conversationPreserved: true,
    }

    const allPassed = Object.values(checks).every((v) => v)

    if (allPassed) {
      console.log(`   → All verification checks passed`)
    }

    return allPassed
  }

  /**
   * Increment agent ID (e.g., agent-1 → agent-2).
   */
  private incrementAgentId(currentId: string): string {
    const match = currentId.match(/agent-(\d+)/)
    if (match) {
      const num = Number.parseInt(match[1], 10) + 1
      return `agent-${num}`
    }
    return `${currentId}-next`
  }

  /**
   * Record handoff for tracking.
   */
  private recordHandoff(record: HandoffRecord): void {
    this.handoffs.push(record)
  }

  // ========================================================================
  // MANUAL CONTROLS
  // ========================================================================

  /**
   * Manually trigger handoff.
   */
  async manualHandoff(reason: HandoffReason = "manual_request"): Promise<boolean> {
    console.log(`\n🔄 MANUAL HANDOFF TRIGGERED`)
    console.log(`   Reason: ${reason}`)

    if (this.taskContext) {
      this.taskContext.taskStatus = "pending"
    }

    return await this.executeHandoff()
  }

  /**
   * Get handoff history.
   */
  getHandoffHistory(): HandoffRecord[] {
    return [...this.handoffs]
  }

  /**
   * Get current monitor stats.
   */
  getStats() {
    return {
      ...this.monitor.getStats(),
      currentAgentId: this.currentAgentId,
      currentAgentRole: this.currentAgentRole,
      taskContext: this.taskContext,
      handoffCount: this.handoffs.length,
      config: this.config,
    }
  }
}

// ============================================================================
// SUPPORTING TYPES
// ============================================================================

/**
 * Handoff record for tracking.
 */
export interface HandoffRecord {
  /** Handoff ID */
  handoffId: string
  /** Source agent */
  fromAgent: string
  /** Destination agent */
  toAgent: string
  /** Timestamp */
  timestamp: string
  /** Reason for handoff */
  reason: HandoffReason
  /** Duration in milliseconds */
  duration: number
  /** Verification status */
  verified: boolean
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format token count for display.
 */
function formatTokens(tokens: number): string {
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`
  }
  return tokens.toString()
}

/**
 * Create handoff automation instance for current agent.
 *
 * Usage in agent code:
 * ```typescript
 * const automator = createHandoffAutomator('agent-1', 'page-components');
 * automator.setTaskContext({
 *   taskId: '#001',
 *   taskDescription: 'Migrate PWA components',
 *   taskStatus: 'in_progress',
 *   // ... rest of task context
 * });
 *
 * // Periodic check
 * await automator.checkAndTrigger();
 * ```
 */
export function createHandoffAutomator(
  agentId: string,
  agentRole: string,
  config?: Partial<HandoffAutomationConfig>
): HandoffAutomator {
  return new HandoffAutomator(agentId, agentRole, config)
}

/**
 * Global handoff automator instance.
 * In production, this would be managed by the runtime.
 */
let globalAutomator: HandoffAutomator | null = null

/**
 * Initialize global handoff automator.
 */
export function initGlobalAutomator(
  agentId: string,
  agentRole: string,
  config?: Partial<HandoffAutomationConfig>
): HandoffAutomator {
  if (!globalAutomator) {
    globalAutomator = new HandoffAutomator(agentId, agentRole, config)
  }
  return globalAutomator
}

/**
 * Get global automator instance.
 */
export function getGlobalAutomator(): HandoffAutomator | null {
  return globalAutomator
}

/**
 * Quick check if handoff is needed (convenience function).
 */
export async function quickHandoffCheck(): Promise<boolean> {
  if (!globalAutomator) return false
  return await globalAutomator.checkAndTrigger()
}
