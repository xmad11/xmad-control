#!/usr/bin/env bun

interface HeapSnapshot {
  snapshot: {
    meta: any
    node_count: number
    edge_count: number
  }
  nodes: any[]
  edges: any[]
  strings: string[]
}

// Field indices for node structure
const NODE_TYPE_OFFSET = 0
const NODE_NAME_OFFSET = 1
const NODE_ID_OFFSET = 2
const NODE_SELF_SIZE_OFFSET = 3
const NODE_EDGE_COUNT_OFFSET = 4
const NODE_TRACE_NODE_ID_OFFSET = 5

// Field indices for edge structure
const _EDGE_TYPE_OFFSET = 0
const _EDGE_NAME_OR_INDEX_OFFSET = 1
const _EDGE_TO_NODE_OFFSET = 2

// Node types
const NODE_TYPE = [
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

// Edge types
const _EDGE_TYPE = ["context", "element", "property", "internal", "hidden", "shortcut", "weak"]

function parseNode(nodes: any[], nodeIndex: number, strings: string[]) {
  const nodeFields = 6 // number of fields per node
  const nodeOffset = nodeIndex * nodeFields

  const type = nodes[NODE_TYPE_OFFSET][nodeOffset]
  const nameIndex = nodes[NODE_NAME_OFFSET][nodeOffset]
  const id = nodes[NODE_ID_OFFSET][nodeOffset]
  const selfSize = nodes[NODE_SELF_SIZE_OFFSET][nodeOffset]
  const edgeCount = nodes[NODE_EDGE_COUNT_OFFSET][nodeOffset]
  const traceNodeId = nodes[NODE_TRACE_NODE_ID_OFFSET]?.[nodeOffset]

  return {
    type: NODE_TYPE[type] || `type_${type}`,
    name: strings[nameIndex] || "",
    id,
    selfSize,
    edgeCount,
    traceNodeId,
    index: nodeIndex,
  }
}

function analyzeSnapshot(filePath: string) {
  console.log(`\n📊 Analyzing: ${filePath}`)

  const content = Bun.file(filePath).text()
  const snapshot: HeapSnapshot = JSON.parse(content)

  const { nodes, edges, strings } = snapshot
  const nodeArray = nodes
  const _edgeArray = edges

  // Parse all nodes and group by type
  const typeStats = new Map<string, { count: number; selfSize: number; retainedSize: number }>()
  const constructorStats = new Map<string, { count: number; selfSize: number }>()

  let totalNodes = 0
  let totalSelfSize = 0

  // Calculate number of nodes
  const _nodeFields = 6
  const numNodes = nodeArray[NODE_TYPE_OFFSET].length

  for (let i = 0; i < numNodes; i++) {
    const node = parseNode(nodeArray, i, strings)

    totalNodes++
    totalSelfSize += node.selfSize

    // Stats by node type
    if (!typeStats.has(node.type)) {
      typeStats.set(node.type, { count: 0, selfSize: 0, retainedSize: 0 })
    }
    const typeStat = typeStats.get(node.type)!
    typeStat.count++
    typeStat.selfSize += node.selfSize

    // Stats by constructor/name (filter out internal nodes)
    if (node.name && !node.name.startsWith("(")) {
      if (!constructorStats.has(node.name)) {
        constructorStats.set(node.name, { count: 0, selfSize: 0 })
      }
      const constStat = constructorStats.get(node.name)!
      constStat.count++
      constStat.selfSize += node.selfSize
    }
  }

  return {
    filePath,
    totalNodes,
    totalSelfSize: totalSelfSize / 1024 / 1024, // Convert to MB
    typeStats: Array.from(typeStats.entries())
      .map(([type, stats]) => ({
        type,
        count: stats.count,
        selfSizeMB: stats.selfSize / 1024 / 1024,
      }))
      .sort((a, b) => b.selfSizeMB - a.selfSizeMB),
    constructorStats: Array.from(constructorStats.entries())
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        selfSizeMB: stats.selfSize / 1024 / 1024,
      }))
      .sort((a, b) => b.selfSizeMB - a.selfSizeMB),
  }
}

