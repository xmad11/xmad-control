/* ═══════════════════════════════════════════════════════════════════════════════
   SUPPORT TICKETS - User support ticket management
   Ticket queue with status management and responses
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  TicketIcon,
  UserIcon,
  XMarkIcon,
} from "@/components/icons"
import { memo, useCallback, useMemo, useState } from "react"

type TicketStatus = "open" | "in-progress" | "resolved" | "closed"
type TicketPriority = "low" | "medium" | "high" | "urgent"

interface Ticket {
  id: string
  subject: string
  description: string
  userId: string
  userName: string
  userEmail: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

interface TicketMessage {
  id: string
  userId: string
  userName: string
  isAdmin: boolean
  content: string
  timestamp: string
}

/**
 * Support Tickets Component
 *
 * Features:
 * - Ticket list with filters
 * - Ticket detail view
 * - Status management
 * - Priority assignment
 * - Message responses
 */
export function SupportTickets() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all")
  const [newMessage, setNewMessage] = useState("")

  /**
   * Mock tickets - replace with API call
   */
  const tickets: Ticket[] = [
    {
      id: "1",
      subject: "Cannot upload restaurant photos",
      description:
        "I'm trying to upload photos for my restaurant but keep getting an error message.",
      userId: "u1",
      userName: "Ahmed Al-Rashid",
      userEmail: "ahmed@example.com",
      status: "open",
      priority: "high",
      category: "Technical",
      createdAt: "2025-12-30T10:30:00Z",
      updatedAt: "2025-12-30T10:30:00Z",
      messages: [
        {
          id: "m1",
          userId: "u1",
          userName: "Ahmed Al-Rashid",
          isAdmin: false,
          content:
            "I'm trying to upload photos for my restaurant but keep getting an error message saying 'File too large'. The files are under 5MB.",
          timestamp: "2025-12-30T10:30:00Z",
        },
      ],
    },
    {
      id: "2",
      subject: "Wrong restaurant information",
      description: "The address for my restaurant is incorrect on the platform.",
      userId: "u2",
      userName: "Sarah Wilson",
      userEmail: "sarah@example.com",
      status: "in-progress",
      priority: "medium",
      category: "Data",
      createdAt: "2025-12-29T14:20:00Z",
      updatedAt: "2025-12-30T09:15:00Z",
      messages: [
        {
          id: "m1",
          userId: "u2",
          userName: "Sarah Wilson",
          isAdmin: false,
          content:
            "The address listed for my restaurant is outdated. We moved locations last month.",
          timestamp: "2025-12-29T14:20:00Z",
        },
        {
          id: "m2",
          userId: "admin",
          userName: "Admin User",
          isAdmin: true,
          content: "Thank you for reporting this. We'll update the address within 24 hours.",
          timestamp: "2025-12-30T09:15:00Z",
        },
      ],
    },
    {
      id: "3",
      subject: "Account deletion request",
      description: "I would like to permanently delete my account.",
      userId: "u3",
      userName: "John Smith",
      userEmail: "john@example.com",
      status: "resolved",
      priority: "low",
      category: "Account",
      createdAt: "2025-12-28T08:00:00Z",
      updatedAt: "2025-12-29T16:30:00Z",
      messages: [
        {
          id: "m1",
          userId: "u3",
          userName: "John Smith",
          isAdmin: false,
          content: "I would like to permanently delete my account and all associated data.",
          timestamp: "2025-12-28T08:00:00Z",
        },
        {
          id: "m2",
          userId: "admin",
          userName: "Admin User",
          isAdmin: true,
          content:
            "Your account has been deleted as requested. You'll receive a confirmation email shortly.",
          timestamp: "2025-12-29T16:30:00Z",
        },
      ],
    },
  ]

  /**
   * Filter tickets
   */
  const filteredTickets = useMemo(() => {
    let result = tickets

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter)
    }

    return result.sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [tickets, statusFilter, priorityFilter])

  /**
   * Handle status change
   */
  const handleStatusChange = useCallback((ticketId: string, newStatus: TicketStatus) => {
    console.log("Change ticket status:", ticketId, newStatus)
    // TODO: Call API
  }, [])

  /**
   * Handle send message
   */
  const handleSendMessage = useCallback(() => {
    if (!selectedTicket || !newMessage.trim()) return

    console.log("Send message:", selectedTicket.id, newMessage)
    // TODO: Call API
    setNewMessage("")
  }, [selectedTicket, newMessage])

  /**
   * Stats
   */
  const stats = useMemo(() => {
    return {
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in-progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      urgent: tickets.filter((t) => t.priority === "urgent").length,
    }
  }, [tickets])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <div>
          <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
            Support Tickets
          </h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            {filteredTickets.length} tickets total
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "all")}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)]"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | "all")}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)]"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <StatCard
          icon={<TicketIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
          value={stats.open}
          label="Open"
          color="text-[var(--color-warning)]"
        />
        <StatCard
          icon={<ClockIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
          value={stats.inProgress}
          label="In Progress"
          color="text-[var(--color-primary)]"
        />
        <StatCard
          icon={<CheckIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
          value={stats.resolved}
          label="Resolved"
          color="text-[var(--color-success)]"
        />
        <StatCard
          icon={
            <ExclamationCircleIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
          }
          value={stats.urgent}
          label="Urgent"
          color="text-[var(--color-error)]"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-lg)]">
        {/* Ticket List */}
        <div className="lg:col-span-1 space-y-[var(--spacing-sm)]">
          {filteredTickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => setSelectedTicket(ticket)}
              className={`
                w-full p-[var(--spacing-md)] rounded-[var(--radius-lg)] border text-left transition-all
                ${
                  selectedTicket?.id === ticket.id
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "border-[var(--fg-10)] bg-[var(--card-bg)] hover:border-[var(--fg-20)]"
                }
              `}
            >
              <div className="flex items-start justify-between mb-[var(--spacing-sm)]">
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[var(--font-size-sm)] font-semibold mb-[var(--spacing-xs)] ${
                      selectedTicket?.id === ticket.id
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--fg)]"
                    }`}
                  >
                    {ticket.subject}
                  </p>
                  <p className="text-[var(--font-size-xs)] text-[var(--fg-60)] truncate">
                    {ticket.userName}
                  </p>
                </div>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div className="flex items-center justify-between">
                <TicketStatusBadge status={ticket.status} />
                <span className="text-[var(--font-size-xs)] text-[var(--fg-50)]">
                  {formatTimestamp(ticket.createdAt)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onStatusChange={handleStatusChange}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="p-[var(--spacing-xl)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)] text-center">
              <TicketIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-md)]" />
              <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
                Select a ticket
              </h3>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
                Choose a ticket from the list to view details and respond
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Stat Card
 */
interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  color: string
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <div className="p-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)]">
      <div className="flex items-center gap-[var(--spacing-sm)]">
        <div
          className={`p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--fg-5)] ${color}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">{value}</p>
          <p className="text-[var(--font-size-xs)] text-[var(--fg-60)]">{label}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Priority Badge
 */
