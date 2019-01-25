<template>
  <div @click="onClick">
    <h1>Show me a good {{ sectionSelected || 'time' }}</h1>
    <!--<h4 v-if="location">in {{ location }}</h4>-->
    <multiselect
      v-model="selected"
      :options="sections"
      class="multiselect"
      @select="onSelect"/>
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
      sectionSelected: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        selected: 'all'
      }
    },

  }
</script>

<style scoped>
  div {
    z-index: 5;
    position: absolute;
    top: 0;
    width: 100%;
    height: 8%;
  }

  h1, h4 {
    /*background: rgba(247, 247, 247, 0.8);*/
    /*retro*/
    background: rgba(251, 245, 229, 0.8);
    text-align: center;
  }

  .multiselect {
    top: 30px;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: normal;
    font-style: normal;
    text-align: center;
  }
</style>
