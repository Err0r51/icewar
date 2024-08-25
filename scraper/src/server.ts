/* eslint-disable no-console */
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'

dotenv.config()

const prisma = new PrismaClient()

const PORT = process.env.PORT || 3000
const TAKE = Number(process.env.TAKE) || 10

async function webServer() {
  const app: FastifyInstance = Fastify({ logger: true })
  
  app.register(cors, {
    // TODO: Update this to only allow the frontend URL
    origin: '*', // Allow all origins
  })

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

    const posts = await prisma.post.findMany({
      take: TAKE,
      where: {
        ...or,
      },
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    })

    res.send(posts)
  })

  app.get('/feed', async (req: FastifyRequest<{ Querystring: FeedRequestQuery }>, res: FastifyReply) => {
    const { cursor } = req.query
  
    const posts = await prisma.post.findMany({
      take: TAKE,
      skip: cursor ? 1 : 0, 
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { id: 'asc' },
    })
  
    const newCursor = posts.length > 0 ? posts[posts.length - 1]?.id : null
  
    res.send({ posts, cursor: newCursor })
  })

  try {
    await app.listen({ port: Number(PORT), host: '0.0.0.0' })
    console.log(`🚀 Server running at http://localhost:${PORT}/`)
  }
  catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

interface ISearchQueryString {
  query: string
  orderBy: 'title' | 'createdAt' | null
}

interface FeedRequestQuery {
  cursor?: string;
}

export { webServer }