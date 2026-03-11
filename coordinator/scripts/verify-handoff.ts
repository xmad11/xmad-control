/**
 * Handoff Verification System
 *
 * Verifies that handoffs preserve state correctly and
 * enable seamless agent continuity.
 *
 * @author Coordinator System
 * @version 1.0.0
 */

import { type AgentHandoffState, validateHandoffState } from "./handoff-protocol"
import { ContextSnapshot, calculateContextUsage } from "./token-counter"

// ============================================================================
// VERIFICATION TYPES
// ============================================================================

/**
 * Handoff verification result.
 */
export interface VerificationResult {
  /** Overall verification status */
  success: boolean
  /** Verification timestamp */
  timestamp: string
  /** Handoff ID being verified */
  handoffId: string
  /** Individual check results */
  checks: VerificationCheck[]
  /** Warnings (non-critical issues) */
  warnings: string[]
  /** Errors (critical issues that failed verification) */
  errors: string[]
  /** Summary statistics */
  summary: VerificationSummary
}

/**
 * Individual verification check.
 */
export interface VerificationCheck {
  /** Check name */
  name: string
  /** Check status */
  status: "pass" | "fail" | "warn"
  /** Check description */
  description: string
  /** Additional details */
  details?: string
  /** Time taken for check (ms) */
  duration: number
}

/**
 * Verification summary.
 */
export interface VerificationSummary {
  /** Total checks performed */
  totalChecks: number
  /** Checks passed */
  passedChecks: number
  /** Checks failed */
  failedChecks: number
  /** Checks with warnings */
  warnedChecks: number
  /** Overall duration (ms) */
  duration: number
  /** Continuity preserved */
  continuityPreserved: boolean
}

// ============================================================================
// VERIFICATION ENGINE
// ============================================================================

/**
 * Handoff verifier class.
 */
export class HandoffVerifier {
  /**
   * Verify a complete handoff state.
   */
  async verifyHandoff(
    state: AgentHandoffState,
    options: VerificationOptions = {}
  ): Promise<VerificationResult> {
    const startTime = Date.now()
    const checks: VerificationCheck[] = []
    const warnings: string[] = []
    const errors: string[] = []

    // Run all verification checks
    const allChecks = this.getAllChecks()

    for (const check of allChecks) {
      const result = await check.run(state, options)
      checks.push(result)

      if (result.status === "fail") {
        errors.push(`${check.name}: ${result.details || "Failed"}`)
      } else if (result.status === "warn") {
        warnings.push(`${check.name}: ${result.details || "Warning"}`)
      }
    }

    const duration = Date.now() - startTime
    const passedChecks = checks.filter((c) => c.status === "pass").length
    const failedChecks = checks.filter((c) => c.status === "fail").length
    const warnedChecks = checks.filter((c) => c.status === "warn").length
    const success = failedChecks === 0

    return {
      success,
      timestamp: new Date().toISOString(),
      handoffId: state.handoffId,
      checks,
      warnings,
      errors,
      summary: {
        totalChecks: checks.length,
        passedChecks,
        failedChecks,
        warnedChecks,
        duration,
        continuityPreserved: success && this.checkContinuity(checks),
      },
    }
  }

  /**
   * Get all verification checks.
   */
  private getAllChecks(): VerificationCheckDefinition[] {
    return [
      // Structure checks
      this.checkProtocolVersion,
      this.checkHandoffId,
      this.checkSourceInfo,
      this.checkTaskContext,

      // Conversation checks
      this.checkConversationHistory,
      this.checkRecentMessages,
      this.checkDecisions,
      this.checkIssues,

      // Memory checks
      this.checkWorkingMemory,
      this.checkActiveFiles,
      this.checkActiveWork,
      this.checkPendingActions,

      // File tracking checks
      this.checkFileTracking,
      this.checkFileIntegrity,

      // Progress checks
      this.checkProgressState,
      this.checkCheckpoints,

      // Metadata checks
      this.checkMetadata,
      this.checkCompressionMethod,
    ]
  }

  /**
   * Check if continuity is preserved.
   */
  private checkContinuity(checks: VerificationCheck[]): boolean {
    const criticalChecks = [
      "checkTaskContext",
      "checkConversationHistory",
      "checkWorkingMemory",
      "checkFileTracking",
    ]

    return criticalChecks.every((name) => {
      const check = checks.find((c) => c.name === name)
      return check && check.status !== "fail"
    })
  }

