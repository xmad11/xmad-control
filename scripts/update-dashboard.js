#!/usr/bin/env node

/**
 * Auto-updates the HTML dashboard with cleaned prompts
 * Run this after adding new prompts to prompts/prompts.json
 */

const fs = require("node:fs")
const path = require("node:path")

const promptsPath = path.resolve(__dirname, "../prompts/prompts.json")
const htmlPath = path.resolve(__dirname, "../dashboard/index.html")

if (!fs.existsSync(promptsPath)) {
  console.error(`❌ prompts.json not found at ${promptsPath}`)
  process.exit(1)
}

const promptsData = JSON.parse(fs.readFileSync(promptsPath, "utf8"))

// Generate HTML content
let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Coordinator Dashboard | Shadi-V2</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
  }
  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
  header {
    background: white;
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  .header-content {
    flex: 1;
  }
  h1 {
    color: #333;
    margin-bottom: 10px;
    font-size: 2rem;
  }
  .subtitle {
    color: #666;
    font-size: 0.9rem;
  }
  .clone-btn {
    background: linear-gradient(135deg, #ff7f50 0%, #e06b38 100%);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(255, 127, 80, 0.3);
  }
  .clone-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(255, 127, 80, 0.4);
  }
  .clone-btn:active {
    transform: translateY(0);
  }
  .tech-stack {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    margin-top: 15px;
  }
  .tech-badge {
    background: #f0f0f0;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: #555;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  @media (max-width: 1024px) {
    .grid { grid-template-columns: 1fr; }
  }
  .category {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .category-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
  }
  .category-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }
  .low .category-icon { background: #d4edda; }
  .medium .category-icon { background: #fff3cd; }
  .high .category-icon { background: #f8d7da; }
  .category h2 {
    font-size: 1.3rem;
    color: #333;
    margin: 0;
  }
  .prompt-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    border-left: 4px solid #ddd;
  }
  .low .prompt-card { border-left-color: #28a745; }
  .medium .prompt-card { border-left-color: #ffc107; }
  .high .prompt-card { border-left-color: #dc3545; }
  .prompt-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 10px;
  }
  .prompt-id {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
  }
  .prompt-notes {
    font-size: 0.75rem;
    color: #666;
    background: #e9ecef;
    padding: 3px 8px;
    border-radius: 4px;
  }
  .prompt-text {
    background: white;
    padding: 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 10px;
    border: 1px solid #e9ecef;
  }
  .copy-btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  .low .copy-btn { background: #28a745; color: white; }
  .medium .copy-btn { background: #ffc107; color: #333; }
  .high .copy-btn { background: #dc3545; color: white; }
  .copy-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  .copy-btn:active {
    transform: translateY(0);
  }
  .quick-start {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 20px;
  }
  .quick-start h2 {
    color: #333;
    margin-bottom: 15px;
  }
  .step {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    border-left: 4px solid #667eea;
  }
  .step-code {
    background: #2d3748;
    color: #a0aec0;
    padding: 15px;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.85rem;
    margin-top: 10px;
    overflow-x: auto;
  }
  .step-code .command {
    color: #68d391;
  }
  .workflow {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 20px;
  }
  .workflow h2 {
    color: #333;
    margin-bottom: 15px;
  }
  .state-flow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  .state {
    background: #f8f9fa;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    color: #333;
    border: 2px solid #e9ecef;
  }
  .state.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
  .arrow {
    font-size: 1.5rem;
    color: #999;
  }
  .checks {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
  }
  .checks h3 {
    font-size: 1rem;
    margin-bottom: 10px;
    color: #333;
  }
  .check-item {
    padding: 8px 0;
    color: #555;
    font-size: 0.9rem;
  }
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    display: none;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .last-updated {
    text-align: center;
    color: white;
    font-size: 0.85rem;
    padding: 15px;
    opacity: 0.9;
  }
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 1000;
    align-items: center;
    justify-content: center;
  }
  .modal.active {
    display: flex;
  }
  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    animation: modalSlideIn 0.3s ease;
  }
  @keyframes modalSlideIn {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .modal-content h2 {
    margin-bottom: 20px;
    color: #333;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    font-weight: 600;
  }
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 1rem;
  }
  .form-group input:focus {
    outline: none;
    border-color: #667eea;
  }
  .form-group .hint {
    font-size: 0.85rem;
    color: #888;
    margin-top: 5px;
  }
  .modal-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  .modal-buttons button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }
  .btn-primary {
    background: #667eea;
    color: white;
  }
  .btn-secondary {
    background: #e9ecef;
    color: #333;
  }
  .clone-section {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 20px;
  }
  .clone-section h2 {
    color: #333;
    margin-bottom: 15px;
  }
  .clone-section .info {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    border-left: 4px solid #ff7f50;
  }
</style>
</head>
<body>

<div class="container">

<header>
  <div class="header-content">
    <h1>🚀 Coordinator Dashboard</h1>
    <p class="subtitle">State Machine Architecture for GLM-4.7 | Ralph Loop Quality Gates</p>
    <div class="tech-stack">
      <span class="tech-badge">Next.js 16.1.3</span>
    <span class="tech-badge">React 19.2</span>
    <span class="tech-badge">Tailwind 4.1.18</span>
    <span class="tech-badge">Bun</span>
    <span class="tech-badge">TypeScript Strict</span>
    <span class="tech-badge">Biome</span>
  </div>
  </div>
  <button class="clone-btn" onclick="showCloneModal()">
    📋 Clone to New Project
  </button>
</header>

<div class="quick-start">
  <h2>⚡ Quick Start</h2>
  <div class="step">
    <strong>Step 1:</strong> Open your terminal and run:
    <div class="step-code"><span class="command">claude2</span></div>
  </div>
  <div class="step">
    <strong>Step 2:</strong> Copy a prompt from below (click the button)
  </div>
  <div class="step">
    <strong>Step 3:</strong> Paste into the Coordinator session
  </div>
  <p style="margin-top: 15px; color: #666; font-size: 0.9rem;">
    ✨ No prep work needed - Coordinator handles branches, checks, and merges automatically
  </p>
</div>

<div class="clone-section">
  <h2>📋 Clone Coordinator to New Project</h2>
  <div class="info">
    <strong>Want to use Coordinator in another project?</strong><br>
    Click the "Clone to New Project" button above to copy all Coordinator files, prompts, and dashboard to a new folder.
    The system will automatically set up the <code>claude2</code> alias for the new project.
  </div>
  <p style="color: #666; font-size: 0.9rem;">
    <strong>What gets copied:</strong><br>
    • coordinator-system.md (state machine prompt)<br>
    • All documentation and cheat sheets<br>
    • All scripts (start-coordinator, validate, update-dashboard, clone)<br>
    • prompts/prompts.json (your task library)<br>
    • dashboard/index.html (interactive UI)<br>
    • package.json scripts
  </p>
</div>

<div class="workflow">
  <h2>🔄 State Machine Workflow</h2>
  <div class="state-flow">
    <div class="state">INTAKE</div>
    <span class="arrow">→</span>
    <div class="state">REFINING</div>
    <span class="arrow">→</span>
    <div class="state active">EXECUTING</div>
    <span class="arrow">→</span>
    <div class="state">REVIEWING</div>
    <span class="arrow">→</span>
    <div class="state">MERGED</div>
  </div>
  <div class="checks">
    <h3>🛡️ Ralph Loop Quality Gate (EXECUTING state)</h3>
    <div class="check-item">✓ bun install - Dependencies must install without errors</div>
    <div class="check-item">✓ bun run check:ts - Zero TypeScript errors</div>
    <div class="check-item">✓ bun run check - Biome linting passes</div>
    <div class="check-item">✓ bun run build - Production build succeeds</div>
    <p style="margin-top: 10px; font-size: 0.85rem; color: #666;">
      <strong>No exceptions. No deferrals. Must pass in-session.</strong>
    </p>
  </div>
</div>

<div class="grid">
`

// Generate prompt cards for each category
const icons = { low: "🟢", medium: "🟡", high: "🔴" }
const titles = { low: "Low Complexity", medium: "Medium Complexity", high: "High Complexity" }

for (const category of ["low", "medium", "high"]) {
  if (!promptsData[category] || promptsData[category].length === 0) continue

  htmlContent += `  <div class="category ${category}">
    <div class="category-header">
      <div class="category-icon">${icons[category]}</div>
      <h2>${titles[category]}</h2>
    </div>
    <div class="container">
`

  promptsData[category].forEach((p) => {
    const escapedPrompt = p.cleaned
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "\\'")

    const escapedPromptForAttr = p.cleaned
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")
      .replace(/\n/g, "\\n")

    htmlContent += `    <div class="prompt-card">
      <div class="prompt-header">
        <span class="prompt-id">${p.id}</span>
        ${p.notes ? `<span class="prompt-notes">${p.notes}</span>` : ""}
      </div>
      <div class="prompt-text">${escapedPrompt}</div>
      <button class="copy-btn" onclick="copyPrompt('${escapedPromptForAttr}')">
        📋 Copy Prompt
      </button>
    </div>
`
  })

  htmlContent += `    </div>
  </div>
`
}

htmlContent += `
</div>

<div class="last-updated">
  Generated by Coordinator System | Last updated: ${new Date().toLocaleString()}
</div>

</div>

<div class="toast" id="toast"></div>

<div class="modal" id="cloneModal">
  <div class="modal-content">
    <h2>📋 Clone Coordinator to New Project</h2>
    <div class="form-group">
      <label for="folderPath">Target Folder Path:</label>
      <input type="text" id="folderPath" placeholder="/Users/ahmadabdullah/Desktop">
      <div class="hint">Full path to where you want to create the new project</div>
    </div>
    <div class="form-group">
      <label for="projectName">Project Name:</label>
      <input type="text" id="projectName" placeholder="my-new-project">
      <div class="hint">Letters, numbers, hyphens, and underscores only</div>
    </div>
    <div class="modal-buttons">
      <button class="btn-secondary" onclick="closeCloneModal()">Cancel</button>
      <button class="btn-primary" onclick="performClone()">Clone Coordinator</button>
    </div>
  </div>
</div>

<script>
function copyPrompt(text) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('toast');
    toast.textContent = '✅ Prompt copied! Now paste in your terminal';
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2500);
  }).catch(err => {
    alert('Failed to copy: ' + err);
  });
}

