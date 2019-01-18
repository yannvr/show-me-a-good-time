<template>
  <section class="section">
    <Title location="response.data.response.headerFullLocation"/>
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
    <div id="map"/>
  </section>
</template>

<style>
  /* Set the size of the div element that contains the map */
  #map {
    height: 400px; /* The height is 400 pixels */
    width: 100%; /* The width is the width of the web page */
  }
  .gm-style-mtc {
    display: none;
  }
</style>

<script>
  import Title from '@/components/Title'
  import Venue from '@/components/Venue'
  import mapStyles from '../components/mapStyles'

  export default {
    name: 'ShowMeAGoodTime',
    components: { Title, Venue },
    data() {
      return {
        location: null,
        url: null,
        response: null,
        currentPosition: null
      }
    },
    async asyncData({ app, isServer, env }) {
      const url = `${process.env.FOUR_SQUARE_URL}venues/explore?client_id=${
        process.env.FOUR_SQUARE_CLIENT_ID
        }&client_secret=${process.env.FOUR_SQUARE_CLIENT_SECRET}&`
      return { url }
    },
    computed: {
      venues: function() {
        const venues = this.response.data.response.groups[0].items.map(item => item.venue).slice(0, 5)
        return venues.sort((a, b) => a.location.distance - b.location.distance)
      },
      initializeMap: function () {
         const map = new google.maps.Map(
          document.getElementById('map'), {
            zoom: 15,
            center: { lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude },
            styles: mapStyles
          })
        this.venues.forEach(venue => {
          const position = { lat: venue.location.lat, lng: venue.location.lng }
          let marker = new google.maps.Marker({ position, map })
          google.maps.event.addListener(marker, "click", function(e) {
            console.log('e click', venue.name)
          });
        })
      }
    },
    async mounted() {
      this.currentPosition = await new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position.coords.latitude, position.coords.longitude)
          res(position)
        })
      })

      // Get 4 square venues
      this.url += `ll=${this.currentPosition.coords.latitude},${
        this.currentPosition.coords.longitude
        }&v=20190101&section=topPicks`
      this.response = await this.$axios.get(this.url)
      // console.log('position', this.currentPosition)
      this.initializeMap(this.currentPosition)
    }
  }
</script>
