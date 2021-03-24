<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_2.0
 * @Author: liangkaiLee
 * @Date: 2021-02-24 15:45:20
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-23 20:07:49
-->
<template>
  <div style="margin: auto 30px">
    <!-- 头部面包屑 -->
    <div class="head-title">火情中心 / {{ subTitle }}</div>
    <!-- 火情列表 -->
    <FirePage
      :tableInfo="tableInfo"
      :subTitle="subTitle"
      :api="getFireList"
      @handelImgClick="handelImgClick"
    ></FirePage>
    <!-- 火情详情弹窗 -->
    <FireInfoDialog
      ref="addDictRef"
      :isShow.sync="isShow"
      title="火情详情"
      :fireInfo.sync="fireInfo"
      @confirmFireClick="confirmFireClick"
    ></FireInfoDialog>
  </div>
</template>

<script>
import FirePage from './components/firePage'
import FireInfoDialog from './components/fireInfoDialog'
import { fireApi } from '@/api/videoSystem/fireAlarm.js'

export default {
  components: {
    FirePage,
    FireInfoDialog
  },

  data () {
    return {
      subTitle: '火情列表',
      // 表格项
      tableInfo: {
        refresh: 0,
        data: [],
        fieldList: [
          { label: '报警时间', value: 'alarmTime', width: '150' },
          { label: '报警地点', value: 'alarmAddress', width: '200' },
          { label: '经度', value: 'alarmLongitude', width: '100' },
          { label: '纬度', value: 'alarmLatitude', width: '100' },
          { label: '类型', value: 'alarmTypeName', width: '85' },
          {
            label: '报警图片',
            value: 'alarmPicList',
            type: 'fireImage',
            width: '120'
          },
          { label: '报警设备', value: 'deviceName', width: '110' },
          { label: '状态', value: 'alarmStatus', width: '70' },
          { label: '确认时间', value: 'updateTime', width: '150' }
        ]
      },
      isShow: false,
      fireInfo: {}
    }
  },

  mounted () {
    this.refreshTable()
  },

  beforeDestroy () {
    this.tableInfo.refresh = ''
  },

  methods: {
    // 刷新table
    refreshTable () {
      this.tableInfo.refresh = Math.random()
    },

    // 获取火情列表
    getFireList (params) {
      //   console.log('params:', params)
      return this.$axios.get(fireApi.getDurationFireAlarmInfos, {
        params: params
      })
    },

    // 单击图片
    handelImgClick (data) {
      this.fireInfo = data
      this.isShow = true
    },

    // 按钮操作提交
    confirmFireClick () {
      this.refreshTable()
    }
  }
}
</script>

<style lang="scss" scoped>
.head-title {
  height: 54px;
  line-height: 54px;
  font-size: 16px;
}
/deep/::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
/deep/::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #00b7ff;
}
/deep/::-webkit-scrollbar-track {
  background: transparent;
}
</style>