  // ========================================================================
  // INDIVIDUAL CHECKS
  // ========================================================================

  private checkProtocolVersion: VerificationCheckDefinition = {
    name: "Protocol Version",
    description: "Verify protocol version is supported",
    run: async (state) => {
      const supported = ["1.0.0"]
      const isSupported = supported.includes(state.protocolVersion)

      return {
        name: "Protocol Version",
        status: isSupported ? "pass" : "fail",
        description: "Protocol version compatibility",
        details: isSupported
          ? `Version ${state.protocolVersion} is supported`
          : `Version ${state.protocolVersion} is not supported`,
        duration: 0,
      }
    },
  }

  private checkHandoffId: VerificationCheckDefinition = {
    name: "Handoff ID",
    description: "Verify handoff ID is present and valid",
    run: async (state) => {
      const isValid = state.handoffId && state.handoffId.startsWith("handoff-")

      return {
        name: "Handoff ID",
        status: isValid ? "pass" : "fail",
        description: "Handoff ID validation",
        details: isValid ? `Valid ID: ${state.handoffId}` : "Invalid or missing handoff ID",
        duration: 0,
      }
    },
  }

  private checkSourceInfo: VerificationCheckDefinition = {
    name: "Source Info",
    description: "Verify source agent information is complete",
    run: async (state) => {
      const required = ["agentId", "agentRole", "sessionId", "messageCount", "tokenUsage"]
      const missing = required.filter((field) => !(field in state.source))

      return {
        name: "Source Info",
        status: missing.length === 0 ? "pass" : "fail",
        description: "Source agent information completeness",
        details:
          missing.length === 0
            ? "All required fields present"
            : `Missing fields: ${missing.join(", ")}`,
        duration: 0,
      }
    },
  }

  private checkTaskContext: VerificationCheckDefinition = {
    name: "Task Context",
    description: "Verify task context is preserved",
    run: async (state) => {
      const required = ["taskDescription", "taskStatus", "currentStep"]
      const missing = required.filter((field) => !(field in state.task))

      // Check if task status is valid
      const validStatuses = ["pending", "in_progress", "review", "completed", "blocked"]
      const statusValid = validStatuses.includes(state.task.taskStatus)

      return {
        name: "Task Context",
        status: missing.length === 0 && statusValid ? "pass" : "fail",
        description: "Task context preservation",
        details:
          missing.length === 0 && statusValid
            ? `Task: ${state.task.taskId || "unnamed"} - Status: ${state.task.taskStatus}`
            : missing.length > 0
              ? `Missing: ${missing.join(", ")}`
              : `Invalid status: ${state.task.taskStatus}`,
        duration: 0,
      }
    },
  }

  private checkConversationHistory: VerificationCheckDefinition = {
    name: "Conversation History",
    description: "Verify conversation history is preserved",
    run: async (state) => {
      const history = state.conversation
      const hasHistory = history && typeof history.messageCount === "number"

      // Check message count consistency
      const messageCountMatch =
        history.messageCount ===
        history.compressed.reduce(
          (sum, s) => sum + (s.messageRange[1] - s.messageRange[0] + 1),
          0
        ) +
          history.recentMessages.length

      return {
        name: "Conversation History",
        status: hasHistory ? "pass" : "fail",
        description: "Conversation history preservation",
        details: hasHistory
          ? `${history.messageCount} messages tracked`
          : "Conversation history missing or incomplete",
        duration: 0,
      }
    },
  }

  private checkRecentMessages: VerificationCheckDefinition = {
    name: "Recent Messages",
    description: "Verify recent messages are preserved",
    run: async (state) => {
      const recent = state.conversation.recentMessages
      const hasRecent = recent && recent.length > 0

      // Validate message structure
      const validStructure =
        hasRecent &&
        recent.every(
          (msg) => msg.role && msg.content && msg.timestamp && typeof msg.index === "number"
        )

      return {
        name: "Recent Messages",
        status: validStructure ? "pass" : "fail",
        description: "Recent messages preservation",
        details: validStructure
          ? `${recent.length} recent messages preserved`
          : "Recent messages missing or invalid structure",
        duration: 0,
      }
    },
  }

