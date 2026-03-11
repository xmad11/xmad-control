/**
 * Token Counter for GLM-4.7 Context Window Management
 *
 * Estimates token usage for context monitoring and handover triggers.
 * Uses character-based approximation with model-specific adjustments.
 *
 * GLM-4.7 Specifications:
 * - Context Window: 200,000 tokens
 * - Safe Usage Threshold: 70% (140,000 tokens)
 * - Handover Trigger: 50% (100,000 tokens)
 * - Output Max: 128,000 tokens
 *
 * @author Coordinator System
 * @version 1.0.0
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/** GLM-4.7 Context Window Specifications */
export const GLM_47_CONTEXT = {
  /** Maximum context window size */
  MAX_TOKENS: 200_000,
  /** Safe usage threshold (70%) - before quality degrades */
  SAFE_THRESHOLD: 0.7,
  /** Handover trigger threshold (50%) - user-specified */
  HANDOVER_THRESHOLD: 0.5,
  /** Output maximum */
  MAX_OUTPUT: 128_000,
} as const

/** Token calculation ratios based on language analysis */
const TOKEN_RATIOS = {
  /** English text: ~4 characters per token */
  english: 0.25,
  /** Code: ~3.5 characters per token */
  code: 0.286,
  /** Chinese text: ~1.5 characters per token */
  chinese: 0.667,
  /** Mixed content: weighted average */
  mixed: 0.3,
} as const

/** File type categorization */
const FILE_PATTERNS = {
  /** TypeScript/JavaScript files (code) */
  code: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".jsonc"],
  /** Markdown documentation (mixed) */
  docs: [".md", ".mdx"],
  /** CSS/SCSS files (code) */
  styles: [".css", ".scss", ".sass", ".less"],
  /** Config files (code) */
  config: [".json", ".yaml", ".yml", ".toml", ".ini"],
} as const

// ============================================================================
// TOKEN COUNTING FUNCTIONS
// ============================================================================

/**
 * Estimate tokens from text using character-based approximation.
 * Uses GLM-4.7 specific ratios.
 *
 * @param text - The text to count tokens for
 * @param type - Content type for ratio selection
 * @returns Estimated token count
 */
export function estimateTokens(text: string, type: keyof typeof TOKEN_RATIOS = "mixed"): number {
  if (!text) return 0

  const ratio = TOKEN_RATIOS[type]
  const charCount = text.length

  // Adjust for whitespace and special characters
  const adjustedCount = charCount * 0.95

  return Math.ceil(adjustedCount * ratio)
}

/**
 * Estimate tokens for a file based on its type.
 *
 * @param content - File content
 * @param filename - File name for type detection
 * @returns Estimated token count
 */
export function estimateFileTokens(content: string, filename: string): number {
  const ext = getFileExtension(filename)
  const type = getFileType(ext)

  return estimateTokens(content, type)
}

/**
 * Get file extension from filename.
 */
function getFileExtension(filename: string): string {
  const match = filename.match(/\.[^.]+$/)
  return match ? match[0] : ""
}

/**
 * Determine file token ratio type based on extension.
 */
function getFileType(ext: string): keyof typeof TOKEN_RATIOS {
  if (
    FILE_PATTERNS.code.includes(ext as any) ||
    FILE_PATTERNS.styles.includes(ext as any) ||
    FILE_PATTERNS.config.includes(ext as any)
  ) {
    return "code"
  }
  if (FILE_PATTERNS.docs.includes(ext as any)) {
    return "mixed"
  }
  return "mixed"
}

// ============================================================================
// CONTEXT MONITORING
// ============================================================================

/**
 * Context usage snapshot for monitoring.
 */
export interface ContextSnapshot {
  /** Total tokens used */
  totalTokens: number
  /** Percentage of context window used */
  usagePercentage: number
  /** Tokens remaining */
  tokensRemaining: number
  /** Tokens until handover trigger */
  tokensUntilHandover: number
  /** Tokens until safe threshold */
  tokensUntilSafe: number
  /** Status assessment */
  status: "safe" | "warning" | "critical" | "handover"
  /** Timestamp of snapshot */
  timestamp: string
  /** Breakdown by source */
  breakdown: ContextBreakdown
}

/**
 * Breakdown of token usage by source.
 */
export interface ContextBreakdown {
  /** Documentation files */
  documentation: number
  /** Code files */
  code: number
  /** System prompts */
  systemPrompts: number
  /** User messages */
  userMessages: number
  /** Assistant responses */
  assistantResponses: number
  /** Other sources */
  other: number
}

/**
 * Calculate current context usage from various sources.
 *
 * @param sources - Token counts from different sources
 * @returns Context snapshot
 */
