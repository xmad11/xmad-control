#!/usr/bin/env bun
/**
 * AUDIT DASHBOARD GENERATOR
 *
 * Creates a beautiful HTML dashboard from audit results
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs"

interface AuditReport {
  timestamp: string
  branch: string
  commit: string
  projectName: string
  layers: any[]
  summary: any
}

function generateDashboard() {
  if (!existsSync(".audit/audit-report.json")) {
    console.error("❌ No audit report found. Run: bun run audit")
    process.exit(1)
  }

  const report: AuditReport = JSON.parse(readFileSync(".audit/audit-report.json", "utf-8"))

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audit Dashboard - ${report.projectName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .header .meta {
      opacity: 0.9;
      font-size: 0.9rem;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
      background: #f8f9fa;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-card .value {
      font-size: 3rem;
      font-weight: bold;
      margin: 0.5rem 0;
    }

    .stat-card .label {
      color: #6c757d;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-card.passed .value { color: #28a745; }
    .stat-card.warned .value { color: #ffc107; }
    .stat-card.failed .value { color: #dc3545; }
    .stat-card.critical .value { color: #dc3545; }

    .layers {
      padding: 2rem;
    }

    .layers h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .layer {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .layer-header {
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .layer-header:hover {
      background: #e9ecef;
    }

    .layer-status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .layer-status.pass {
      background: #d4edda;
      color: #155724;
    }

    .layer-status.warn {
      background: #fff3cd;
      color: #856404;
    }

    .layer-status.fail {
      background: #f8d7da;
      color: #721c24;
    }

    .layer-content {
      padding: 1.5rem;
      display: none;
    }

    .layer-content.open {
      display: block;
    }

    .violation {
      padding: 1rem;
      background: #f8f9fa;
      border-left: 3px solid #dc3545;
      margin-bottom: 0.75rem;
      border-radius: 0.25rem;
    }

    .violation.high { border-left-color: #fd7e14; }
    .violation.medium { border-left-color: #ffc107; }
    .violation.low { border-left-color: #17a2b8; }

    .violation-type {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .violation-message {
      color: #6c757d;
      margin-bottom: 0.5rem;
    }

    .violation-file {
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: #495057;
    }

    .violation-fix {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: white;
      border-radius: 0.25rem;
      font-size: 0.85rem;
    }

    .footer {
      padding: 2rem;
      text-align: center;
      color: #6c757d;
      border-top: 1px solid #e9ecef;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 Audit Dashboard</h1>
      <div class="meta">
        <div>Project: ${report.projectName}</div>
        <div>Branch: ${report.branch} (${report.commit})</div>
        <div>Generated: ${new Date(report.timestamp).toLocaleString()}</div>
      </div>
    </div>

    <div class="summary">
      <div class="stat-card">
        <div class="label">Total Layers</div>
        <div class="value">${report.summary.total}</div>
      </div>

      <div class="stat-card passed">
        <div class="label">Passed</div>
        <div class="value">${report.summary.passed}</div>
      </div>

      <div class="stat-card warned">
        <div class="label">Warnings</div>
        <div class="value">${report.summary.warned}</div>
      </div>

      <div class="stat-card failed">
        <div class="label">Failed</div>
        <div class="value">${report.summary.failed}</div>
      </div>

      <div class="stat-card critical">
        <div class="label">Critical</div>
        <div class="value">${report.summary.criticalViolations}</div>
      </div>
    </div>

    <div class="layers">
      <h2>Layer Results</h2>

      ${report.layers
        .map(
          (layer, i) => `
        <div class="layer">
          <div class="layer-header" onclick="toggleLayer(${i})">
            <span>
              <strong>Layer ${String(i).padStart(2, "0")}</strong>: ${layer.layer}
              ${layer.violations.length > 0 ? `(${layer.violations.length} violations)` : ""}
            </span>
            <span class="layer-status ${layer.status}">${layer.status.toUpperCase()}</span>
          </div>

          <div class="layer-content" id="layer-${i}">
            ${
              layer.violations.length === 0
                ? "<p>✅ No violations detected</p>"
                : layer.violations
                    .map(
                      (v: any) => `
              <div class="violation ${v.severity}">
                <div class="violation-type">${v.type}</div>
                <div class="violation-message">${v.message}</div>
                ${v.file ? `<div class="violation-file">📄 ${v.file}${v.line ? `:${v.line}` : ""}</div>` : ""}
                ${v.fix ? `<div class="violation-fix"><strong>Fix:</strong> ${v.fix}</div>` : ""}
              </div>
            `
                    )
                    .join("")
            }
          </div>
        </div>
      `
        )
        .join("")}
    </div>

    <div class="footer">
      Generated by Enterprise Audit System |
      ${
        report.summary.failed === 0 ? "✅ All checks passed!" : "❌ Fix violations before deploying"
      }
    </div>
  </div>

  <script>
    function toggleLayer(index) {
      const content = document.getElementById('layer-' + index);
      content.classList.toggle('open');
    }
  </script>
</body>
</html>
  `

  writeFileSync(".audit/dashboard.html", html)
  console.log("✅ Dashboard generated: .audit/dashboard.html")
  console.log("   Open in browser to view results")
}

generateDashboard()
