/* ═══════════════════════════════════════════════════════════════════════════════
   FAQ SECTION - Frequently Asked Questions
   Separate section before footer
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { ChevronDownIcon, ChevronUpIcon } from "@/components/icons"
import { memo, useState } from "react"

const qaItems = [
  {
    question: "What is Shadi.ae?",
    answer:
      "Shadi.ae is the UAE's premier restaurant recommendation platform by Shadi Shawqi (@the.ss), featuring 7,000+ curated and verified restaurants, home businesses, and food shops across the UAE.",
  },
  {
    question: "How can I list my business?",
    answer:
      "Restaurants, home businesses, and food shops can register for free. Visit our Business Sign Up page to create your profile and start reaching thousands of food lovers daily.",
  },
  {
    question: "How do I request a review from @the.ss?",
    answer:
      "You can request a visit by filling out our 'Request a Visit' form. Shadi Shawqi personally reviews selected establishments and features them on Instagram (@the.ss) to 100K+ followers.",
  },
  {
    question: "Can I send products for review?",
    answer:
      "Yes! If you're a food business, you can send your products (sweets, dishes, packaged foods, etc.) for potential review by @the.ss. Use the 'Send Products' form to get started.",
  },
  {
    question: "Is Shadi.ae free to use?",
    answer:
      "Yes, Shadi.ae is completely free for users. Business listings are also free, with optional premium features for enhanced visibility.",
  },
]

/**
 * Q&A Accordion Item
 */
interface QAItemProps {
  question: string
  answer: string
}

function QAItem({ question, answer }: QAItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-[var(--fg-10)] last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-[var(--spacing-md)] text-left"
      >
        <span className="text-[var(--font-size-base)] font-semibold text-[var(--fg)] flex-1 pr-[var(--spacing-md)]">
          {question}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-secondary-gray flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-secondary-gray flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-[var(--spacing-md)]">
          <p className="text-[var(--font-size-sm)] leading-relaxed text-secondary-gray">{answer}</p>
        </div>
      )}
    </div>
  )
}

/**
 * FAQ Section Component
 */
const FAQSection = memo(function FAQSection() {
  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-2xl)]">
      <h3 className="text-[var(--font-size-lg)] font-bold text-[var(--fg)] text-center mb-[var(--spacing-lg)]">
        Frequently Asked Questions
      </h3>
      <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] p-[var(--spacing-md)]">
        {qaItems.map((item, index) => (
          <QAItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  )
})

export { FAQSection }
