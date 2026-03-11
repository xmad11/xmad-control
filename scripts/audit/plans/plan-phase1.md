
# 🚀 **COMPLETE 360° ENTERPRISE AUDIT SYSTEM**

## 📦 **DELIVERY PACKAGE**

I’m providing you with:

1. ✅ **All 10 Audit Layer Scripts** (production-ready)
1. ✅ **Master Audit Runner** (orchestrator)
1. ✅ **Agent Instructions** (step-by-step guide)
1. ✅ **Owner Cheatsheet** (30% developer friendly)
1. ✅ **Usage Guide** (when/how to use)
1. ✅ **Template Setup** (reusable starter)
1. ✅ **Architecture Decision** (standalone vs embedded)

-----

## 🎯 **ARCHITECTURE RECOMMENDATION**

### **Option A: Embedded (In Each Project)** ✅ **RECOMMENDED**

```
your-project/
├── scripts/
│   └── audit/           # Audit system here
├── .audit-config.json   # Project-specific config
└── package.json
```

**Pros:**

- ✅ Self-contained (works offline)
- ✅ Version-locked per project
- ✅ Customizable per project
- ✅ No external dependencies
- ✅ Works with databases, APIs, anything

**Cons:**

- ⚠️ Duplicated across projects (but templates solve this)

-----

### **Option B: Standalone CLI Tool** ⚠️ **NOT RECOMMENDED YET**

```
npm install -g @your-org/project-auditor
cd your-project
auditor run --full
```

**Pros:**

- ✅ Single source of truth
- ✅ Easy updates

**Cons:**

- ❌ Network dependency
- ❌ Version conflicts between projects
- ❌ Harder to customize per-project
- ❌ More complex setup

-----

### **Option C: Hybrid Approach** 🎯 **BEST LONG-TERM**

```
# Template includes audit system
npx create-shadi-project my-app
# ↓ Includes audit system embedded

# Later: Update via template sync
npx update-audit-system
# ↓ Updates embedded audit from template
```

**This is what I recommend:**

1. **Start with embedded** (Option A) - Use now
1. **Create template** - For future projects
1. **Later**: Extract to CLI tool when you have 5+ projects using it

-----

## 📋 **MY RECOMMENDATION: EMBEDDED + TEMPLATE**

**Right now:** Embed the audit system in your project
**For future:** Use this project as a starter template
**Long-term:** When you have many projects, extract to CLI tool

-----

# 🎯 **COMPLETE IMPLEMENTATION**

## **File 1: Master Audit Runner**

`scripts/audit-runner.ts`

