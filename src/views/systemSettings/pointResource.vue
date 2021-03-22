<template>
  <div>
    <MapResSetting
      :subTitle="subTitle"
    ></MapResSetting>
  </div>
</template>

<script>
import MapResSetting from './components/mapResSetting.vue'
export default {
  data () {
    return {
      subTitle: '点资源设置'
    }
  },
  components: {
    MapResSetting
  },
  mounted () {},
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
