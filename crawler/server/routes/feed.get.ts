import { getQuery, sendError } from 'h3'
import type { FeedRequestQuery } from '~/utils/types.js'
import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event) as FeedRequestQuery
    const { limit = '10', offset = '0', search } = query

    // Set the pagination parameters
    const paginationLimit = Number.parseInt(limit)
    const paginationOffset = Number.parseInt(offset)

    // Define the base query
    const queryOptions: any = {
      take: paginationLimit,
      skip: paginationOffset,
      orderBy: { createdAt: 'desc' },
    }

    // If search is provided, apply a filter to search within post titles or other fields
    if (search) {
      queryOptions.where = {
        title: { contains: search, mode: 'insensitive' }, // Case-insensitive search in title
      }
    }

    // Fetch the posts from the database
    const posts = await prisma.post.findMany(queryOptions)

    // Fetch the total number of posts for pagination calculation
    const totalPosts = await prisma.post.count({
      where: search ? { title: { contains: search, mode: 'insensitive' } } : {},
    })

    // Return the response with posts and pagination info
    return {
      posts,
      totalPosts,
      limit: paginationLimit,
      offset: paginationOffset,
    }
  }
  catch (error) {
    console.error(error)
    return sendError(event, createError({ statusCode: 503, statusMessage: 'Failed to fetch posts' }), true)
  }
})
