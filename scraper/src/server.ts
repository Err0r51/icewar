/* eslint-disable no-console */
import dotenv from 'dotenv'
import { PrismaClient } from '@icewar/prisma'
import type { Post } from '@icewar/prisma'
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit';


import { FeedRequestQuery, ISearchQueryString } from './types.js'

dotenv.config()


const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'; // Fallback to localhost if not provided


const prisma = new PrismaClient()

const PORT = process.env.PORT || 3000
const TAKE = Number(process.env.TAKE) || 5

async function webServer() {
  const app: FastifyInstance = Fastify({ logger: true })
  
  await app.register(rateLimit, {
    max: 60, 
    timeWindow: '1 minute', 
    ban: 5 
  });
  
  await app.register(cors, {
    origin: allowedOrigin,
    methods: ['GET'],
  }, )

  app.get<{ Querystring: ISearchQueryString }>('/search', async (req: FastifyRequest<{ Querystring: ISearchQueryString }>, res: FastifyReply) => {
    const { query, orderBy } = req.query

    if (!query) {
      return res.status(400).send({ error: 'query is required' })
    }

    const or = {
      OR: [
        { title: { contains: query } },
      ],
    }

    const posts: Post[] = await prisma.post.findMany({
      take: TAKE,
      where: {
        ...or,
      },
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    })

    res.send(posts)
  })

  app.get('/feed', async (req: FastifyRequest<{ Querystring: FeedRequestQuery }>, res: FastifyReply) => {
    try {
      const { limit = '10', offset = '0', search } = req.query;
  
      // Set the pagination parameters
      const paginationLimit = parseInt(limit);
      const paginationOffset = parseInt(offset);
  
      // Define the base query
      const queryOptions: any = {
        take: paginationLimit,
        skip: paginationOffset,
        orderBy: { createdAt: 'desc' },
      };
  
      // If search is provided, apply a filter to search within post titles or other fields
      if (search) {
        queryOptions.where = {
              title: { contains: search, mode: 'insensitive' }, // Search in title (case-insensitive)
        };
      }
  
      // Fetch the posts from the database
      const posts = await prisma.post.findMany(queryOptions);

      // TODO: make more efficient -> one call to get count and posts
      // Fetch the total number of posts for pagination calculation
      const totalPosts = await prisma.post.count({
        where: search ? { title: { contains: search, mode: 'insensitive' } } : {},
      });
  
  
      // Send the response with posts and pagination info
      res.send({
        posts,
        totalPosts,
        limit: paginationLimit,
        offset: paginationOffset,
      });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch posts' });
    }
  });

  try {
    await app.listen({ port: Number(PORT), host: '0.0.0.0' })
    console.log(`🚀 Server running at http://localhost:${PORT}/`)
  }
  catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

export { webServer }