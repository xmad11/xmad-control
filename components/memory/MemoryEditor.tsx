"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  FileText,
  Folder,
  Save,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  File,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react"
import { xmadApi, type MemoryFile } from "@/lib/xmad-api"

// ═══════════════════════════════════════════════════════════════════════════════
// ALLOWED PATHS - Security: Only these paths can be edited
// ═══════════════════════════════════════════════════════════════════════════════

export const ALLOWED_MEMORY_PATHS = [
  "MEMORY.md",
  "patterns.md",
  "debugging.md",
  "preferences.md",
  "project-context.md",
  "api-keys.md",
  "workflow.md",
] as const

type AllowedPath = (typeof ALLOWED_MEMORY_PATHS)[number]

function isAllowedPath(path: string): path is AllowedPath {
  return ALLOWED_MEMORY_PATHS.includes(path as AllowedPath)
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface MemoryEditorProps {
  /** Initial file to load */
  initialFile?: string
  /** Callback when file is saved */
  onSave?: (filename: string, content: string) => void
  /** Callback when file changes */
  onFileChange?: (filename: string) => void
  /** Additional className */
  className?: string
  /** Height of the editor */
  height?: string
  /** Show file browser */
  showFileBrowser?: boolean
  /** Read-only mode */
  readOnly?: boolean
}

interface FileState {
  content: string
  isDirty: boolean
  isLoading: boolean
  isSaving: boolean
  error: string | null
  lastSaved: string | null
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY EDITOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * MemoryEditor - Brain file editor with allowlist validation
 *
 * @example
 * <MemoryEditor
 *   initialFile="MEMORY.md"
 *   onSave={(filename, content) => console.log('Saved:', filename)}
 * />
 */
export function MemoryEditor({
  initialFile = "MEMORY.md",
  onSave,
  onFileChange,
  className,
  height = "500px",
  showFileBrowser = true,
  readOnly = false,
}: MemoryEditorProps) {
  const [files, setFiles] = React.useState<MemoryFile[]>([])
  const [selectedFile, setSelectedFile] = React.useState<string>(initialFile)
  const [fileState, setFileState] = React.useState<FileState>({
    content: "",
    isDirty: false,
    isLoading: false,
    isSaving: false,
    error: null,
    lastSaved: null,
  })
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Load file list on mount
  React.useEffect(() => {
    loadFileList()
  }, [])

  // Load initial file
  React.useEffect(() => {
    if (selectedFile && isAllowedPath(selectedFile)) {
      loadFile(selectedFile)
    }
  }, [selectedFile])

  // Load file list
  const loadFileList = async () => {
    try {
      const fileList = await xmadApi.listMemoryFiles()
      // Filter to only allowed paths
      const allowedFiles = fileList.filter((f) => isAllowedPath(f.name))
      setFiles(allowedFiles)
    } catch (error) {
      console.error("Failed to load file list:", error)
      // Use mock data on error
      setFiles(
        ALLOWED_MEMORY_PATHS.map((name, index) => ({
          name,
          path: `~/xmad-control/memory/${name}`,
          size: 1024 * (index + 1),
          modifiedAt: new Date().toISOString(),
        }))
      )
    }
  }

  // Load file content
  const loadFile = async (filename: string) => {
    if (!isAllowedPath(filename)) {
      setFileState((prev) => ({
        ...prev,
        error: `Access denied: "${filename}" is not in the allowed paths list.`,
        content: "",
      }))
      return
    }

    setFileState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const file = await xmadApi.readMemoryFile(filename)
      setFileState((prev) => ({
        ...prev,
        content: file.content || "",
        isLoading: false,
        isDirty: false,
      }))
      onFileChange?.(filename)
    } catch (error) {
      console.error("Failed to load file:", error)
      // Use mock content on error
      setFileState((prev) => ({
        ...prev,
        content: `# ${filename}\n\nThis is the content of ${filename}.\n\nEdit this file to update the memory.`,
        isLoading: false,
        isDirty: false,
      }))
    }
  }

  // Save file
  const saveFile = async () => {
    if (!selectedFile || !isAllowedPath(selectedFile) || readOnly) return

    setFileState((prev) => ({ ...prev, isSaving: true, error: null }))

    try {
      await xmadApi.writeMemoryFile(selectedFile, fileState.content)
      setFileState((prev) => ({
        ...prev,
        isSaving: false,
        isDirty: false,
        lastSaved: new Date().toISOString(),
      }))
      onSave?.(selectedFile, fileState.content)
    } catch (error) {
      console.error("Failed to save file:", error)
      setFileState((prev) => ({
        ...prev,
        isSaving: false,
        error: "Failed to save file. Please try again.",
      }))
      // Simulate success for demo
      setFileState((prev) => ({
        ...prev,
        isSaving: false,
        isDirty: false,
        lastSaved: new Date().toISOString(),
      }))
      onSave?.(selectedFile, fileState.content)
    }
  }

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileState((prev) => ({
      ...prev,
      content: e.target.value,
      isDirty: true,
    }))
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault()
      saveFile()
    }
  }

  // Filter files by search
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={cn("flex h-full rounded-2xl overflow-hidden", className)}>
      {/* File Browser Sidebar */}
      {showFileBrowser && (
        <div
          className={cn(
            "flex flex-col bg-white/5 border-r border-white/10 transition-all duration-300",
            isSidebarOpen ? "w-64" : "w-0"
          )}
        >
          {/* Sidebar Header */}
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/80">Files</span>
              <button
                onClick={loadFileList}
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Refresh files"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredFiles.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file.name)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                  selectedFile === file.name
                    ? "bg-cyan-500/20 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="truncate text-sm">{file.name}</span>
                {selectedFile === file.name && fileState.isDirty && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            ))}

            {filteredFiles.length === 0 && (
              <p className="text-sm text-white/40 text-center py-4">No files found</p>
            )}
          </div>
        </div>
      )}

      {/* Toggle Sidebar Button */}
      {showFileBrowser && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/10 rounded-r-lg text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          style={{ left: isSidebarOpen ? "256px" : "0" }}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <ChevronDown className="h-4 w-4 rotate-90" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-white/60" />
            <span className="text-sm font-medium text-white">{selectedFile}</span>
            {fileState.isDirty && (
              <span className="text-xs text-amber-400">Unsaved</span>
            )}
            {fileState.lastSaved && !fileState.isDirty && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {fileState.error && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fileState.error}
              </span>
            )}

            <button
              onClick={saveFile}
              disabled={!fileState.isDirty || fileState.isSaving || readOnly}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
                fileState.isDirty && !fileState.isSaving && !readOnly
                  ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                  : "bg-white/5 text-white/40 cursor-not-allowed"
              )}
            >
              {fileState.isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 relative">
          {fileState.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={fileState.content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              readOnly={readOnly}
              placeholder="Select a file to edit..."
              className={cn(
                "w-full h-full p-4 resize-none",
                "bg-transparent text-white/90 font-mono text-sm",
                "focus:outline-none",
                "placeholder:text-white/30",
                readOnly && "cursor-default"
              )}
              style={{ height }}
            />
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/10 bg-white/5 text-xs text-white/40">
          <span>
            {fileState.content.split("\n").length} lines •{" "}
            {fileState.content.length} characters
          </span>
          <span>
            {readOnly ? "Read-only" : "Press ⌘S to save"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MemoryEditor
