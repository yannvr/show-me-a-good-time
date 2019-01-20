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
      <p> {{ data.categories.name }}{{ data.location.address }} </p>
    </div>
  </div>
</template>

<style>
  .venue {
    font-size: 1.7vmax;
    padding: 0.2em;
  }
  .header {
    display: flex;
    flex-flow: row;
    align-items: center;
    }

  .icon {
    background: #ea4335;
    max-width: 24px;
    max-height: 24px;
    border-radius: 32px;
  }

  h3 {
    width: 60%;
    margin-left: 2vw;
    text-overflow: ellipsis;
    overflow: hidden;
    align-self: flex-start;
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
        return `${this.data.categories[0].icon.prefix}32${this.data.categories[0].icon.suffix}`
      }
    },
    methods: {
      handleClickMarker: function (event) {
        google.maps.event.trigger( this.data.marker, 'click', event );
      }
    }

  }
</script>
