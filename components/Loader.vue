<!--http://tobiasahlin.com/spinkit/-->
<template>
  <div class="sk-rotating-plane"/>
</template>

<script>
  export default {
    name: 'LoaderVue'
  }
</script>

<style scoped>
  .sk-rotating-plane {
    width: 29vw;
    height: 20vh;
    position: absolute;
    top: 30%;
    background-color: #1c92ff;
    margin: 40px auto;
    -webkit-animation: sk-rotatePlane 2s infinite alternate-reverse ease-in-out;
    transition: background-color 0.5s ease;
    animation: sk-rotatePlane 2s infinite alternate-reverse ease-in-out;
  }

  @-webkit-keyframes sk-rotatePlane {
    0% {
      -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
      transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    }
    50% {
      -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
      transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
      /*background-color: darkseagreen;*/
    }
    100% {
      -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
      transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
      background: blueviolet;
    }
  }

  @keyframes sk-rotatePlane {
    0% {
      -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
      transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    }
    50% {
      -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
      transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
      /*background-color: darkseagreen;*/
    }
    100% {
      -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
      transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
      background: #ff1e00;
    }
  }
</style>
