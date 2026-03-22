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

        elif self.path == "/processes":
            try:
                # Top 5 by memory
                mem_out = subprocess.check_output(
                    ["ps", "aux", "-m"], timeout=5, text=True
                ).strip().split("\n")[1:6]
                # Top 5 by CPU
                cpu_out = subprocess.check_output(
                    ["ps", "aux", "-r"], timeout=5, text=True
                ).strip().split("\n")[1:6]

                def parse_ps(lines):
                    result = []
                    for line in lines:
                        parts = line.split(None, 10)
                        if len(parts) < 11:
                            continue
                        name = parts[10].split("/")[-1][:30]
                        if name.startswith("(") or name == "":
                            continue
                        result.append({
                            "pid": int(parts[1]),
                            "name": name,
                            "cpu": float(parts[2]),
                            "memory": round(int(parts[5]) / 1024),
                            "user": parts[0]
                        })
                    return result

                self.send_json({
                    "memory": parse_ps(mem_out),
                    "cpu": parse_ps(cpu_out),
                    "_source": "bridge"
                })
            except Exception as e:
                self.send_json({"error": str(e), "memory": [], "cpu": []}, 503)

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

        elif action == "kill_process":
            pid = body.get("pid")
            name = body.get("name", "")
            # Safety: never kill system-critical processes
            protected = ["kernel", "launchd", "WindowServer", "tailscaled",
                        "sshd", "python3", "bridge", "master"]
            if not pid:
                self.send_json({"error": "no pid"}, 400)
                return
            if any(p in str(name) for p in protected):
                self.send_json({"error": f"protected process: {name}"}, 403)
                return
            try:
                import signal as sig_module
                os.kill(int(pid), sig_module.SIGTERM)
                state["last_activity"] = int(time.time())
                self.send_json({"ok": True, "action": f"killed {pid}"})
            except Exception as e:
                self.send_json({"error": str(e)}, 500)
                return

        else:
            self.send_json({"error": f"unknown action: {action}"}, 400)
            return

        with open(state_file, "w") as f:
            json.dump(state, f)

if __name__ == "__main__":
    port = int(os.environ.get("XMAD_BRIDGE_PORT", 4567))
    print(f"[XMAD Bridge] Starting on port {port}")
    HTTPServer(("0.0.0.0", port), Handler).serve_forever()
