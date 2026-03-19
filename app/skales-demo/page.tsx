"use client"

/* ═══════════════════════════════════════════════════════════════════════════════
   SKALES DEMO PAGE
   Landing page design inspired by skales.app
   Integrates with existing theme system (light/dark/warm + accent colors)
   ═══════════════════════════════════════════════════════════════════════════════ */

import { Footer } from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { ArrowRight, Bot, Brain, Calendar, Cpu, Globe, Mail, Mic, Sparkles } from "lucide-react"
import Link from "next/link"

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE CARDS DATA
// ═══════════════════════════════════════════════════════════════════════════════

const features = [
  {
    icon: Bot,
    title: "Desktop Buddy",
    description:
      "A floating mascot lives on your desktop. Click it to ask anything, or ask it to DO something.",
    badge: "NEW 5.0",
    accent: "cyan",
  },
  {
    icon: Brain,
    title: "Autopilot",
    description:
      "Set a goal and walk away. Autopilot runs a Deep-Dive Interview, builds a Master Plan, self-corrects.",
    badge: "NEW 5.0",
    accent: "purple",
  },
  {
    icon: Mic,
    title: "Voice Chat",
    description:
      "Full-duplex voice interface with Whisper transcription and ElevenLabs TTS playback.",
    badge: "NEW 5.0",
    accent: "blue",
  },
  {
    icon: Sparkles,
    title: "Custom Skills",
    description: "Describe a skill in plain English and generate it. Hot-reload without restart.",
    badge: "NEW 5.0",
    accent: "pink",
  },
  {
    icon: Cpu,
    title: "Lio AI - Code Builder",
    description:
      "Plan, scaffold, run and debug entire projects from chat. Lio writes files and fixes its own errors.",
    accent: "emerald",
  },
  {
    icon: Globe,
    title: "Browser Control",
    description:
      "Automate any website with a real Chromium browser. Fill forms, scrape pages, take screenshots.",
    accent: "azure",
  },
  {
    icon: Mail,
    title: "Gmail Integration",
    description: "Read, compose, reply, search, and manage emails via IMAP/SMTP with safety gates.",
    accent: "rose",
  },
  {
    icon: Calendar,
    title: "Google Calendar",
    description: "Check your schedule, create events, get reminders. Full read/write via OAuth.",
    accent: "amber",
  },
]

const testimonials = [
  {
    id: "clippy",
    quote: "This was what Clippy was supposed to be, maybe Bonzibuddy.",
    author: "u/jebeller",
    source: "r/LocalLLaMA",
  },
  {
    id: "incredible",
    quote: "Incredible. Make him look like Clippy and I will get it right away.",
    author: "r/LocalLLaMA",
    source: "Community",
  },
  {
    id: "accessibility",
    quote: "The accessibility angle is underrated - opens it to an entirely different audience.",
    author: "BenAndBlake",
    source: "Hacker News",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ACCENT COLOR MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const accentColors: Record<string, string> = {
  cyan: "var(--glow-cyan)",
  purple: "var(--glow-purple)",
  blue: "var(--glow-blue)",
  pink: "var(--glow-pink)",
  green: "var(--glow-green)",
  emerald: "var(--color-accent-emerald)",
  azure: "var(--color-accent-azure)",
  rose: "var(--color-accent-rose)",
  amber: "var(--color-accent-amber)",
  lavender: "var(--color-accent-lavender)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--glow-cyan)] opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-[var(--glow-purple)] opacity-20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/3 w-72 h-72 bg-[var(--glow-pink)] opacity-15 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero gradient overlay */}
      <div className="absolute inset-0 bg-[var(--hero-gradient)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Version badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--fg-10)] border border-[var(--fg-20)] mb-6">
          <span className="text-sm font-medium text-[var(--fg-70)]">v7.0.0</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent-emerald)] text-white font-medium">
            The Foundation
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-[var(--glow-cyan)] via-[var(--glow-purple)] to-[var(--glow-pink)] bg-clip-text text-transparent">
            The Foundation
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-[var(--fg-70)] mb-4 max-w-2xl mx-auto">
          Your always-on desktop AI companion for Windows, macOS & Linux.
        </p>

        <p className="text-base text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
          No Node. No Docker. Zero setup. A floating buddy, autonomous Autopilot, voice chat, custom
          skills - all local. In seconds.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-[var(--glow-cyan)] to-[var(--glow-purple)] text-white hover:shadow-lg hover:shadow-[var(--glow-cyan)]/25 hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://github.com/skalesapp/skales"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-[var(--fg-10)] border border-[var(--fg-20)] text-[var(--fg)] hover:bg-[var(--fg-20)] hover:border-[var(--fg-30)]"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  const Icon = feature.icon
  const accentColor = accentColors[feature.accent] || accentColors.cyan

  return (
    <div
      className="group relative p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--fg-10)] transition-all duration-300 hover:border-[var(--fg-20)] hover:shadow-lg overflow-hidden"
      style={
        {
          "--accent-color": accentColor,
        } as React.CSSProperties
      }
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}, transparent 40%)`,
          opacity: 0.06,
        }}
      />

      <div className="relative z-10">
        {/* Icon with badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            <Icon className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          {feature.badge && (
            <span
              className="text-xs px-2 py-1 rounded-full font-medium text-white"
              style={{ backgroundColor: accentColor }}
            >
              {feature.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 text-[var(--fg)]">{feature.title}</h3>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--fg)]">
            Everything your AI buddy needs. Built in.
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            A complete toolkit for desktop AI automation, all running locally on your machine.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--fg-10)]">
      <p className="text-[var(--fg)] mb-4 italic">"{testimonial.quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--glow-cyan)] to-[var(--glow-purple)] flex items-center justify-center text-white font-bold text-sm">
          {testimonial.author.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--fg)]">{testimonial.author}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{testimonial.source}</p>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--fg)]">
            What the community says
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ComparisonSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--fg)]">
            We hate complex setups. So we killed them.
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            How Skales compares to the rest of the AI agent landscape.
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-[var(--fg-10)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--bg-secondary)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--fg)]">
                  Feature
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--glow-cyan)]">
                  Skales
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-[var(--text-secondary)]">
                  Others
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--fg-10)]">
              {[
                { id: "setup", feature: "Setup Time", skales: "30 seconds", others: "3+ hours" },
                { id: "docker", feature: "Docker Required", skales: "No", others: "Yes" },
                { id: "desktop", feature: "Desktop App", skales: "Native", others: "Web only" },
                { id: "voice", feature: "Voice Interface", skales: "Full-duplex", others: "Basic" },
                { id: "local", feature: "Local & Private", skales: "100%", others: "Varies" },
                { id: "skills", feature: "Custom Skills", skales: "Unlimited", others: "Limited" },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-[var(--fg-5)] transition-colors">
                  <td className="px-6 py-4 text-sm text-[var(--fg)]">{row.feature}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-[var(--glow-cyan)]">
                    {row.skales}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-[var(--text-tertiary)]">
                    {row.others}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-12 text-center">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-cyan)] via-[var(--glow-purple)] to-[var(--glow-pink)] opacity-90" />

          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Free for personal use. Source available under BSL-1.1. No Docker. No Node. Zero setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://github.com/skalesapp/skales/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105"
              >
                Download Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function SkalesDemoPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ComparisonSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
