<template>
  <div class="venue">
    <h3>{{ data.name }}</h3>
    {{ data.categories.name }}{{ data.location.address }}
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
  .venue {
    font-family: 'monaco';
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
