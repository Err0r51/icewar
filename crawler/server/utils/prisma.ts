import type { Post } from '@icewar/prisma'
import { PrismaClient } from '@icewar/prisma'

const prisma = new PrismaClient()

async function writetodb(postData: Omit<Post, 'id' | 'createdAt'>) {
  try {
    await prisma.post.upsert({
      where: { Url: postData.Url },
      update: {},
      create: postData,
    })
    // TODO: remove console.log
    // eslint-disable-next-line no-console
    console.log(`Successfully upserted post: ${postData.title}`)
  }
  catch (error) {
    console.error(`Error upserting post: ${postData.title}`, error)
  }
}

export { prisma, writetodb }
