import type { ColumnDef } from '@tanstack/react-table'

import type { Post } from '@/types'

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Posted At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)
      return <div>{formattedDate}</div>
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'memberonly',
    header: 'Member Only',
  },

]