function compareSnapshots(snapshot1: any, snapshot2: any) {
  console.log("\n🔍 COMPARISON ANALYSIS")
  console.log("=".repeat(80))

  // Overall metrics
  console.log("\n📈 Overall Metrics:")
  console.log(
    `  Before: ${(snapshot1.totalSelfSize).toFixed(2)} MB (${snapshot1.totalNodes.toLocaleString()} nodes)`
  )
  console.log(
    `  After:  ${(snapshot2.totalSelfSize).toFixed(2)} MB (${snapshot2.totalNodes.toLocaleString()} nodes)`
  )
  console.log(
    `  Delta:  ${(snapshot2.totalSelfSize - snapshot1.totalSelfSize).toFixed(2)} MB (${(snapshot2.totalNodes - snapshot1.totalNodes).toLocaleString()} nodes)`
  )

  // Compare by type
  console.log("\n🏷️  Top Object Types by Growth:")
  console.log("─".repeat(80))
  console.log(`{'Type':<40} {'Before':>12} {'After':>12} {'Delta':>12} {'Delta Nodes':>15}`)
  console.log("─".repeat(80))

  const type1Map = new Map(snapshot1.typeStats.map((t) => [t.type, t]))
  const type2Map = new Map(snapshot2.typeStats.map((t) => [t.type, t]))

  const allTypes = new Set([
    ...snapshot1.typeStats.map((t) => t.type),
    ...snapshot2.typeStats.map((t) => t.type),
  ])

  const typeDeltas = Array.from(allTypes)
    .map((type) => {
      const stats1 = type1Map.get(type) || { count: 0, selfSizeMB: 0 }
      const stats2 = type2Map.get(type) || { count: 0, selfSizeMB: 0 }
      return {
        type,
        beforeSize: stats1.selfSizeMB,
        afterSize: stats2.selfSizeMB,
        deltaSize: stats2.selfSizeMB - stats1.selfSizeMB,
        beforeCount: stats1.count,
        afterCount: stats2.count,
        deltaCount: stats2.count - stats1.count,
      }
    })
    .sort((a, b) => b.deltaSize - a.deltaSize)

  for (const stat of typeDeltas.slice(0, 15)) {
    const deltaStr =
      stat.deltaSize >= 0 ? `+${stat.deltaSize.toFixed(2)}` : stat.deltaSize.toFixed(2)
    const countStr =
      stat.deltaCount >= 0
        ? `+${stat.deltaCount.toLocaleString()}`
        : stat.deltaCount.toLocaleString()
    console.log(
      `${stat.type.padEnd(40)} ${stat.beforeSize.toFixed(2).padStart(12)} MB ${stat.afterSize.toFixed(2).padStart(12)} MB ${deltaStr.padStart(12)} MB ${countStr.padStart(15)}`
    )
  }

  // Compare by constructor
  console.log("\n🏗️  Top Constructors by Growth:")
  console.log("─".repeat(80))
  console.log(`{'Constructor':<50} {'Before':>12} {'After':>12} {'Delta':>12} {'Delta Nodes':>15}`)
  console.log("─".repeat(80))

  const const1Map = new Map(snapshot1.constructorStats.map((c) => [c.name, c]))
  const const2Map = new Map(snapshot2.constructorStats.map((c) => [c.name, c]))

  const allConstructors = new Set([
    ...snapshot1.constructorStats.map((c) => c.name),
    ...snapshot2.constructorStats.map((c) => c.name),
  ])

  const constDeltas = Array.from(allConstructors)
    .map((name) => {
      const stats1 = const1Map.get(name) || { count: 0, selfSizeMB: 0 }
      const stats2 = const2Map.get(name) || { count: 0, selfSizeMB: 0 }
      return {
        name,
        beforeSize: stats1.selfSizeMB,
        afterSize: stats2.selfSizeMB,
        deltaSize: stats2.selfSizeMB - stats1.selfSizeMB,
        beforeCount: stats1.count,
        afterCount: stats2.count,
        deltaCount: stats2.count - stats1.count,
      }
    })
    .sort((a, b) => b.deltaSize - a.deltaSize)

  for (const stat of constDeltas.slice(0, 25)) {
    if (Math.abs(stat.deltaSize) < 0.01 && stat.deltaCount === 0) continue
    const deltaStr =
      stat.deltaSize >= 0 ? `+${stat.deltaSize.toFixed(2)}` : stat.deltaSize.toFixed(2)
    const countStr =
      stat.deltaCount >= 0
        ? `+${stat.deltaCount.toLocaleString()}`
        : stat.deltaCount.toLocaleString()
    console.log(
      `${stat.name.substring(0, 50).padEnd(50)} ${stat.beforeSize.toFixed(2).padStart(12)} MB ${stat.afterSize.toFixed(2).padStart(12)} MB ${deltaStr.padStart(12)} MB ${countStr.padStart(15)}`
    )
  }

  // Key findings
  console.log("\n🎯 KEY FINDINGS:")
  console.log("=".repeat(80))

  const significantGrowths = constDeltas.filter((d) => d.deltaSize > 0.5).slice(0, 10)
  if (significantGrowths.length > 0) {
    console.log("\n⚠️  Significant Memory Growth (>0.5 MB):")
    for (const stat of significantGrowths) {
      console.log(
        `  • ${stat.name}: +${stat.deltaSize.toFixed(2)} MB (${stat.afterCount.toLocaleString()} instances, +${stat.deltaCount.toLocaleString()})`
      )
    }
  }

  const highCountGrowths = constDeltas.filter((d) => d.deltaCount > 100).slice(0, 10)
  if (highCountGrowths.length > 0) {
    console.log("\n📊 High Instance Count Growth (>100 instances):")
    for (const stat of highCountGrowths) {
      console.log(
        `  • ${stat.name}: +${stat.deltaCount.toLocaleString()} instances (+${stat.deltaSize.toFixed(2)} MB)`
      )
    }
  }

  // Look for specific Next.js/React related patterns
  console.log("\n🔧 Next.js/React Related Objects:")
  const reactPatterns = constDeltas
    .filter(
      (d) =>
        d.name.includes("React") ||
        d.name.includes("Component") ||
        d.name.includes("Element") ||
        d.name.includes("Fiber") ||
        d.name.includes("Hook") ||
        d.name.includes("Module") ||
        d.name.includes("turbopack") ||
        d.name.includes("hmr") ||
        d.name.includes("closure")
    )
    .slice(0, 15)

  if (reactPatterns.length > 0) {
    for (const stat of reactPatterns) {
      if (Math.abs(stat.deltaSize) < 0.01 && stat.deltaCount === 0) continue
      const deltaStr =
        stat.deltaSize >= 0 ? `+${stat.deltaSize.toFixed(2)}` : stat.deltaSize.toFixed(2)
      const countStr =
        stat.deltaCount >= 0
          ? `+${stat.deltaCount.toLocaleString()}`
          : stat.deltaCount.toLocaleString()
      console.log(`  ${stat.name}: ${deltaStr} MB (${countStr} instances)`)
    }
  }
}

async function main() {
  const snapshot1Path = "/Users/ahmadabdullah/Desktop/Heap-20260103T155934.heapsnapshot"
  const snapshot2Path = "/Users/ahmadabdullah/Desktop/Heap-20260103T155955.heapsnapshot"

  console.log("🔬 HEAP SNAPSHOT ANALYSIS")
  console.log("=".repeat(80))

  const snapshot1 = analyzeSnapshot(snapshot1Path)
  const snapshot2 = analyzeSnapshot(snapshot2Path)

  compareSnapshots(snapshot1, snapshot2)

  console.log(`\n${"=".repeat(80)}`)
  console.log("✅ Analysis complete!")
}

main().catch(console.error)