export function calculateContextUsage(sources: Partial<ContextBreakdown>): ContextSnapshot {
  const breakdown: ContextBreakdown = {
    documentation: sources.documentation || 0,
    code: sources.code || 0,
    systemPrompts: sources.systemPrompts || 0,
    userMessages: sources.userMessages || 0,
    assistantResponses: sources.assistantResponses || 0,
    other: sources.other || 0,
  }

  const totalTokens = Object.values(breakdown).reduce((sum, val) => sum + val, 0)
  const usagePercentage = totalTokens / GLM_47_CONTEXT.MAX_TOKENS
  const tokensRemaining = GLM_47_CONTEXT.MAX_TOKENS - totalTokens
  const handoverLimit = GLM_47_CONTEXT.MAX_TOKENS * GLM_47_CONTEXT.HANDOVER_THRESHOLD
  const safeLimit = GLM_47_CONTEXT.MAX_TOKENS * GLM_47_CONTEXT.SAFE_THRESHOLD

  const tokensUntilHandover = Math.max(0, handoverLimit - totalTokens)
  const tokensUntilSafe = Math.max(0, safeLimit - totalTokens)

  // Determine status
  let status: ContextSnapshot["status"]
  if (usagePercentage >= GLM_47_CONTEXT.SAFE_THRESHOLD) {
    status = "critical"
  } else if (usagePercentage >= GLM_47_CONTEXT.HANDOVER_THRESHOLD) {
    status = "handover"
  } else if (usagePercentage >= 0.4) {
    status = "warning"
  } else {
    status = "safe"
  }

  return {
    totalTokens,
    usagePercentage,
    tokensRemaining,
    tokensUntilHandover,
    tokensUntilSafe,
    status,
    timestamp: new Date().toISOString(),
    breakdown,
  }
}

/**
 * Check if handover should be triggered.
 *
 * @param snapshot - Context snapshot
 * @returns True if handover should be triggered
 */
export function shouldTriggerHandover(snapshot: ContextSnapshot): boolean {
  return snapshot.status === "handover" || snapshot.status === "critical"
}

// ============================================================================
// FILE SCANNING
// ============================================================================

/**
 * Scan a directory and estimate token usage.
 *
 * @param dirPath - Directory path to scan
 * @param patterns - File patterns to include
 * @returns Total token count
 */
export async function scanDirectoryTokens(
  dirPath: string,
  patterns: string[] = ["**/*.{ts,tsx,md,json}"]
): Promise<number> {
  // This would use glob to scan files
  // For now, return placeholder
  // In production: use glob pattern matching and read files
  return 0
}

/**
 * Estimate tokens for multiple files.
 *
 * @param files - Map of filenames to content
 * @returns Total token count
 */
export function estimateMultipleFiles(files: Map<string, string>): Map<string, number> {
  const results = new Map<string, number>()

  for (const [filename, content] of files.entries()) {
    results.set(filename, estimateFileTokens(content, filename))
  }

  return results
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format token count for display.
 *
 * @param tokens - Token count
 * @returns Formatted string
 */
export function formatTokens(tokens: number): string {
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`
  }
  return tokens.toString()
}

/**
 * Create a progress bar for context usage.
 *
 * @param percentage - Usage percentage (0-1)
 * @param width - Bar width in characters
 * @returns ASCII progress bar
 */
export function createProgressBar(percentage: number, width = 30): string {
  const filled = Math.round(percentage * width)
  const empty = width - filled

  const bar = "█".repeat(filled) + "░".repeat(empty)

  // Color based on usage
  if (percentage >= 0.7) {
    return `\x1b[31m${bar}\x1b[0m` // Red
  } else if (percentage >= 0.5) {
    return `\x1b[33m${bar}\x1b[0m` // Yellow
  } else {
    return `\x1b[32m${bar}\x1b[0m` // Green
  }
}

/**
 * Print context usage report.
 *
 * @param snapshot - Context snapshot
 */
export function printContextReport(snapshot: ContextSnapshot): void {
  const bar = createProgressBar(snapshot.usagePercentage)

  console.log("\n📊 Context Usage Report")
  console.log("─".repeat(50))
  console.log(`Progress: [${bar}] ${(snapshot.usagePercentage * 100).toFixed(1)}%`)
  console.log(
    `Tokens Used: ${formatTokens(snapshot.totalTokens)} / ${formatTokens(GLM_47_CONTEXT.MAX_TOKENS)}`
  )
  console.log(`Remaining: ${formatTokens(snapshot.tokensRemaining)}`)
  console.log(`Status: ${snapshot.status.toUpperCase()}`)
  console.log("\nBreakdown:")
  console.log(`  Documentation: ${formatTokens(snapshot.breakdown.documentation)}`)
  console.log(`  Code: ${formatTokens(snapshot.breakdown.code)}`)
  console.log(`  System Prompts: ${formatTokens(snapshot.breakdown.systemPrompts)}`)
  console.log(`  User Messages: ${formatTokens(snapshot.breakdown.userMessages)}`)
  console.log(`  Assistant Responses: ${formatTokens(snapshot.breakdown.assistantResponses)}`)
  console.log(`  Other: ${formatTokens(snapshot.breakdown.other)}`)
  console.log("\nThresholds:")
  console.log(`  Handover (50%): ${formatTokens(snapshot.tokensUntilHandover)} tokens remaining`)
  console.log(`  Safe (70%): ${formatTokens(snapshot.tokensUntilSafe)} tokens remaining`)
  console.log("─".repeat(50))
}
