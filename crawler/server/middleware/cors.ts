import { env } from "~~/env"

export default defineEventHandler((event) => {
    if (event.method === 'OPTIONS') {
        event.node.res.statusCode = 204
        event.node.res.statusMessage = "No Content."
        return 'OK'
    }
    setResponseHeaders(event, {
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Origin": env.CORS_ORIGIN,
        'Access-Control-Allow-Credentials': 'true',
        // "Access-Control-Allow-Headers": '*',
        // "Access-Control-Expose-Headers": '*'
    })
  
})
