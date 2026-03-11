"use client"

import { useState } from "react"

const logos = [
  { name: "brand-logo-icon.svg", path: "/brand/logo.svg", type: "svg" },
  { name: "brand-logo-text.svg", path: "/brand/logo-text.svg", type: "svg" },
]

export default function TestPage() {
  const [selectedLogo, setSelectedLogo] = useState<(typeof logos)[0] | null>(null)

  return (
    <div className="min-h-screen bg-background p-[var(--spacing-xl)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[var(--font-size-3xl)] font-bold text-fg mb-[var(--spacing-2xl)]">
          Logo Showcase
        </h1>

        {/* Main Display */}
        {selectedLogo && (
          <div className="glass-card p-[var(--spacing-2xl)] rounded-[var(--radius-2xl)] mb-[var(--spacing-2xl)]">
            <h2 className="text-[var(--font-size-xl)] text-fg mb-[var(--spacing-md)]">
              {selectedLogo.name}
            </h2>
            <div
              className="bg-transparent p-[var(--spacing-xl)] rounded-[var(--radius-xl)] flex items-center justify-center"
              style={{ minHeight: "400px" }} // @design-exception DYNAMIC_VALUE: min-h is a specific showcase height that cannot be expressed with static tokens
            >
              {selectedLogo.type === "svg" ? (
                <div
                  className="logo-wrapper"
                  style={
                    {
                      backgroundColor: "transparent",
                      display: "inline-block",
                    } as React.CSSProperties
                  }
                >
                  <img
                    src={selectedLogo.path}
                    alt={selectedLogo.name}
                    className="max-w-full block"
                    style={
                      {
                        maxHeight: "350px",
                        color: "var(--logo-color)",
                      } as React.CSSProperties
                    }
                  />
                </div>
              ) : (
                <a
                  href={selectedLogo.path}
                  download
                  className="px-[var(--spacing-2xl)] py-[var(--spacing-xl)] bg-primary text-white rounded-[var(--radius-full)] hover:scale-105 transition-transform"
                >
                  Download {selectedLogo.name}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Logo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
          {logos.map((logo, index) => (
            <button
              type="button"
              key={logo.name}
              onClick={() => setSelectedLogo(logo)}
              className={`glass-card p-[var(--spacing-lg)] rounded-[var(--radius-xl)] text-left transition-all hover:scale-[1.02] relative ${
                selectedLogo?.name === logo.name ? "ring-2 ring-primary" : ""
              }`}
            >
              <span className="absolute top-2 left-3 text-[var(--font-size-lg)] font-bold text-primary/50">
                {index + 1}
              </span>
              <div
                className="bg-transparent p-[var(--spacing-md)] rounded-[var(--radius-lg)] mb-[var(--spacing-sm)] flex items-center justify-center"
                style={{ minHeight: "120px" }} // @design-exception DYNAMIC_VALUE: min-h is a specific showcase height that cannot be expressed with static tokens
              >
                {logo.type === "svg" ? (
                  <div
                    className="logo-wrapper"
                    style={
                      {
                        backgroundColor: "transparent",
                        display: "inline-block",
                      } as React.CSSProperties
                    }
                  >
                    <img
                      src={logo.path}
                      alt={logo.name}
                      className="max-w-full block"
                      style={
                        {
                          maxHeight: "100px",
                          color: "var(--logo-color)",
                        } as React.CSSProperties
                      }
                    />
                  </div>
                ) : (
                  <span className="text-[var(--font-size-3xl)]">📄</span>
                )}
              </div>
              <p className="text-[var(--font-size-sm)] text-fg truncate">{logo.name}</p>
              <p className="text-[var(--font-size-xs)] text-fg/60">{logo.type.toUpperCase()}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
