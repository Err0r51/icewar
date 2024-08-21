/* eslint-disable no-console */
import axios from 'axios'
import * as cheerio from 'cheerio'
import type { Cheerio, CheerioAPI, Element } from 'cheerio'
import { PrismaClient } from '@prisma/client'
import type { Post } from '@prisma/client'

const prisma = new PrismaClient()

const url = 'https://warontherocks.com/'
const AxiosInstance = axios.create({
  baseURL: url,
})

async function scrapeAndStore() {
  try {
    const response = await AxiosInstance.get('/')
    const html = response.data
    const $: CheerioAPI = cheerio.load(html as string)
    const latestPostsDiv: Cheerio<Element> = $('body > div.main > div.wrapper > div.latest-posts')
    const articles: Cheerio<Element> = latestPostsDiv.find('div.box--full, div.box--half')

    articles.each((_: number, element: Element) => {
      const title = $(element).find('h2 a, h3 a').text()
      const link = $(element).find('h2 a, h3 a').attr('href')

      console.log(`Title: ${title}`)
      console.log(`Link: ${link}`)

      if (title && link) {
        writetodb({
          title,
          Url: link,
          memberonly: false,
        }).catch((error) => {
          console.error(`Failed to write to DB for link: ${link}`, error)
        })
      }
    })
  }
  catch (error) {
    console.error('Failed to fetch the webpage:', error)
  }
}

async function writetodb(postData: Omit<Post, 'id' | 'createdAt'>) {
  try {
    await prisma.post.upsert({
      where: { Url: postData.Url },
      update: {},
      create: postData,
    })
    console.log(`Successfully upserted post: ${postData.title}`)
  }
  catch (error) {
    console.error(`Error upserting post: ${postData.title}`, error)
  }
}

scrapeAndStore()

setInterval(scrapeAndStore, 3 * 60 * 60 * 1000)
