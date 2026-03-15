/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CLIENT - XMAD Control Dashboard
   Clean foundation for dashboard implementation
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client";

import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemStats {
  cpu: number;
  memory: { used: number; total: number; percentage: number };
  disk: { used: number; total: number; percentage: number };
  uptime: number;
}

interface ServiceStatus {
  openclaw: { running: boolean; pid?: number; memoryUsage?: number };
  tailscale: { connected: boolean; ip?: string };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [services, setServices] = useState<ServiceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch system stats from API
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/xmad/system/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      }
    } catch (err) {
      // Silently fail - stats endpoint may not be implemented yet
    }
  }, []);

  // Fetch service status from API
  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch("/api/xmad/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (err) {
      // Silently fail - services endpoint may not be implemented yet
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchServices()]);
      setIsLoading(false);
    };

    init();

    // Set up polling for live stats (every 5 seconds)
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [fetchStats, fetchServices]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">XMAD Control</h1>
          <p className="text-white/60 mt-2">Dashboard foundation ready for implementation</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/60">Loading...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Stats Grid - Placeholder */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CPU */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-white/60 text-sm">CPU Usage</div>
              <div className="text-2xl font-bold text-white mt-1">
                {stats?.cpu ?? "--"}%
              </div>
            </div>

            {/* Memory */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-white/60 text-sm">Memory</div>
              <div className="text-2xl font-bold text-white mt-1">
                {stats?.memory?.percentage ?? "--"}%
              </div>
            </div>

            {/* Disk */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-white/60 text-sm">Disk</div>
              <div className="text-2xl font-bold text-white mt-1">
                {stats?.disk?.percentage ?? "--"}%
              </div>
            </div>

            {/* OpenClaw Status */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-white/60 text-sm">OpenClaw</div>
              <div className="text-2xl font-bold mt-1">
                <span className={services?.openclaw?.running ? "text-green-400" : "text-red-400"}>
                  {services?.openclaw?.running ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tailscale Status */}
        {!isLoading && services?.tailscale && (
          <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-white/60 text-sm">Tailscale VPN</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={services.tailscale.connected ? "text-green-400" : "text-red-400"}>
                {services.tailscale.connected ? "Connected" : "Disconnected"}
              </span>
              {services.tailscale.ip && (
                <span className="text-white/40 text-sm">({services.tailscale.ip})</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeClient;
