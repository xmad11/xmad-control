/* ═══════════════════════════════════════════════════════════════════════════════
   OCR SYSTEM - Optical Character Recognition Interface

   PORTABLE MODULE - Designed for monorepo extraction
   No tight coupling to xmad-control specific code

   Status: PLACEHOLDER - Interface contracts only, no implementation
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

export interface OCRResult {
  text: string
  confidence: number
  blocks: OCRBlock[]
  metadata: {
    sourceType: "image" | "pdf" | "screenshot"
    language?: string
    processedAt: string
    processingTimeMs: number
  }
}

export interface OCRBlock {
  text: string
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  confidence: number
  type: "text" | "heading" | "list" | "table" | "image"
}

export interface OCROptions {
  language?: string
  detectLanguage?: boolean
  extractTables?: boolean
  extractStructure?: boolean
  minConfidence?: number
}

export interface OCRImageInput {
  type: "buffer" | "url" | "base64"
  data: Buffer | string
  format?: "png" | "jpg" | "jpeg" | "webp" | "pdf"
}

/* ═══════════════════════════════════════════════════════════════════════════════
   INTERFACE CONTRACT
   ═══════════════════════════════════════════════════════════════════════════════ */

export interface OCRProvider {
  readonly name: string

  // Text extraction
  extractText(input: OCRImageInput, options?: OCROptions): Promise<OCRResult>
  extractTextFromUrl(url: string, options?: OCROptions): Promise<OCRResult>
  extractTextFromBuffer(buffer: Buffer, format?: string, options?: OCROptions): Promise<OCRResult>

  // Batch processing
  extractBatch(inputs: OCRImageInput[], options?: OCROptions): Promise<OCRResult[]>

  // Health
  isReady(): Promise<boolean>
  getSupportedLanguages(): string[]
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PLACEHOLDER IMPLEMENTATION
   To be replaced with actual provider (Tesseract.js, GPT-4 Vision, etc.)
   ═══════════════════════════════════════════════════════════════════════════════ */

class PlaceholderOCRProvider implements OCRProvider {
  readonly name = "placeholder"

  async extractText(_input: OCRImageInput, _options?: OCROptions): Promise<OCRResult> {
    throw new Error("OCR provider not configured. Implement with Tesseract.js or GPT-4 Vision.")
  }

  async extractTextFromUrl(_url: string, _options?: OCROptions): Promise<OCRResult> {
    throw new Error("OCR provider not configured. Implement with Tesseract.js or GPT-4 Vision.")
  }

  async extractTextFromBuffer(
    _buffer: Buffer,
    _format?: string,
    _options?: OCROptions
  ): Promise<OCRResult> {
    throw new Error("OCR provider not configured. Implement with Tesseract.js or GPT-4 Vision.")
  }

  async extractBatch(_inputs: OCRImageInput[], _options?: OCROptions): Promise<OCRResult[]> {
    throw new Error("OCR provider not configured. Implement with Tesseract.js or GPT-4 Vision.")
  }

  async isReady(): Promise<boolean> {
    return false
  }

  getSupportedLanguages(): string[] {
    return []
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════════════════════════════════════ */

export const ocrProvider: OCRProvider = new PlaceholderOCRProvider()

// Convenience functions
export async function extractText(input: OCRImageInput, options?: OCROptions): Promise<OCRResult> {
  return ocrProvider.extractText(input, options)
}

export async function extractTextFromUrl(url: string, options?: OCROptions): Promise<OCRResult> {
  return ocrProvider.extractTextFromUrl(url, options)
}
