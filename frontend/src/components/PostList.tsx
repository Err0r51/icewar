import { useEffect, useState } from 'react'
import axios from 'axios'
import useSearch from './useSearch'
import { columns } from './post-table/columns'
import { DataTable } from './post-table/data-table'
import { env } from '@/env'
import type { Post } from '@/types'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const apiUrl = env.VITE_API_URL


// Modify the fetchPosts function to return totalPosts along with the posts
async function fetchPosts(pageIndex: number, pageSize: number): Promise<{ posts: Post[], totalPosts: number }> {
  const offset = pageIndex * pageSize
  const response = await axios.get<{ posts: Post[], totalPosts: number }>(`${apiUrl}/feed`, {
    params: { limit: pageSize, offset },
  })
  const { posts, totalPosts } = response.data
  return { posts, totalPosts }
}

export default function PostList() {
  const { results, searchTerm } = useSearch() // Get search term and results from context
  const [data, setData] = useState<Post[]>([]) // Data from the API
  const [pageIndex, setPageIndex] = useState(0) // Current page index
  const [pageSize] = useState(10) // Rows per page
  const [pageCount, setPageCount] = useState(0) // Total number of pages
  const [loading, setLoading] = useState(false)
  const [freeArticlesOnly, setFreeArticlesOnly] = useState(false)

  // Fetch posts when the page index changes
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      try {
        const { posts, totalPosts } = await fetchPosts(pageIndex, pageSize)
        setData(posts)
        setPageCount(Math.ceil(totalPosts / pageSize)) // Calculate total pages
      }
      catch (error) {
        console.error('Failed to fetch posts:', error)
      }
      finally {
        setLoading(false)
      }
    }
    if (!results.length) {
      loadPosts()
    }

    loadPosts()
  }, [pageIndex, pageSize, searchTerm, results])

  const handleRowClick = (row: Post) => {
    if (row.Url) {
    // Open the post in a new tab
      window.open(row.Url, '_blank')
    }
    else {
      console.error('No URL available for this post')
    }
  }

  // Handler to change the page (triggered by DataTable)
  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex) // This will trigger the useEffect to fetch the new page
  }

  const filteredData = freeArticlesOnly ? data.filter(post => !post.memberonly) : data

  // If there are search results, show them instead of the API data
  const displayData = results.length > 0 ? results : filteredData

  const toggleFreeArticlesOnly = () => {
    setFreeArticlesOnly(!freeArticlesOnly)
  }

  return (
    <div className="container mx-auto pb-10 pt-5">
      <div className="flex justify-end mb-4">
        <label className="flex items-center space-x-2">
          <Switch
            checked={freeArticlesOnly}
            onCheckedChange={toggleFreeArticlesOnly}
            className="data-[state=checked]:bg-primary"
            id="free-articles-only"
          />
          <Label htmlFor="free-articles-only">Free Articles Only</Label>
        </label>
      </div>
      <DataTable
        columns={columns}
        data={displayData}
        pageCount={pageCount}
        pageIndex={pageIndex}
        onPageChange={handlePageChange}
        loading={loading}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