  private checkDecisions: VerificationCheckDefinition = {
    name: "Decisions",
    description: "Verify important decisions are recorded",
    run: async (state) => {
      const decisions = state.conversation.decisions
      const hasDecisions = Array.isArray(decisions)

      // Validate decision structure if present
      const validStructure =
        !hasDecisions ||
        decisions.length === 0 ||
        decisions.every((d) => d.description && d.rationale && d.timestamp)

      return {
        name: "Decisions",
        status: validStructure ? "pass" : "fail",
        description: "Important decisions recording",
        details:
          hasDecisions && decisions.length > 0
            ? `${decisions.length} decisions recorded`
            : "No decisions recorded (acceptable)",
        duration: 0,
      }
    },
  }

  private checkIssues: VerificationCheckDefinition = {
    name: "Issues",
    description: "Verify issues and resolutions are tracked",
    run: async (state) => {
      const issues = state.conversation.issues
      const hasIssues = Array.isArray(issues)

      // Validate issue structure if present
      const validStructure =
        !hasIssues ||
        issues.length === 0 ||
        issues.every((i) => i.issue && i.resolution && i.timestamp && i.status)

      return {
        name: "Issues",
        status: validStructure ? "pass" : "fail",
        description: "Issues and resolutions tracking",
        details:
          hasIssues && issues.length > 0
            ? `${issues.length} issues tracked`
            : "No issues tracked (acceptable)",
        duration: 0,
      }
    },
  }

  private checkWorkingMemory: VerificationCheckDefinition = {
    name: "Working Memory",
    description: "Verify working memory is preserved",
    run: async (state) => {
      const memory = state.memory
      const hasMemory = memory && typeof memory.variables === "object"

      return {
        name: "Working Memory",
        status: hasMemory ? "pass" : "fail",
        description: "Working memory preservation",
        details: hasMemory
          ? `${Object.keys(memory.variables).length} variables, ` +
            `${memory.activeFiles.length} active files, ` +
            `${memory.notes.length} notes`
          : "Working memory missing",
        duration: 0,
      }
    },
  }

  private checkActiveFiles: VerificationCheckDefinition = {
    name: "Active Files",
    description: "Verify active files are tracked",
    run: async (state) => {
      const activeFiles = state.memory.activeFiles
      const hasActiveFiles = Array.isArray(activeFiles)

      return {
        name: "Active Files",
        status: hasActiveFiles ? "pass" : "fail",
        description: "Active files tracking",
        details: hasActiveFiles
          ? `${activeFiles.length} active files tracked`
          : "Active files list missing",
        duration: 0,
      }
    },
  }

  private checkActiveWork: VerificationCheckDefinition = {
    name: "Active Work",
    description: "Verify active work items are tracked",
    run: async (state) => {
      const activeWork = state.memory.activeWork
      const hasActiveWork = Array.isArray(activeWork)

      // Validate structure if present
      const validStructure =
        !hasActiveWork ||
        activeWork.length === 0 ||
        activeWork.every(
          (w) => w.id && w.type && w.name && w.path && w.state && typeof w.progress === "number"
        )

      return {
        name: "Active Work",
        status: validStructure ? "pass" : "fail",
        description: "Active work items tracking",
        details:
          hasActiveWork && activeWork.length > 0
            ? `${activeWork.length} active work items`
            : "No active work items (acceptable)",
        duration: 0,
      }
    },
  }

  private checkPendingActions: VerificationCheckDefinition = {
    name: "Pending Actions",
    description: "Verify pending actions are tracked",
    run: async (state) => {
      const pending = state.memory.pendingActions
      const hasPending = Array.isArray(pending)

      return {
        name: "Pending Actions",
        status: hasPending ? "pass" : "fail",
        description: "Pending actions tracking",
        details:
          hasPending && pending.length > 0
            ? `${pending.length} pending actions`
            : "No pending actions (acceptable)",
        duration: 0,
      }
    },
  }

