# Data Table Component

Full-featured data table with sorting, filtering, pagination, row selection, bulk actions, and export functionality.

## Features

- **Sortable Columns** - Click headers to sort ascending/descending
- **Filterable Rows** - Filter data by any column
- **Pagination** - Built-in pagination controls
- **Row Selection** - Checkbox selection with select all
- **Bulk Actions** - Action bar for selected items
- **Export** - Export to CSV or JSON
- **Mobile Responsive** - Horizontal scroll on small screens
- **100% Design Token Compliant** - No hardcoded values

## Installation

Copy all files from this staging folder to your project:

```bash
cp -r /coordinator/staging/agent-2/data-table-component/* /components/ui/data-table/
```

## Usage

### Basic Example

```tsx
import { DataTable } from "@/components/ui/data-table"
import type { Column } from "@/components/ui/data-table"

interface User {
  id: string
  name: string
  email: string
  role: string
}

const columns: Column<User>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    cell: (user) => <span>{user.name}</span>,
  },
  {
    key: "email",
    header: "Email",
    sortable: true,
    cell: (user) => <span>{user.email}</span>,
  },
  {
    key: "role",
    header: "Role",
    cell: (user) => <span>{user.role}</span>,
  },
]

function UserTable({ users }: { users: User[] }) {
  return (
    <DataTable
      idKey="id"
      columns={columns}
      data={users}
    />
  )
}
```

### With Sort

```tsx
import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { SortState } from "@/components/ui/data-table"

function UserTable({ users }) {
  const [sort, setSort] = useState<SortState>({
    key: "name",
    direction: "asc",
  })

  return (
    <DataTable
      idKey="id"
      columns={columns}
      data={users}
      sort={sort}
      onSortChange={setSort}
    />
  )
}
```

### With Selection & Bulk Actions

```tsx
import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { SelectionState, BulkAction } from "@/components/ui/data-table"

const bulkActions: BulkAction[] = [
  {
    key: "delete",
    label: "Delete",
    destructive: true,
    onClick: (selected) => deleteUsers(selected),
  },
  {
    key: "activate",
    label: "Activate",
    onClick: (selected) => activateUsers(selected),
  },
]

function UserTable({ users }) {
  const [selection, setSelection] = useState<SelectionState>({
    selected: new Set(),
    allSelected: false,
    someSelected: false,
  })

  return (
    <DataTable
      idKey="id"
      columns={columns}
      data={users}
      selectable
      selection={selection}
      onSelectionChange={setSelection}
      bulkActions={bulkActions}
    />
  )
}
```

### With Pagination

```tsx
import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { PaginationState } from "@/components/ui/data-table"

function UserTable({ users }) {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: users.length,
  })

  return (
    <DataTable
      idKey="id"
      columns={columns}
      data={users}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
```

### With Export

```tsx
import { useExport } from "@/components/ui/data-table"

function UserTable({ users, columns }) {
  const { exportToCSV, exportToJSON } = useExport({
    data: users,
    columns: columns,
    filename: "users-export",
  })

  return (
    <>
      <button onClick={exportToCSV}>Export CSV</button>
      <button onClick={exportToJSON}>Export JSON</button>
      <DataTable idKey="id" columns={columns} data={users} />
    </>
  )
}
```

## Column Definition

```tsx
interface Column<T> {
  key: string              // Unique key for the column
  header: string | ReactNode  // Column header
  cell: (item: T, index: number) => ReactNode  // Cell renderer
  sortable?: boolean       // Enable sorting
  width?: string          // Column width
  sticky?: "left" | "right"  // Sticky column
  className?: string      // CSS class
}
```

## Props

### DataTable

```tsx
<DataTable
  idKey="id"                          // Unique identifier
  columns={columns}                   // Column definitions
  data={data}                        // Table data
  sort={sort}                        // Sort state
  onSortChange={setSort}             // Sort handler
  selectable={true}                  // Enable selection
  selection={selection}              // Selection state
  onSelectionChange={setSelection}   // Selection handler
  pagination={pagination}            // Pagination state
  onPaginationChange={setPagination} // Pagination handler
  bulkActions={actions}              // Bulk actions
  isLoading={false}                  // Loading state
  emptyMessage="No data"             // Empty state message
  height="400px"                     // Table height
  className=""                       // CSS class
/>
```

## Sort Options

- Click column header to sort
- Click again to reverse direction
- Click third time to remove sort

## Design Token Compliance

All components use design tokens exclusively:

```tsx
// Colors
className="text-[var(--fg)] bg-[var(--bg)]"
className="border-[var(--fg-10)]"
className="text-[var(--color-primary)]"

// Spacing
className="px-[var(--spacing-md)] py-[var(--spacing-sm)]"

// Typography
className="text-[var(--font-size-sm)] font-semibold"

// Border Radius
className="rounded-[var(--radius-lg)]"
```

## File Structure

```
data-table-component/
├── DataTable.tsx     # Main table component
├── useExport.ts       # Export hook
├── example.tsx        # Usage example
├── types.ts           # TypeScript types
├── index.ts           # Export barrel
└── README.md          # This file
```

## Accessibility

- Semantic HTML table structure
- ARIA labels for actions
- Keyboard navigation
- Focus indicators
- Screen reader friendly

## Responsive Design

- Mobile: Horizontal scroll
- Sticky columns for context
- Responsive pagination

## Export Formats

- **CSV** - Comma-separated values
- **JSON** - Structured JSON data

---

*Generated for Shadi V2 - Restaurant Discovery Platform*
*Task #011 - Data Table Component*
