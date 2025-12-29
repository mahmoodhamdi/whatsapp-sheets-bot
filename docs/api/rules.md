# Rules API

This document describes the auto-reply rules endpoints.

## Overview

Rules define automatic responses to incoming WhatsApp messages. Each rule has a trigger pattern and a response message.

## Trigger Types

| Type | Description | Example |
|------|-------------|---------|
| `EXACT` | Message must match exactly | "hello" matches "hello" |
| `CONTAINS` | Message must contain the trigger | "price" matches "what's the price?" |
| `STARTS_WITH` | Message must start with trigger | "hi" matches "hi there" |
| `REGEX` | Regular expression pattern | `\d{3,}` matches "order 12345" |

## Endpoints

### GET /api/rules

List all auto-reply rules.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `active` | boolean | Filter by active status |
| `search` | string | Search in name/trigger |

**Response (200 OK):**
```json
{
  "rules": [
    {
      "id": "clxx...",
      "name": "Welcome Message",
      "trigger": "hello",
      "triggerType": "EXACT",
      "response": "Hello! How can I help you?",
      "priority": 100,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

---

### POST /api/rules

Create a new rule.

**Request Body:**
```json
{
  "name": "Price Inquiry",
  "trigger": "price",
  "triggerType": "CONTAINS",
  "response": "Our prices start at $9/month. Visit our website for details.",
  "priority": 50,
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "id": "clxx...",
  "name": "Price Inquiry",
  "trigger": "price",
  "triggerType": "CONTAINS",
  "response": "Our prices start at $9/month. Visit our website for details.",
  "priority": 50,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Validation:**
- `name`: Required, 1-100 characters
- `trigger`: Required, 1-500 characters
- `triggerType`: Required, one of EXACT, CONTAINS, STARTS_WITH, REGEX
- `response`: Required, 1-2000 characters
- `priority`: Optional, 0-1000 (default: 0)
- `isActive`: Optional, boolean (default: true)

**Errors:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid input |
| 403 | LIMIT_REACHED | Rule limit reached for plan |

---

### GET /api/rules/[id]

Get a specific rule.

**Response (200 OK):**
```json
{
  "id": "clxx...",
  "name": "Welcome Message",
  "trigger": "hello",
  "triggerType": "EXACT",
  "response": "Hello! How can I help you?",
  "priority": 100,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### PUT /api/rules/[id]

Update a rule.

**Request Body:**
```json
{
  "name": "Updated Welcome",
  "response": "Welcome! How may I assist you today?",
  "priority": 150
}
```

**Response (200 OK):**
```json
{
  "id": "clxx...",
  "name": "Updated Welcome",
  "trigger": "hello",
  "triggerType": "EXACT",
  "response": "Welcome! How may I assist you today?",
  "priority": 150,
  "isActive": true,
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

---

### DELETE /api/rules/[id]

Delete a rule.

**Response (200 OK):**
```json
{
  "message": "Rule deleted successfully"
}
```

---

### PATCH /api/rules/[id]/toggle

Toggle rule active status.

**Response (200 OK):**
```json
{
  "id": "clxx...",
  "isActive": false
}
```

---

## Rule Matching

### Priority

Rules are matched in order of priority (highest first). When multiple rules match a message, only the highest priority rule's response is sent.

### Regex Patterns

For `REGEX` trigger type, the pattern is matched against the entire message:

```json
{
  "trigger": "\\b\\d{5,}\\b",
  "triggerType": "REGEX",
  "response": "I see you mentioned an order number. Let me check that for you."
}
```

Common patterns:
- `\d+` - Match any number
- `\b(order|pedido)\b` - Match specific words
- `^(hi|hello|hey)` - Match greetings at start

### Case Sensitivity

All matching is **case-insensitive** by default.

---

## Plan Limits

| Plan | Rules Limit |
|------|-------------|
| Free | 1 |
| Starter | 10 |
| Professional | Unlimited |
| Enterprise | Unlimited |

When the limit is reached, new rule creation returns a 403 error.

---

## Best Practices

1. **Use specific triggers** - Avoid overly broad patterns
2. **Set priorities** - Higher priority for specific rules, lower for catch-all
3. **Test regex patterns** - Verify with sample messages before enabling
4. **Keep responses concise** - WhatsApp has character limits
5. **Use working hours** - Configure when auto-replies are active
