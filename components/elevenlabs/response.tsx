/* ═══════════════════════════════════════════════════════════════════════════════
   RESPONSE - ElevenLabs UI Component
   Streaming markdown renderer with smooth character-by-character animations
   for AI responses with Math/LaTeX support via KaTeX
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { cn } from "@/lib/utils"
import React, { useMemo, useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import { BlockMath, InlineMath } from "react-katex"
import "katex/dist/katex.min.css"

// ═══════════════════════════════════════════════════════════════════════════════
// MATH RENDERING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

interface ParsedSegment {
  type: "text" | "math-inline" | "math-block"
  content: string
}

function extractMathSegments(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = []
  let remaining = text

  while (remaining.length > 0) {
    // Check for block math $$...$$
    const blockMatch = remaining.match(/^\$\$([\s\S]*?)\$\$/)
    if (blockMatch) {
      segments.push({ type: "math-block", content: blockMatch[1].trim() })
      remaining = remaining.slice(blockMatch[0].length)
      continue
    }

    // Check for inline math $...$
    const inlineMatch = remaining.match(/^\$([^$\n]+?)\$/)
    if (inlineMatch) {
      segments.push({ type: "math-inline", content: inlineMatch[1].trim() })
      remaining = remaining.slice(inlineMatch[0].length)
      continue
    }

    // Find next math delimiter
    const nextBlock = remaining.indexOf("$$")
    const nextInline = remaining.indexOf("$")
    const nextMath =
      nextBlock === -1
        ? nextInline
        : nextInline === -1
          ? nextBlock
          : Math.min(nextBlock, nextInline)

    if (nextMath === -1) {
      segments.push({ type: "text", content: remaining })
      break
    }

    segments.push({ type: "text", content: remaining.slice(0, nextMath) })
    remaining = remaining.slice(nextMath)
  }

  return segments.filter((s) => s.content.length > 0)
}

function renderMathSegments(segments: ParsedSegment[], keyPrefix: string): ReactNode[] {
  return segments.map((seg, i) => {
    const key = `${keyPrefix}-math-${i}`
    try {
      if (seg.type === "math-inline") {
        return <InlineMath key={key} math={seg.content} />
      }
      if (seg.type === "math-block") {
        return <BlockMath key={key} math={seg.content} />
      }
      return <span key={key} dangerouslySetInnerHTML={{ __html: seg.content }} />
    } catch {
      // Fallback for invalid LaTeX
      return (
        <span key={key} className="text-white/60">
          {seg.type.startsWith("math") ? `$${seg.content}$` : seg.content}
        </span>
      )
    }
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIMPLE MARKDOWN RENDERER
// Supports: headers, bold, italic, code, links, lists, blockquotes, tables, math
// ═══════════════════════════════════════════════════════════════════════════════

let globalKeyIndex = 0
const _getKey = () => `md-${globalKeyIndex++}`

function processInline(line: string, keyPrefix: string): ReactNode {
  // First, check for math segments
  const mathSegments = extractMathSegments(line)

  if (
    mathSegments.length > 1 ||
    (mathSegments.length === 1 && mathSegments[0].type.startsWith("math"))
  ) {
    // Line contains math - process text segments for markdown
    const processed: ParsedSegment[] = mathSegments.map((seg) => {
      if (seg.type === "text") {
        let processed = seg.content
        // Bold
        processed = processed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic
        processed = processed.replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Code
        processed = processed.replace(
          /`(.*?)`/g,
          '<code class="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300">$1</code>'
        )
        // Links
        processed = processed.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" class="text-cyan-400 underline" target="_blank" rel="noopener noreferrer">$1</a>'
        )
        return { ...seg, content: processed }
      }
      return seg
    })
    return <span key={`${keyPrefix}-inline`}>{renderMathSegments(processed, keyPrefix)}</span>
  }

  // No math - use original logic
  let processed = line
  // Bold
  processed = processed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  // Italic
  processed = processed.replace(/\*(.*?)\*/g, "<em>$1</em>")
  // Code
  processed = processed.replace(
    /`(.*?)`/g,
    '<code class="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300">$1</code>'
  )
  // Links
  processed = processed.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-cyan-400 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  return <span key={`${keyPrefix}-text`} dangerouslySetInnerHTML={{ __html: processed }} />
}

