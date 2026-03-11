/**
 * Handoff Protocol for Agent State Transfer
 *
 * Defines the serialization format and protocol for transferring
 * state between GLM-4.7 agent instances during context window handovers.
 *
 * Based on:
 * - Agent File (.af) format (Letta AI)
 * - LangGraph checkpoint system
 * - MCP (Model Context Protocol) state replay
 *
 * @author Coordinator System
 * @version 1.0.0
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Agent handoff state packet.
 * Contains all information needed for seamless agent continuation.
 */
export interface AgentHandoffState {
  /** Protocol version for compatibility */
  protocolVersion: string;
  /** Unique handoff ID */
  handoffId: string;
  /** Timestamp of handoff creation */
  createdAt: string;
  /** Source agent information */
  source: AgentInfo;
  /** Current task context */
  task: TaskContext;
  /** Conversation history (compressed) */
  conversation: ConversationHistory;
  /** Working memory and variables */
  memory: WorkingMemory;
  ** File tracking for continuation */
  files: FileTracking;
  ** Progress and checkpoints */
  progress: ProgressState;
  ** Metadata for debugging */
  metadata: HandoffMetadata;
}

/**
 * Agent identification information.
 */
export interface AgentInfo {
  /** Agent identifier (e.g., "agent-1", "coordinator") */
  agentId: string;
  /** Agent role/type */
  agentRole: string;
  /** Session identifier */
  sessionId: string;
  /** Message count in this session */
  messageCount: number;
  /** Token usage at handover time */
  tokenUsage: {
    total: number;
    input: number;
    output: number;
    percentage: number;
  };
}

/**
 * Current task context.
 */
export interface TaskContext {
  /** Current task ID */
  taskId: string | null;
  /** Task description */
  taskDescription: string;
  /** Task status */
  taskStatus: 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked';
  ** Current step in task */
  currentStep: string;
  ** Steps completed */
  completedSteps: string[];
  ** Steps remaining */
  remainingSteps: string[];
  ** Staging location (if applicable) */
  stagingLocation?: string;
  ** Target location (if applicable) */
  targetLocation?: string;
}

/**
 * Compressed conversation history.
 * Uses summary tokens to reduce token count while preserving context.
 */
export interface ConversationHistory {
  /** Total message count */
  messageCount: number;
  /** Compressed history (summary + recent messages) */
  compressed: MessageSummary[];
  /** Recent messages (last N messages, always preserved) */
  recentMessages: ChatMessage[];
  /** Important decisions/outcomes (extracted) */
  decisions: Decision[];
  /** Issues encountered and resolutions */
  issues: Issue[];
}

/**
 * Individual chat message.
 */
export interface ChatMessage {
  /** Message role */
  role: 'user' | 'assistant' | 'system';
  /** Message content */
  content: string;
  /** Timestamp */
  timestamp: string;
  /** Message index in conversation */
  index: number;
  /** Tool calls (if any) */
  toolCalls?: ToolCall[];
}

/**
 * Tool/function call information.
 */
export interface ToolCall {
  /** Tool name */
  name: string;
  /** Tool arguments */
  arguments: Record<string, unknown>;
  /** Result (if available) */
  result?: unknown;
}

/**
 * Compressed message summary.
 */
export interface MessageSummary {
  /** Summary text */
  summary: string;
  /** Message range covered */
  messageRange: [number, number];
  /** Key topics covered */
  topics: string[];
  ** Timestamp of last message in range */
  timestamp: string;
}

/**
 * Important decision record.
 */
export interface Decision {
  /** Decision description */
  description: string;
  ** Rationale */
  rationale: string;
  ** Timestamp */
  timestamp: string;
  ** Related step */
  relatedStep?: string;
}

/**
 * Issue and resolution record.
 */
export interface Issue {
  /** Issue description */
  issue: string;
  ** Resolution applied */
  resolution: string;
  ** Timestamp */
  timestamp: string;
  ** Status */
  status: 'resolved' | 'workaround' | 'blocked';
}

/**
 * Working memory and variables.
 */
export interface WorkingMemory {
  /** Key-value store for agent state */
  variables: Record<string, unknown>;
  /** Files being actively worked on */
  activeFiles: string[];
  /** Component/function signatures being built */
  activeWork: ActiveWork[];
  ** Important context notes */
  notes: ContextNote[];
  ** Pending actions */
  pendingActions: PendingAction[];
}

