const Koa = require('koa')
const { search, reviews } = require('./api')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(async ctx => {
    if (ctx.req.method === 'GET' && /api/.test(ctx.req.url)) {
      if (ctx.req.url.indexOf('/search') >- - 1) {
        console.log('SEARCH BIZ')
        ctx.body = await search(ctx)
        return
      } else if (ctx.req.url.indexOf('/reviews') > -1) {
        console.log('GET REVIEW BIZ')
        ctx.body = await reviews(ctx)
        return
      }
    }

    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