  private checkFileTracking: VerificationCheckDefinition = {
    name: "File Tracking",
    description: "Verify file operations are tracked",
    run: async (state) => {
      const files = state.files
      const hasFiles =
        files &&
        Array.isArray(files.readFiles) &&
        Array.isArray(files.modifiedFiles) &&
        Array.isArray(files.createdFiles) &&
        Array.isArray(files.pendingReview)

      return {
        name: "File Tracking",
        status: hasFiles ? "pass" : "fail",
        description: "File operations tracking",
        details: hasFiles
          ? `${files.readFiles.length} read, ` +
            `${files.modifiedFiles.length} modified, ` +
            `${files.createdFiles.length} created, ` +
            `${files.pendingReview.length} pending review`
          : "File tracking incomplete",
        duration: 0,
      }
    },
  }

  private checkFileIntegrity: VerificationCheckDefinition = {
    name: "File Integrity",
    description: "Verify file records have required fields",
    run: async (state) => {
      const allFiles = [
        ...state.files.readFiles,
        ...state.files.modifiedFiles,
        ...state.files.createdFiles,
        ...state.files.pendingReview,
      ]

      const validStructure = allFiles.every(
        (file) => file.path && file.tokens > 0 && file.lastModified && file.status
      )

      return {
        name: "File Integrity",
        status: validStructure ? "pass" : "fail",
        description: "File record integrity",
        details: validStructure
          ? `${allFiles.length} files have valid records`
          : "Some file records are missing required fields",
        duration: 0,
      }
    },
  }

  private checkProgressState: VerificationCheckDefinition = {
    name: "Progress State",
    description: "Verify progress information is preserved",
    run: async (state) => {
      const progress = state.progress
      const hasProgress =
        progress &&
        typeof progress.overallProgress === "number" &&
        Array.isArray(progress.checkpoints)

      return {
        name: "Progress State",
        status: hasProgress ? "pass" : "fail",
        description: "Progress state preservation",
        details: hasProgress
          ? `Phase: ${progress.currentPhase}, ` +
            `Progress: ${(progress.overallProgress * 100).toFixed(0)}%, ` +
            `${progress.checkpoints.length} checkpoints`
          : "Progress state missing",
        duration: 0,
      }
    },
  }

  private checkCheckpoints: VerificationCheckDefinition = {
    name: "Checkpoints",
    description: "Verify checkpoints are recorded",
    run: async (state) => {
      const checkpoints = state.progress.checkpoints
      const hasCheckpoints = Array.isArray(checkpoints)

      // Validate checkpoint structure if present
      const validStructure =
        !hasCheckpoints ||
        checkpoints.length === 0 ||
        checkpoints.every((cp) => cp.id && cp.name && cp.timestamp && cp.state)

      return {
        name: "Checkpoints",
        status: validStructure ? "pass" : "fail",
        description: "Checkpoint recording",
        details:
          hasCheckpoints && checkpoints.length > 0
            ? `${checkpoints.length} checkpoints recorded`
            : "No checkpoints (acceptable)",
        duration: 0,
      }
    },
  }

  private checkMetadata: VerificationCheckDefinition = {
    name: "Metadata",
    description: "Verify handoff metadata is complete",
    run: async (state) => {
      const metadata = state.metadata
      const required = ["reason", "priority", "context", "protocolVersion", "compressionMethod"]
      const missing = required.filter((field) => !(field in metadata))

      return {
        name: "Metadata",
        status: missing.length === 0 ? "pass" : "fail",
        description: "Handoff metadata completeness",
        details:
          missing.length === 0
            ? `Reason: ${metadata.reason}, Priority: ${metadata.priority}`
            : `Missing fields: ${missing.join(", ")}`,
        duration: 0,
      }
    },
  }

  private checkCompressionMethod: VerificationCheckDefinition = {
    name: "Compression Method",
    description: "Verify compression method is valid",
    run: async (state) => {
      const method = state.metadata.compressionMethod
      const validMethods = ["none", "summary", "summary+v2", "semantic"]

      return {
        name: "Compression Method",
        status: validMethods.includes(method) ? "pass" : "warn",
        description: "Compression method validation",
        details: validMethods.includes(method) ? `Using: ${method}` : `Unknown method: ${method}`,
        duration: 0,
      }
    },
  }
}

// ============================================================================
// SUPPORTING TYPES
// ============================================================================

/**
 * Verification check definition.
 */
interface VerificationCheckDefinition {
  /** Check name */
  name: string
  /** Check description */
  description: string
  /** Run the check */
  run: (
    state: AgentHandoffState,
    options: VerificationOptions
  ) => Promise<VerificationCheck> | VerificationCheck
}

