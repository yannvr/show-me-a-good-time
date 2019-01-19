<template>
  <div>
    <h1>{{ title }}</h1>
    <h4 v-if="location">in {{ location }}</h4>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Show me a good time'
      },
      location: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped>
  div {
    z-index: 5;
    position: fixed;
    width: 100%;
  }

  h1, h4 {
    /*background: rgba(247, 247, 247, 0.8);*/
    /*retro*/
    background: rgba(238, 231, 211, 0.8);

  }

  h1 {
    font-size: 1.5rem;
    /*font-family: 'my_scrawlregular';*/
    /*src: url('/font/myscrawl-webfont.woff2') format('woff2'),*/
    /*url('/font/myscrawl-webfont.woff') format('woff');*/
    font-weight: normal;
    font-style: normal;
    text-align: center;
  }


  h4 {
    text-align: center;
  }
</style>
