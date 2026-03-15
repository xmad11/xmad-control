# API Reference

> **Complete API documentation for XMAD Control Center**

---

## Overview

XMAD Control Center exposes several APIs:
- **OpenClaw Gateway API** - AI agent interactions (port 18789)
- **XMAD Core API** - Platform management (port 9870)
- **Dashboard API** - Web interface (port 3333)

---

## OpenClaw Gateway API

**Base URL:** `http://127.0.0.1:18789`

### Authentication

```http
Authorization: Bearer <gateway-token>
```

Token configured in `openclaw.json`:
```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}
```

### Endpoints

#### Health Check

```http
GET /health
```

**Response:**
```json
{
  "ok": true,
  "status": "live"
}
```

#### Gateway Info

```http
GET /
```

Returns gateway control UI (HTML).

#### Agent Chat

```http
POST /v1/chat/completions
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "model": "zai/glm-4.7",
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "stream": true
}
```

**Response (streaming):**
```
data: {"choices":[{"delta":{"content":"Hi"}}]}
data: {"choices":[{"delta":{"content":" there!"}}]}
data: [DONE]
```

#### List Models

```http
GET /v1/models
```

**Response:**
```json
{
  "data": [
    {"id": "zai/glm-4.7", "object": "model"},
    {"id": "zai/glm-5", "object": "model"}
  ]
}
```

---

## XMAD Core API

**Base URL:** `http://127.0.0.1:9870`

### Endpoints

#### Health

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 123456,
  "version": "1.0.0"
}
```

#### System Status

```http
GET /api/status
```

**Response:**
```json
{
  "services": {
    "gateway": "running",
    "core": "running",
    "watchdog": "running"
  },
  "memory": {
    "used": 512,
    "limit": 700
  },
  "uptime": 123456
}
```

#### Execute Command

```http
POST /api/execute
```

**Request:**
```json
{
  "command": "health-check",
  "params": {}
}
```

**Response:**
```json
{
  "success": true,
  "result": {}
}
```

---

## Dashboard API

**Base URL:** `http://127.0.0.1:3333/api`

### Endpoints

#### Get Dashboard Data

```http
GET /api/dashboard
```

**Response:**
```json
{
  "stats": {
    "totalRequests": 1234,
    "activeUsers": 5,
    "memoryUsage": 512
  },
  "recentActivity": []
}
```

#### Get Logs

```http
GET /api/logs
```

**Query Parameters:**
- `limit` - Number of entries (default: 100)
- `level` - Log level filter (info, warn, error)
- `service` - Service filter (gateway, watchdog, core)

**Response:**
```json
{
  "logs": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "level": "info",
      "service": "gateway",
      "message": "Gateway started"
    }
  ]
}
```

---

## WhatsApp Webhook

**Endpoint:** Internal (handled by OpenClaw)

### Incoming Message

When a WhatsApp message is received, OpenClaw processes it:

```
WhatsApp Message → OpenClaw Gateway → AI Processing → WhatsApp Reply
```

### Configuration

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "dmPolicy": "pairing",
      "allowFrom": ["+971504042000"]
    }
  }
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Invalid API key",
    "code": "invalid_api_key"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `invalid_api_key` | 401 | API key missing or invalid |
| `rate_limit_exceeded` | 429 | Too many requests |
| `model_not_found` | 404 | Requested model doesn't exist |
| `context_length_exceeded` | 400 | Input too long |
| `internal_error` | 500 | Server error |

---

## Rate Limiting

### Default Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/v1/chat/*` | 200 | 1 minute |
| `/v1/models` | 100 | 1 minute |
| `/health` | Unlimited | - |

### Headers

Responses include rate limit headers:
```
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 195
X-RateLimit-Reset: 60
```

---

## Webhooks

### Configure Webhook

```json
{
  "webhooks": {
    "enabled": true,
    "url": "https://your-server.com/webhook",
    "events": ["message.received", "message.sent"]
  }
}
```

### Webhook Payload

```json
{
  "event": "message.received",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "from": "+971504042000",
    "message": "Hello",
    "channel": "whatsapp"
  }
}
```

---

## SDK Usage

### JavaScript/TypeScript

```javascript
const response = await fetch('http://127.0.0.1:18789/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token'
  },
  body: JSON.stringify({
    model: 'zai/glm-4.7',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});

const data = await response.json();
```

### Python

```python
import requests

response = requests.post(
    'http://127.0.0.1:18789/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token'
    },
    json={
        'model': 'zai/glm-4.7',
        'messages': [{'role': 'user', 'content': 'Hello'}]
    }
)
data = response.json()
```

### cURL

```bash
curl -X POST http://127.0.0.1:18789/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"model":"zai/glm-4.7","messages":[{"role":"user","content":"Hello"}]}'
```

---

## Related Documentation

- [OpenClaw Guide](./OPENCLAW.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Modules Overview](./MODULES.md)
