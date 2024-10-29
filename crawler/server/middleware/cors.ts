import { env } from '~~/env'

const corsConfig = {
  origins: [env.CORS_ORIGIN, env.CORS_ORIGIN_CUSTOM_DOMAIN],
  default: env.CORS_ORIGIN, // Fallback origin if request origin is not allowed
}

export default defineEventHandler((event) => {
  const requestOrigin = event.node.req.headers.origin?.toLowerCase()

  // Determine the allowed origin for the response header
  const allowOrigin = corsConfig.origins.includes(requestOrigin) ? requestOrigin : corsConfig.default

  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.statusMessage = 'No Content.'
    return 'OK'
  }

  // Set CORS headers based on the determined origin
  setResponseHeaders(event, {
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  })
})
