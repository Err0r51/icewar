// module path alias (@/*) isn't being properly resolved in the built JavaScript files
console.log(import.meta.resolve('@icewar/prisma'));
import { webServer } from './server.js'
import { scrapeAndStore } from './scraper.js'

scrapeAndStore()

// Schedule the scraper to run once every hour (3600 seconds)
setInterval(scrapeAndStore, 1 * 60 * 60 * 1000)

webServer()
