<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <TuringMachine />
  </div>
</template>

<script src="/assets/anime.min.js"></script>
<script>
import HelloWorld from './components/HelloWorld.vue'
import TuringMachine from './components/TuringMachine.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    TuringMachine
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