/**
 * Active work item.
 */
export interface ActiveWork {
  /** Work identifier */
  id: string;
  /** Type of work */
  type: 'component' | 'page' | 'feature' | 'fix';
  ** Name */
  name: string;
  ** File path */
  path: string;
  ** Current state */
  state: 'planning' | 'implementing' | 'testing' | 'reviewing';
  ** Progress (0-1) */
  progress: number;
  ** Blockers, if any */
  blockers?: string[];
}

/**
 * Context note.
 */
export interface ContextNote {
  /** Note content */
  content: string;
  ** Importance level */
  importance: 'low' | 'medium' | 'high' | 'critical';
  ** Related file or topic */
  relatedTo?: string;
  ** Timestamp */
  timestamp: string;
}

/**
 * Pending action.
 */
export interface PendingAction {
  /** Action description */
  action: string;
  /** Priority */
  priority: 'low' | 'medium' | 'high';
  /** Estimated time */
  estimatedTime?: string;
  /** Dependencies */
  dependencies?: string[];
}

/**
 * File tracking information.
 */
export interface FileTracking {
  /** Files read during session */
  readFiles: FileRecord[];
  /** Files modified during session */
  modifiedFiles: FileRecord[];
  /** Files created during session */
  createdFiles: FileRecord[];
  /** Files pending review */
  pendingReview: FileRecord[];
}

/**
 * File record.
 */
export interface FileRecord {
  /** File path */
  path: string;
  /** Token count (approximate) */
  tokens: number;
  /** Last modified timestamp */
  lastModified: string;
  /** File checksum for verification */
  checksum?: string;
  /** Status */
  status: 'read' | 'modified' | 'created' | 'staged' | 'pending';
}

/**
 * Progress and checkpoint state.
 */
export interface ProgressState {
  /** Current phase */
  currentPhase: string;
  /** Overall progress (0-1) */
  overallProgress: number;
  /** Checkpoints reached */
  checkpoints: Checkpoint[];
  /** Current checkpoint */
  currentCheckpoint?: string;
  /** Metrics */
  metrics: ProgressMetrics;
}

/**
 * Checkpoint record.
 */
export interface Checkpoint {
  /** Checkpoint ID */
  id: string;
  /** Checkpoint name */
  name: string;
  /** Timestamp reached */
  timestamp: string;
  /** State snapshot */
  state: Record<string, unknown>;
}

/**
 * Progress metrics.
 */
export interface ProgressMetrics {
  /** Tasks completed */
  tasksCompleted: number;
  /** Tasks total */
  tasksTotal: number;
  /** Approval rate */
  approvalRate: number;
  /** Average time per task */
  avgTimePerTask: number;
  /** Token usage trend */
  tokenUsageTrend: 'decreasing' | 'stable' | 'increasing';
}

/**
 * Handoff metadata.
 */
export interface HandoffMetadata {
  /** Handoff reason */
  reason: HandoffReason;
  /** Handoff priority */
  priority: 'normal' | 'urgent' | 'critical';
  /** Additional context */
  context: string;
  /** Warnings or notes */
  warnings?: string[];
  /** Protocol version that created this */
  protocolVersion: string;
  /** Compression method used */
  compressionMethod: string;
}

/**
 * Handoff reason enumeration.
 */
export type HandoffReason =
  | 'context_window_limit'
  | 'quality_degradation'
  | 'token_threshold'
  | 'manual_request'
  | 'error_recovery'
  | 'shift_change';

// ============================================================================
// HANDOFF STATE BUILDER
// ============================================================================

/**
 * Builder class for constructing AgentHandoffState.
 */
export class HandoffStateBuilder {
  private state: Partial<AgentHandoffState> = {
    protocolVersion: '1.0.0',
    createdAt: new Date().toISOString(),
    conversation: {
      messageCount: 0,
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
      currentPhase: 'unknown',
      overallProgress: 0,
      checkpoints: [],
      metrics: {
        tasksCompleted: 0,
        tasksTotal: 0,
        approvalRate: 0,
        avgTimePerTask: 0,
        tokenUsageTrend: 'stable',
      },
    },
    metadata: {
      reason: 'context_window_limit',
      priority: 'normal',
      context: '',
      protocolVersion: '1.0.0',
      compressionMethod: 'summary+v2',
    },
  };

