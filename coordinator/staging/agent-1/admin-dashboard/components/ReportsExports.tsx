/* ═══════════════════════════════════════════════════════════════════════════════
   REPORTS & EXPORTS - Report generation and download
   Generate and download platform reports
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  UsersIcon,
} from "@/components/icons"
import { memo, useCallback, useState } from "react"

type ReportType = "users" | "restaurants" | "reviews" | "analytics" | "activity"
type ReportFormat = "pdf" | "csv" | "xlsx"
type DateRange = "7d" | "30d" | "90d" | "1y" | "custom"

interface ReportTemplate {
  id: ReportType
  name: string
  description: string
  icon: React.ReactNode
  availableFormats: ReportFormat[]
}

/**
 * Reports & Exports Component
 *
 * Features:
 * - Report templates
 * - Date range selection
 * - Format selection
 * - Download functionality
 */
export function ReportsExports() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>("30d")
  const [format, setFormat] = useState<ReportFormat>("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  /**
   * Report templates
   */
  const reportTemplates: ReportTemplate[] = [
    {
      id: "users",
      name: "User Report",
      description: "User registration, activity, and engagement metrics",
      icon: <UsersIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />,
      availableFormats: ["pdf", "csv", "xlsx"],
    },
    {
      id: "restaurants",
      name: "Restaurant Report",
      description: "Restaurant listings, ratings, and performance",
      icon: <BuildingStorefrontIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />,
      availableFormats: ["pdf", "csv", "xlsx"],
    },
    {
      id: "reviews",
      name: "Reviews Report",
      description: "Review statistics, trends, and sentiment analysis",
      icon: <ChartBarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />,
      availableFormats: ["pdf", "csv", "xlsx"],
    },
    {
      id: "analytics",
      name: "Analytics Report",
      description: "Comprehensive platform analytics and insights",
      icon: <ChartBarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />,
      availableFormats: ["pdf"],
    },
    {
      id: "activity",
      name: "Activity Log",
      description: "Platform activity and admin actions log",
      icon: <CalendarDaysIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />,
      availableFormats: ["csv", "xlsx"],
    },
  ]

  /**
   * Handle generate report
   */
  const handleGenerate = useCallback(async () => {
    if (!selectedReport) return

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Generate report:", { type: selectedReport, dateRange, format })

    setIsGenerating(false)
  }, [selectedReport, dateRange, format])

  /**
   * Get available formats for selected report
   */
  const availableFormats = selectedReport
    ? reportTemplates.find((r) => r.id === selectedReport)?.availableFormats || []
    : []

  return (
    <div>
      {/* Header */}
      <div className="mb-[var(--spacing-lg)]">
        <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
          Reports & Exports
        </h2>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          Generate and download platform reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-xl)]">
        {/* Report Templates */}
        <div className="lg:col-span-2">
          <div className="mb-[var(--spacing-md)]">
            <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
              Select Report Type
            </h3>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
              Choose the type of report you want to generate
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-md)]">
            {reportTemplates.map((template) => {
              const isSelected = selectedReport === template.id

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedReport(template.id)}
                  className={`
                    p-[var(--spacing-md)] rounded-[var(--radius-lg)] border text-left transition-all
                    ${
                      isSelected
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                        : "border-[var(--fg-10)] bg-[var(--card-bg)] hover:border-[var(--fg-20)]"
                    }
                  `}
                >
                  <div className="flex items-start gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
                    <div
                      className={`p-[var(--spacing-sm)] rounded-[var(--radius-md)] ${
                        isSelected
                          ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                          : "bg-[var(--fg-5)] text-[var(--fg-60)]"
                      }`}
                    >
                      {template.icon}
                    </div>
                  </div>
                  <h4
                    className={`text-[var(--font-size-base)] font-semibold mb-[var(--spacing-xs)] ${
                      isSelected ? "text-[var(--color-primary)]" : "text-[var(--fg)]"
                    }`}
                  >
                    {template.name}
                  </h4>
                  <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
                    {template.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Configuration */}
        <div>
          <div className="p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)] sticky top-[var(--spacing-lg)]">
            <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-md)]">
              Configure Report
            </h3>

            {!selectedReport ? (
              <div className="text-center py-[var(--spacing-xl)]">
                <DocumentTextIcon className="h-[var(--icon-size-2xl)] w-[var(--icon-size-2xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-sm)]" />
                <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
                  Select a report type to configure
                </p>
              </div>
            ) : (
              <div className="space-y-[var(--spacing-lg)]">
                {/* Report Info */}
                <div className="p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[var(--fg-3)]">
                  <p className="text-[var(--font-size-sm)] font-medium text-[var(--fg)]">
                    {reportTemplates.find((r) => r.id === selectedReport)?.name}
                  </p>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg-70)] mb-[var(--spacing-xs)]">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as DateRange)}
                    className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)]"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                    <option value="custom">Custom range</option>
                  </select>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg-70)] mb-[var(--spacing-xs)]">
                    Format
                  </label>
                  <div className="grid grid-cols-3 gap-[var(--spacing-xs)]">
                    {availableFormats.map((fmt) => {
                      const isSupported = availableFormats.includes(fmt)

                      return (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => isSupported && setFormat(fmt)}
                          disabled={!isSupported}
                          className={`
                            px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)]
                            text-[var(--font-size-sm)] font-medium uppercase transition-all
                            ${
                              !isSupported
                                ? "bg-[var(--fg-5)] text-[var(--fg-30)] cursor-not-allowed"
                                : format === fmt
                                  ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                                  : "bg-[var(--fg-5)] text-[var(--fg-70)] hover:bg-[var(--fg-10)]"
                            }
                          `}
                        >
                          {fmt}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`
                    w-full flex items-center justify-center gap-[var(--spacing-xs)]
                    px-[var(--spacing-lg)] py-[var(--spacing-md)] rounded-[var(--radius-lg)]
                    font-medium transition-all
                    ${
                      isGenerating
                        ? "bg-[var(--fg-10)] text-[var(--fg-50)] cursor-wait"
                        : "bg-[var(--color-primary)] text-[var(--color-white)] hover:opacity-[var(--hover-opacity)]"
                    }
                  `}
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="animate-spin h-[var(--icon-size-md)] w-[var(--icon-size-md)]"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Recent Reports */}
          <div className="mt-[var(--spacing-md)]">
            <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)] mb-[var(--spacing-md)]">
              Recent Reports
            </h3>
            <div className="space-y-[var(--spacing-sm)]">
              <RecentReport name="User Report - Dec 2025" date="Dec 30, 2025" format="pdf" />
              <RecentReport name="Restaurant Analytics" date="Dec 28, 2025" format="xlsx" />
              <RecentReport name="Reviews Summary" date="Dec 25, 2025" format="csv" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Recent Report Item
 */
interface RecentReportProps {
  name: string
  date: string
  format: ReportFormat
}

function RecentReport({ name, date, format }: RecentReportProps) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-between p-[var(--spacing-sm)] rounded-[var(--radius-md)] hover:bg-[var(--fg-3)] transition-colors text-left"
    >
      <div className="flex items-center gap-[var(--spacing-sm)]">
        <DocumentTextIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-50)]" />
        <div>
          <p className="text-[var(--font-size-sm)] font-medium text-[var(--fg)]">{name}</p>
          <p className="text-[var(--font-size-xs)] text-[var(--fg-50)]">{date}</p>
        </div>
      </div>
      <span className="text-[var(--font-size-xs)] font-medium uppercase text-[var(--color-primary)]">
        {format}
      </span>
    </button>
  )
}
