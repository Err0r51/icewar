import { Post } from '@prisma/client';

interface ISearchQueryString {
    query: string
    orderBy: 'title' | 'createdAt' | null
  }
  
interface FeedRequestQuery {
    cursor?: string;
  }


export interface ErrorResponse {
    error: string;
  }
  
export interface SearchResponse {
    posts: Post[];
  }
  
export interface FeedResponse {
    posts: Post[];
    cursor: number | null;
  }

export { ISearchQueryString, FeedRequestQuery }