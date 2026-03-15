# XMAD Ecosystem - Package Index

This directory contains modular packages for XMAD system control.

## Available Packages

### ssh-manager
Control macOS SSH server (start/stop/status)

### system-monitor
Real-time system metrics (CPU, RAM, disk)

### vnc-control
Control macOS Screen Sharing (VNC)

### backup-manager
Automatic backup of OpenClaw workspace and memory

### apple-notes
Access Apple Notes via AppleScript bridge

### automation
Task scheduling and execution queue

### memory-editor
Read/write OpenClaw memory files

### voice-client
External API voice client (no local microservices)

## Usage

Each module exports a class:

```javascript
const SystemMonitor = require('./system-monitor');
const monitor = new SystemMonitor();
const stats = await monitor.getAllStats();
```

## API Gateway

All modules are exposed via the API gateway at:
- http://localhost:9870

## On-Demand Execution

All modules run on-demand only (no continuous background processes).
Modules are loaded when API endpoints are called.