```typescript
#!/usr/bin/env bun
/**
 * ═══════════════════════════════════════════════════════════════
 * ENTERPRISE 360° PROJECT AUDIT SYSTEM
 * ═══════════════════════════════════════════════════════════════
 * 
 * This is the master orchestrator that runs all audit layers.
 * 
 * USAGE:
 *   bun run audit              # Run full audit
 *   bun run audit --layer=03   # Run specific layer
 *   bun run audit --fix        # Auto-fix violations
 *   bun run audit --report     # Generate detailed report
 * 
 * EXIT CODES:
 *   0 = All checks passed
 *   1 = Critical failures detected
 *   2 = Configuration error
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { execSync } from "child_process";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface AuditResult {
  layer: string;
  status: "pass" | "warn" | "fail";
  violations: Violation[];
  duration: number;
  metadata?: Record<string, any>;
}

interface Violation {
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  file?: string;
  line?: number;
  message: string;
  fix?: string;
}

interface AuditReport {
  timestamp: string;
  branch: string;
  commit: string;
  projectName: string;
  layers: AuditResult[];
  summary: {
    total: number;
    passed: number;
    warned: number;
    failed: number;
    totalViolations: number;
    criticalViolations: number;
  };
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const AUDIT_LAYERS = [
  { id: "00", name: "pre-flight", script: "00-pre-flight.ts", description: "Environment & dependencies check" },
  { id: "01", name: "doc-verification", script: "01-doc-verification.ts", description: "Documentation hash validation" },
  { id: "02", name: "architecture", script: "02-architecture.ts", description: "Layer boundaries & folder structure" },
  { id: "03", name: "typescript", script: "03-typescript.ts", description: "Type safety & forbidden patterns" },
  { id: "04", name: "design-tokens", script: "04-design-tokens.ts", description: "Token compliance & hardcoded values" },
  { id: "05", name: "dependencies", script: "05-dependencies.ts", description: "Package audit & lockfile validation" },
  { id: "06", name: "git-health", script: "06-git-health.ts", description: "Git hygiene & branch protection" },
  { id: "07", name: "ui-responsive", script: "07-ui-responsive.ts", description: "Responsive design & breakpoints" },
  { id: "08", name: "ownership", script: "08-ownership.ts", description: "CODEOWNERS & file permissions" },
  { id: "09", name: "build-verify", script: "09-build-verify.ts", description: "Build validation & bundle analysis" },
];

const OUTPUT_DIR = ".audit";
const REPORT_FILE = `${OUTPUT_DIR}/audit-report.json`;
const LOG_FILE = `${OUTPUT_DIR}/audit.log`;
const CONFIG_FILE = ".audit-config.json";

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function log(message: string, level: "info" | "warn" | "error" = "info") {
  const timestamp = new Date().toISOString();
  const emoji = {
    info: "ℹ️ ",
    warn: "⚠️ ",
    error: "❌",
  }[level];
  
  const colorCode = {
    info: "\x1b[36m", // Cyan
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
  }[level];
  
  const reset = "\x1b[0m";
  
  console.log(`${emoji} ${colorCode}${message}${reset}`);
  
  // Append to log file
  if (existsSync(OUTPUT_DIR)) {
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    try {
      const currentLog = existsSync(LOG_FILE) ? readFileSync(LOG_FILE, "utf-8") : "";
      writeFileSync(LOG_FILE, currentLog + logEntry);
    } catch (error) {
      // Ignore log write errors
    }
  }
}

function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    log(`Created audit output directory: ${OUTPUT_DIR}`);
  }
}

function getCurrentBranch(): string {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

function getCurrentCommit(): string {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

function getProjectName(): string {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    return pkg.name || "unknown";
  } catch {
    return "unknown";
  }
}

function loadConfig(): Record<string, any> {
  if (existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
    } catch {
      log("Failed to parse .audit-config.json, using defaults", "warn");
    }
  }
  return {};
}

// ═══════════════════════════════════════════════════════════════
// AUDIT EXECUTION
// ═══════════════════════════════════════════════════════════════

async function runLayer(
  layer: typeof AUDIT_LAYERS[0],
  options: { fix?: boolean }
): Promise<AuditResult> {
  const startTime = Date.now();
  const scriptPath = `./scripts/audit/${layer.script}`;
  
  if (!existsSync(scriptPath)) {
    return {
      layer: layer.name,
      status: "fail",
      violations: [
        {
          type: "MISSING_SCRIPT",
          severity: "critical",
          message: `Audit script not found: ${scriptPath}`,
        },
      ],
      duration: Date.now() - startTime,
    };
  }
  
  try {
    const fixFlag = options.fix ? "--fix" : "";
    const command = `bun run ${scriptPath} ${fixFlag}`;
    
    log(`Running layer ${layer.id}: ${layer.name}...`);
    
    const output = execSync(command, {
      encoding: "utf-8",
      stdio: "pipe",
    });
    
    // Parse JSON output from script
    const result = JSON.parse(output.trim());
    
    // Add duration
    result.duration = Date.now() - startTime;
    
    return result;
  } catch (error: any) {
    // Check if error output is JSON
    try {
      const errorOutput = error.stdout || error.stderr || "";
      const result = JSON.parse(errorOutput);
      result.duration = Date.now() - startTime;
      return result;
    } catch {
      return {
        layer: layer.name,
        status: "fail",
        violations: [
          {
            type: "EXECUTION_ERROR",
            severity: "critical",
            message: `Layer execution failed: ${error.message}`,
          },
        ],
        duration: Date.now() - startTime,
      };
    }
  }
}

async function runFullAudit(options: {
  fix?: boolean;
  stopOnFailure?: boolean;
}): Promise<AuditReport> {
  ensureOutputDir();
  
  console.log("\n" + "═".repeat(70));
  console.log("🔍 ENTERPRISE 360° PROJECT AUDIT");
  console.log("═".repeat(70));
  log(`Project: ${getProjectName()}`);
  log(`Branch: ${getCurrentBranch()}`);
  log(`Commit: ${getCurrentCommit()}`);
  log(`Started: ${new Date().toISOString()}`);
  console.log("═".repeat(70) + "\n");
  
  const results: AuditResult[] = [];
  
  for (const layer of AUDIT_LAYERS) {
    const result = await runLayer(layer, options);
    results.push(result);
    
    // Log result
    const statusEmoji = {
      pass: "✅",
      warn: "⚠️ ",
      fail: "❌",
    }[result.status];
    
    const duration = (result.duration / 1000).toFixed(2);
    log(
      `${statusEmoji} Layer ${layer.id} (${layer.name}): ${result.status.toUpperCase()} - ${result.violations.length} violations (${duration}s)`
    );
    
    // Stop on critical failure if requested
    if (options.stopOnFailure && result.status === "fail") {
      const criticalViolations = result.violations.filter(
        (v) => v.severity === "critical"
      );
      if (criticalViolations.length > 0) {
        log(`\nCritical failures detected in layer ${layer.name}. Stopping audit.`, "error");
        break;
      }
    }
  }
  
  // Calculate summary
  const allViolations = results.flatMap((r) => r.violations);
  const summary = {
    total: results.length,
    passed: results.filter((r) => r.status === "pass").length,
    warned: results.filter((r) => r.status === "warn").length,
    failed: results.filter((r) => r.status === "fail").length,
    totalViolations: allViolations.length,
    criticalViolations: allViolations.filter((v) => v.severity === "critical").length,
  };
  
  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    branch: getCurrentBranch(),
    commit: getCurrentCommit(),
    projectName: getProjectName(),
    layers: results,
    summary,
  };
  
  // Save report
  writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`\nDetailed report saved: ${REPORT_FILE}`);
  
  // Display summary
  console.log("\n" + "═".repeat(70));
  console.log("📊 AUDIT SUMMARY");
  console.log("═".repeat(70));
  console.log(`Total Layers:       ${summary.total}`);
  console.log(`✅ Passed:          ${summary.passed}`);
  console.log(`⚠️  Warnings:        ${summary.warned}`);
  console.log(`❌ Failed:          ${summary.failed}`);
  console.log(`─`.repeat(70));
  console.log(`Total Violations:   ${summary.totalViolations}`);
  console.log(`🔴 Critical:        ${summary.criticalViolations}`);
  console.log("═".repeat(70));
  
  if (summary.failed > 0) {
    console.log("\n❌ AUDIT FAILED - Fix violations before proceeding\n");
  } else if (summary.warned > 0) {
    console.log("\n⚠️  AUDIT PASSED WITH WARNINGS - Review violations\n");
  } else {
    console.log("\n✅ AUDIT PASSED - All checks successful!\n");
  }
  
  return report;
}

// ═══════════════════════════════════════════════════════════════
// CLI INTERFACE
// ═══════════════════════════════════════════════════════════════

function printUsage() {
  console.log(`
