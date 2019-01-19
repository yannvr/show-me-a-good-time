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
    margin: 0 1vmax;
  }
  .header {
    display: flex;
    flex-flow: row;
    }

  .icon {
    background: #ea4335;
    width: 16px;
    height: 16px;
    max-width: 32px;
    max-height: 32px;
    overflow: scroll;
    border-radius: 10px;
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

  .venue {
    font-size: 1vmax;
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
        google.maps.event.trigger( this.data.marker, 'bounce', event );
      }
    }

  }
</script>
