<template>
  <div class="venue">
    <div class="header">
      <h3>{{ data.name }}</h3>
      <p> {{ data.categories.name }}{{ data.location.address }} </p>
      <img
        :src="iconUrl"
        :alt="data.name"
        class="icon">
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
    justify-content: space-between;
  }

  .icon {
    background: #ea4335;
    width: 16px;
    /*margin-left: 4vw;*/
    height: 16px;
    max-width: 32px;
    max-height: 32px;
    overflow: scroll;
    border-radius: 10px;
    margin-left: 1vw;
  }

  h3 {
    width: 60%;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .venue {
    /*font-family: 'monaco';*/
    font-size: 1.6vh;
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
      address: {
        type: String,
        default: 'Address'
      }
    },
    computed: {
      iconUrl: function() {
        const imgUrl = `${this.data.categories[0].icon.prefix}32${this.data.categories[0].icon.suffix}`
        return imgUrl
      }
    }

  }
</script>
