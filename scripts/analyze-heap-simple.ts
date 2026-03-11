#!/usr/bin/env bun

// Simple Chrome Heap Snapshot Analyzer
// The nodes and edges are stored as flat arrays

const NODE_FIELD_COUNT = 6 // type, name, id, self_size, edge_count, detachedness
const _EDGE_FIELD_COUNT = 3 // type, name_or_index, to_node

const NODE_TYPES = [
  "hidden",
  "array",
  "string",
  "object",
  "code",
  "closure",
  "regexp",
  "number",
  "native",
  "synthetic",
  "concatenated string",
  "sliced string",
  "symbol",
  "bigint",
  "object shape",
]

interface HeapData {
  snapshot: any
  nodes: number[]
  edges: number[]
  strings: string[]
}

function parseSnapshot(filePath: string): HeapData {
  console.log(`Loading ${filePath}...`)
  const text = Bun.file(filePath).text()
  const json = JSON.parse(text)

  return {
    snapshot: json.snapshot,
    nodes: json.nodes as number[],
    edges: json.edges as number[],
    strings: json.strings as string[],
  }
}

function getNode(nodes: number[], strings: string[], index: number) {
  const offset = index * NODE_FIELD_COUNT
  return {
    type: nodes[offset + 0],
    nameIndex: nodes[offset + 1],
    id: nodes[offset + 2],
    selfSize: nodes[offset + 3],
    edgeCount: nodes[offset + 4],
    detachedness: nodes[offset + 5],
    getTypeName: () => NODE_TYPES[nodes[offset + 0]] || `type_${nodes[offset + 0]}`,
    getName: () => strings[nodes[offset + 1]] || "",
  }
}

function analyzeSnapshot(data: HeapData) {
  const { nodes, strings, snapshot } = data
  const nodeCount = snapshot.node_count

  const typeStats = new Map<string, { count: number; selfSize: number }>()
  const constructorStats = new Map<string, { count: number; selfSize: number }>()

  let totalSelfSize = 0

  for (let i = 0; i < nodeCount; i++) {
    const node = getNode(nodes, strings, i)
    const typeName = node.getTypeName()
    const name = node.getName()

    totalSelfSize += node.selfSize

    // Track by type
    if (!typeStats.has(typeName)) {
      typeStats.set(typeName, { count: 0, selfSize: 0 })
    }
    const typeStat = typeStats.get(typeName)!
    typeStat.count++
    typeStat.selfSize += node.selfSize

    // Track by constructor name (filter out internal)
    if (name && !name.startsWith("(") && !name.startsWith("<") && name.length > 0) {
      const key = name
      if (!constructorStats.has(key)) {
        constructorStats.set(key, { count: 0, selfSize: 0 })
      }
      const constStat = constructorStats.get(key)!
      constStat.count++
      constStat.selfSize += node.selfSize
    }
  }

  return {
    totalNodes: nodeCount,
    totalSelfSizeMB: totalSelfSize / 1024 / 1024,
    typeStats: Array.from(typeStats.entries())
      .map(([type, data]) => ({ type, count: data.count, selfSizeMB: data.selfSize / 1024 / 1024 }))
      .sort((a, b) => b.selfSizeMB - a.selfSizeMB),
    constructorStats: Array.from(constructorStats.entries())
      .map(([name, data]) => ({ name, count: data.count, selfSizeMB: data.selfSize / 1024 / 1024 }))
      .sort((a, b) => b.selfSizeMB - a.selfSizeMB),
  }
}

function formatNum(n: number): string {
  return n.toLocaleString()
}

function formatSize(mb: number): string {
  return mb.toFixed(2)
}

