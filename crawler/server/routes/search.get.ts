import { getQuery, sendError } from 'h3'
import type { ISearchQueryString } from '~/utils/types.js' // fix imports
import { prisma } from '~/utils/prisma'

const TAKE = 10

export default eventHandler(async (event) => { // arrow async function
  const query = getQuery(event) as ISearchQueryString
  const { query: searchQuery, orderBy } = query

  if (!searchQuery) {
    // Send 400 error response if the query is missing
    return sendError(event, createError({ statusCode: 400, statusMessage: 'query is required' }))
  }

  // Construct Prisma filter condition for search
  const or = {
    OR: [
      { title: { contains: searchQuery } },
    ],
  }

  // Fetch posts using Prisma
  const posts = await prisma.post.findMany({
    take: TAKE,
    where: {
      ...or,
    },
    orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
  })

  // Return posts as the response
  return posts
})
