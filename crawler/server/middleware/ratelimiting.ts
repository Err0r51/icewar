import { defineEventHandler, createError, setResponseHeader, useStorage, getRequestIP } from '#imports'
import type { H3Event } from 'h3'

type StorageItem = {
  value: number,
  date: number
}

// Define global rate limiter configuration
type RateLimiterConfig = {
  tokensPerInterval: number;
  interval: number;
  throwError: boolean;
  headers: boolean;
}

// Define global rate limiter configuration
const rateLimiter: RateLimiterConfig = {
  tokensPerInterval: 100,
  interval: 60 * 1000, // in milliseconds (1 minute)
  throwError: true,
  headers: true
}

const storage = useStorage<StorageItem>('#rate-limiter-storage')

export default defineEventHandler(async (event) => {
  // Disable rate limiter in prerender mode
  if (import.meta.prerender) { 
    return 
  }

  const ip = getIP(event)
  const url = ip + event.node.req

  let storageItem = await storage.getItem(url) as StorageItem

  // Set initial storage item if none exists
  if (!storageItem) {
    await setStorageItem(rateLimiter, url)
  } else {
    const timeSinceFirstRateLimit = storageItem.date
    const timeForInterval = storageItem.date + rateLimiter.interval

    // Reset tokens if interval has passed
    if (Date.now() >= timeForInterval) {
      await setStorageItem(rateLimiter, url)
      storageItem = await storage.getItem(url) as StorageItem
    }

    // Check if rate limit has been exceeded
    const isLimited = timeSinceFirstRateLimit <= timeForInterval && storageItem.value === 0
    if (isLimited) {
      const tooManyRequestsError = {
        statusCode: 429,
        statusMessage: 'Too Many Requests'
      }

      if (rateLimiter.headers) {
        setResponseHeader(event, 'x-ratelimit-remaining', 0)
        setResponseHeader(event, 'x-ratelimit-limit', rateLimiter.tokensPerInterval)
        setResponseHeader(event, 'x-ratelimit-reset', timeForInterval)
      }

      if (rateLimiter.throwError) {
        throw createError(tooManyRequestsError)
      }
      return tooManyRequestsError
    }

    // Decrement token and update date if still within interval
    const newItemDate = timeSinceFirstRateLimit > timeForInterval ? Date.now() : storageItem.date
    const newStorageItem: StorageItem = { value: storageItem.value - 1, date: newItemDate }

    await storage.setItem(url, newStorageItem)

    // Set rate limit headers if enabled
    if (rateLimiter.headers) {
      setResponseHeader(event, 'x-ratelimit-remaining', newStorageItem.value)
      setResponseHeader(event, 'x-ratelimit-limit', rateLimiter.tokensPerInterval)
      setResponseHeader(event, 'x-ratelimit-reset', timeForInterval)
    }
  }
})

// Helper function to set initial storage item
async function setStorageItem(rateLimiter: RateLimiterConfig, url: string) {
  const rateLimitedObject: StorageItem = { value: rateLimiter.tokensPerInterval, date: Date.now() }
  await storage.setItem(url, rateLimitedObject)
}

// Helper function to get IP address
function getIP(event: H3Event) {
  return getRequestIP(event, { xForwardedFor: true }) || ''
}