function main() {
  const beforeFile = "/Users/ahmadabdullah/Desktop/Heap-20260103T162216.heapsnapshot"
  const afterFile = "/Users/ahmadabdullah/Desktop/Heap-20260103T162240.heapsnapshot"

  console.log("🔬 HEAP SNAPSHOT COMPARISON")
  console.log("=".repeat(100))
  console.log(`\n📁 BEFORE: ${beforeFile.split("/").pop()}`)
  console.log(`📁 AFTER:  ${afterFile.split("/").pop()}\n`)

  const beforeData = parseSnapshot(beforeFile)
  const afterData = parseSnapshot(afterFile)

  const beforeStats = analyzeSnapshot(beforeData)
  const afterStats = analyzeSnapshot(afterData)

  // Overall metrics
  console.log("\n📊 OVERALL METRICS")
  console.log("─".repeat(100))
  console.log(`{"Metric":<25} {"Before":>20} {"After":>20} {"Delta":>20}`)
  console.log("─".repeat(100))
  const sizeDelta = afterStats.totalSelfSizeMB - beforeStats.totalSelfSizeMB
  const countDelta = afterStats.totalNodes - beforeStats.totalNodes
  console.log(
    `"Total Heap Size"              ${formatSize(beforeStats.totalSelfSizeMB).padStart(19)} MB ${formatSize(afterStats.totalSelfSizeMB).padStart(19)} MB ${sizeDelta.toFixed(2).padStart(19)} MB`
  )
  console.log(
    `"Total Node Count"             ${formatNum(beforeStats.totalNodes).padStart(19)} ${formatNum(afterStats.totalNodes).padStart(19)} ${countDelta.toLocaleString().padStart(19)}`
  )

  // Compare by type
  console.log("\n\n🏷️  MEMORY BY OBJECT TYPE (Top 20 by Delta)")
  console.log("─".repeat(100))

  const beforeTypes = new Map(beforeStats.typeStats.map((t) => [t.type, t]))
  const afterTypes = new Map(afterStats.typeStats.map((t) => [t.type, t]))

  const allTypes = new Set([...beforeTypes.keys(), ...afterTypes.keys()])
  const typeDeltas = Array.from(allTypes)
    .map((type) => {
      const before = beforeTypes.get(type) || { count: 0, selfSizeMB: 0 }
      const after = afterTypes.get(type) || { count: 0, selfSizeMB: 0 }
      return {
        type,
        beforeSize: before.selfSizeMB,
        afterSize: after.selfSizeMB,
        deltaSize: after.selfSizeMB - before.selfSizeMB,
        beforeCount: before.count,
        afterCount: after.count,
        deltaCount: after.count - before.count,
      }
    })
    .sort((a, b) => Math.abs(b.deltaSize) - Math.abs(a.deltaSize))

  console.log(`{"Type":<30} {"Before":>12} {"After":>12} {"Delta MB":>12} {"Delta Count":>12}`)
  console.log("─".repeat(100))

  for (const stat of typeDeltas.slice(0, 20)) {
    if (Math.abs(stat.deltaSize) < 0.01) continue
    const deltaStr =
      stat.deltaSize >= 0 ? `+${formatSize(stat.deltaSize)}` : formatSize(stat.deltaSize)
    const countStr =
      stat.deltaCount >= 0 ? `+${formatNum(stat.deltaCount)}` : formatNum(stat.deltaCount)
    console.log(
      `${stat.type.substring(0, 30).padEnd(30)} ${formatSize(stat.beforeSize).padStart(12)} MB ${formatSize(stat.afterSize).padStart(12)} MB ${deltaStr.padStart(12)} MB ${countStr.padStart(12)}`
    )
  }

  // Compare by constructor - TOP GROWTH
  console.log("\n\n🏗️  TOP CONSTRUCTORS BY MEMORY GROWTH")
  console.log("─".repeat(100))

  const beforeConstructors = new Map(beforeStats.constructorStats.map((c) => [c.name, c]))
  const afterConstructors = new Map(afterStats.constructorStats.map((c) => [c.name, c]))

  const allConstructors = new Set([...beforeConstructors.keys(), ...afterConstructors.keys()])
  const constructorDeltas = Array.from(allConstructors)
    .map((name) => {
      const before = beforeConstructors.get(name) || { count: 0, selfSizeMB: 0 }
      const after = afterConstructors.get(name) || { count: 0, selfSizeMB: 0 }
      return {
        name,
        beforeSize: before.selfSizeMB,
        afterSize: after.selfSizeMB,
        deltaSize: after.selfSizeMB - before.selfSizeMB,
        beforeCount: before.count,
        afterCount: after.count,
        deltaCount: after.count - before.count,
      }
    })
    .filter((d) => d.afterCount > 0 && Math.abs(d.deltaSize) > 0.01)
    .sort((a, b) => b.deltaSize - a.deltaSize)

  console.log(`{"Constructor":<55} {"Before":>10} {"After":>10} {"Delta":>10} {"Total":>8}`)
  console.log("─".repeat(100))

  for (const stat of constructorDeltas.slice(0, 30)) {
    const deltaStr =
      stat.deltaSize >= 0 ? `+${formatSize(stat.deltaSize)}` : formatSize(stat.deltaSize)
    console.log(
      `${stat.name.substring(0, 55).padEnd(55)} ${formatSize(stat.beforeSize).padStart(10)} MB ${formatSize(stat.afterSize).padStart(10)} MB ${deltaStr.padStart(10)} MB ${stat.afterCount.toString().padStart(8)}`
    )
  }

  // Top by instance count growth
  console.log("\n\n📊 TOP CONSTRUCTORS BY INSTANCE GROWTH")
  console.log("─".repeat(100))

  const byInstanceGrowth = [...constructorDeltas]
    .sort((a, b) => b.deltaCount - a.deltaCount)
    .filter((d) => d.deltaCount > 0)

  console.log(`{"Constructor":<55} {"Before":>10} {"After":>10} {"Delta":>10}`)
  console.log("─".repeat(100))

  for (const stat of byInstanceGrowth.slice(0, 25)) {
    const countStr =
      stat.deltaCount >= 0 ? `+${formatNum(stat.deltaCount)}` : formatNum(stat.deltaCount)
    console.log(
      `${stat.name.substring(0, 55).padEnd(55)} ${formatNum(stat.beforeCount).padStart(10)} ${formatNum(stat.afterCount).padStart(10)} ${countStr.padStart(10)}`
    )
  }

  // Framework-specific
  console.log("\n\n🔧 NEXT.JS / REACT / TURBOPACK OBJECTS")
  console.log("─".repeat(100))

  const patterns = [
    "turbopack",
    "react",
    "next",
    "router",
    "module",
    "closure",
    "fiber",
    "component",
    "hmr",
  ]
  const frameworkObjs = constructorDeltas.filter((d) =>
    patterns.some((p) => d.name.toLowerCase().includes(p))
  )

  if (frameworkObjs.length > 0) {
    console.log(`{"Constructor":<55} {"Delta MB":>12} {"Delta Count":>12}`)
    console.log("─".repeat(100))
    for (const stat of frameworkObjs.slice(0, 20)) {
      const deltaStr =
        stat.deltaSize >= 0 ? `+${formatSize(stat.deltaSize)}` : formatSize(stat.deltaSize)
      const countStr =
        stat.deltaCount >= 0 ? `+${formatNum(stat.deltaCount)}` : formatNum(stat.deltaCount)
      console.log(
        `${stat.name.substring(0, 55).padEnd(55)} ${deltaStr.padStart(12)} MB ${countStr.padStart(12)}`
      )
    }
  } else {
    console.log("  (No significant framework object growth detected)")
  }

  // Key findings
  console.log("\n\n🎯 KEY FINDINGS")
  console.log("=".repeat(100))

  const bigGrowth = constructorDeltas.filter((d) => d.deltaSize > 0.1)
  if (bigGrowth.length > 0) {
    console.log("\n⚠️  Significant memory growth (>0.1 MB):")
    for (const stat of bigGrowth.slice(0, 10)) {
      console.log(
        `  • ${stat.name}: +${formatSize(stat.deltaSize)} MB (${stat.afterCount} instances)`
      )
    }
  } else {
    console.log("\n✅ No significant memory growth detected!")
  }

  console.log(`\n${"=".repeat(100)}`)
}

main()
