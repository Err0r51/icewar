import type { Post } from '@icewar/prisma'

interface ISearchQueryString {
  query: string
  orderBy: 'title' | 'createdAt' | null
}

interface FeedRequestQuery {
  limit?: string
  offset?: string
  search?: string
}

export interface ErrorResponse {
  error: string
}

export interface SearchResponse {
  posts: Post[]
}

export interface FeedResponse {
  posts: Post[]
  cursor: number | null
}

export { ISearchQueryString, FeedRequestQuery }
