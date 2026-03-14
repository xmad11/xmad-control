/**
 * AI Chat Page
 * Chat interface for XMAD AI agents
 */

export const metadata = {
  title: "AI Chat | XMAD Control",
}

export default function ChatPage() {
  return (
    <div className="p-[var(--spacing-xl)]">
      <h1 className="text-[var(--font-size-4xl)] font-bold mb-[var(--spacing-xl)]">AI Chat</h1>

      <div className="h-[calc(100vh-200px)] bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] flex flex-col">
        {/* Chat messages area */}
        <div className="flex-1 p-[var(--spacing-lg)] overflow-auto">
          <p className="text-[var(--fg-muted)] text-center">Chat interface coming soon...</p>
        </div>

        {/* Input area */}
        <div className="p-[var(--spacing-lg)] border-t border-[var(--fg-10)]">
          <div className="flex gap-[var(--spacing-md)]">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--bg)] rounded-[var(--radius-lg)] border border-[var(--fg-20)] focus:border-[var(--color-primary)] outline-none"
              disabled
            />
            <button
              className="px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] opacity-50 cursor-not-allowed"
              disabled
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
