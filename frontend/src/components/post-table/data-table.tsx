import type {
  ColumnDef,
  PaginationState,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Pagination } from './pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pageIndex: number
  onPageChange: (newPageIndex: number) => void
  loading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  onPageChange,
  loading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Enable server-side pagination
    pageCount, // Provide the total number of pages
    state: {
      pagination: {
        pageIndex, // Use pageIndex from parent
        pageSize: 10, // Number of rows per page
      },
    },
    onPaginationChange: (updaterOrValue) => {
      // Check if `updaterOrValue` is a function (the "updater" case)
      if (typeof updaterOrValue === 'function') {
        // If it's a function, call it with the current pagination state
        const newPaginationState = updaterOrValue({ pageIndex, pageSize: 10 });
        onPageChange(newPaginationState.pageIndex); // Trigger page change
      } else {
        // If it's not a function, it's the new state (the "direct value" case)
        onPageChange(updaterOrValue.pageIndex); // Trigger page change with the new pageIndex
      }
    },
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} pageCount={pageCount} />
    </div>
  )
}
