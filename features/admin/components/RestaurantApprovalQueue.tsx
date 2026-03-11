/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANT APPROVAL QUEUE - Restaurant approval management
   Kanban/list view for pending restaurant approvals
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  BuildingStorefrontIcon,
  CheckIcon,
  ClockIcon,
  EyeIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
} from "@/components/icons"
import { XMarkIcon as CloseIcon } from "@/components/icons"
import { memo, useCallback, useMemo, useState } from "react"

type ApprovalStatus = "pending" | "approved" | "rejected"
type ViewMode = "list" | "kanban"

interface RestaurantApproval {
  id: string
  name: string
  owner: string
  email: string
  phone: string
  cuisine: string
  location: string
  submittedDate: string
  status: ApprovalStatus
  description: string
  imageUrl?: string
}

/**
 * Restaurant Approval Queue Component
 *
 * Features:
 * - List and kanban view modes
 * - Filter by status
 * - Approve/reject actions
 * - Detail view modal
 * - Bulk actions
 */
export function RestaurantApprovalQueue() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | "all">("all")
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantApproval | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  /**
   * Mock data - replace with API call
   */
  const approvals: RestaurantApproval[] = [
    {
      id: "1",
      name: "The Arabian Grill",
      owner: "Ahmed Al-Rashid",
      email: "ahmed@arabiangrill.com",
      phone: "+971 50 123 4567",
      cuisine: "Arabic",
      location: "Dubai Marina",
      submittedDate: "2025-12-28",
      status: "pending",
      description:
        "Authentic Arabic cuisine with traditional recipes passed down through generations.",
    },
    {
      id: "2",
      name: "Sakura Sushi",
      owner: "Yuki Tanaka",
      email: "yuki@sakurasushi.ae",
      phone: "+971 50 234 5678",
      cuisine: "Japanese",
      location: "Downtown Dubai",
      submittedDate: "2025-12-27",
      status: "pending",
      description: "Premium Japanese sushi and sashimi with imported ingredients from Tokyo.",
    },
    {
      id: "3",
      name: "Bella Italia",
      owner: "Marco Rossi",
      email: "marco@bellaitalia.ae",
      phone: "+971 50 345 6789",
      cuisine: "Italian",
      location: "JBR",
      submittedDate: "2025-12-26",
      status: "approved",
      description: "Classic Italian dishes with homemade pasta and wood-fired pizza.",
    },
    {
      id: "4",
      name: "Spice Garden",
      owner: "Priya Sharma",
      email: "priya@spicegarden.ae",
      phone: "+971 50 456 7890",
      cuisine: "Indian",
      location: "Al Barsha",
      submittedDate: "2025-12-25",
      status: "rejected",
      description: "Authentic Indian cuisine with rich flavors and aromatic spices.",
    },
  ]

  /**
   * Filter approvals by status
   */
  const filteredApprovals = useMemo(() => {
    if (statusFilter === "all") return approvals
    return approvals.filter((a) => a.status === statusFilter)
  }, [approvals, statusFilter])

  /**
   * Handle approve action
   */
  const handleApprove = useCallback((id: string) => {
    console.log("Approve:", id)
    // TODO: Call API to approve
  }, [])

  /**
   * Handle reject action
   */
  const handleReject = useCallback((id: string) => {
    console.log("Reject:", id)
    // TODO: Call API to reject
  }, [])

  /**
   * Handle view details
   */
  const handleViewDetails = useCallback((approval: RestaurantApproval) => {
    setSelectedRestaurant(approval)
  }, [])

  /**
   * Handle bulk approve
   */
  const handleBulkApprove = useCallback(() => {
    console.log("Bulk approve:", Array.from(selectedItems))
    // TODO: Call API to bulk approve
    setSelectedItems(new Set())
  }, [selectedItems])

  /**
   * Handle bulk reject
   */
  const handleBulkReject = useCallback(() => {
    console.log("Bulk reject:", Array.from(selectedItems))
    // TODO: Call API to bulk reject
    setSelectedItems(new Set())
  }, [selectedItems])

  /**
   * Handle select item
   */
  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  /**
   * Handle select all
   */
  const handleSelectAll = useCallback(() => {
    const allIds = filteredApprovals.map((a) => a.id)
    setSelectedItems(new Set(allIds))
  }, [filteredApprovals])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <div>
          <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
            Restaurant Approval Queue
          </h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            {filteredApprovals.filter((a) => a.status === "pending").length} pending approvals
          </p>
        </div>

        <div className="flex items-center gap-[var(--spacing-md)]">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApprovalStatus | "all")}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-[var(--fg-20)] rounded-[var(--radius-md)] overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--font-size-sm)] transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                  : "bg-[var(--bg)] text-[var(--fg-60)] hover:bg-[var(--fg-5)]"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--font-size-sm)] transition-colors ${
                viewMode === "kanban"
                  ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                  : "bg-[var(--bg)] text-[var(--fg-60)] hover:bg-[var(--fg-5)]"
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="flex items-center justify-between p-[var(--spacing-md)] mb-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30">
          <p className="text-[var(--font-size-sm)] text-[var(--fg)]">
            <span className="font-semibold">{selectedItems.size}</span> items selected
          </p>
          <div className="flex items-center gap-[var(--spacing-sm)]">
            <button
              type="button"
              onClick={handleBulkApprove}
              className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-success)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
            >
              <CheckIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Approve All
            </button>
            <button
              type="button"
              onClick={handleBulkReject}
              className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-error)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
            >
              <XMarkIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Reject All
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === "list" ? (
        <ListView
          approvals={filteredApprovals}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewDetails={handleViewDetails}
        />
      ) : (
        <KanbanView
          approvals={approvals}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Detail Modal */}
      {selectedRestaurant && (
        <DetailModal restaurant={selectedRestaurant} onClose={() => setSelectedRestaurant(null)} />
      )}
    </div>
  )
}

