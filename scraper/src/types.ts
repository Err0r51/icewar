interface ISearchQueryString {
    query: string
    orderBy: 'title' | 'createdAt' | null
  }
  
  interface FeedRequestQuery {
    cursor?: string;
  }

export { ISearchQueryString, FeedRequestQuery }