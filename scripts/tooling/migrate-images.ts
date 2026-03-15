#!/usr/bin/env bun

/**
 * Automated Image Migration Script
 *
 * This script:
 * 1. Scans codebase for remote image URLs
 * 2. Downloads images to local storage
 * 3. Optimizes and converts to WebP in multiple sizes
 * 4. Replaces remote URLs with local paths in code
 * 5. Generates migration report
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public")
const IMAGES_DIR = path.join(PUBLIC_DIR, "images", "restaurants")

// Image size presets (width, height, quality)
const SIZE_PRESETS = {
  thumbnail: { width: 80, height: 80, quality: 70 },
  card: { width: 300, height: 200, quality: 80 },
  marquee: { width: 150, height: 100, quality: 75 },
  hero: { width: 800, height: 400, quality: 85 },
}

interface ImageInfo {
  url: string
  id: string
  localPaths: Record<string, string>
  status: "pending" | "downloaded" | "optimized" | "replaced" | "failed"
  error?: string
}

interface MigrationReport {
  timestamp: string
  totalImages: number
  successful: number
  failed: number
  filesModified: string[]
  images: ImageInfo[]
}

/**
 * Extract image ID from Unsplash URL
 */
function extractImageId(url: string): string {
  const match = url.match(/photo-([a-z0-9-]+)/)
  return match ? match[1] : Buffer.from(url).toString("base64").slice(0, 12)
}

/**
 * Download image from URL
 */
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ImageMigrator/1.0)",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`)
  }

  const buffer = await response.arrayBuffer()
  return Buffer.from(buffer)
}

/**
 * Convert and optimize image to WebP
 */
async function optimizeImage(
  sourceBuffer: Buffer,
  width: number,
  height: number,
  quality: number
): Promise<Buffer> {
  return await sharp(sourceBuffer)
    .resize(width, height, { fit: "cover", position: "center" })
    .webp({ quality, effort: 4 })
    .toBuffer()
}

/**
 * Find all remote image URLs in codebase
 */
async function findRemoteImages(): Promise<Map<string, string[]>> {
  const remoteImages = new Map<string, string[]>()

  async function scanDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        await scanDirectory(fullPath)
      } else if (entry.name.match(/\.(tsx|ts|jsx|js)$/)) {
        const content = await fs.readFile(fullPath, "utf-8")
        // Match URLs including query parameters (Unsplash format)
        const urls = content.matchAll(/https?:\/\/images\.unsplash\.com\/[^\s"'>}]+/gi)

        for (const match of urls) {
          const url = match[0]
          if (!remoteImages.has(url)) {
            remoteImages.set(url, [])
          }
          remoteImages.get(url)!.push(fullPath)
        }
      }
    }
  }

  await scanDirectory(path.join(PROJECT_ROOT, "app"))
  await scanDirectory(path.join(PROJECT_ROOT, "components"))

  return remoteImages
}

/**
 * Process a single image
 */
async function processImage(url: string, files: string[]): Promise<ImageInfo> {
  const imageId = extractImageId(url)
  const info: ImageInfo = {
    url,
    id: imageId,
    localPaths: {},
    status: "pending",
  }

  try {
    console.log(`\n📥 Processing: ${url}`)

    // Download original image
    console.log("  ⬇️  Downloading...")
    const originalBuffer = await downloadImage(url)
    info.status = "downloaded"

    // Create output directory
    await fs.mkdir(IMAGES_DIR, { recursive: true })

    // Generate all size presets
    info.localPaths = {}
    for (const [sizeName, preset] of Object.entries(SIZE_PRESETS)) {
      const fileName = `${imageId}-${sizeName}.webp`
      const outputPath = path.join(IMAGES_DIR, fileName)

      console.log(`  🖼️  Generating ${sizeName} (${preset.width}x${preset.height})...`)
      const optimizedBuffer = await optimizeImage(
        originalBuffer,
        preset.width,
        preset.height,
        preset.quality
      )

      await fs.writeFile(outputPath, optimizedBuffer)
      info.localPaths[sizeName] = `/images/restaurants/${fileName}`
    }

    info.status = "optimized"

    // Replace URLs in files
    console.log(`  🔄 Replacing URLs in ${files.length} file(s)...`)
    for (const filePath of files) {
      let content = await fs.readFile(filePath, "utf-8")

      // Replace the URL with local path (use card size as default)
      const localPath = info.localPaths.card
      content = content.replaceAll(url, localPath)

      await fs.writeFile(filePath, content, "utf-8")
    }

    info.status = "replaced"
    console.log("  ✅ Complete!")
  } catch (error) {
    info.status = "failed"
    info.error = error instanceof Error ? error.message : String(error)
    console.log(`  ❌ Failed: ${info.error}`)
  }

  return info
}

/**
 * Main migration function
 */
async function migrate() {
  console.log("🔍 Scanning for remote images...")

  const remoteImages = await findRemoteImages()
  const totalImages = remoteImages.size

  console.log(`\n📊 Found ${totalImages} unique remote image(s)\n`)

  if (totalImages === 0) {
    console.log("✅ No remote images found - already migrated!")
    return
  }

  const report: MigrationReport = {
    timestamp: new Date().toISOString(),
    totalImages,
    successful: 0,
    failed: 0,
    filesModified: [],
    images: [],
  }

  // Track all modified files
  const modifiedFiles = new Set<string>()

  // Process each image
  for (const [url, files] of remoteImages.entries()) {
    const result = await processImage(url, files)
    report.images.push(result)

    files.forEach((f) => modifiedFiles.add(f))

    if (result.status === "replaced") {
      report.successful++
    } else {
      report.failed++
    }
  }

  report.filesModified = Array.from(modifiedFiles)

  // Save report
  const reportPath = path.join(PROJECT_ROOT, "migration-report.json")
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
  console.log(`\n📝 Report saved to: ${reportPath}`)

  // Summary
  console.log(`\n${"=".repeat(60)}`)
  console.log("📋 MIGRATION SUMMARY")
  console.log("=".repeat(60))
  console.log(`Total images:        ${report.totalImages}`)
  console.log(`Successful:          ${report.successful}`)
  console.log(`Failed:              ${report.failed}`)
  console.log(`Files modified:      ${report.filesModified.length}`)
  console.log("=".repeat(60))

  if (report.failed > 0) {
    console.log("\n⚠️  Failed images:")
    report.images
      .filter((i) => i.status === "failed")
      .forEach((i) => {
        console.log(`  ❌ ${i.url}`)
        console.log(`     ${i.error}`)
      })
  }

  if (report.successful > 0) {
    console.log("\n✅ Successful migrations:")
    report.images
      .filter((i) => i.status === "replaced")
      .forEach((i) => {
        console.log(`  ✅ ${i.id} → ${i.localPaths.card}`)
      })
  }

  console.log("\n🎉 Migration complete!")
  console.log("\nNext steps:")
  console.log("  1. Review the changes: git diff")
  console.log("  2. Test the app: bun run dev")
  console.log("  3. Check for remaining remote URLs:")
  console.log(`     grep -r "https://" app/ components/ --include="*.tsx"`)
}

// Run migration
migrate().catch(console.error)
