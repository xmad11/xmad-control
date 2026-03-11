#!/usr/bin/env bun

// Chrome Heap Snapshot Analyzer
// Format: https://github.com/v8/v8/blob/master/src/inspector/js_protocol.json

interface HeapSnapshot {
  snapshot: {
    meta: {
      node_fields: string[]
      node_types: string[][]
      edge_fields: string[]
      edge_types: string[][]
    }
    node_count: number
    edge_count: number
    root_index: number
  }
  nodes: {
    [key: string]: number[] | string[] | number
  }
  edges: {
    [key: string]: number[] | string[] | number
  }
  strings: string[]
  trace_function_infos?: any[]
  trace_tree?: any
  samples?: any[]
  locations?: any[]
}

// Node field indices based on the snapshot meta
const NODE_TYPE = 0
const NODE_NAME = 1
const _NODE_ID = 2
const NODE_SELF_SIZE = 3
const _NODE_EDGE_COUNT = 4
const _NODE_DETACHEDNESS = 5

// Edge field indices
const _EDGE_TYPE = 0
const _EDGE_NAME_OR_INDEX = 1
const _EDGE_TO_NODE = 2

// Node types
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
]

const _EDGE_TYPES = ["context", "element", "property", "internal", "hidden", "shortcut", "weak"]

const _DETACHEDNESS = ["Attached", "Detached", "Unknown"]

class HeapSnapshotAnalyzer {
  private snapshot: HeapSnapshot
  private nodeFields: string[]
  private edgeFields: string[]
  private nodes: number[][]
  private edges: number[][]
  private strings: string[]
  private nodeCount: number
  private edgeCount: number

  constructor(data: string) {
    this.snapshot = JSON.parse(data)
    this.nodeFields = this.snapshot.snapshot.meta.node_fields
    this.edgeFields = this.snapshot.snapshot.meta.edge_fields

    // Build node and edge arrays from the flat format
    this.nodes = this.buildNodeArray()
    this.edges = this.buildEdgeArray()
    this.strings = this.snapshot.strings
    this.nodeCount = this.snapshot.snapshot.node_count
    this.edgeCount = this.snapshot.snapshot.edge_count
  }

  private buildNodeArray(): number[][] {
    const nodes = this.snapshot.nodes as { [key: string]: number[] | number }
    const nodeFields = this.nodeFields.length
    const numNodes = Math.floor((nodes.type as number[]).length)
    const result: number[][] = []

    for (let i = 0; i < numNodes; i++) {
      const node: number[] = []
      for (let j = 0; j < nodeFields; j++) {
        const fieldName = this.nodeFields[j]
        const arr = nodes[fieldName] as number[]
        node.push(arr[i])
      }
      result.push(node)
    }
    return result
  }

  private buildEdgeArray(): number[][] {
    const edges = this.snapshot.edges as { [key: string]: number[] | number }
    const edgeFields = this.edgeFields.length
    const numEdges = Math.floor((edges.type as number[]).length)
    const result: number[][] = []

    for (let i = 0; i < numEdges; i++) {
      const edge: number[] = []
      for (let j = 0; j < edgeFields; j++) {
        const fieldName = this.edgeFields[j]
        const arr = edges[fieldName] as number[]
        edge.push(arr[i])
      }
      result.push(edge)
    }
    return result
  }

