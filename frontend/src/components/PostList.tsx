import { Component, useEffect, useState } from 'react'
import axios from 'axios'
import type { Post } from '../types'
import { columns } from './post-table/columns'
import { DataTable } from './post-table/data-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function getData(): Promise<Post[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      createdAt: new Date(),
      title: 'Post 1',
      Url: 'https://example.com',
      memberonly: false,
    },
    {
      id: 2,
      createdAt: new Date(),
      title: 'Post 2',
      Url: 'https://example.com',
      memberonly: false,
    },
    // ...
  ]
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData()
        setPosts(data)
        setLoading(false)
      }
      catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    fetchData()
  }, [])

  // const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={posts} />
    </div>
  )
}

// interface PostListState {
//   posts: Post[]
//   cursor: string | null
//   hasMore: boolean
//   page: number
//   cursors: (string | null)[]
// }

// class PostList extends Component<Record<string, never>, PostListState> {
//   state: PostListState = {
//     posts: [],
//     cursor: null,
//     hasMore: true,
//     page: 1,
//     cursors: [null], // Store cursors for each page
//   }

//   componentDidMount() {
//     this.fetchPosts()
//   }

//   fetchPosts = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/feed`, {
//         params: { cursor: this.state.cursor },
//       })
//       const { posts, cursor } = response.data
//       const hasMore = posts.length > 0 && cursor !== null
//       if (!hasMore) {
//         this.setState({ hasMore: false })
//       }
//       else {
//         this.setState(prevState => ({
//           posts: posts || [],
//           cursor,
//           hasMore,
//           cursors: [...prevState.cursors.slice(0, prevState.page), cursor],
//         }))
//       }
//     }
//     catch (error) {
//       console.error('Error fetching posts:', error)
//     }
//   }

//   handleNextPage = () => {
//     if (this.state.hasMore) {
//       this.setState(
//         prevState => ({
//           page: prevState.page + 1,
//           cursor: prevState.cursors[prevState.page], // Update cursor for the next page
//         }),
//         this.fetchPosts,
//       )
//     }
//   }

//   handlePreviousPage = () => {
//     if (this.state.page > 1) {
//       this.setState(
//         prevState => ({
//           page: prevState.page - 1,
//           cursor: prevState.cursors[prevState.page - 2], // Update cursor for the previous page
//         }),
//         this.fetchPosts,
//       )
//     }
//   }

//   render() {
//     const { posts, page, hasMore } = this.state

//     if (!posts.length) {
//       return <div>No results found</div>
//     }

//     return (
//       <div className="flex-auto items-center">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[100px]">Created At</TableHead>
//               <TableHead className="text-left">Title</TableHead>
//               <TableHead>Member only</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {posts.map(post => (
//               <TableRow key={post.id}>
//                 <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
//                 <a href={post.Url} style={{ textDecoration: 'none', color: 'inherit' }}>
//                   <TableCell>{post.title}</TableCell>
//                 </a>
//                 <TableCell>{post.memberonly ? 'Yes' : 'No'}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <div className="flex justify-center space-x-4 mt-4">
//           {this.state.page > 1
//           && (
//             <Button variant="outline" onClick={this.handlePreviousPage} disabled={page === 1}>
//               Prev
//             </Button>
//           )}
//           <Button onClick={this.handleNextPage} disabled={!hasMore}>
//             Next
//           </Button>
//         </div>
//       </div>
//     )
//   }
// }

// export default PostList
