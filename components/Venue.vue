<template>
  <div class="venue">
    <div 
      class="header" 
      @click="handleClickMarker">
      <img
        :src="iconUrl"
        :alt="data.name"
        class="icon">
      <h3>{{ data.name }}</h3>
      <p> {{ data.categories[0].title }}{{ data.location.address1 }} </p>
    </div>
  </div>
</template>

<style>
  .venue {
    font-size: 1.5vmax;
    padding: 0.2em;
  }

  @media all and (min-width: 1024px) {
    .venue {
      font-size: 0.7em;
    }
  }

  .header {
    cursor: pointer;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  h3 {
    width: 60%;
    margin-left: 1em;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  p {
    width: 50%;
  }
</style>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default: () => {
        }
      },
      marker: {
        type: Object,
        default: () => {
        }
      },
      address: {
        type: String,
        default: 'Address'
      }
    },
    computed: {
      iconUrl: function() {
        return `${this.data.image_url.replace(/\/o.jpg$/, '/ss.jpg')}`
      }
    },
    methods: {
      handleClickMarker: function (event) {
        google.maps.event.trigger( this.data.marker, 'click', event );
      }
    }

  }
</script>
