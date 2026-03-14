/**
 * Settings Page
 * System configuration and preferences
 */

export const metadata = {
  title: "Settings | XMAD Control",
}

export default function SettingsPage() {
  return (
    <TabContentWrapper>
      <h1 className="text-[var(--font-size-3xl)] font-bold mb-[var(--spacing-lg)]">
        System Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-lg)]">
        {/* General Settings */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            General Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Language</span>
              <select className="px-4 py-2 bg-[var(--bg)] rounded-lg border border-[var(--fg-20)] text-white">
                <option>English</option>
                <option>العربية</option>
                <option>中文</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Timezone</span>
              <select className="px-4 py-2 bg-[var(--bg)] rounded-lg border border-[var(--fg-20)] text-white">
                <option>UTC+4 (Dubai)</option>
                <option>UTC (London)</option>
                <option>UTC-5 (New York)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Notifications
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Email Alerts</span>
              <div className="relative inline-block w-12 h-6 bg-[var(--bg)] rounded-full transition-all">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-[var(--color-success)]"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">SMS Alerts</span>
              <div className="relative inline-block w-12 h-6 bg-[var(--bg)] rounded-full transition-all">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-[var(--color-error)]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Security
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Two-Factor Auth</span>
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-80">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Session Timeout</span>
              <select className="px-4 py-2 bg-[var(--bg)] rounded-lg border border-[var(--fg-20)] text-white">
                <option>30 min</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Display
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Theme</span>
              <select className="px-4 py-2 bg-[var(--bg)] rounded-lg border border-[var(--fg-20)] text-white">
                <option>Light</option>
                <option>Warm</option>
                <option>Dark</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Animations</span>
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-80">
                Enabled
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-[var(--spacing-lg)]">
          <button
            className="w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-80"
          >
            Save Settings
          </button>
        </div>
      </div>
    </TabContentWrapper>
  )
}