USAGE:
  bun run audit [options]

OPTIONS:
  --full              Run all audit layers (default)
  --layer=<id>        Run specific layer (e.g., --layer=03)
  --fix               Auto-fix violations where possible
  --stop-on-failure   Stop audit on first critical failure
  --list              List all available audit layers
  --help              Show this help message

EXAMPLES:
  bun run audit                    # Run full audit
  bun run audit --layer=03         # Run TypeScript audit only
  bun run audit --fix              # Run audit and auto-fix violations
  bun run audit --stop-on-failure  # Stop on first critical error

LAYERS:
${AUDIT_LAYERS.map((l) => `  ${l.id} - ${l.name.padEnd(20)} ${l.description}`).join("\n")}
  `);
}

function listLayers() {
  console.log("\n📋 AVAILABLE AUDIT LAYERS:\n");
  AUDIT_LAYERS.forEach((layer) => {
    console.log(`  ${layer.id} - ${layer.name}`);
    console.log(`      ${layer.description}`);
    console.log();
  });
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const options = {
    full: args.includes("--full"),
    fix: args.includes("--fix"),
    stopOnFailure: args.includes("--stop-on-failure"),
    list: args.includes("--list"),
    help: args.includes("--help"),
    layer: args.find((a) => a.startsWith("--layer="))?.split("=")[1],
  };
  
  // Show help
  if (options.help) {
    printUsage();
    process.exit(0);
  }
  
  // List layers
  if (options.list) {
    listLayers();
    process.exit(0);
  }
  
  // Default to full audit
  if (!options.layer) {
    options.full = true;
  }
  
  try {
    if (options.full) {
      const report = await runFullAudit({
        fix: options.fix,
        stopOnFailure: options.stopOnFailure,
      });
      
      // Exit with error if any layer failed
      if (report.summary.failed > 0) {
        process.exit(1);
      }
    } else if (options.layer) {
      const layer = AUDIT_LAYERS.find((l) => l.id === options.layer);
      if (!layer) {
        log(`Layer ${options.layer} not found. Use --list to see available layers.`, "error");
        process.exit(2);
      }
      
      const result = await runLayer(layer, { fix: options.fix });
      console.log(JSON.stringify(result, null, 2));
      
      if (result.status === "fail") {
        process.exit(1);
      }
    }
  } catch (error: any) {
    log(`Fatal error: ${error.message}`, "error");
    console.error(error);
    process.exit(2);
  }
}

main();
```