/**
 * List View - Table view of approvals
 */
interface ListViewProps {
  approvals: RestaurantApproval[]
  selectedItems: Set<string>
  onSelectItem: (id: string) => void
  onSelectAll: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onViewDetails: (approval: RestaurantApproval) => void
}

function ListView({
  approvals,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onApprove,
  onReject,
  onViewDetails,
}: ListViewProps) {
  return (
    <div className="border border-[var(--fg-10)] rounded-[var(--radius-lg)] overflow-hidden">
      {/* Header */}
      <div className="hidden md:grid md:grid-cols-[auto_2fr_2fr_1.5fr_1fr_1fr_1fr] gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--fg-3)] border-b border-[var(--fg-10)]">
        <input
          type="checkbox"
          checked={approvals.length > 0 && selectedItems.size === approvals.length}
          onChange={onSelectAll}
          className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] rounded border-[var(--fg-30)]"
        />
        <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg-70)]">
          Restaurant
        </span>
        <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg-70)]">Owner</span>
        <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg-70)]">
          Cuisine
        </span>
        <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg-70)]">
          Submitted
        </span>
        <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg-70)]">Status</span>
        <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg-70)]">
          Actions
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[var(--fg-10)]">
        {approvals.map((approval) => (
          <div
            key={approval.id}
            className="grid grid-cols-1 md:grid-cols-[auto_2fr_2fr_1.5fr_1fr_1fr_1fr] gap-[var(--spacing-md)] p-[var(--spacing-md)] hover:bg-[var(--fg-3)] transition-colors"
          >
            {/* Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={selectedItems.has(approval.id)}
                onChange={() => onSelectItem(approval.id)}
                className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] rounded border-[var(--fg-30)]"
              />
            </div>

            {/* Restaurant */}
            <div className="flex items-start gap-[var(--spacing-sm)]">
              <div className="h-[48px] w-[48px] rounded-[var(--radius-md)] bg-[var(--fg-5)] flex items-center justify-center flex-shrink-0">
                <BuildingStorefrontIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-50)]" />
              </div>
              <div className="min-w-0">
                <p className="text-[var(--font-size-base)] font-semibold text-[var(--fg)] truncate">
                  {approval.name}
                </p>
                <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] truncate md:hidden">
                  {approval.location}
                </p>
              </div>
            </div>

            {/* Owner */}
            <div className="flex flex-col">
              <p className="text-[var(--font-size-sm)] text-[var(--fg)]">{approval.owner}</p>
              <p className="text-[var(--font-size-xs)] text-[var(--fg-50)]">{approval.email}</p>
            </div>

            {/* Cuisine */}
            <div className="flex items-center">
              <span className="inline-flex items-center px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] bg-[var(--fg-5)] text-[var(--font-size-xs)] text-[var(--fg-70)]">
                {approval.cuisine}
              </span>
            </div>

            {/* Submitted */}
            <div className="flex items-center text-[var(--font-size-sm)] text-[var(--fg-60)]">
              {new Date(approval.submittedDate).toLocaleDateString()}
            </div>

            {/* Status */}
            <div className="flex items-center">
              <StatusBadge status={approval.status} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <button
                type="button"
                onClick={() => onViewDetails(approval)}
                className="p-[var(--spacing-xs)] rounded-[var(--radius-md)] hover:bg-[var(--fg-10)] transition-colors"
                aria-label="View details"
              >
                <EyeIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-60)]" />
              </button>
              {approval.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => onApprove(approval.id)}
                    className="p-[var(--spacing-xs)] rounded-[var(--radius-md)] hover:bg-[var(--color-success)]/20 transition-colors"
                    aria-label="Approve"
                  >
                    <CheckIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-success)]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(approval.id)}
                    className="p-[var(--spacing-xs)] rounded-[var(--radius-md)] hover:bg-[var(--color-error)]/20 transition-colors"
                    aria-label="Reject"
                  >
                    <XMarkIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-error)]" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Kanban View - Board view with columns
 */
