<template>
  <div class="decision">
    <gMap ref="gduMap" handleType="Dashboard" :bShowBasic="true" :bShowMeasure="true"></gMap>
    <plan class="plan"></plan>
  </div>
</template>

<script>
import Plan from './plan/Plan.vue'

export default {
  name: 'decision',
  components: {
    Plan
  },
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
.plan {
  position: relative;
  width: 300px;
  max-height: 500px;
  left: 15px;
  top: -735px;
  border-radius: 4px;
  // background-color: rgb(21, 51, 77);
  background: white;
  overflow-y: scroll;
}
</style>
