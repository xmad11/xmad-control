#!/usr/bin/env bun
/**
 * BlurHash Generation Script
 * Run: bun run scripts/generate-blurhash.ts
 */

import { writeFile } from "node:fs/promises"
import { mockRestaurants } from "@/__mock__/restaurants"
import { generateBlurHash } from "@/lib/images/generate-blurhash"

async function main() {
  console.log("🎨 Generating BlurHash strings for mock data...\n")

  const blurHashMap: Record<string, string> = {}

  // Collect all unique image URLs from both 'image' and 'images' fields
  const allImages: string[] = []
  for (const restaurant of mockRestaurants) {
    if (restaurant.image) {
      allImages.push(restaurant.image)
    }
    if (restaurant.images && Array.isArray(restaurant.images)) {
      allImages.push(...restaurant.images)
    }
  }
  const imageUrls = Array.from(new Set(allImages))

  console.log(`Found ${imageUrls.length} unique images`)

  // Generate BlurHash for each image
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]
    console.log(`[${i + 1}/${imageUrls.length}] Processing: ${url}`)

    try {
      const hash = await generateBlurHash(url, 4, 4)
      if (hash) {
        blurHashMap[url] = hash
        console.log(`  ✓ BlurHash: ${hash}`)
      } else {
        console.log("  ✗ Failed to generate BlurHash")
        blurHashMap[url] = "L6HZ8k8g%g%g%g%g%g%g%g%g" // Fallback
      }
    } catch (error) {
      console.error("  ✗ Error:", error)
      blurHashMap[url] = "L6HZ8k8g%g%g%g%g%g%g%g%g" // Fallback
    }
  }

  // Write to file
  const outputPath = "./lib/images/precomputed-blurhash.ts"
  const content = `/* ═══════════════════════════════════════════════════════════════════════════════
   PRECOMPUTED BLURHASH - Generated for mock data images
   Run: bun run scripts/generate-blurhash.ts to regenerate
   ═══════════════════════════════════════════════════════════════════════════════ */

export const precomputedBlurHash: Record<string, string> = ${JSON.stringify(blurHashMap, null, 2)}

export function getBlurHash(imageUrl: string): string | undefined {
  return precomputedBlurHash[imageUrl]
}
`

  await writeFile(outputPath, content, "utf-8")
  console.log(`\n✅ Generated ${Object.keys(blurHashMap).length} BlurHash strings`)
  console.log(`📁 Saved to: ${outputPath}`)
}

main().catch(console.error)
