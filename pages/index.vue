<template>
  <main>
    <div id="map"/>
    <section>
      <Title
        :sections="sections"
        :sectionSelected="sectionSelected"
        :onSelect="onSelect"
      />
      <Loader v-if="!response"/>
      <div
        v-if="response"
        class="venues">
        <Venue
          v-for="(venue, i) of venues"
          :data="venue"
          :key="i"
        />
      </div>
    </section>
  </main>
</template>

<style>

  section {
    /*background: rgba(247, 247, 247, 0.6);*/
    /*background: rgba(238, 231, 211, 0.6);*/
    display: flex;
    justify-content: center;
  }

  main {
    height: 100vh;
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

  .venue-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .venue-details-heading {
    display: flex;
    line-height: 1.5;
    flex-direction: column;
    margin: 0;
    font-size: 1em;
  }

  .venue-phone {
    font-weight: lighter;
    font-size: smaller;
  }

  .venue-details-content {
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  .venue-details-content img {
    height: 100%;
  }

  .tips {
    list-style: none;
    padding: 1em 0 0 0;
  }

  .venues {
    -webkit-overflow-scrolling: touch;
    margin-top: 1rem;
    background: rgba(251, 245, 229, 1);
    left: 0;
    font-size: 1rem;
    position: absolute;
    z-index: 1;
    top: 58%;
    width: 100%;
    max-height: 40%;
    overflow: scroll;
  }

  /* Set the size of the div element that contains the map */
  #map {
    height: 52%;
    width: 100%;
    top: 8%;
  }

</style>

<script>
  import Title from '@/components/Title'
  import Venue from '@/components/Venue'
  import Loader from '../components/LoaderTarget'
  import mapStyles from '../components/mapStyles'

  const ZOOM = 16

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
        sections: ['topPicks', 'Food', 'Drinks', 'Coffee', 'Arts', 'Landmarks', 'All'], // topPicks
        sectionSelected: 'topPicks',
        map: null,
        theme: 'retro',
        currentPosition: null
      }
    },
    computed: {
      fullLocation: function() {
        return this.response && this.response.headerFullLocation || ''
      },
      venues: function() {
        const venues = this.response.businesses
        return venues.sort((a, b) => a.distance - b.distance)
      }
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
      // 'o' (original): Up to 1,000x1,000
      // 'l' (large): Up to 600x400
      // 'm' (medium): Up to 100x100
      // 'ms' (medium square): 100x100
      // 's' (small): Up to 40x40
      // 'ss' (small square): 40x40
      this.getImageUrl = function(imageUrl, size = 'm') {
        if (size !== 'o') {
          return imageUrl.replace(/\/o.jpg$/, `/${size}.jpg`)
        }
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

      // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.gestureHandling
      this.map = new google.maps.Map(
        document.getElementById('map'), {
          zoom: ZOOM,
          gestureHandling: 'greedy',
          center: { lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude },
          styles: mapStyles[this.theme],
          fullscreenControl: false,
          mapTypeControl: false
        })
      window.map = this.map
      // TODO? GEt more markers but requires pagination
      // this.map.addListener('zoom_changed', () => this.populateMapVenues(this.map, this.sectionSelected) );
      this.populateMapVenues(this.map)
    },

    beforeDestroy() {
    },

    methods: {
      onSelect: function sectionSelected(sectionSelected) {
        if(sectionSelected === 'All') {
          sectionSelected = ''
        }
        this.sectionSelected = sectionSelected.toLowerCase().replace(/s$/, '')
        // Remove existing markers
        this.markers.forEach(marker => {
          marker.setMap(null)
        })
        this.markers.length = 0
        this.populateMapVenues(this.map, sectionSelected)
      },
      populateMapVenues: async function(map, sectionSelected = 'best') {
        this.map.setCenter({ lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude })
        const exploreAPIUrl = `http://localhost:3000/api/search?sort_by=rating&latitude=${this.currentPosition.coords.latitude}&longitude=${this.currentPosition.coords.longitude}&term=${sectionSelected}&radius=300`
        this.response = await fetch(exploreAPIUrl).then(resp => resp.json())
        this.venues.forEach(venue => {
          const position = { lat: venue.coordinates.latitude, lng: venue.coordinates.longitude }
          let marker = new google.maps.Marker({
            position,
            map,
            clickable: true,
            animation: google.maps.Animation.DROP,
            draggable: false
          })

          const venueContentString = (reviews, venue) => {
            let tips = reviews.map(tip => `<li>${tip.text}</li>`)
            tips = `<ul class="tips">${tips}</ul>`
            return `
              <div class="venue-details">
                <div class="venue-header">
                  <div class="venue-details-heading">
                    <h4><a href="${venue.url}">${venue.name}</a></h4>
                    <a href="tel:${venue.phone}" class="venue-phone">${venue.display_phone}</a>
                    <span class="venue-details-rating"> ★ ${venue.rating} (${venue.review_count} reviews) </span>
                    <span class="venue-details-span"> ${venue.location.address1 ? venue.location.address1 : ''} </span>
                  </div>
                  <img src="${this.getImageUrl(venue.image_url)}" alt="${venue.name}"/>
                </div>
                  <div class="venue-details-content">
                      ${tips}
                  </div>
              </div>`
          }

          marker.addListener('click', async () => {
            // Lookup venue details

            const businessDetailUrl = `http://localhost:3000/api/reviews?id=${venue.id}`
            console.log('businessDetailUrl', businessDetailUrl)
            const venueResponse = await fetch(businessDetailUrl).then(resp => resp.json())

            const infowindow = new google.maps.InfoWindow({
              content: venueContentString(venueResponse.reviews, venue)
            })
            this.infoWindows.forEach(iw => {
              iw.close()
            })
            // Make space for infowindow
            infowindow.open(map, marker)
            // map.panBy(0, 100)
            window.infowindow = infowindow
            this.infoWindows.push(infowindow)
          })
          venue.marker = marker
          this.markers.push(marker)
        })
      }
    }
  }
</script>
