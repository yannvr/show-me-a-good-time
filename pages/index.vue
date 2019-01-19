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

  .venue-details {
    display: flex;
    flex-direction: column;
  }

  .venue-details-span {
    font-size: 12px;
    margin-right: 1.2em;
    font-weight: lighter;
  }

  .venue-details-heading {
    display: flex;
    flex-direction: row;
    width: 100%;
    font-size: 1em;
    justify-content: space-between;
  }

  .venue-details-content {
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  .venue-details-content img {
    width: 100px;
    height: 100px;
  }

  .tips {
    display: flex;
    flex-flow: column;
    list-style: none;
    /*padding: 0;*/
    /*margin: 0;*/
    justify-content: center;
  }

  .venues {
    /*background: hsl(0, 0%, 93%); standard*/
    /*retro*/
    margin-top: 1rem;
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
        fourSquareBaseURL: null,
        response: null,
        markers: null,
        infoWindows: [],
        currentPosition: null
      }
    },
    async asyncData({ app, isServer, env }) {
      const exploreUrl = `${process.env.FOUR_SQUARE_URL}venues/explore?client_id=${
        process.env.FOUR_SQUARE_CLIENT_ID
        }&client_secret=${process.env.FOUR_SQUARE_CLIENT_SECRET}&v=20190101&`
      return {
        api: {
          venues: {
            explore: exploreUrl,
            getVenueUrl: venueId => `${process.env.FOUR_SQUARE_URL}venues/${venueId}?client_id=${
              process.env.FOUR_SQUARE_CLIENT_ID
              }&client_secret=${process.env.FOUR_SQUARE_CLIENT_SECRET}&v=20190101&`
          }
        }
      }
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

      console.log('this.currentPosition', this.currentPosition)

      // Get 4 square venues
      const exploreAPIUrl = `${this.api.venues.explore}ll=${this.currentPosition.coords.latitude},${
        this.currentPosition.coords.longitude
        }&section=topPicks`
      console.log('exploreAPIUrl', exploreAPIUrl)
      this.response = await fetch(exploreAPIUrl).then(resp => resp.json())
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
          draggable: false
        })

        function toggleBounce() {
          marker.setAnimation(google.maps.Animation.BOUNCE)
          setTimeout(() => marker.setAnimation(null), 1000)
        }

        const venueContentString = data => {
          let tips = data.tips.map(tip => `<li>${tip.text} ${tip.likes ? ':)' : ''}</li>`)
          tips = `<ul class="tips">${tips}</ul>`
          return `
          <div class="venue-details">
              <h3 class="venue-details-heading">
                <a href="${data.shortUrl}">${data.name}</a>
                <span class="venue-details-span"> ${data.address ? data.address : ''} </span>
              </h3>
              <div class="venue-details-content">
                  <img src="${data.bestPhotoUrl}" alt="${data.name}"/>
                  ${tips}
              </div>
          </div>`
        }


        marker.addListener('bounce', toggleBounce)
        marker.addListener('click', async () => {
          // Lookup venue details
          console.log('this.api.venues', this.api.venues)
          const venueAPIUrl = this.api.venues.getVenueUrl(venue.id)
          console.log('venueAPIUrl', venueAPIUrl)
          let venueResponse
          const infoWindows = []
          try {
            venueResponse = await fetch(venueAPIUrl).then(resp => resp.json())
          } catch (error) {
            console.error('fetch error', error)
          }
          console.log('venueResponse', venueResponse)
          venueResponse = venueResponse.response
          console.log('venueResponse after', venueResponse)

          function getVenueData() {
            const { bestPhoto, likes, shortUrl, name, location, hereNow, tips } = venueResponse.venue
            return {
              bestPhotoUrl: `${bestPhoto.prefix}100x100${bestPhoto.suffix}`,
              nbLikes: likes.summary,
              tips: tips.groups[0].items.map(tip => ({
                createdAt: tip.createdAt,
                text: tip.text,
                likes: tip.likes.count
              })),
              hereNow: hereNow.summary,
              name,
              address: location.address,
              shortUrl
            }
          }

          const infowindow = new google.maps.InfoWindow({
            content: venueContentString(getVenueData())
          })
          this.infoWindows.forEach(iw => {
            iw.close()
          })
          infowindow.open(map, marker)
          this.infoWindows.push(infowindow)
        })
        venue.marker = marker
      })
      this.markers = markers
    },
    beforeDestroy() {
    }
  }
</script>
