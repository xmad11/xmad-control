/* ═══════════════════════════════════════════════════════════════════════════════
   Memory Editor Component
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Save, RefreshCw, ChevronDown, Check, Loader2 } from "lucide-react";

interface MemoryFile {
  name: string;
  path: string;
  content: string;
}

interface MemoryEditorProps {
  initialFile?: string;
  height?: string;
  onSave?: (filename: string, content: string) => void;
  files?: MemoryFile[];
}

// Default memory files
const DEFAULT_FILES: MemoryFile[] = [
  { name: "MEMORY.md", path: "/memory/MEMORY.md", content: "# Memory\n\nAgent memory content..." },
  { name: "SOUL.md", path: "/memory/SOUL.md", content: "# Soul\n\nAgent soul configuration..." },
  { name: "IDENTITY.md", path: "/memory/IDENTITY.md", content: "# Identity\n\nAgent identity settings..." },
];

export function MemoryEditor({
  initialFile = "MEMORY.md",
  height = "400px",
  onSave,
  files = DEFAULT_FILES,
}: MemoryEditorProps) {
  const [selectedFile, setSelectedFile] = useState<string>(initialFile);
  const [content, setContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Load file content
  useEffect(() => {
    const file = files.find((f) => f.name === selectedFile);
    if (file) {
      setIsLoading(true);
      // Simulate loading delay for better UX
      setTimeout(() => {
        setContent(file.content);
        setIsLoading(false);
      }, 100);
    }
  }, [selectedFile, files]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!content.trim() || isSaving) return;

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      if (onSave) {
        onSave(selectedFile, content);
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save:", error);
      setSaveStatus("idle");
    } finally {
      setIsSaving(false);
    }
  }, [content, isSaving, onSave, selectedFile]);

  // Handle keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  // Handle file selection
  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-cyan-400" />
          <span className="text-white font-medium">Memory Editor</span>
        </div>

        {/* File Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
          >
            <span>{selectedFile}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-slate-800 border border-white/10 rounded-lg overflow-hidden z-10">
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => handleFileSelect(file.name)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
                    selectedFile === file.name ? "text-cyan-400" : "text-white/80"
                  }`}
                >
                  {file.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative" style={{ height }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-white/40">
            <RefreshCw className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 bg-transparent text-white/90 font-mono text-sm resize-none focus:outline-none"
            placeholder="Start typing..."
            spellCheck={false}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>{content.length} characters</span>
          <span>•</span>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === "saved" && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <Check className="h-4 w-4" />
              <span>Saved</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoryEditor;
