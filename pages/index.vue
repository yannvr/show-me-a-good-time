<template>
  <section class="section">
    <Title
      :location="fullLocation"/>
    <Loader v-if="!response"/>
    <div
      v-if="response"
      class="venues">
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

  section {
    /*background: rgba(247, 247, 247, 0.6);*/
    /*background: rgba(238, 231, 211, 0.6);*/
    display: flex;
    justify-content: center;
  }

  .gm-style-cc {
    display: none;
  }

  .venues {
    /*background: hsl(0, 0%, 93%); standard*/
    /*retro*/
    background: #eee7d3;
    font-size: 1rem;
    position: absolute;
    z-index: 1;
    bottom: 0;
    width: 100%;
    height: 40%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  /* Set the size of the div element that contains the map */
  #map {
    height: 60vh; /* The height is 400 pixels */
    width: 100%; /* The width is the width of the web page */
    position: absolute;
    top: 0;
  }

</style>

<script>
  import Title from '@/components/Title'
  import Venue from '@/components/Venue'
  import Loader from '../components/Loader'
  import mapStyles from '../components/mapStyles'

  const MAX_ELEMENT = 15

  export default {
    name: 'ShowMeAGoodTime',
    components: { Title, Venue, Loader },
    data() {
      return {
        location: null,
        url: null,
        response: null,
        markers: null,
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
      fullLocation: function() {
        return this.response && this.response.headerFullLocation || ''
      },
      venues: function() {
        const venues = this.response.groups[0].items.map(item => item.venue).slice(0, MAX_ELEMENT)
        return venues.sort((a, b) => a.location.distance - b.location.distance)
      }
      /*initializeMap: function() {
        const map = new google.maps.Map(
          document.getElementById('map'), {
            zoom: 15,
            center: { lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude },
            styles: mapStyles.retro,
            fullscreenControl: false,
            mapTypeControl: false
          })
        this.venues.forEach(venue => {
          const position = { lat: venue.location.lat, lng: venue.location.lng }
          let marker = new google.maps.Marker({ position, map })
          google.maps.event.addListener(marker, 'click', function(e) {
            console.log('e click', venue.name)
          })
        })
      }*/
    },
    async mounted() {
      this.currentPosition = await new Promise((res, rej) => {
        try {
          navigator.geolocation.getCurrentPosition(function(position) {
            // console.log(position.coords.latitude, position.coords.longitude)
            res(position)
          })
        } catch (e) {
          rej(e)
        }
      })

      // Get 4 square venues
      this.url += `ll=${this.currentPosition.coords.latitude},${
        this.currentPosition.coords.longitude
        }&v=20190101&section=topPicks`
      this.response = await fetch(this.url).then(resp => resp.json())
      this.response = this.response.response
      // console.log('position', this.currentPosition)
      const map = new google.maps.Map(
        document.getElementById('map'), {
          zoom: 15,
          center: { lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude },
          styles: mapStyles.standard,
          fullscreenControl: false,
          mapTypeControl: false
        })
      const markers = []
      this.venues.forEach(venue => {
        const position = { lat: venue.location.lat, lng: venue.location.lng }
        let marker = new google.maps.Marker({
          position,
          map,
          clickable: true,
          animation: google.maps.Animation.DROP,
          draggable: true
        })

        function toggleBounce() {
          marker.setAnimation(google.maps.Animation.BOUNCE)
          setTimeout(() => marker.setAnimation(null), 1000)
        }

        marker.addListener('bounce', toggleBounce)
        venue.marker = marker
      })
      this.markers = markers
    },
    beforeDestroy() {
    }
  }
</script>
