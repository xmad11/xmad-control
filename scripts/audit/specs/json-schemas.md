# JSON Schemas — UI Normalization Layer Reports

> **Authoritative Contract Definitions**
>
> Version: 1.0.0 | Status: Non-Negotiable

---

## A. UI Normalization Report

**File:** `.audit/ui-normalization-report.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "UI Normalization Report",
  "type": "object",
  "required": ["meta", "summary", "violations", "warnings", "recommendations"],
  "properties": {
    "meta": {
      "type": "object",
      "description": "Report metadata",
      "required": ["timestamp", "project", "mode", "mobileFirstScore"],
      "properties": {
        "timestamp": {
          "type": "string",
          "format": "date-time",
          "description": "ISO-8601 timestamp of report generation"
        },
        "project": {
          "type": "string",
          "description": "Project name"
        },
        "mode": {
          "type": "string",
          "enum": ["inspect", "isolate", "assist-fix"],
          "description": "Operating mode used"
        },
        "mobileFirstScore": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "description": "Mobile-first compliance score (0-1)"
        },
        "duration": {
          "type": "number",
          "description": "Execution time in milliseconds"
        }
      }
    },
    "summary": {
      "type": "object",
      "description": "Aggregate statistics",
      "required": ["componentsScanned", "violations", "warnings", "exceptions", "duplications"],
      "properties": {
        "componentsScanned": {
          "type": "integer",
          "minimum": 0,
          "description": "Total components analyzed"
        },
        "violations": {
          "type": "integer",
          "minimum": 0,
          "description": "Total critical violations"
        },
        "warnings": {
          "type": "integer",
          "minimum": 0,
          "description": "Total warnings"
        },
        "exceptions": {
          "type": "integer",
          "minimum": 0,
          "description": "Total approved exceptions"
        },
        "duplications": {
          "type": "integer",
          "minimum": 0,
          "description": "Total duplicate component pairs"
        },
        "tokenCoverage": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "description": "Token usage coverage (0-1)"
        }
      }
    },
    "violations": {
      "type": "array",
      "description": "Critical violations list",
      "items": {
        "type": "object",
        "required": ["type", "severity", "component", "message"],
        "properties": {
          "type": {
            "type": "string",
            "enum": ["HARDCODED_COLOR", "MAGIC_NUMBER", "INLINE_STYLE", "DESKTOP_FIRST", "TYPE_LEAK", "DUPLICATE_COMPONENT"]
          },
          "severity": {
            "type": "string",
            "enum": ["critical", "high", "medium", "low"]
          },
          "component": {
            "type": "string",
            "description": "Component file path"
          },
          "line": {
            "type": "integer",
            "description": "Line number"
          },
          "message": {
            "type": "string",
            "description": "Human-readable violation description"
          },
          "fix": {
            "type": "string",
            "description": "Suggested fix"
          }
        }
      }
    },
    "warnings": {
      "type": "array",
      "description": "Warnings list",
      "items": {
        "type": "object",
        "required": ["type", "component", "message"],
        "properties": {
          "type": {
            "type": "string",
            "enum": ["TEMPORARY_HARDCODE", "LEGACY_COMPONENT", "MISSING_TOKEN", "PARTIAL_COVERAGE"]
          },
          "component": {
            "type": "string"
          },
          "line": {
            "type": "integer"
          },
          "message": {
            "type": "string"
          }
        }
      }
    },
    "recommendations": {
      "type": "array",
      "description": "Improvement recommendations",
      "items": {
        "type": "object",
        "required": ["priority", "category", "description"],
        "properties": {
          "priority": {
            "type": "string",
            "enum": ["p0", "p1", "p2", "p3"]
          },
          "category": {
            "type": "string",
            "enum": ["performance", "maintainability", "accessibility", "consistency"]
          },
          "description": {
            "type": "string"
          },
          "estimatedEffort": {
            "type": "string",
            "description": "e.g., '2 hours', '1 day'"
          }
        }
      }
    }
  }
}
```

---

## B. Component Inventory

**File:** `.audit/component-inventory.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Component Inventory",
  "type": "object",
  "required": ["components"],
  "properties": {
    "generatedAt": {
      "type": "string",
      "format": "date-time"
    },
    "components": {
      "type": "array",
      "description": "List of all components with metadata",
      "items": {
        "type": "object",
        "required": ["name", "path", "linesOfCode", "propsCount", "usesTokens", "responsiveStrategy"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Component name"
          },
          "path": {
            "type": "string",
            "description": "Full file path"
          },
          "linesOfCode": {
            "type": "integer",
            "minimum": 0,
            "description": "Total lines of code"
          },
          "propsCount": {
            "type": "integer",
            "minimum": 0,
            "description": "Number of props"
          },
          "usesTokens": {
            "type": "boolean",
            "description": "Whether component uses design tokens"
          },
          "inlineStyles": {
            "type": "boolean",
            "description": "Whether component has inline styles"
          },
          "responsiveStrategy": {
            "type": "string",
            "enum": ["mobile-first", "desktop-first", "none", "mixed"]
          },
          "heavy": {
            "type": "boolean",
            "description": "Whether component is heavy (>300 LOC or complex)"
          },
          "memoized": {
            "type": "boolean",
            "description": "Whether component uses memo optimization"
          },
          "tokenCoverage": {
            "type": "number",
            "minimum": 0,
            "maximum": 1,
            "description": "Token coverage percentage (0-1)"
          },
          "exceptions": {
            "type": "array",
            "description": "List of approved exceptions for this component",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  }
}
```

