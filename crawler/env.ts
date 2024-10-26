import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    // POSTGRES_USER: z.string().min(1),
    // POSTGRES_PASSWORD: z.string().min(1),
    // VITE_API_URL: z.string().url(),
    CORS_ORIGIN: z.string().min(1),
    CORS_ORIGIN_CUSTOM_DOMAIN: z.string().min(1),
    // COOLIFY_POSTGRES_USER: z.string().min(1),
    // COOLIFY_POSTGRES_PASSWORD: z.string().min(1),
    // COOLIFY_DATABASE_NAME: z.string().min(1),
    // COOLIFY_DATABASE_URL: z.string().url(),
    // CRAWLER_URL: z.string().url(),
  },
  // eslint-disable-next-line node/prefer-global/process
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