  public analyze() {
    const stats = {
      totalNodes: this.nodeCount,
      totalSelfSize: 0,
      typeStats: new Map<string, { count: number; selfSize: number }>(),
      constructorStats: new Map<string, { count: number; selfSize: number }>(),
    }

    for (let i = 0; i < this.nodeCount; i++) {
      const node = this.nodes[i]
      const type = node[NODE_TYPE]
      const name = this.strings[node[NODE_NAME]] || ""
      const selfSize = node[NODE_SELF_SIZE]

      stats.totalSelfSize += selfSize

      const typeName = NODE_TYPES[type] || `type_${type}`
      if (!stats.typeStats.has(typeName)) {
        stats.typeStats.set(typeName, { count: 0, selfSize: 0 })
      }
      const typeStat = stats.typeStats.get(typeName)!
      typeStat.count++
      typeStat.selfSize += selfSize

      // Track by constructor name (filter out internal nodes)
      if (name && !name.startsWith("(") && !name.startsWith("<")) {
        if (!stats.constructorStats.has(name)) {
          stats.constructorStats.set(name, { count: 0, selfSize: 0 })
        }
        const constStat = stats.constructorStats.get(name)!
        constStat.count++
        constStat.selfSize += selfSize
      }
    }

    return {
      totalNodes: stats.totalNodes,
      totalSelfSizeMB: stats.totalSelfSize / 1024 / 1024,
      typeStats: Array.from(stats.typeStats.entries())
        .map(([type, data]) => ({
          type,
          count: data.count,
          selfSizeMB: data.selfSize / 1024 / 1024,
        }))
        .sort((a, b) => b.selfSizeMB - a.selfSizeMB),
      constructorStats: Array.from(stats.constructorStats.entries())
        .map(([name, data]) => ({
          name,
          count: data.count,
          selfSizeMB: data.selfSize / 1024 / 1024,
        }))
        .sort((a, b) => b.selfSizeMB - a.selfSizeMB),
    }
  }
}

function formatNumber(n: number): string {
  return n.toLocaleString()
}

function formatSize(mb: number): string {
  return mb.toFixed(2)
}

