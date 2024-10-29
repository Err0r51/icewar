import { env } from '~~/env'

export default defineEventHandler((event) => {
  const requestOrigin = event.node.req.headers.origin
  const allowedOrigins = [env.CORS_ORIGIN, env.CORS_ORIGIN_CUSTOM_DOMAIN]

  // Check if the request's origin is in the list of allowed origins
  const allowOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : ''

  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.statusMessage = 'No Content.'
    return 'OK'
  }

  setResponseHeaders(event, {
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
    // "Access-Control-Allow-Headers": '*',
    // "Access-Control-Expose-Headers": '*'
  })
})
