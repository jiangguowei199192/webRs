<template>
  <div :style="'height:'+fullHeight+'px;'">
     <Map :url="configUrl" :showOpenAnimation="false" :showCompass="false" @onload="onMapload"/>
  </div>
</template>

<script>
import Map from '../decisionSystem/components/marsMap.vue'
export default {
  name: 'evaluation',
  data () {
    return {
      minHeight: 929,
      fullHeight: 0,
      configUrl: 'config/config.json'
    }
  },
  components: {
    Map
  },

  mounted () {
    this.setMapHeight()
    const me = this
    window.onresize = () => {
      me.setMapHeight()
    }
  },
  beforeDestroy () {
    window.onresize = null
  },
  methods: {
    // 设置地图高度，避免F11全屏时，底部有空白
    setMapHeight () {
      var h = document.documentElement.clientHeight - 96
      if (h < this.minHeight) this.fullHeight = this.minHeight
      else this.fullHeight = h
    },
    /**
     *  地图构造完成回调
     */
    onMapload (viewer) {
      this.viewer = viewer
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