interface KanbanViewProps {
  approvals: RestaurantApproval[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onViewDetails: (approval: RestaurantApproval) => void
}

function KanbanView({ approvals, onApprove, onReject, onViewDetails }: KanbanViewProps) {
  const columns: { status: ApprovalStatus; label: string; color: string }[] = [
    { status: "pending", label: "Pending", color: "bg-[var(--color-warning)]" },
    { status: "approved", label: "Approved", color: "bg-[var(--color-success)]" },
    { status: "rejected", label: "Rejected", color: "bg-[var(--color-error)]" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-md)]">
      {columns.map((column) => {
        const columnApprovals = approvals.filter((a) => a.status === column.status)

        return (
          <div
            key={column.status}
            className="border border-[var(--fg-10)] rounded-[var(--radius-lg)] p-[var(--spacing-md)]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-[var(--spacing-md)]">
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <div className={`h-[8px] w-[8px] rounded-full ${column.color}`} />
                <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
                  {column.label}
                </h3>
              </div>
              <span className="text-[var(--font-size-sm)] text-[var(--fg-50)]">
                {columnApprovals.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-[var(--spacing-sm)]">
              {columnApprovals.map((approval) => (
                <KanbanCard
                  key={approval.id}
                  approval={approval}
                  onApprove={onApprove}
                  onReject={onReject}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Kanban Card - Single approval card
 */
interface KanbanCardProps {
  approval: RestaurantApproval
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onViewDetails: (approval: RestaurantApproval) => void
}

function KanbanCard({ approval, onApprove, onReject, onViewDetails }: KanbanCardProps) {
  return (
    <div className="p-[var(--spacing-md)] rounded-[var(--radius-md)] border border-[var(--fg-10)] bg-[var(--card-bg)] hover:border-[var(--fg-20)] transition-colors">
      <div className="flex items-start gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
        <div className="h-[40px] w-[40px] rounded-[var(--radius-md)] bg-[var(--fg-5)] flex items-center justify-center flex-shrink-0">
          <BuildingStorefrontIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-50)]" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[var(--font-size-sm)] font-semibold text-[var(--fg)] truncate">
            {approval.name}
          </h4>
          <p className="text-[var(--font-size-xs)] text-[var(--fg-60)] truncate">
            {approval.owner}
          </p>
        </div>
      </div>

      <div className="space-y-[var(--spacing-xs)] mb-[var(--spacing-sm)]">
        <p className="text-[var(--font-size-xs)] text-[var(--fg-60)]">
          <span className="font-medium">Cuisine:</span> {approval.cuisine}
        </p>
        <p className="text-[var(--font-size-xs)] text-[var(--fg-60)]">
          <span className="font-medium">Location:</span> {approval.location}
        </p>
      </div>

      <div className="flex items-center justify-between pt-[var(--spacing-sm)] border-t border-[var(--fg-10)]">
        <span className="text-[var(--font-size-xs)] text-[var(--fg-50)]">
          {new Date(approval.submittedDate).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <button
            type="button"
            onClick={() => onViewDetails(approval)}
            className="p-[var(--spacing-xs)] rounded hover:bg-[var(--fg-10)] transition-colors"
            aria-label="View details"
          >
            <EyeIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-60)]" />
          </button>
          {approval.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => onApprove(approval.id)}
                className="p-[var(--spacing-xs)] rounded hover:bg-[var(--color-success)]/20 transition-colors"
                aria-label="Approve"
              >
                <CheckIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--color-success)]" />
              </button>
              <button
                type="button"
                onClick={() => onReject(approval.id)}
                className="p-[var(--spacing-xs)] rounded hover:bg-[var(--color-error)]/20 transition-colors"
                aria-label="Reject"
              >
                <XMarkIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--color-error)]" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Status Badge - Status indicator
 */
interface StatusBadgeProps {
  status: ApprovalStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    approved: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    rejected: "bg-[var(--color-error)]/10 text-[var(--color-error)]",
  }

  return (
    <span
      className={`inline-flex items-center px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] text-[var(--font-size-xs)] font-medium uppercase tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  )
}

/**
 * Detail Modal - Restaurant details modal
 */
interface DetailModalProps {
  restaurant: RestaurantApproval
  onClose: () => void
}

function DetailModal({ restaurant, onClose }: DetailModalProps) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  return (
    <div
      className="fixed inset-0 z-[var(--z-index-modal)] flex items-center justify-center p-[var(--spacing-md)]"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--fg)]/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-[var(--modal-width-md)] bg-[var(--bg)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-2xl)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-[var(--spacing-xl)] border-b border-[var(--fg-10)] bg-[var(--bg)]">
          <div>
            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
              {restaurant.name}
            </h2>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">Approval Details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-[var(--spacing-xs)] rounded-[var(--radius-full)] hover:bg-[var(--fg-10)] transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg-60)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-[var(--spacing-xl)] space-y-[var(--spacing-lg)]">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Status</span>
            <StatusBadge status={restaurant.status} />
          </div>

          {/* Owner Info */}
          <div className="space-y-[var(--spacing-sm)]">
            <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
              Owner Information
            </h3>
            <div className="space-y-[var(--spacing-xs)]">
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                <span className="font-medium">Name:</span> {restaurant.owner}
              </p>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                <span className="font-medium">Email:</span> {restaurant.email}
              </p>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] flex items-center gap-[var(--spacing-xs)]">
                <PhoneIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                {restaurant.phone}
              </p>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="space-y-[var(--spacing-sm)]">
            <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
              Restaurant Details
            </h3>
            <div className="space-y-[var(--spacing-xs)]">
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] flex items-center gap-[var(--spacing-xs)]">
                <MapPinIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                {restaurant.location}
              </p>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                <span className="font-medium">Cuisine:</span> {restaurant.cuisine}
              </p>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(restaurant.submittedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-[var(--spacing-sm)]">
            <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
              Description
            </h3>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              {restaurant.description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 p-[var(--spacing-xl)] border-t border-[var(--fg-10)] bg-[var(--bg)] flex items-center justify-end gap-[var(--spacing-md)]">
          {restaurant.status === "pending" && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] text-[var(--fg)] hover:bg-[var(--fg-5)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-[var(--spacing-xl)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] bg-[var(--color-error)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
              >
                Reject
              </button>
              <button
                type="button"
                className="px-[var(--spacing-xl)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] bg-[var(--color-success)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
              >
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const RestaurantApprovalQueue = memo(RestaurantApprovalQueue)
