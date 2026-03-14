// ~/xmad-control/modules/core/packages/vnc-control/index.js
// VNC screen sharing control via websockify + noVNC

"use strict";

const { spawn, execFile } = require("child_process");
const fs   = require("fs");
const path = require("path");

// Actual install paths on this system
const WEBSOCKIFY_PATH = "/Library/Frameworks/Python.framework/Versions/3.10/bin/websockify";
const NOVNC_WEB_PATH   = "/Users/ahmadabdullah/Applications/novnc";

function isRunning() {
  return vncProcess !== null && !vncProcess.killed;
}

async function start(vncPort = 5900, wsPort = 6080) {
  if (isRunning()) {
    return { ok: true, message: "Already running", port: wsPort };
  }

  if (!fs.existsSync(WEBSOCKIFY_PATH)) {
    return {
      ok: false,
      error: "websockify not installed. Install: pip3 install websockify",
      fix: "pip3 install websockify",
    };
  }

  if (!fs.existsSync(NOVNC_WEB_PATH)) {
    return {
      ok: false,
      error: "noVNC not installed at " + NOVNC_WEB_PATH,
      fix: "Install noVNC to ~/Applications/novnc",
    };
  }

  return new Promise((resolve) => {
    const args = ["--web", NOVNC_WEB_PATH, String(wsPort), `localhost:${vncPort}`];

    vncProcess = spawn(WEBSOCKIFY_PATH, args, {
      detached: false,
      stdio:    ["ignore", "pipe", "pipe"],
    });

    vncProcess.on("error", (err) => {
      vncProcess = null;
      resolve({ ok: false, error: err.message });
    });

    vncProcess.on("exit", (code) => {
      vncProcess = null;
      if (code !== 0 && code !== null) {
        console.error(`[vnc-control] websockify exited with code ${code}`);
      }
    });

    // Give it 1.5s to start
    setTimeout(() => {
      if (isRunning()) {
        resolve({ ok: true, port: wsPort, pid: vncProcess.pid });
      } else {
        resolve({ ok: false, error: "websockify failed to start" });
      }
    }, 1500);
  });
}

function stop() {
  if (!isRunning()) return { ok: true, message: "Not running" };
  vncProcess.kill("SIGTERM");
  vncProcess = null;
  return { ok: true };
}

function getStatus() {
  return {
    running:     isRunning(),
    pid:         vncProcess?.pid ?? null,
    websockify:  WEBSOCKIFY_PATH,
    novncWeb:    NOVNC_WEB_PATH,
    installed:   fs.existsSync(WEBSOCKIFY_PATH) && fs.existsSync(NOVNC_WEB_PATH),
  };
}

module.exports = { start, stop, getStatus, isRunning };
