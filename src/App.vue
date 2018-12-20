<template>
  <div id="app">
    <MHeader></MHeader>
    <Tab></Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <play></play>
  </div>
</template>
<script type="text/ecmascript-6">
  import MHeader from './components/m-header/m-header'
  import Tab from './components/Tab/Tab'
  import play from './components/play/play.vue'
  export default {
    components: {
      MHeader,
      Tab,
      play
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
