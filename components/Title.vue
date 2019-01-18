<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Show me a good time'
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  text-align: center;
  /*font-family: 'my_scrawlregular';*/
  /*src: url('/font/myscrawl-webfont.woff2') format('woff2'),*/
      /*url('/font/myscrawl-webfont.woff') format('woff');*/
  font-weight: normal;
  font-style: normal;
}
</style>
