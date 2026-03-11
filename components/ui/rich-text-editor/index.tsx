/**
 * Rich Text Editor Component
 *
 * Lightweight WYSIWYG editor with basic formatting
 * 100% design token compliant - no hardcoded values
 *
 * @module components/ui/rich-text-editor
 */

"use client"

import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
} from "@/components/icons"
import { useLanguage } from "@/context/LanguageContext"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import type { RichTextEditorFieldProps, RichTextEditorProps, ToolbarButtonProps } from "./types"

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value = "",
      onChange,
      placeholder = "Write something...",
      minHeight = "200px",
      maxHeight = "400px",
      showToolbar = true,
      className = "",
      id,
    },
    _ref
  ) => {
    const { t } = useLanguage()
    const editorRef = useRef<HTMLDivElement>(null)
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState("")
    const [selectionRange, setSelectionRange] = useState<Range | null>(null)

    useEffect(() => {
      if (editorRef.current && value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value
      }
    }, [value])

    const handleInput = useCallback(() => {
      if (editorRef.current) {
        onChange?.(editorRef.current.innerHTML)
      }
    }, [onChange])

    const execCommand = useCallback(
      (command: string, val?: string) => {
        document.execCommand(command, false, val)
        editorRef.current?.focus()
        handleInput()
      },
      [handleInput]
    )

    const toggleBold = useCallback(() => execCommand("bold"), [execCommand])
    const toggleItalic = useCallback(() => execCommand("italic"), [execCommand])
    const toggleUnorderedList = useCallback(() => execCommand("insertUnorderedList"), [execCommand])
    const toggleOrderedList = useCallback(() => execCommand("insertOrderedList"), [execCommand])

    const setHeading = useCallback(
      (level: 1 | 2 | 3) => {
        execCommand("formatBlock", `h${level}`)
      },
      [execCommand]
    )

    const openLinkModal = useCallback(() => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        setSelectionRange(selection.getRangeAt(0))
        setIsLinkModalOpen(true)
      }
    }, [])

    const insertLink = useCallback(() => {
      if (linkUrl && selectionRange) {
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(selectionRange)
        }
        execCommand("createLink", linkUrl)
        setLinkUrl("")
        setIsLinkModalOpen(false)
      }
    }, [linkUrl, selectionRange, execCommand])

    const removeLink = useCallback(() => {
      execCommand("unlink")
    }, [execCommand])

    const [commandState, setCommandState] = useState({ isBold: false, isItalic: false })

    const updateCommandState = useCallback(() => {
      setCommandState({
        isBold: document.queryCommandState("bold"),
        isItalic: document.queryCommandState("italic"),
      })
    }, [])

    useEffect(() => {
      document.addEventListener("selectionchange", updateCommandState)
      return () => document.removeEventListener("selectionchange", updateCommandState)
    }, [updateCommandState])

    const ToolbarButton = ({ onClick, isActive = false, children, title }: ToolbarButtonProps) => (
      <button
        type="button"
        onClick={onClick}
        className={`p-[var(--spacing-sm)] rounded-[var(--radius-md)] transition-colors ${
          isActive
            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
            : "text-[var(--fg-60)] hover:text-[var(--fg)] hover:bg-[var(--fg-5)]"
        }`}
        title={title}
      >
        {children}
      </button>
    )

    return (
      <div className={`flex flex-col gap-[var(--spacing-sm)] ${className}`}>
        {showToolbar && (
          <div className="flex flex-wrap items-center gap-[var(--spacing-xs)] p-[var(--spacing-sm)] bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-lg)]">
            <div className="flex items-center gap-[var(--spacing-xs)] pr-[var(--spacing-sm)] border-r border-[var(--fg-10)]">
              <ToolbarButton onClick={toggleBold} isActive={commandState.isBold} title="Bold">
                <BoldIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              </ToolbarButton>
              <ToolbarButton onClick={toggleItalic} isActive={commandState.isItalic} title="Italic">
                <ItalicIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-[var(--spacing-xs)] pr-[var(--spacing-sm)] border-r border-[var(--fg-10)]">
              <button
                type="button"
                onClick={() => setHeading(1)}
                className="px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-bold text-[var(--fg-60)] hover:text-[var(--fg)] hover:bg-[var(--fg-5)] transition-colors"
                title="Heading 1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => setHeading(2)}
                className="px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-bold text-[var(--fg-60)] hover:text-[var(--fg)] hover:bg-[var(--fg-5)] transition-colors"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => setHeading(3)}
                className="px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-bold text-[var(--fg-60)] hover:text-[var(--fg)] hover:bg-[var(--fg-5)] transition-colors"
                title="Heading 3"
              >
                H3
              </button>
            </div>

            <div className="flex items-center gap-[var(--spacing-xs)] pr-[var(--spacing-sm)] border-r border-[var(--fg-10)]">
              <ToolbarButton onClick={toggleUnorderedList} title="Bullet List">
                <ListBulletIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              </ToolbarButton>
              <ToolbarButton onClick={toggleOrderedList} title="Numbered List">
                <NumberedListIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-[var(--spacing-xs)]">
              <ToolbarButton onClick={openLinkModal} title="Insert Link">
                <LinkIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              </ToolbarButton>
              <ToolbarButton onClick={removeLink} title="Remove Link">
                <span className="text-[var(--font-size-xs)] font-medium">{t("common.unlink")}</span>
              </ToolbarButton>
            </div>
          </div>
        )}

        {isLinkModalOpen && (
          <div className="flex items-center gap-[var(--spacing-sm)] p-[var(--spacing-sm)] bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-lg)] animate-in fade-in slide-in-from-top-2 duration-200">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-[var(--spacing-sm)] py-[var(--spacing-xs)] bg-[var(--bg)] border border-[var(--fg-20)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] text-[var(--fg)] placeholder:text-[var(--fg-40)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  insertLink()
                } else if (e.key === "Escape") {
                  setIsLinkModalOpen(false)
                  setLinkUrl("")
                }
              }}
            />
            <button
              type="button"
              onClick={insertLink}
              className="px-[var(--spacing-sm)] py-[var(--spacing-xs)] bg-[var(--color-primary)] text-[var(--bg)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-medium hover:opacity-90 transition-opacity"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLinkModalOpen(false)
                setLinkUrl("")
              }}
              className="px-[var(--spacing-sm)] py-[var(--spacing-xs)] bg-[var(--fg-10)] text-[var(--fg)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-medium hover:bg-[var(--fg-20)] transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* @design-exception DYNAMIC_VALUE: minHeight & maxHeight are runtime props that cannot be expressed with static Tailwind classes */}
        <div
          ref={editorRef}
          id={id}
          contentEditable
          onInput={handleInput}
          style={{ minHeight, maxHeight: maxHeight !== "none" ? maxHeight : undefined }}
          className="flex-1 px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--bg)] border border-[var(--fg-20)] rounded-[var(--radius-lg)] text-[var(--font-size-base)] text-[var(--fg)] leading-relaxed focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--fg-20)] hover:scrollbar-thumb-[var(--fg-30)] [&_a]:text-[var(--color-primary)] [&_a]:underline [&_ul]:list-[disc] [&_ul]:pl-[var(--spacing-lg)] [&_ol]:list-[decimal] [&_ol]:pl-[var(--spacing-lg)] [&_h1]:text-[var(--font-size-4xl)] [&_h1]:font-bold [&_h1]:mb-[var(--spacing-sm)] [&_h2]:text-[var(--font-size-3xl)] [&_h2]:font-bold [&_h2]:mb-[var(--spacing-sm)] [&_h3]:text-[var(--font-size-2xl)] [&_h3]:font-bold [&_h3]:mb-[var(--spacing-sm)] [&_p]:mb-[var(--spacing-sm)]"
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
      </div>
    )
  }
)

RichTextEditor.displayName = "RichTextEditor"

export function RichTextEditorField({
  label,
  value,
  onChange,
  required = false,
  error,
  helperText,
  id,
  ...editorProps
}: RichTextEditorFieldProps) {
  const editorId = id || `rich-text-editor-${Math.random().toString(36).substring(2, 11)}`
  return (
    <div className="flex flex-col gap-[var(--spacing-xs)]">
      <label
        htmlFor={editorId}
        className="flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-sm)] font-medium text-[var(--fg)]"
      >
        {label}
        {required && <span className="text-[var(--color-error)]">*</span>}
      </label>
      <RichTextEditor value={value} onChange={onChange} id={editorId} {...editorProps} />
      {helperText && !error && (
        <p className="text-[var(--font-size-xs)] text-[var(--fg-60)]">{helperText}</p>
      )}
      {error && <p className="text-[var(--font-size-xs)] text-[var(--color-error)]">{error}</p>}
    </div>
  )
}
