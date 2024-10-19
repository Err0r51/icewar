/* eslint-disable no-console */
import * as cheerio from 'cheerio'
// @ts-expect-error - no types available for Element
import type { Cheerio, CheerioAPI, Element } from 'cheerio'
import { writetodb } from '~/utils/prisma'

// TODO: dont use dotenv in production

const url = 'https://warontherocks.com/'

export default defineTask({
  meta: {
    name: 'scraper',
    description: 'Run website scraper',
  },
  async run() {
    try {
      const response = await $fetch(url)
      const $: CheerioAPI = cheerio.load(response as string)
      const latestPostsDiv: Cheerio<Element> = $('body > div.main > div.wrapper > div.latest-posts')
      const articles: Cheerio<Element> = latestPostsDiv.find('div.box--full, div.box--half')

      articles.each((_: number, element: Element) => {
        let isMemberOnly = false
        const title = $(element).find('h2 a, h3 a').text()
        const link = $(element).find('h2 a, h3 a').attr('href')

        console.log(`Title: ${title}`)
        console.log(`Link: ${link}`)

        if (title.includes('Rewind and Reconnoiter') || title.includes('In Brief') || title.includes('Mid-Afternoon Map')) {
          isMemberOnly = true
        }

        console.log(`Is Member Only: ${isMemberOnly}`)

        if (title && link) {
          writetodb({
            title,
            Url: link,
            memberonly: isMemberOnly,
          }).catch((error) => {
            console.error(`Failed to write to DB for link: ${link}`, error)
          })
        }
      })
    }
    catch (error) {
      console.error('Failed to fetch the webpage:', error)
    }
    return { result: 'Success' }
  },
})
