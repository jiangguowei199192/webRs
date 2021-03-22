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
      dlgView: 'LineResDlg',
      subTitle: '线资源设置',
      resourcesDataType: '1',
      fieldList: [
        { label: '线路名称', value: 'resourcesName' },
        { label: '类型', value: 'resourcesTypeName' },
        { label: '起点', value: 'lineOrigin' },
        { label: '终点', value: 'lineDestination' },
        {
          label: '长度',
          value: 'totalLength',
          formatter: (row) => {
            return row.totalLength + '千米'
          }
        },
        { label: '所属机构', value: 'deptName' },
        { label: '排序', value: 'resourcesSort' }
      ]
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