function parseMarkdown(text: string, keyPrefix = "md"): ReactNode[] {
  const lines = text.split("\n")
  const elements: ReactNode[] = []
  let inCodeBlock = false
  let codeContent: string[] = []
  let codeLanguage = ""
  let inTable = false
  let tableRows: string[][] = []

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <table key={`${keyPrefix}-tbl-${elements.length}`} className="my-4 w-full border-collapse">
          <thead>
            <tr>
              {tableRows[0].map((cell, i) => (
                <th
                  key={i}
                  className="border border-white/10 bg-white/5 px-4 py-2 text-left text-white"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border border-white/10 px-4 py-2 text-white/80">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
      tableRows = []
      inTable = false
    }
  }

  lines.forEach((line, index) => {
    const lineKey = `${keyPrefix}-l${index}`

    // Code blocks
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        flushTable()
        inCodeBlock = true
        codeLanguage = line.slice(3)
        codeContent = []
      } else {
        elements.push(
          <pre key={lineKey} className="my-4 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm">
            <code className={`language-${codeLanguage}`}>{codeContent.join("\n")}</code>
          </pre>
        )
        inCodeBlock = false
      }
      return
    }

    if (inCodeBlock) {
      codeContent.push(line)
      return
    }

    // Tables
    if (line.includes("|") && !line.startsWith(">")) {
      const cells = line
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c)

      if (cells.length > 0) {
        // Skip separator rows
        if (!cells.every((c) => /^[-:]+$/.test(c))) {
          inTable = true
          tableRows.push(cells)
        }
        return
      }
    } else if (inTable) {
      flushTable()
    }

    // Headers
    if (line.startsWith("### ")) {
      flushTable()
      elements.push(
        <h3 key={lineKey} className="mt-6 mb-2 text-lg font-semibold text-white">
          {processInline(line.slice(4), lineKey)}
        </h3>
      )
      return
    }
    if (line.startsWith("## ")) {
      flushTable()
      elements.push(
        <h2 key={lineKey} className="mt-6 mb-3 text-xl font-semibold text-white">
          {processInline(line.slice(3), lineKey)}
        </h2>
      )
      return
    }
    if (line.startsWith("# ")) {
      flushTable()
      elements.push(
        <h1 key={lineKey} className="mt-6 mb-4 text-2xl font-bold text-white">
          {processInline(line.slice(2), lineKey)}
        </h1>
      )
      return
    }

    // Horizontal rule
    if (line === "---") {
      flushTable()
      elements.push(<hr key={lineKey} className="my-6 border-t border-white/10" />)
      return
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushTable()
      elements.push(
        <blockquote
          key={lineKey}
          className="my-4 border-l-4 border-cyan-500/50 pl-4 italic text-white/70"
        >
          {processInline(line.slice(2), lineKey)}
        </blockquote>
      )
      return
    }

    // Lists
    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushTable()
      elements.push(
        <li key={lineKey} className="ml-4 list-disc text-white/80">
          {processInline(line.slice(2), lineKey)}
        </li>
      )
      return
    }

    // Empty line
    if (line === "") {
      flushTable()
      elements.push(<br key={lineKey} />)
      return
    }

    // Regular paragraph
    flushTable()
    elements.push(
      <p key={lineKey} className="my-2 text-white/80">
        {processInline(line, lineKey)}
      </p>
    )
  })

  // Flush remaining table
  flushTable()

  return elements
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ResponseProps {
  children: ReactNode
  className?: string
  /** Enable streaming animation (default: false) */
  streaming?: boolean
  /** Speed of streaming animation in ms per character (default: 10) */
  speed?: number
  /** Initial delay before streaming starts in ms (default: 0) */
  delay?: number
}

export function Response({
  children,
  className,
  streaming = false,
  speed = 10,
  delay = 0,
}: ResponseProps) {
  const [streamedContent, setStreamedContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const animationRef = useRef<number | null>(null)
  const mountedRef = useRef(true)

  const fullContent = useMemo(() => {
    if (typeof children === "string") {
      return children
    }
    return null
  }, [children])

  // Handle streaming animation with proper cleanup
  useEffect(() => {
    mountedRef.current = true

    if (!streaming || !fullContent) {
      if (!streaming && fullContent) {
        setStreamedContent(fullContent)
      }
      return
    }

    let currentIndex = 0
    setIsStreaming(true)
    setStreamedContent("")

    const startStreaming = () => {
      if (!mountedRef.current) return

      const stream = () => {
        if (!mountedRef.current || currentIndex >= fullContent.length) {
          setIsStreaming(false)
          animationRef.current = null
          return
        }

        // Stream multiple characters per frame for better performance
        const charsPerFrame = Math.max(1, Math.floor(16 / speed))
        const nextIndex = Math.min(currentIndex + charsPerFrame, fullContent.length)

        currentIndex = nextIndex
        setStreamedContent(fullContent.slice(0, currentIndex))

        if (currentIndex < fullContent.length) {
          animationRef.current = requestAnimationFrame(stream)
        } else {
          setIsStreaming(false)
          animationRef.current = null
        }
      }

      animationRef.current = requestAnimationFrame(stream)
    }

    const startDelay = setTimeout(startStreaming, delay)

    return () => {
      mountedRef.current = false
      clearTimeout(startDelay)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [streaming, fullContent, speed, delay])

  // Memoize parsed content to prevent re-parsing on every render
  const parsedContent = useMemo(() => {
    // If non-string children, render directly
    if (typeof children !== "string") {
      return children
    }

    // If streaming, show animated content
    if (streaming && streamedContent) {
      return parseMarkdown(streamedContent, `stream-${Date.now()}`)
    }

    // Otherwise, render full content
    return parseMarkdown(children as string, "static")
  }, [children, streamedContent, streaming])

  return (
    <div
      className={cn(
        "prose prose-invert prose-sm max-w-none",
        // Custom styling
        "prose-headings:text-white",
        "prose-p:text-white/80",
        "prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline",
        "prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-300",
        "prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10",
        "prose-blockquote:border-cyan-500/50 prose-blockquote:text-white/70",
        "prose-strong:text-white",
        "prose-em:text-white/90",
        "prose-li:text-white/80",
        "prose-hr:border-white/10",
        className
      )}
    >
      {parsedContent}
      {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />}
    </div>
  )
}

export default Response