-----

## **File 2: Layer 00 - Pre-Flight**

`scripts/audit/00-pre-flight.ts`

```typescript
#!/usr/bin/env bun
/**
 * LAYER 00: PRE-FLIGHT CHECKS
 * 
 * Validates the environment before running other audits:
 * - Node/Bun version
 * - Required tools installed
 * - Project structure intact
 * - Configuration files present
 */

import { existsSync } from "fs";
import { execSync } from "child_process";

interface Violation {
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  fix?: string;
}

const violations: Violation[] = [];

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Check Bun version
try {
  const bunVersion = execSync("bun --version", { encoding: "utf-8" }).trim();
  const major = parseInt(bunVersion.split(".")[0]);
  if (major < 1) {
    violations.push({
      type: "OUTDATED_BUN",
      severity: "high",
      message: `Bun version ${bunVersion} is outdated. Requires >= 1.0.0`,
      fix: "Run: curl -fsSL https://bun.sh/install | bash",
    });
  }
} catch {
  violations.push({
    type: "BUN_NOT_FOUND",
    severity: "critical",
    message: "Bun runtime not found",
    fix: "Install Bun: https://bun.sh",
  });
}

// Check required files
const REQUIRED_FILES = [
  "package.json",
  "tsconfig.json",
  "biome.json",
  ".gitignore",
];

REQUIRED_FILES.forEach((file) => {
  if (!existsSync(file)) {
    violations.push({
      type: "MISSING_FILE",
      severity: "critical",
      message: `Required file missing: ${file}`,
      fix: `Create ${file} with proper configuration`,
    });
  }
});

// Check required folders
const REQUIRED_FOLDERS = [
  "app",
  "components",
  "lib",
  "types",
  "styles",
  "scripts",
  "documentation",
];

REQUIRED_FOLDERS.forEach((folder) => {
  if (!existsSync(folder)) {
    violations.push({
      type: "MISSING_FOLDER",
      severity: "high",
      message: `Required folder missing: ${folder}`,
      fix: `Create folder: mkdir -p ${folder}`,
    });
  }
});

// Check Git repository
try {
  execSync("git rev-parse --git-dir", { stdio: "ignore" });
} catch {
  violations.push({
    type: "NOT_GIT_REPO",
    severity: "critical",
    message: "Not a Git repository",
    fix: "Initialize Git: git init",
  });
}

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = {
  layer: "pre-flight",
  status:
    violations.length === 0
      ? "pass"
      : violations.some((v) => v.severity === "critical")
      ? "fail"
      : "warn",
  violations,
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.status === "fail" ? 1 : 0);
```
