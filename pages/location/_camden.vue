<template>
  <section class="section">
    <Title title="CAMDEN"/>
    <h2>below title</h2>
    <div class="columns is-mobile">
      <!--<div-->
      <!--v-for="(feature, i) of features"-->
      <!--:key="i"-->
      <!--class="column">-->
      <!--<div class="card">-->
      <!--<header class="card-header">-->
      <!--<p class="card-header-title has-text-grey">-->
      <!--{{ feature.title }}xx-->
      <!--</p>-->
      <!--</header>-->
      <!--<div class="card-content">-->
      <!--<div class="content has-text-centered">-->
      <!--<b-icon-->
      <!--:icon="feature.icon"-->
      <!--size="is-large"-->
      <!--type="is-primary"/>-->
      <!--</div>-->
      <!--</div>-->
      <!--<footer class="card-footer">-->
      <!--<div-->
      <!--class="card-footer-item"-->
      <!--v-html="feature.content"/>-->
      <!--</footer>-->
      <!--</div>-->
      <!--</div>-->
    </div>
  </section>
</template>

<script>
import axios from 'axios'

import BLogo from '@/components/Logo'
import Title from '@/components/Title'

export default {
  name: 'ShowMeAGoodTime',
  components: { Title },
  data() {
    return {
      results: null,
      url: null,
      position: null
    }
  },
  async asyncData({ app, isServer }) {
    console.log('process.env', process.env)
    const url = `${process.env.FOUR_SQUARE_URL}venues/explore?client_id=${
      process.env.FOUR_SQUARE_CLIENT_ID
    }&client_secret=${process.env.FOUR_SQUARE_CLIENT_SECRET}&`
    console.log('url', url)
    if (isServer) {
      beforeNuxtRender(({ nuxtState }) => {
        console.log('nuxtState', nuxtState)
        nuxtState.test = true
      })
    }
    return { url }
  },
  // https://nuxtjs.org/api/configuration-generate/
  generate: {
    routes: function(callback) {
      const url = `${process.env.FOUR_SQUARE_URL}venues/explore?client_id=${
        process.env.FOUR_SQUARE_CLIENT_ID
      }&client_secret=${process.env.FOUR_SQUARE_CLIENT_SECRET}&`
      axios
        .get(url)
        .then(res => {
          const routes = res.data.map(user => {
            return '/users/' + user.id
          })
          callback(null, routes)
        })
        .catch(callback)
    }
  },
  async mounted() {
    const position = await new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position.coords.latitude, position.coords.longitude)
        res(position)
      })
    })
    // console.log('position', position)
    // console.log('this', this)
    this.url += `ll=${position.coords.latitude},${
      position.coords.longitude
    }&v=20190101&section=topPicks`
    // console.log('url', this.url)
    this.results = await this.$axios.get(this.url)
    // console.log('this.results', this.results)
  }
}
</script>
