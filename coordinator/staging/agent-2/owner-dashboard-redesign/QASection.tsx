/**
 * Q&A Section - Customer questions management
 *
 * View, answer, and manage customer questions about your restaurant.
 */

"use client"

import {
  CalendarIcon,
  ChatBubbleQuestionIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  XIcon,
} from "@/components/icons"
import { memo, useState } from "react"
import type { QuestionAnswer } from "./types"

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

/**
 * Format relative time (e.g., "2 days ago")
 */
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  }
  return "Just now"
}

/**
 * Q&A card component
 */
function QACard({
  qa,
  onAnswer,
  onEdit,
  onDelete,
}: {
  qa: QuestionAnswer
  onAnswer: (id: string, answer: string) => void
  onEdit: (qa: QuestionAnswer) => void
  onDelete: (id: string) => void
}) {
  const [isAnswering, setIsAnswering] = useState(false)
  const [answerText, setAnswerText] = useState(qa.answer ?? "")

  const handleSubmitAnswer = () => {
    if (answerText.trim()) {
      onAnswer(qa.id, answerText.trim())
      setIsAnswering(false)
    }
  }

  const handleCancelAnswer = () => {
    setAnswerText(qa.answer ?? "")
    setIsAnswering(false)
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg-70)]">
      {/* Question */}
      <div className="flex flex-col gap-[var(--spacing-sm)]">
        <div className="flex items-start justify-between gap-[var(--spacing-md)]">
          <div className="flex items-start gap-[var(--spacing-md)]">
            <div className="flex h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] items-center justify-center rounded-full bg-[var(--fg-10)]">
              <UserIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-70)]" />
            </div>
            <div>
              <p className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
                {qa.askedBy}
              </p>
              <div className="flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-sm)] text-[var(--fg-70)]">
                <CalendarIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                <time dateTime={new Date(qa.askedAt).toISOString()}>
                  {formatRelativeTime(qa.askedAt)}
                </time>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[var(--spacing-xs)]">
            {qa.isAnswered ? (
              <span className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] bg-[oklch(from_var(--color-success)_l_c_h_/0.15)] text-[var(--color-success)] text-[var(--font-size-xs)] font-medium">
                <CheckIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                Answered
              </span>
            ) : (
              <span className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] bg-[oklch(from_var(--color-warning)_l_c_h_/0.15)] text-[var(--color-warning)] text-[var(--font-size-xs)] font-medium">
                <XIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                Pending
              </span>
            )}
          </div>
        </div>

        <p className="pl-[calc(var(--icon-size-lg)_+_var(--spacing-md))] text-[var(--font-size-base)] text-[var(--fg)]">
          {qa.question}
        </p>
      </div>

      {/* Answer */}
      {qa.isAnswered && qa.answer && !isAnswering && (
        <div className="pl-[calc(var(--icon-size-lg)_+_var(--spacing-md))]">
          <div className="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[var(--bg)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
            <div className="flex items-center justify-between">
              <p className="text-[var(--font-size-sm)] font-medium text-[var(--color-primary)]">
                Your Answer
              </p>
              <button
                type="button"
                onClick={() => onEdit(qa)}
                className="p-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--fg-70)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--fg-10)]"
                title="Edit answer"
              >
                <PencilIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              </button>
            </div>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] whitespace-pre-wrap">
              {qa.answer}
            </p>
          </div>
        </div>
      )}

      {/* Answer Form */}
      {(!qa.isAnswered || isAnswering) && (
        <div className="pl-[calc(var(--icon-size-lg)_+_var(--spacing-md))]">
          <div className="flex flex-col gap-[var(--spacing-sm)]">
            <label
              htmlFor={`answer-${qa.id}`}
              className="text-[var(--font-size-sm)] font-medium text-[var(--color-primary)]"
            >
              Your Answer
            </label>
            <textarea
              id={`answer-${qa.id}`}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] resize-y focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
            />
            <div className="flex items-center gap-[var(--spacing-sm)]">
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim()}
                className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                {qa.isAnswered && isAnswering ? "Update Answer" : "Submit Answer"}
              </button>
              {isAnswered && isAnswering && (
                <button
                  type="button"
                  onClick={handleCancelAnswer}
                  className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {qa.isAnswered && !isAnswering && (
        <div className="pl-[calc(var(--icon-size-lg)_+_var(--spacing-md))] flex items-center gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={() => {
              setIsAnswering(true)
              setAnswerText(qa.answer ?? "")
            }}
            className="flex items-center gap-[var(--spacing-xs)] text-[var(--color-primary)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:underline"
          >
            <PencilIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            Edit Answer
          </button>

          <button
            type="button"
            onClick={() => onDelete(qa.id)}
            className="flex items-center gap-[var(--spacing-xs)] text-[var(--color-error)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:underline"
          >
            <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Q&A Section Component
 *
 * @example
 * <QASection questions={questions} onAnswer={(id, answer) => saveAnswer(id, answer)} />
 */
export function QASection({
  questions,
  onAnswer,
  onDelete,
  isLoading = false,
}: {
  questions: QuestionAnswer[]
  onAnswer: (id: string, answer: string) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "answered">("all")

  const filteredQuestions = questions.filter((qa) => {
    if (filter === "pending") return !qa.isAnswered
    if (filter === "answered") return qa.isAnswered
    return true
  })

  const stats = {
    total: questions.length,
    pending: questions.filter((qa) => !qa.isAnswered).length,
    answered: questions.filter((qa) => qa.isAnswered).length,
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <ChatBubbleQuestionIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
          <div>
            <h2 className="text-[var(--heading-section)] font-black tracking-tight text-[var(--fg)]">
              Questions & Answers
            </h2>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Respond to customer questions
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-[var(--spacing-md)]">
        <div className="flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
          <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Total Questions</span>
          <span className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
            {stats.total}
          </span>
        </div>
        <div className="flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[oklch(from_var(--color-warning)_l_c_h_/0.1)] border-[var(--border-width-thin)] border-[oklch(from_var(--color-warning)_l_c_h_/0.2)]">
          <span className="text-[var(--font-size-sm)] text-[var(--color-warning)]">Pending</span>
          <span className="text-[var(--font-size-2xl)] font-bold text-[var(--color-warning)]">
            {stats.pending}
          </span>
        </div>
        <div className="flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[oklch(from_var(--color-success)_l_c_h_/0.1)] border-[var(--border-width-thin)] border-[oklch(from_var(--color-success)_l_c_h_/0.2)]">
          <span className="text-[var(--font-size-sm)] text-[var(--color-success)]">Answered</span>
          <span className="text-[var(--font-size-2xl)] font-bold text-[var(--color-success)]">
            {stats.answered}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-[var(--spacing-sm)] border-b border-[var(--fg-10)]">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b-[var(--border-width-thin)] transition-all duration-[var(--duration-fast)] ${
            filter === "all"
              ? "border-[var(--color-primary)] text-[var(--color-primary)]"
              : "border-transparent text-[var(--fg-70)] hover:text-[var(--fg)]"
          }`}
        >
          All ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b-[var(--border-width-thin)] transition-all duration-[var(--duration-fast)] ${
            filter === "pending"
              ? "border-[var(--color-warning)] text-[var(--color-warning)]"
              : "border-transparent text-[var(--fg-70)] hover:text-[var(--fg)]"
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          type="button"
          onClick={() => setFilter("answered")}
          className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b-[var(--border-width-thin)] transition-all duration-[var(--duration-fast)] ${
            filter === "answered"
              ? "border-[var(--color-success)] text-[var(--color-success)]"
              : "border-transparent text-[var(--fg-70)] hover:text-[var(--fg)]"
          }`}
        >
          Answered ({stats.answered})
        </button>
      </div>

      {/* Questions List */}
      {filteredQuestions.length > 0 ? (
        <div className="flex flex-col gap-[var(--spacing-md)]">
          {filteredQuestions
            .sort((a, b) => {
              // Sort pending first, then by date
              if (a.isAnswered !== b.isAnswered) {
                return a.isAnswered ? 1 : -1
              }
              return new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime()
            })
            .map((qa) => (
              <QACard
                key={qa.id}
                qa={qa}
                onAnswer={onAnswer}
                onEdit={(qa) => {
                  // Edit functionality - could open a modal
                  console.log("Edit:", qa)
                }}
                onDelete={onDelete}
              />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-[var(--spacing-4xl)] rounded-[var(--radius-lg)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
          <ChatBubbleQuestionIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg-30)] mb-[var(--spacing-md)]" />
          <p className="text-[var(--font-size-base)] text-[var(--fg-70)]">
            {filter === "pending"
              ? "No pending questions!"
              : filter === "answered"
                ? "No answered questions yet."
                : "No questions yet. When customers ask questions, they'll appear here."}
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center p-[var(--spacing-2xl)]">
          <div className="flex items-center gap-[var(--spacing-sm)] text-[var(--fg-70)]">
            <div className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] animate-spin rounded-full border-[var(--border-width-thin)] border-[var(--fg-20)] border-t-[var(--color-primary)]" />
            <span className="text-[var(--font-size-sm)]">Loading questions...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export const QASection = memo(QASection)