interface PriorityBadgeProps {
  priority: TicketPriority
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    low: { label: "Low", color: "bg-[var(--fg-10)] text-[var(--fg-60)]" },
    medium: { label: "Medium", color: "bg-[var(--color-info)]/10 text-[var(--color-info)]" },
    high: { label: "High", color: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]" },
    urgent: { label: "Urgent", color: "bg-[var(--color-error)]/10 text-[var(--color-error)]" },
  }

  const { label, color } = config[priority]

  return (
    <span
      className={`inline-flex items-center px-[var(--spacing-xs)] py-[var(--spacing-2xs)] rounded-[var(--radius-full)] text-[var(--font-size-xs)] font-semibold uppercase ${color}`}
    >
      {label}
    </span>
  )
}

/**
 * Ticket Status Badge
 */
interface TicketStatusBadgeProps {
  status: TicketStatus
}

function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const config = {
    open: { label: "Open", color: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]" },
    "in-progress": {
      label: "In Progress",
      color: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
    },
    resolved: {
      label: "Resolved",
      color: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    },
    closed: { label: "Closed", color: "bg-[var(--fg-10)] text-[var(--fg-60)]" },
  }

  const { label, color } = config[status]

  return (
    <span
      className={`inline-flex items-center px-[var(--spacing-xs)] py-[var(--spacing-2xs)] rounded-[var(--radius-full)] text-[var(--font-size-xs)] font-medium ${color}`}
    >
      {label}
    </span>
  )
}

/**
 * Ticket Detail Component
 */
interface TicketDetailProps {
  ticket: Ticket
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void
  newMessage: string
  onNewMessageChange: (value: string) => void
  onSendMessage: () => void
}

function TicketDetail({
  ticket,
  onStatusChange,
  newMessage,
  onNewMessageChange,
  onSendMessage,
}: TicketDetailProps) {
  return (
    <div className="p-[var(--spacing-xl)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--spacing-md)] mb-[var(--spacing-lg)] pb-[var(--spacing-md)] border-b border-[var(--fg-10)]">
        <div className="flex-1">
          <h3 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-sm)]">
            {ticket.subject}
          </h3>
          <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
            <div className="flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-sm)] text-[var(--fg-60)]">
              <UserIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              {ticket.userName}
            </div>
            <span className="text-[var(--fg-30)]">•</span>
            <span className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
              {ticket.userEmail}
            </span>
            <span className="text-[var(--fg-30)]">•</span>
            <span className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
              {ticket.category}
            </span>
          </div>
        </div>

        {/* Status Change */}
        <select
          value={ticket.status}
          onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
          className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)]"
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Messages */}
      <div className="space-y-[var(--spacing-md)] mb-[var(--spacing-lg)] max-h-[400px] overflow-y-auto">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={`p-[var(--spacing-md)] rounded-[var(--radius-lg)] ${
              message.isAdmin
                ? "bg-[var(--color-primary)]/10 ml-[0] mr-[20%]"
                : "bg-[var(--fg-3)] ml-[20%] mr-[0]"
            }`}
          >
            <div className="flex items-center justify-between mb-[var(--spacing-xs)]">
              <span
                className={`text-[var(--font-size-sm)] font-semibold ${
                  message.isAdmin ? "text-[var(--color-primary)]" : "text-[var(--fg)]"
                }`}
              >
                {message.userName}
                {message.isAdmin && (
                  <span className="ml-[var(--spacing-xs)] text-[var(--font-size-xs)]">(Admin)</span>
                )}
              </span>
              <span className="text-[var(--font-size-xs)] text-[var(--fg-50)]">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">{message.content}</p>
          </div>
        ))}
      </div>

      {/* Reply */}
      <div className="pt-[var(--spacing-md)] border-t border-[var(--fg-10)]">
        <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg-70)] mb-[var(--spacing-xs)]">
          Your Response
        </label>
        <textarea
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
          placeholder="Type your response..."
          rows={3}
          className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)] placeholder:text-[var(--fg-40)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--color-primary)]/20 resize-none"
        />
        <div className="flex items-center justify-end mt-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed"
          >
            <ChatBubbleLeftRightIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            Send Reply
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Format timestamp
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

export const SupportTickets = memo(SupportTickets)
