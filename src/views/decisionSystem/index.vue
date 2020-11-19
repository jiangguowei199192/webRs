<template>
  <div :style="'height:'+fullHeight+'px;'">
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
    return {
      minHeight: 964,
      fullHeight: 0
    }
  },
  methods: {
    // 设置地图高度，避免F11全屏时，底部有空白
    setMapHeight () {
      const tmpMap = this.$refs.gduMap.map2D
      var h = document.documentElement.clientHeight - 96
      if (h < this.minHeight) this.fullHeight = this.minHeight
      else this.fullHeight = h
      setTimeout(() => {
        tmpMap._map.updateSize()
      }, 200)
    },
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
    this.setMapHeight()
    const me = this
    window.onresize = () => {
      me.setMapHeight()
    }
  },
  deactivated () {
    window.onresize = null
  },
  mounted () {
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

</style>
