# NOVA Orchestration Commands

## How NOVA Coordinates Agents

### Command Pattern 1: Divide and Delegate
```
divide this task: [your task]
```

**Example:**
```
divide this task: Create restaurant delivery app with:
- Database design (Manager)
- Next.js frontend (Developer)
- Tech comparison (Researcher)
- CI/CD pipeline (Automator)
```

**NOVA will:**
1. Parse the task
2. Send to Manager Group: "Design database schema for restaurant delivery app"
3. Send to Developer Group: "Create Next.js frontend for restaurant delivery"
4. Send to Researcher Group: "Compare databases: PostgreSQL vs MongoDB for delivery app"
5. Send to Automator Group: "Set up GitHub Actions CI/CD for restaurant project"
6. Collect all responses
7. Consolidate and send back: "Here's the complete plan..."

### Command Pattern 2: Direct Agent Command
```
tell [agent]: [task]
```

**Examples:**
```
tell developer: audit /Users/ahmadabdullah/Desktop/restaurant-platform and report bugs
tell researcher: compare Next.js 14 vs 15 for new project
tell automator: run database backup script
tell manager: create project timeline for Q1 2026
```

### Command Pattern 3: Orchestrate All Agents
```
orchestrat: all agents [task]
```

**Example:**
```
orchestrat: all agents audit XMAD Ecosystem and report improvements
```

### Command Pattern 4: Status Check
```
status [agent|all]
```

**Examples:**
```
status developer
status all agents
```

## Task Templates

### Full Project Template
```
divide this project: [project name]
- Requirements: [Manager]
- Implementation: [Developer]
- Research: [Researcher]
- Automation: [Automator]
```

### Quick Audit Template
```
tell developer: audit [project path] and fix issues
tell researcher: find best practices for [topic]
tell automator: run tests for [project]
```

## Response Flow

1. **You** → Send task in NOVA Group
2. **NOVA** → Receives and parses
3. **NOVA** → Sends to each agent group
4. **Each Agent** → Processes and responds
5. **NOVA** → Collects all responses
6. **NOVA** → Consolidates and sends back to NOVA Group

## Important Notes

- NOVA responds in the group where the command was sent
- For cross-group coordination, always send commands in NOVA Group
- Each agent group works independently
- NOVA is the coordinator, not a worker
- Guardian-Orchestrator can be triggered for complex tasks via NOVA
