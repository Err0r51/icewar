import type { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageCount: number
}

export function Pagination<TData>({
  table,
  pageCount,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page
          {' '}
          {table.getState().pagination.pageIndex + 1}
          {' '}
          of
          {' '}
          {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to previous page"
            variant="outline"
            className="w-20 p-0"

            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            aria-label="Go to next page"
            variant="default"
            className="w-20 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
