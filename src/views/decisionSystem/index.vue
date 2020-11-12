<template>
  <div class="decision">
    <gMap
      ref="gduMap"
      handleType="search_route"
      :bShowSearchTools="true"
      :bShowBasic="true"
      :bShowMeasure="false"
    ></gMap>
  </div>
</template>

<script>
export default {
  name: 'decision',
  watch: {
    $route: 'refresh'
  },
  data () {
    return {}
  },
  methods: {
    refresh () {
      this.$refs.gduMap.routeOrCloseFunc()
    },
    refreshWinSize () {
      if (document.createEvent) {
        var event = document.createEvent('HTMLEvents')
        event.initEvent('resize', true, true)
        window.dispatchEvent(event)
      } else if (document.createEventObject) {
        window.fireEvent('onresize')
      }
    }
  },
  activated () {
    this.refreshWinSize()
    const tmpMap = this.$refs.gduMap.map2D
    setTimeout(() => {
      tmpMap._map.updateSize()
    }, 200)
  },

  beforeRouteLeave (to, from, next) {
    if (to.name === 'fightDeploy') {
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
.decision {
  height: 964px;
}
</style>
