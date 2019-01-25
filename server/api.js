const consola = require('consola')
require('isomorphic-fetch')
require('dotenv').config()

const options = {
  headers: {
    'Authorization': `Bearer ${process.env.YELP_API_KEY}`
  }
}
const search = async ctx => {
  const url = `${process.env.YELP_API_URL}/businesses/search?${ctx.querystring}`
  consola.info('url', url)

  const response = await fetch(url, options)
    .then(response => response.json())
    .catch(e => consola.error('e', e))
  return response
}

const reviews = async ctx => {
  consola.info('ctx.query', ctx.query)
  const url = `${process.env.YELP_API_URL}/businesses/${ctx.query.id}/reviews`
  consola.info('url', url)
  const response = await fetch(url, options).then(response => response.json())
  return response
}

module.exports = { search, reviews }
