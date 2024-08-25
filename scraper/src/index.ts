import { webServer } from '@/server.js'
import { scrapeAndStore } from '@/scraper.js'

scrapeAndStore()

// Schedule the scraper to run once every hour (3600 seconds)
setInterval(scrapeAndStore, 1 * 60 * 60 * 1000)

webServer()