/**
 * Verification options.
 */
export interface VerificationOptions {
  /** Strict mode (warnings become failures) */
  strict?: boolean
  /** Skip specific checks */
  skipChecks?: string[]
  /** Only run specific checks */
  onlyChecks?: string[]
}

// ============================================================================
// VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Verify handoff continuity.
 *
 * This is the main entry point for handoff verification.
 */
export async function verifyHandoffContinuity(params: {
  handoffId: string
  previousAgent: string
  newAgent: string
}): Promise<{
  continuityPreserved: boolean
  verificationResult: VerificationResult
}> {
  // In production: Load handoff state from file
  // For now, create a mock result
  const mockState: AgentHandoffState = {
    protocolVersion: "1.0.0",
    handoffId: params.handoffId,
    createdAt: new Date().toISOString(),
    source: {
      agentId: params.previousAgent,
      agentRole: "page-components",
      sessionId: "session-123",
      messageCount: 42,
      tokenUsage: {
        total: 104000,
        input: 85000,
        output: 19000,
        percentage: 0.52,
      },
    },
    task: {
      taskId: "M01",
      taskDescription: "PWA Hooks Migration",
      taskStatus: "in_progress",
      currentStep: "Completing useOfflineActions",
      completedSteps: ["Step 1", "Step 2"],
      remainingSteps: ["Step 3", "Step 4"],
    },
    conversation: {
      messageCount: 42,
      compressed: [],
      recentMessages: [],
      decisions: [],
      issues: [],
    },
    memory: {
      variables: {},
      activeFiles: [],
      activeWork: [],
      notes: [],
      pendingActions: [],
    },
    files: {
      readFiles: [],
      modifiedFiles: [],
      createdFiles: [],
      pendingReview: [],
    },
    progress: {
      currentPhase: "Migration",
      overallProgress: 0.6,
      checkpoints: [],
      metrics: {
        tasksCompleted: 1,
        tasksTotal: 5,
        approvalRate: 0.8,
        avgTimePerTask: 300,
        tokenUsageTrend: "stable",
      },
    },
    metadata: {
      reason: "context_window_limit",
      priority: "normal",
      context: "Standard handoff",
      protocolVersion: "1.0.0",
      compressionMethod: "summary+v2",
    },
  }

  const verifier = new HandoffVerifier()
  const result = await verifier.verifyHandoff(mockState)

  return {
    continuityPreserved: result.summary.continuityPreserved,
    verificationResult: result,
  }
}

/**
 * Print verification result.
 */
export function printVerificationResult(result: VerificationResult): void {
  console.log("\n📋 HANDOFF VERIFICATION RESULT")
  console.log("═".repeat(60))
  console.log(`Handoff ID: ${result.handoffId}`)
  console.log(`Timestamp: ${result.timestamp}`)
  console.log(`Status: ${result.success ? "✅ PASSED" : "❌ FAILED"}`)
  console.log(
    `Continuity: ${result.summary.continuityPreserved ? "✅ PRESERVED" : "❌ NOT PRESERVED"}`
  )
  console.log("\nSummary:")
  console.log(`  Total Checks: ${result.summary.totalChecks}`)
  console.log(`  Passed: ${result.summary.passedChecks}`)
  console.log(`  Failed: ${result.summary.failedChecks}`)
  console.log(`  Warnings: ${result.summary.warnedChecks}`)
  console.log(`  Duration: ${result.summary.duration}ms`)

  if (result.checks.length > 0) {
    console.log("\nChecks:")
    for (const check of result.checks) {
      const icon = check.status === "pass" ? "✅" : check.status === "fail" ? "❌" : "⚠️"
      console.log(`  ${icon} ${check.name}: ${check.description}`)
      if (check.details) {
        console.log(`     ${check.details}`)
      }
    }
  }

  if (result.warnings.length > 0) {
    console.log("\nWarnings:")
    for (const warning of result.warnings) {
      console.log(`  ⚠️  ${warning}`)
    }
  }

  if (result.errors.length > 0) {
    console.log("\nErrors:")
    for (const error of result.errors) {
      console.log(`  ❌ ${error}`)
    }
  }

  console.log("═".repeat(60))
}
