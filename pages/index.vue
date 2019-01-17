<template>
  <section class="section">
    <!--<Title location="response.data.response.headerFullLocation"/>-->
    <!--<p>{{ response }}</p>-->
    <div 
      v-if="response"
      class="columns is-mobile">
      <p>{{ response.data.response.headerFullLocation }}</p>
      <div
        v-for="(venue, i) of venues"
        :key="i"
        class="column">
        <Venue :data="venue"/>
      </div>
    </div>
  </section>
</template>

<script>
import Title from '@/components/Title'
import Venue from '@/components/Venue'

export default {
  name: 'ShowMeAGoodTime',
  components: { Title, Venue },
  data() {
    return {
      location: null,
      url: null,
      position: null,
      response: null,
    }
  },
  async asyncData({ app, isServer, env }) {
    // console.log('process.env', process.env)
    const url = `${process.env.FOUR_SQUARE_URL}venues/explore?client_id=${
      process.env.FOUR_SQUARE_CLIENT_ID
    }&client_secret=${process.env.FOUR_SQUARE_CLIENT_SECRET}&`
    if (isServer) {
      beforeNuxtRender(({ nuxtState }) => {
        console.log('nuxtState', nuxtState)
        nuxtState.test = true
      })
    }
    return { url }
  },
  computed: {
    venues: function () {
      const venues = this.response.data.response.groups[0].items.map(item => item.venue)
      console.log('venues', venues)
       return venues.sort((a, b) => a.location.distance - b.location.distance)
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
    console.log('url', this.url)
    this.response = await this.$axios.get(this.url)
    console.log('this.response', this.response)
    console.log(
      'headerLocation',
      this.response.headerLocation,
      this.response.headerLocationGranularity
    )
  }
}
</script>