function compareSnapshots(beforeFile: string, afterFile: string) {
  console.log("🔬 HEAP SNAPSHOT COMPARISON")
  console.log("=".repeat(100))
  console.log(`\n📁 BEFORE: ${beforeFile.split("/").pop()}`)
  console.log(`📁 AFTER:  ${afterFile.split("/").pop()}`)

  const beforeContent = Bun.file(beforeFile).text()
  const afterContent = Bun.file(afterFile).text()

  const before = new HeapSnapshotAnalyzer(beforeContent)
  const after = new HeapSnapshotAnalyzer(afterContent)

  const beforeStats = before.analyze()
  const afterStats = after.analyze()

  // Overall metrics
  console.log("\n\n📊 OVERALL METRICS")
  console.log("─".repeat(100))
  console.log(`{'Metric':<25} {'Before':>20} {'After':>20} {'Delta':>20}`)
  console.log("─".repeat(100))
  console.log(
    `{'Total Heap Size':<25} ${formatSize(beforeStats.totalSelfSizeMB).padStart(19)} MB ${formatSize(afterStats.totalSelfSizeMB).padStart(19)} MB ${(afterStats.totalSelfSizeMB - beforeStats.totalSelfSizeMB).toFixed(2).padStart(19)} MB`
  )
  console.log(
    `{'Total Node Count':<25} ${formatNumber(beforeStats.totalNodes).padStart(19)} ${formatNumber(afterStats.totalNodes).padStart(19)} ${(afterStats.totalNodes - beforeStats.totalNodes).toLocaleString().padStart(19)}`
  )

  // Compare by type
  console.log("\n\n🏷️  MEMORY BY OBJECT TYPE")
  console.log("─".repeat(100))
  console.log(`{'Type':<30} {'Before':>15} {'After':>15} {'Delta MB':>15} {'Delta Count':>15}`)
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
    .filter((d) => d.afterSize > 0.01) // Only show types with meaningful memory
    .sort((a, b) => Math.abs(b.deltaSize) - Math.abs(a.deltaSize))

  for (const stat of typeDeltas.slice(0, 20)) {
    const deltaStr =
      stat.deltaSize >= 0 ? `+${formatSize(stat.deltaSize)}` : formatSize(stat.deltaSize)
    const countStr =
      stat.deltaCount >= 0 ? `+${formatNumber(stat.deltaCount)}` : formatNumber(stat.deltaCount)
    console.log(
      `${stat.type.substring(0, 30).padEnd(30)} ${formatSize(stat.beforeSize).padStart(15)} MB ${formatSize(stat.afterSize).padStart(15)} MB ${deltaStr.padStart(15)} MB ${countStr.padStart(15)}`
    )
  }

  // Compare by constructor
  console.log("\n\n🏗️  MEMORY BY CONSTRUCTOR (Top 30 by Growth)")
  console.log("─".repeat(100))
  console.log(`{'Constructor':<50} {'Before':>12} {'After':>12} {'Delta':>12} {'Count':>10}`)
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
    .filter((d) => d.afterCount > 0) // Only show constructors that exist
    .sort((a, b) => Math.abs(b.deltaSize) - Math.abs(a.deltaSize))

  for (const stat of constructorDeltas.slice(0, 30)) {
    const deltaStr =
      stat.deltaSize >= 0 ? `+${formatSize(stat.deltaSize)}` : formatSize(stat.deltaSize)
    console.log(
      `${stat.name.substring(0, 50).padEnd(50)} ${formatSize(stat.beforeSize).padStart(12)} MB ${formatSize(stat.afterSize).padStart(12)} MB ${deltaStr.padStart(12)} MB ${stat.afterCount.toLocaleString().padStart(10)}`
    )
  }

  // Key findings - problematic growth
  console.log("\n\n🎯 KEY FINDINGS")
  console.log("=".repeat(100))

  const significantGrowths = constructorDeltas.filter((d) => d.deltaSize > 0.1)
  if (significantGrowths.length > 0) {
    console.log("\n⚠️  SIGNIFICANT MEMORY GROWTH (>0.1 MB):")
    for (const stat of significantGrowths.slice(0, 15)) {
      console.log(
        `  • ${stat.name}: +${formatSize(stat.deltaSize)} MB (${stat.afterCount.toLocaleString()} instances)`
      )
    }
  } else {
    console.log("\n✅ No significant memory growth detected between snapshots")
  }

  const highInstanceGrowth = constructorDeltas.filter((d) => d.deltaCount > 50)
  if (highInstanceGrowth.length > 0) {
    console.log("\n📊 HIGH INSTANCE COUNT GROWTH (>50 instances):")
    for (const stat of highInstanceGrowth.slice(0, 15)) {
      console.log(
        `  • ${stat.name}: +${formatNumber(stat.deltaCount)} instances (+${formatSize(stat.deltaSize)} MB)`
      )
    }
  }

  // Next.js/React specific patterns
  console.log("\n\n🔧 NEXT.JS / REACT / TURBOPACK OBJECTS:")
  console.log("─".repeat(100))

  const reactPatterns = [
    "react",
    "component",
    "fiber",
    "element",
    "hook",
    "memo",
    "context",
    "turbopack",
    "module",
    "closure",
    "hmr",
    "hot",
    "webpack",
    "next",
    "router",
    "server",
    "client",
    "chunk",
  ]

  const frameworkObjects = constructorDeltas.filter((d) =>
    reactPatterns.some((p) => d.name.toLowerCase().includes(p))
  )

  if (frameworkObjects.length > 0) {
    for (const stat of frameworkObjects.slice(0, 20)) {
      const deltaStr =
        stat.deltaSize >= 0 ? `+${formatSize(stat.deltaSize)}` : formatSize(stat.deltaSize)
      const countStr =
        stat.deltaCount >= 0 ? `+${formatNumber(stat.deltaCount)}` : formatNumber(stat.deltaCount)
      console.log(
        `  ${stat.name}: ${deltaStr} MB (${countStr} instances, ${stat.afterCount.toLocaleString()} total)`
      )
    }
  }

  console.log(`\n${"=".repeat(100)}`)
  console.log("✅ Analysis complete!")
}

const beforeFile = "/Users/ahmadabdullah/Desktop/Heap-20260103T162216.heapsnapshot"
const afterFile = "/Users/ahmadabdullah/Desktop/Heap-20260103T162240.heapsnapshot"

compareSnapshots(beforeFile, afterFile)