// Keyboard shortcut: Press 1, 2, or 3 to copy first prompt from each category
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'BUTTON') return;

  const prompts = ${JSON.stringify(promptsData)};
  if (e.key === '1' && prompts.low?.length) {
    copyPrompt(prompts.low[0].cleaned);
  } else if (e.key === '2' && prompts.medium?.length) {
    copyPrompt(prompts.medium[0].cleaned);
  } else if (e.key === '3' && prompts.high?.length) {
    copyPrompt(prompts.high[0].cleaned);
  }
});

function showCloneModal() {
  document.getElementById('cloneModal').classList.add('active');
  document.getElementById('folderPath').focus();
}

function closeCloneModal() {
  document.getElementById('cloneModal').classList.remove('active');
}

async function performClone() {
  const folderPath = document.getElementById('folderPath').value.trim();
  const projectName = document.getElementById('projectName').value.trim();

  if (!folderPath || !projectName) {
    alert('Please enter both folder path and project name');
    return;
  }

  // Sanitize project name
  const sanitizedName = projectName.replace(/[^a-zA-Z0-9-_]/g, '');
  if (sanitizedName !== projectName) {
    alert('Project name can only contain letters, numbers, hyphens, and underscores');
    return;
  }

  closeCloneModal();

  // Show command to run (since we can't execute Node.js from browser directly)
  const command = \`cd "\${process.cwd().replace(/dashboard$/, '')}" && bun run coordinator:clone "\${folderPath}" "\${sanitizedName}"\`;

  const message = \`To clone the Coordinator system, run this command in your terminal:

\${command}

Or navigate to the project and run:
bun run coordinator:clone \${folderPath} \${sanitizedName}\`;

  // Copy command to clipboard
  try {
    await navigator.clipboard.writeText(command);
    alert('✅ Clone command copied to clipboard!\\n\\nPaste it in your terminal and press Enter.\\n\\n' + message);
  } catch (err) {
    alert(message);
  }
}

// Close modal when clicking outside
document.getElementById('cloneModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeCloneModal();
  }
});
</script>

</body>
</html>
`

// Ensure directory exists
const dashboardDir = path.dirname(htmlPath)
if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true })
}

// Write HTML
fs.writeFileSync(htmlPath, htmlContent)

console.log("✅ Dashboard updated at dashboard/index.html")
console.log("📊 Prompts loaded:")
console.log(`   • Low complexity: ${promptsData.low?.length || 0} prompts`)
console.log(`   • Medium complexity: ${promptsData.medium?.length || 0} prompts`)
console.log(`   • High complexity: ${promptsData.high?.length || 0} prompts`)
console.log("")
console.log("💡 Open dashboard: bun run dashboard:open")
