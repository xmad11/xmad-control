/**
 * Automation Queue Page
 * Manage automation tasks
 */

import { TabContentWrapper } from "@/components/dashboard/TabContentWrapper"

export const metadata = {
  title: "Automation | XMAD Control",
}

export default function AutomationPage() {
  return (
    <TabContentWrapper>
      <h1 className="text-[var(--font-size-3xl)] font-bold mb-[var(--spacing-lg)]">
        Automation Queue
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-lg)]">
        {/* Pending Tasks */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Pending Tasks
          </h2>
          <div className="space-y-[var(--spacing-md)]">
            <div className="p-[var(--spacing-md)] bg-[var(--bg)] rounded-[var(--radius-lg)] opacity-50">
              No pending tasks
            </div>
          </div>
        </div>

        {/* Task History */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Task History
          </h2>
          <div className="space-y-[var(--spacing-md)]">
            <div className="p-[var(--spacing-md)] bg-[var(--bg)] rounded-[var(--radius-lg)] opacity-50">
              No completed tasks
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <div className="mt-[var(--spacing-lg)] bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
        <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
          Add New Task
        </h2>
        <div className="flex gap-[var(--spacing-md)]">
          <select className="flex-1 px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--bg)] rounded-[var(--radius-lg)] border border-[var(--fg-20)]">
            <option>backup</option>
            <option>restore</option>
            <option>memory-sync</option>
            <option>ssh-toggle</option>
          </select>
          <button
            type="button"
            className="px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] opacity-50 cursor-not-allowed"
            disabled
          >
            Add Task
          </button>
        </div>
      </div>
    </TabContentWrapper>
  )
}
