/* ═══════════════════════════════════════════════════════════════════════════════
   TENANTS SURFACE - XMAD Control Dashboard
   Manages platform-monorepo tenants from super admin dashboard
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassButton as Button } from "@/components/glass/glass-button"
import {
  GlassCard as Card,
  GlassCardContent as CardContent,
  GlassCardDescription as CardDescription,
  GlassCardHeader as CardHeader,
  GlassCardTitle as CardTitle,
} from "@/components/glass/glass-card"
import { GlassInput as Input } from "@/components/glass/glass-input"
import type { Tenant } from "@/lib/platform-api"
import { Plus, RefreshCw, Search, Users } from "lucide-react"
import * as React from "react"

export function TenantsSurface() {
  const [tenants, setTenants] = React.useState<Tenant[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showCreateForm, setShowCreateForm] = React.useState(false)

  const fetchTenants = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/xmad/tenants")
      const data = await res.json()
      if (data.tenants) {
        setTenants(data.tenants)
      } else if (data.error) {
        setError(data.error)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  const filteredTenants = React.useMemo(() => {
    if (!searchQuery) return tenants
    const query = searchQuery.toLowerCase()
    return tenants.filter(
      (t) => t.name.toLowerCase().includes(query) || t.slug.toLowerCase().includes(query)
    )
  }, [tenants, searchQuery])

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "text-green-400"
      case "suspended":
        return "text-red-400"
      case "pending":
        return "text-yellow-400"
      default:
        return "text-white/60"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-white/40" />
        <span className="ml-3 text-white/60">Loading tenants...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400">Connection Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/60 text-sm mb-4">
            Make sure platform-monorepo is running on the configured port.
          </p>
          <Button onClick={fetchTenants} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6" />
            Tenants
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {tenants.length} tenant{tenants.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          placeholder="Search tenants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <CreateTenantForm
          onSuccess={() => {
            setShowCreateForm(false)
            fetchTenants()
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Tenant List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="hover:bg-white/5 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{tenant.name}</CardTitle>
                <span className={`text-xs ${getStatusColor(tenant.status)}`}>
                  {tenant.status || "unknown"}
                </span>
              </div>
              <CardDescription>/{tenant.slug}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-white/40">
                Created {new Date(tenant.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && !loading && (
        <div className="text-center py-12 text-white/40">
          {searchQuery ? "No tenants match your search" : "No tenants found"}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE TENANT FORM
// ═══════════════════════════════════════════════════════════════════════════════

interface CreateTenantFormProps {
  onSuccess: () => void
  onCancel: () => void
}

function CreateTenantForm({ onSuccess, onCancel }: CreateTenantFormProps) {
  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [ownerId, setOwnerId] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !slug || !ownerId) {
      setError("All fields are required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/xmad/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, ownerId }),
      })

      const data = await res.json()
      if (res.ok) {
        onSuccess()
      } else {
        setError(data.error || "Failed to create tenant")
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (!slug) setSlug(generateSlug(e.target.value))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(generateSlug(e.target.value))
  }

  const handleOwnerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerId(e.target.value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Tenant</CardTitle>
        <CardDescription>Add a new tenant to the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tenant-name" className="block text-sm text-white/60 mb-1">
              Name
            </label>
            <Input
              id="tenant-name"
              value={name}
              onChange={handleNameChange}
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label htmlFor="tenant-slug" className="block text-sm text-white/60 mb-1">
              Slug
            </label>
            <Input
              id="tenant-slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="acme-corp"
            />
          </div>
          <div>
            <label htmlFor="tenant-owner" className="block text-sm text-white/60 mb-1">
              Owner ID
            </label>
            <Input
              id="tenant-owner"
              value={ownerId}
              onChange={handleOwnerIdChange}
              placeholder="user_xxx"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Tenant"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default TenantsSurface
