/* ═══════════════════════════════════════════════════════════════════════════════
   PLATFORM API - Cross-project API client for xmad-control ↔ platform-monorepo
   Uses shared API key for inter-service authentication
   ═══════════════════════════════════════════════════════════════════════════════ */

const PLATFORM_URL = process.env.PLATFORM_API_URL || "http://localhost:3000"
const PLATFORM_KEY = process.env.PLATFORM_API_KEY || ""

interface PlatformFetchOptions extends RequestInit {
  timeout?: number
}

async function platformFetch<T>(endpoint: string, options: PlatformFetchOptions = {}): Promise<T> {
  const { timeout = 5000, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(`${PLATFORM_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": PLATFORM_KEY,
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.error || `Platform API error: ${res.status}`)
    }

    return res.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Tenant {
  id: string
  name: string
  slug: string
  owner_id: string
  created_at: string
  updated_at?: string
  status?: "active" | "suspended" | "pending"
}

export interface CreateTenantInput {
  name: string
  slug: string
  ownerId: string
}

export interface TenantListResponse {
  tenants: Tenant[]
  total: number
}

export interface TenantResponse {
  tenant: Tenant
}

export interface PlatformHealthResponse {
  ok: boolean
  service: string
  version: string
  timestamp: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// API CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

export const platformApi = {
  // Health check
  health: () => platformFetch<PlatformHealthResponse>("/api/health", { timeout: 3000 }),

  // Tenant management
  listTenants: () => platformFetch<TenantListResponse>("/api/admin/tenants"),

  getTenant: (id: string) => platformFetch<TenantResponse>(`/api/admin/tenants/${id}`),

  createTenant: (data: CreateTenantInput) =>
    platformFetch<TenantResponse>("/api/admin/tenants", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTenant: (id: string, data: Partial<CreateTenantInput>) =>
    platformFetch<TenantResponse>(`/api/admin/tenants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTenant: (id: string) =>
    platformFetch<{ ok: boolean }>(`/api/admin/tenants/${id}`, {
      method: "DELETE",
    }),

  // Agent operations
  listAgents: () =>
    platformFetch<{ agents: Array<{ id: string; name: string; status: string }> }>(
      "/api/admin/agents"
    ),

  // Automation queue
  listAutomations: () =>
    platformFetch<{ queue: unknown[]; history: unknown[] }>("/api/admin/automations"),
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK FOR REACT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export function usePlatformApi() {
  const isConfigured = Boolean(PLATFORM_URL && PLATFORM_KEY)

  return {
    isConfigured,
    platformUrl: PLATFORM_URL,
    ...platformApi,
  }
}

export default platformApi
