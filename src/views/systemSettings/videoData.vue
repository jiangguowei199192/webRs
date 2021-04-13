<template>
  <div>
    <VideoResSetting
      :dlgView="dlgView"
      :tableInfo="tableInfo"
      :subTitle="subTitle"
      :query="queryParams"
      :api="getListApi"
    ></VideoResSetting>
  </div>
</template>

<script>
import VideoResSetting from './components/videoResSetting.vue'
import { settingApi } from '@/api/setting'
export default {
  data () {
    return {
      dlgView: 'VideoResDlg',
      subTitle: '视频数据',
      // 表格相关
      tableInfo: {
        refresh: 1,
        data: [],
        fieldList: [
          {
            label: '设备类型',
            value: 'deviceTypeCode',
            formatter: item => {
              if (item.deviceTypeCode === 'GDJK') {
                return '高点监控'
              } else if (item.deviceTypeCode === 'WRJ') {
                return '无人机'
              } else {
                return item.deviceTypeCode
              }
            }
          },
          { label: '设备名称', value: 'deviceName' },
          {
            label: '配置告警类型',
            value: 'deviceCode',
            type: 'eventConfig',
            width: '244'
          },
          {
            label: '实时检测配置',
            value: 'deviceAddress',
            type: 'realDetect',
            width: '244'
          },
          { label: '所属单位', value: 'deviceDeptName' },
          { label: '在线状态', value: 'onlineStatus' },
          { label: '启用', value: 'deviceStatus', type: 'switch' }
        ],
        handle: {
          label: '操作',
          width: '306',
          btList: [
            {
              label: '修改',
              event: 'modify'
            },
            {
              label: '查看',
              event: 'readonly'
            },
            {
              label: '实时检测',
              event: 'monitor'
            },
            {
              label: '事件配置',
              event: 'config'
            }
          ]
        }
      },
      queryParams: {
        deviceCode: '',
        deviceName: ''
      }
    }
  },
  components: {
    VideoResSetting
  },
  mounted () {},
  methods: {
    getListApi (params) {
      return this.$axios.post(settingApi.queryDevicePage, params)
    }
  }
}
</script>

<style lang="scss" scoped></style>
