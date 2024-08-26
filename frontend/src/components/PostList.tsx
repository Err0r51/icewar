import { Component } from 'react'
import axios from 'axios'
import type { Post } from '../types'

interface PostListState {
  posts: Post[]
  cursor: string | null
  hasMore: boolean
  page: number
  cursors: (string | null)[]
}

class PostList extends Component<{}, PostListState> {
  state: PostListState = {
    posts: [],
    cursor: null,
    hasMore: true,
    page: 1,
    cursors: [null], // Store cursors for each page
  }

  componentDidMount() {
    this.fetchPosts()
  }

  fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/feed', {
        params: { cursor: this.state.cursor },
      })
      // TODO: Global response type from Backend
      this.setState(prevState => ({
        posts: response.data.posts,
        cursor: response.data.cursor,
        hasMore: response.data.cursor !== null,
        cursors: [...prevState.cursors.slice(0, prevState.page), response.data.cursor],
      }))
    }
    catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  handleNextPage = () => {
    if (this.state.hasMore) {
      this.setState(
        prevState => ({
          page: prevState.page + 1,
          cursor: prevState.cursors[prevState.page], // Update cursor for the next page
        }),
        this.fetchPosts,
      )
    }
  }

  handlePreviousPage = () => {
    if (this.state.page > 1) {
      this.setState(
        prevState => ({
          page: prevState.page - 1,
          cursor: prevState.cursors[prevState.page - 2], // Update cursor for the previous page
        }),
        this.fetchPosts,
      )
    }
  }

  render() {
    const { posts, page, hasMore } = this.state

    if (!posts.length) {
      return <div>No results found</div>
    }

    return (
      <div className="flex-auto items-center">
        <ul>
          {posts.map(post => (
            <PostObj post={post} key={post.id} />
          ))}
        </ul>
        <div>
          {this.state.page > 1
          && (
            <button type="button" onClick={this.handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
          )}
          <button type="button" onClick={this.handleNextPage} disabled={!hasMore}>
            Next
          </button>
        </div>
      </div>
    )
  }
}

function PostObj({ post }: { post: Post }) {
  return (
    <li>
      <a href={post.Url} target="_blank" rel="noreferrer">
        <strong>{post.title}</strong>
      </a>
    </li>
  )
}

export default PostList
