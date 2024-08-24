/* eslint-disable no-console */
import dotenv from 'dotenv'
import { PrismaClient, SortOrder } from '@prisma/client'
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

dotenv.config()

const prisma = new PrismaClient()
const process = require('node:process')

const PORT = process.env.PORT || 3000
const TAKE = Number(process.env.TAKE) || 10

interface IFeedQueryString {
  searchString: string | null
  orderBy: SortOrder | null
}

async function webServer() {
  const app: FastifyInstance = Fastify({ logger: true })

  app.get<{ Querystring: IFeedQueryString }>('/search', async (req: FastifyRequest<{ Querystring: IFeedQueryString }>, res: FastifyReply) => {
    const { searchString, orderBy } = req.query

    const or = searchString
      ? {
          OR: [
            { title: { contains: searchString } },
            { content: { contains: searchString } },
          ],
        }
      : {}

    const posts = await prisma.post.findMany({
      take: TAKE,
      where: {
        published: true,
        ...or,
      },
      orderBy: {
        updatedAt: orderBy || undefined,
      },
    })

    return posts
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

// Start the server
webServer()
