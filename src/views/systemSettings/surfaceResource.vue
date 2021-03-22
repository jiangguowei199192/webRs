<template>
  <div>
    <MapResSetting
      :dlgView="dlgView"
      :resourcesDataType="resourcesDataType"
      :subTitle="subTitle"
      :fieldList="fieldList"
    ></MapResSetting>
  </div>
</template>

<script>
import MapResSetting from './components/mapResSetting.vue'
export default {
  data () {
    return {
      dlgView: 'SurfaceResDlg',
      subTitle: '面资源设置',
      resourcesDataType: '2',
      fieldList: [
        { label: '名称', value: 'resourcesName' },
        { label: '类型', value: 'resourcesTypeName' },
        { label: '所属单位', value: 'deptName' },
        { label: '所属辖区', value: 'belongAreaName' },
        { label: '排序', value: 'resourcesSort' }
      ]
    }
  },
  components: {
    MapResSetting
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
