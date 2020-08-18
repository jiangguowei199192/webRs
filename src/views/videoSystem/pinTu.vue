<template>
  <div class="realTu">
    <gMap
      ref="gduMap"
      :bShowSimpleSearchTools="false"
      :bShowLonLat="true"
      :bAutoLocate="true"
      :bShowBasic="true"
      :bShowMeasure="true"
      :bShowPaln="false"
    ></gMap>
  </div>
</template>
<script>
import { EventBus } from '@/utils/eventBus.js'
export default {
  name: 'pinTu',
  data () {
    return {}
  },
  methods: {
    showPic (url) {
      const tmpMap = this.$refs.gduMap
      if (tmpMap && tmpMap.map2D) {
        tmpMap.map2D._imageLayerManager.add(
          url,
          ly => {
            tmpMap.map2D.zoomToLayer(ly)
            const layerExtent = ly.getExtent()
            if (layerExtent.length === 4) {
              tmpMap.lon = (layerExtent[0] + layerExtent[2]) / 2
              tmpMap.lat = (layerExtent[1] + layerExtent[3]) / 2
            }
          }
        )
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.showPic('http://172.16.63.148/fmsUploads/tif_pieces/1597738049845/tilemapresource.xml')
    }, 500)

    EventBus.$on('realMapping/realMappingResult', info => {
      setTimeout(() => {
        this.showPic(info.imgUrl)
      }, 500)
    })
  }
}
</script>
<style lang="less">
.realTu {
  height: 899px;
}
</style>
