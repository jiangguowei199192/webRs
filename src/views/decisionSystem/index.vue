<template>
  <div class="decision">
    <gMap ref="gduMap" handleType="search_route" :bShowSearchTools="true" :bShowBasic="true" :bShowMeasure="false"></gMap>
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
    }
  },
  methods: {
    refresh () {
      this.$refs.gduMap.routeOrCloseFunc()
    }
  },
  created () {
  },
  activated () {
    const tmpMap = this.$refs.gduMap.map2D
    setTimeout(() => {
      tmpMap._map.updateSize()
    }, 200)
  }
}
</script>

<style lang="scss" scoped>
.decision {
  height: 899px;
  padding-top: 20px;
}
</style>
