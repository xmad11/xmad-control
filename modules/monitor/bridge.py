#!/usr/bin/env python3
"""
XMAD Bridge - Tiny HTTP server (~10MB RAM)
Serves system status to Vercel dashboard via Tailscale
Port: 4567
"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import json, os, subprocess, time

STORAGE = os.path.expanduser("~/xmad-control/storage")
TOKEN = os.environ.get("XMAD_BRIDGE_TOKEN", "")

class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress access logs to save disk

    def check_auth(self):
        if not TOKEN:
            return True
        auth = self.headers.get("Authorization", "")
        return auth == f"Bearer {TOKEN}"

    def send_json(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if not self.check_auth():
            self.send_json({"error": "unauthorized"}, 401)
            return

        if self.path == "/status":
            try:
                with open(f"{STORAGE}/status.json") as f:
                    self.send_json(json.load(f))
            except:
                self.send_json({"error": "status_unavailable"}, 503)

        elif self.path == "/state":
            try:
                with open(f"{STORAGE}/state.json") as f:
                    self.send_json(json.load(f))
            except:
                self.send_json({"mode": "eco", "timestamp": int(time.time())})

        elif self.path == "/health":
            self.send_json({"ok": True, "bridge": "live"})

        else:
            self.send_json({"error": "not_found"}, 404)

    def do_POST(self):
        if not self.check_auth():
            self.send_json({"error": "unauthorized"}, 401)
            return

        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length) or b"{}")
        action = body.get("action", "")

        # Update last activity timestamp
        state_file = f"{STORAGE}/state.json"
        try:
            with open(state_file) as f:
                state = json.load(f)
        except:
            state = {"mode": "eco"}
        state["last_activity"] = int(time.time())

        if action == "start_openclaw":
            subprocess.Popen(["bash", os.path.expanduser(
                "~/xmad-control/openclaw/scripts/start-ssot.sh"
            )])
            state["mode"] = "active"
            self.send_json({"ok": True, "action": "openclaw_starting"})

        elif action == "stop_openclaw":
            subprocess.run(["pkill", "-f", "openclaw"])
            state["mode"] = "eco"
            self.send_json({"ok": True, "action": "openclaw_stopped"})

        elif action == "ping":
            # Just update activity timestamp - keeps session alive
            self.send_json({"ok": True, "timestamp": int(time.time())})

        elif action == "restart_openclaw":
            subprocess.run(["pkill", "-f", "openclaw"])
            time.sleep(2)
            subprocess.Popen(["bash", os.path.expanduser(
                "~/xmad-control/openclaw/scripts/start-ssot.sh"
            )])
            state["mode"] = "active"
            self.send_json({"ok": True, "action": "openclaw_restarting"})

        else:
            self.send_json({"error": f"unknown action: {action}"}, 400)
            return

        with open(state_file, "w") as f:
            json.dump(state, f)

if __name__ == "__main__":
    port = int(os.environ.get("XMAD_BRIDGE_PORT", 4567))
    print(f"[XMAD Bridge] Starting on port {port}")
    HTTPServer(("0.0.0.0", port), Handler).serve_forever()
