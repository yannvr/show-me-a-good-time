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
  background: red;
}
</style>
