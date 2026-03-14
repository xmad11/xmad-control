/**
 * Backups Page
 * System backup management
 */

export const metadata = {
  title: "Backups | XMAD Control",
}

export default function BackupsPage() {
  return (
    <TabContentWrapper>
      <h1 className="text-[var(--font-size-3xl)] font-bold mb-[var(--spacing-lg)]">
        System Backups
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-lg)]">
        {/* Backup Status */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Backup Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[var(--color-success)]"></div>
              <div>
                <div className="text-sm text-white/60">Status:</div>
                <div className="text-sm text-white font-medium">Active</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[var(--color-success)]"></div>
              <div>
                <div className="text-sm text-white/60">Last Backup:</div>
                <div className="text-sm text-white font-medium">Today 8:00 PM</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[var(--color-success)]"></div>
              <div>
                <div className="text-sm text-white/60">Total Size:</div>
                <div className="text-sm text-white font-medium">2.4 GB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Backup */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Create New Backup
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 block mb-2">Backup Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[var(--bg)] rounded-lg border border-[var(--fg-20)] text-white"
                placeholder="My System Backup - 2026-03-14"
              />
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-2">Backup Type</label>
              <select className="w-full px-4 py-3 bg-[var(--bg)] rounded-lg border border-[var(--fg-20)] text-white">
                <option>Full System</option>
                <option>Database Only</option>
                <option>Configuration Only</option>
              </select>
            </div>
            <button
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-80"
            >
              Start Backup
            </button>
          </div>
        </div>

        {/* Restore Backup */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)] opacity-50">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Restore Backup
          </h2>
          <p className="text-sm text-white/60">Select a backup from the list above to restore</p>
        </div>
      </div>

      {/* Recent Backups */}
      <div className="mt-[var(--spacing-lg)]">
        <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
          Recent Backups
        </h2>
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <p className="text-sm text-white/60">No backups available</p>
        </div>
      </div>
    </TabContentWrapper>
  )
}