---

## C. Exception Registry

**File:** `.audit/design-exceptions.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Design Exception Registry",
  "type": "object",
  "required": ["exceptions", "generatedAt"],
  "properties": {
    "generatedAt": {
      "type": "string",
      "format": "date-time"
    },
    "exceptions": {
      "type": "array",
      "description": "List of approved design exceptions",
      "items": {
        "type": "object",
        "required": ["id", "component", "reason", "annotation", "status"],
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique exception ID"
          },
          "component": {
            "type": "string",
            "description": "Component file path"
          },
          "line": {
            "type": "integer",
            "description": "Line number"
          },
          "reason": {
            "type": "string",
            "enum": ["DYNAMIC_VALUE", "VENDOR_CONSTRAINT", "SYSTEM_HOOK", "COLOR_PICKER", "CHART_LIBRARY", "THEME_PREVIEW"],
            "description": "Why this exception is allowed"
          },
          "annotation": {
            "type": "string",
            "description": "@design-exception annotation text"
          },
          "expiry": {
            "type": "string",
            "format": "date",
            "description": "Review date (YYYY-MM-DD)"
          },
          "owner": {
            "type": "string",
            "description": "Team or person responsible"
          },
          "status": {
            "type": "string",
            "enum": ["active", "expired", "pending-review"],
            "description": "Current exception status"
          }
        }
      }
    }
  }
}
```

---

## D. Duplication Matrix

**File:** `.audit/component-duplications.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Component Duplication Matrix",
  "type": "object",
  "required": ["generatedAt", "duplications"],
  "properties": {
    "generatedAt": {
      "type": "string",
      "format": "date-time"
    },
    "duplications": {
      "type": "array",
      "description": "List of duplicate component pairs",
      "items": {
        "type": "object",
        "required": ["componentA", "componentB", "similarityScore", "recommendedAction"],
        "properties": {
          "componentA": {
            "type": "string",
            "description": "First component path"
          },
          "componentB": {
            "type": "string",
            "description": "Second component path"
          },
          "similarityScore": {
            "type": "number",
            "minimum": 0,
            "maximum": 1,
            "description": "Similarity score (0-1, higher = more similar)"
          },
          "diff": {
            "type": "string",
            "description": "Brief description of differences"
          },
          "recommendedAction": {
            "type": "string",
            "enum": ["merge", "refactor", "abstract", "keep-separate", "investigate"],
            "description": "Suggested action"
          },
          "estimatedSavings": {
            "type": "string",
            "description": "Potential LOC/complexity savings"
          }
        }
      }
    }
  }
}
```

---

## E. Token Coverage Report

**File:** `.audit/token-coverage-report.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Token Coverage Report",
  "type": "object",
  "required": ["generatedAt", "summary", "tokenUsage", "componentCoverage"],
  "properties": {
    "generatedAt": {
      "type": "string",
      "format": "date-time"
    },
    "summary": {
      "type": "object",
      "properties": {
        "totalTokens": {
          "type": "integer",
          "description": "Total defined tokens"
        },
        "usedTokens": {
          "type": "integer",
          "description": "Tokens actually used in components"
        },
        "coverage": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "description": "Overall coverage percentage"
        }
      }
    },
    "tokenUsage": {
      "type": "object",
      "description": "Token usage count per token",
      "additionalProperties": {
        "type": "integer"
      }
    },
    "componentCoverage": {
      "type": "array",
      "description": "Per-component token coverage",
      "items": {
        "type": "object",
        "required": ["component", "coverage", "unusedTokens"],
        "properties": {
          "component": {
            "type": "string"
          },
          "coverage": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
          },
          "unusedTokens": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  }
}
```

---

## F. Migration Manifest (Isolate Mode)

**File:** `.audit/migration-manifest.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Migration Manifest",
  "type": "object",
  "required": ["generatedAt", "mode", "sourceComponents", "extractedPath"],
  "properties": {
    "generatedAt": {
      "type": "string",
      "format": "date-time"
    },
    "mode": {
      "type": "string",
      "enum": ["isolate", "assist-fix"]
    },
    "sourceComponents": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "extractedPath": {
      "type": "string",
      "description": "Path to isolated extraction folder"
    },
    "changes": {
      "type": "array",
      "description": "List of changes applied during normalization",
      "items": {
        "type": "object",
        "required": ["component", "changeType", "description"],
        "properties": {
          "component": {
            "type": "string"
          },
          "changeType": {
            "type": "string",
            "enum": ["token-normalized", "mobile-first-fixed", "inline-style-removed", "responsive-added"]
          },
          "description": {
            "type": "string"
          },
          "original": {
            "type": "string"
          },
          "normalized": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-23 | Initial release |

---

**Version:** 1.0.0
**Last Updated:** 2025-12-23
**Status:** Authoritative
