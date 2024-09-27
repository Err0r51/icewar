import { useEffect, useState } from 'react'
import axios from 'axios'
import { columns } from './post-table/columns'
import { DataTable } from './post-table/data-table'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Modify the fetchPosts function to return totalPosts along with the posts
async function fetchPosts(pageIndex: number, pageSize: number) {
  console.log('fetchPosts', pageIndex, pageSize)
  const offset = pageIndex * pageSize
  const response = await axios.get(`${apiUrl}/feed`, {
    params: { limit: pageSize, offset },
  })
  const { posts, totalPosts } = response.data // Get totalPosts from the API
  return { posts, totalPosts }
}

export default function PostList() {
  const [data, setData] = useState([]) // Data from the API
  const [pageIndex, setPageIndex] = useState(0) // Current page index
  const [pageSize] = useState(10) // Rows per page
  const [pageCount, setPageCount] = useState(0) // Total number of pages
  const [loading, setLoading] = useState(false)

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

    loadPosts()
  }, [pageIndex, pageSize])

  // Handler to change the page (triggered by DataTable)
  const handlePageChange = (newPageIndex: number) => {
    console.log('handlePageChange', newPageIndex)
    setPageIndex(newPageIndex) // This will trigger the useEffect to fetch the new page
  }

  return (
    <div className="container mx-auto pb-10 pt-5">
      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        pageIndex={pageIndex}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  )
}
