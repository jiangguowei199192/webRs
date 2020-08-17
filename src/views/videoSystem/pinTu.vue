<template>
  <div class="realTu">
    <gMap
      ref="gduMap"
      :bShowSimpleSearchTools="false"
      :bShowLonLat="true"
      :bAutoLocate="true"
      :bShowBasic="true"
      :bShowMeasure="true"
    ></gMap>
  </div>
</template>
<script>
export default {
  name: 'pinTu',
  data () {
    return {}
  },
  methods: {
    showPic () {
      const tmpMap = this.$refs.gduMap
      tmpMap.map2D._imageLayerManager.add(
        'http://120.24.12.64:80/fmsUploads/tif_pieces/1585807955811/tilemapresource.xml',
        ly => {
          tmpMap.map2D.zoomToLayer(ly)
          const layerExtent = ly.getExtent()
          if (layerExtent.length === 4) {
            tmpMap.lon = (layerExtent[0] + layerExtent[2]) / 2
            tmpMap.lat = (layerExtent[1] + layerExtent[3]) / 2
          }
        }
      )
      setTimeout(() => {
        tmpMap.map2D._imageLayerManager.add(
          'http://120.24.12.64:80/fmsUploads/tif_pieces/1590685385787/tilemapresource.xml',
          ly => {
            tmpMap.map2D.zoomToLayer(ly)
            const layerExtent = ly.getExtent()
            if (layerExtent.length === 4) {
              tmpMap.lon = (layerExtent[0] + layerExtent[2]) / 2
              tmpMap.lat = (layerExtent[1] + layerExtent[3]) / 2
            }
          }
        )
      }, 5000)
    }
  },
  mounted () {
    setTimeout(() => {
      this.showPic()
    }, 5000)
  }
}
</script>
<style lang="less">
.realTu {
  height: 899px;
}
</style>
