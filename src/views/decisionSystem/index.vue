<template>
  <div class="decision">
    <gMap ref="gduMap" handleType="search_route" :bShowBasic="true" :bShowMeasure="true"></gMap>
  </div>
</template>

<script>
export default {
  name: 'decision',
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
.decision {
  height: 800px;
}
</style>
