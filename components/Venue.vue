<template>
  <div>
    <h2>{{ data.name }}</h2>
    {{ data.categories.name }}{{ data.location.address }}
    <!--https://ss1.4sqi.net/img/categories_v2/arts_entertainment/performingarts_dancestudio_32.png-->
    <img 
      :src="iconUrl"
      :alt="data.name"
      class="icon">
  </div>
</template>

<style>
  .icon {
    background: #e7b2ff;
  }
</style>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    address: {
      type: String,
      default: 'Address'
    }
  },
  computed: {
    iconUrl: function () {
      const imgUrl = `${this.data.categories[0].icon.prefix}32${this.data.categories[0].icon.suffix}`
      console.log('imgUrl', imgUrl)
      return imgUrl
    }
  }

}
</script>
