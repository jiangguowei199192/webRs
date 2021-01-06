var Cesium = window.Cesium
/**
     * 将笛卡尔坐标转为地理坐标
     */
export function CartesianToDegrees (position) {
  var cartographic = Cesium.Cartographic.fromCartesian(position)
  var lon = Number(
    Cesium.Math.toDegrees(cartographic.longitude).toFixed(7)
  )
  var lat = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(7))
  var height = Math.ceil(cartographic.height)
  return { lat: lat, lon: lon, height: height }
}
