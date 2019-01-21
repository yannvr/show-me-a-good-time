<template>
  <div @click="onClick">
    <h1>{{ title }}</h1>
    <h4 v-if="location">in {{ location }}</h4>
    <multiselect
      v-if="location"
      v-model="selected"
      :options="sections"
      @select="onSelect"/>
    <h4 v-if="location">in {{ location }}</h4>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'

  export default {
    name: 'Title',
    components: { Multiselect },
    props: {
      onClick: {
        type: Function,
        default: () => {},
      },
      onSelect: {
        type: Function,
        default: () => {},
      },
      sections: {
        type: Array,
        default: () => [],
      },
      title: {
        type: String,
        default: 'Show me a good time'
      },
      location: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        selected: 'topPicks'
      }
    },

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
    background: rgba(251, 245, 229, 0.8);
    text-align: center;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: normal;
    font-style: normal;
    text-align: center;
  }
</style>