  /** Set source agent information */
  withSource(info: AgentInfo): this {
    this.state.source = info;
    return this;
  }

  /** Set task context */
  withTask(task: TaskContext): this {
    this.state.task = task;
    return this;
  }

  /** Add conversation message */
  addMessage(message: ChatMessage): this {
    if (!this.state.conversation) {
      this.state.conversation = {
        messageCount: 0,
        compressed: [],
        recentMessages: [],
        decisions: [],
        issues: [],
      };
    }
    this.state.conversation.recentMessages.push(message);
    this.state.conversation.messageCount++;
    return this;
  }

  /** Add decision */
  addDecision(decision: Decision): this {
    this.state.conversation?.decisions.push(decision);
    return this;
  }

  /** Add issue */
  addIssue(issue: Issue): this {
    this.state.conversation?.issues.push(issue);
    return this;
  }

  /** Set working memory */
  withMemory(memory: WorkingMemory): this {
    this.state.memory = memory;
    return this;
  }

  /** Add file record */
  addFile(record: FileRecord, type: 'read' | 'modified' | 'created' | 'pending'): this {
    switch (type) {
      case 'read':
        this.state.files?.readFiles.push(record);
        break;
      case 'modified':
        this.state.files?.modifiedFiles.push(record);
        break;
      case 'created':
        this.state.files?.createdFiles.push(record);
        break;
      case 'pending':
        this.state.files?.pendingReview.push(record);
        break;
    }
    return this;
  }

  /** Set progress state */
  withProgress(progress: ProgressState): this {
    this.state.progress = progress;
    return this;
  }

  /** Set metadata */
  withMetadata(metadata: Partial<HandoffMetadata>): this {
    this.state.metadata = { ...this.state.metadata!, ...metadata };
    return this;
  }

  /** Generate unique handoff ID */
  private generateHandoffId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return `handoff-${timestamp}-${random}`;
  }

  /** Build the final state */
  build(): AgentHandoffState {
    if (!this.state.source) {
      throw new Error('Source agent information is required');
    }
    if (!this.state.task) {
      throw new Error('Task context is required');
    }

    this.state.handoffId = this.generateHandoffId();

    return this.state as AgentHandoffState;
  }
}

// ============================================================================
// SERIALIZATION/DESERIALIZATION
// ============================================================================

/**
 * Serialize handoff state to JSON.
 */
export function serializeHandoffState(state: AgentHandoffState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Deserialize handoff state from JSON.
 */
export function deserializeHandoffState(json: string): AgentHandoffState {
  return JSON.parse(json) as AgentHandoffState;
}

/**
 * Save handoff state to file.
 */
export function saveHandoffState(
  state: AgentHandoffState,
  filepath: string
): void {
  const json = serializeHandoffState(state);
  // In production: use fs.writeFileSync
  console.log(`[DEBUG] Would save handoff state to: ${filepath}`);
}

/**
 * Load handoff state from file.
 */
export function loadHandoffState(filepath: string): AgentHandoffState {
  // In production: use fs.readFileSync
  console.log(`[DEBUG] Would load handoff state from: ${filepath}`);
  throw new Error('Not implemented in browser environment');
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate handoff state structure.
 */
export function validateHandoffState(state: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof state !== 'object' || state === null) {
    return { valid: false, errors: ['State is not an object'] };
  }

  const s = state as Record<string, unknown>;

  if (!s.protocolVersion || typeof s.protocolVersion !== 'string') {
    errors.push('Missing or invalid protocolVersion');
  }

  if (!s.handoffId || typeof s.handoffId !== 'string') {
    errors.push('Missing or invalid handoffId');
  }

  if (!s.source || typeof s.source !== 'object') {
    errors.push('Missing or invalid source');
  }

  if (!s.task || typeof s.task !== 'object') {
    errors.push('Missing or invalid task');
  }

  // Check protocol version compatibility
  if (s.protocolVersion !== '1.0.0') {
    errors.push(`Unsupported protocol version: ${s.protocolVersion}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
