<template>
  <main>
    <section>
      <Title
        :location="fullLocation"
        :sections="sections"
        :onSelect="onSelect"/>
      />
      <Loader v-if="!response"/>
      <div
        v-if="response"
        class="venues">
        <Venue 
          v-for="(venue, i) of venues"
          :data="venue"
          :key="i"
          class="column"/>
      </div>
    </section>
    <div id="map"/>
  </main>
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
    padding: 0 0.3em 0.3em 0;
    margin: 0;
    flex-direction: row;
    width: 100%;
    font-size: 1em;
    justify-content: space-between;
  }

  .venue-details-content {
    display: flex;
    flex-flow: row;
  }

  .venue-details-content img {
    width: 100px;
    height: 100px;
  }

  .tips {
    display: flex;
    flex-flow: column;
    list-style: none;
    padding: 0 0 0 10px;
    justify-content: center;
    overflow: scroll;
    /*height: 20vh;*/
  }

  .venues {
    /*background: hsl(0, 0%, 93%); standard*/
    /*retro*/
    -webkit-overflow-scrolling: touch;
    margin-top: 1rem;
    background: rgba(251, 245, 229, 0.8);
    left: 0;
    font-size: 1rem;
    position: fixed !important;
    z-index: 1;
    bottom: 0;
    width: 100%;
    height: 40%;
    overflow: scroll;
  }

  /* Set the size of the div element that contains the map */
  #map {
    height: 60vh; /* The height is 400 pixels */
    width: 100%; /* The width is the width of the web page */
    position: fixed;
    top: 0;
    overflow: hidden;
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
        sections: ['food', 'drinks', 'coffee', 'shops', 'arts', 'outdoors', 'sights', 'topPicks'], // topPicks
        sectionSelected: 'topPicks',
        map: null,
        theme: 'retro',
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
            explore: exploreUrl

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
    // Private scope (not observed)
    created: function() {
      this.markers = []
      this.getTheme = function() {
        const searchParams = new URLSearchParams(location.search)
        let themes = ['aubergine', 'retro', 'night', 'dark', 'silver', 'standard']
        let theme = searchParams.get('theme') || 'retro'
        if (themes.indexOf(theme) === -1) {
          theme = 'retro'
        }
        return theme
      }
      this.toggleBounce = function() {
        marker.setAnimation(google.maps.Animation.BOUNCE)
        setTimeout(() => marker.setAnimation(null), 1000)
      }
    },
    async mounted() {

      this.theme = this.getTheme()

      function preventDefault(e) {
        e.preventDefault()
      }

      function disableScroll() {
        document.body.addEventListener('touchmove', preventDefault, { passive: false })
      }

      disableScroll()

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
      console.log('this.sections', this.sections)

      // console.log('position', this.currentPosition)
      // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.gestureHandling
      this.map = new google.maps.Map(
        document.getElementById('map'), {
          zoom: 15,
          gestureHandling: 'greedy',
          center: { lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude },
          styles: mapStyles[this.theme],
          fullscreenControl: false,
          mapTypeControl: false
        })
      // TODO? GEt more markers but requires pagination
      // this.map.addListener('zoom_changed', () => this.populateMapVenues(this.map, this.sectionSelected) );
      this.populateMapVenues(this.map)
    },
    beforeDestroy() {
    },

    methods: {
      onSelect: function sectionSelected(sectionSelected) {
        // Remove existing markers
        console.log('markers to remove', this.markers)
        this.markers.forEach(marker => {
          marker.setMap(null)
        })
        this.markers.length = 0
        this.populateMapVenues(this.map, sectionSelected)
      },
      populateMapVenues: async function(map, sectionSelected = 'topPicks') {
        // Get 4 square venues
        const exploreAPIUrl = `${this.api.venues.explore}ll=${this.currentPosition.coords.latitude},${
          this.currentPosition.coords.longitude
          }&section=${sectionSelected}`
        console.log('exploreAPIUrl', exploreAPIUrl)
        this.response = await fetch(exploreAPIUrl).then(resp => resp.json())
        this.response = this.response.response

        this.venues.forEach(venue => {
          const position = { lat: venue.location.lat, lng: venue.location.lng }
          let marker = new google.maps.Marker({
            position,
            map,
            clickable: true,
            animation: google.maps.Animation.DROP,
            draggable: false
          })

          const venueContentString = data => {
            let tips = data.tips.map(tip => `<li>${tip.text} ${tip.likes ? ':)' : ''}</li>`)
            if (tips.length === 0) {
              tips = data.location.formattedAddress.toString()
            }
            tips = `<ul class="tips">${tips}</ul>`
            return `
              <div class="venue-details">
                  <h3 class="venue-details-heading">
                    <a href="${data.shortUrl}">${data.name}</a>
                    <span class="venue-details-rating"> ${data.rating} </span>
                    <span class="venue-details-span"> ${data.address ? data.address : ''} </span>
                  </h3>
                  <div class="venue-details-content">
                      <img src="${data.bestPhotoUrl}" alt="${data.name}"/>
                      ${tips}
                  </div>
              </div>`
          }

          function getVenueUrl(venueId) {
            return `${process.env.FOUR_SQUARE_URL}venues/${venueId}?client_id=${
              process.env.FOUR_SQUARE_CLIENT_ID
              }&client_secret=${process.env.FOUR_SQUARE_CLIENT_SECRET}&v=20190101&`
          }

          // marker.addListener('bounce', toggleBounce)

          marker.addListener('click', async () => {
            // Lookup venue details
            console.log('this.api.venues', this.api.venues)
            const venueAPIUrl = getVenueUrl(venue.id)
            console.log('venueAPIUrl', venueAPIUrl)
            let venueResponse
            try {
              venueResponse = await fetch(venueAPIUrl).then(resp => resp.json())
            } catch (error) {
              console.error('fetch error', error)
            }
            venueResponse = venueResponse.response
            console.log('venueResponse after', venueResponse)

            function getVenueData() {
              const { bestPhoto, likes, shortUrl, name, location, hereNow, tips, rating } = venueResponse.venue
              return {
                bestPhotoUrl: `${bestPhoto.prefix}100x100${bestPhoto.suffix}`,
                nbLikes: likes.summary,
                rating,
                tips: tips.groups[0].items.map(tip => ({
                  createdAt: tip.createdAt,
                  text: tip.text,
                  likes: tip.likes.count
                })),
                hereNow: hereNow.summary,
                name,
                location,
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
          this.markers.push(marker)
        })
      }
    }
  }
</script>
