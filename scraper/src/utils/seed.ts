import { PrismaClient } from '@icewar/prisma'

const prisma = new PrismaClient()

async function main() {
  const posts = [
    {
      title: 'China’s Defense Spending: The $700 Billion Distraction',
      Url: 'https://warontherocks.com/2024/09/chinas-defense-spending-the-700-billion-distraction/',
      memberonly: false,
    },
    {
      title: 'Mid-Afternoon Map: Hubris Over Ice',
      Url: 'https://warontherocks.com/2024/08/mid-afternoon-map-hubris-over-ice/',
      memberonly: false,
    },
    {
      title: 'When it Comes to Weaponry, Lethality Is Not Enough',
      Url: 'https://warontherocks.com/2024/08/when-it-comes-to-weaponry-lethality-is-not-enough/',
      memberonly: false,
    },
    {
      title: 'Rewind and Reconnoiter: A Europeanized NATO? The Alliance Contemplates the Trump Era and Beyond with Sten Rynning',
      Url: 'https://warontherocks.com/2024/08/rewind-and-reconnoiter-a-europeanized-nato-the-alliance-contemplates-the-trump-era-and-beyond-with-sten-rynning/',
      memberonly: false,
    },
    {
      title: 'What is an Italian Carrier Strike Group Doing in the Indo-Pacific?',
      Url: 'https://warontherocks.com/2024/08/what-is-an-italian-carrier-strike-group-doing-in-the-indo-pacific/',
      memberonly: false,
    },
  ]

  for (const post of posts) {
    await prisma.post.upsert({
      where: { Url: post.Url },
      update: {},
      create: post,
    })
  }

  // eslint-disable-next-line no-console
  console.log('Seed data has been inserted')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
