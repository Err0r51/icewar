// https://nitro.unjs.io/config
import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  srcDir: 'server',
  preset: 'node-server',
  experimental: {
    tasks: true,
  },
  scheduledTasks: {
    '0 * * * *': ['scraper'],
  },
})
