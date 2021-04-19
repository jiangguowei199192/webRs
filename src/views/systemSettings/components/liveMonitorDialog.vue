<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-04-05 15:35:59
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-04-19 14:05:02
-->
<template>
  <div>
    <el-dialog
      :visible.sync="isShow"
      :close-on-click-modal="false"
      class="monitor-dlg dialog-wrap"
    >
      <div class="monitor-header">{{ title }}</div>
      <div class="monitor-content">
        <div class="people-test">
          <span class="fl test-title">人员检测：</span>
          <el-switch
            class="fl"
            v-model="peopleStatus"
            @change="switchStatusChange(0)"
          >
          </el-switch>
        </div>
        <div class="car-test">
          <span class="fl test-title">车辆检测：</span>
          <el-switch
            class="fl"
            v-model="carStatus"
            @change="switchStatusChange(2)"
          >
          </el-switch>
        </div>
        <div class="boat-test">
          <span class="fl test-title">船只检测：</span>
          <el-switch
            class="fl"
            v-model="boatStatus"
            @change="switchStatusChange(1)"
          >
          </el-switch>
        </div>
      </div>
      <div class="handelBtns">
        <span @click.stop="updateIsShow">关闭</span>
        <!-- <span @click.stop="changeTypeSubmit">确定</span> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { settingApi } from '@/api/setting'
import { EventBus } from '@/utils/eventBus.js'

export default {
  props: {
    isShow: { type: Boolean, required: true },
    title: { type: String, required: true }
  },

  data () {
    return {
      placeholder: '请输入',
      peopleStatus: true,
      carStatus: true,
      boatStatus: true,
      people_status: null,
      car_status: null,
      boat_status: null,
      checkDevice: '',
      deviceConfigList: [],
      queryStatusList: []
    }
  },

  watch: {
    isShow (val) {
      if (val) {
        EventBus.$on('clickRow', info => {
          this.checkDevice = info
          // console.log('checkDevice:', this.checkDevice)
        })
        setTimeout(() => {
          this.queryDeviceConfig()
        }, 300)
      }
    }
  },

  mounted () {},

  methods: {
    updateIsShow () {
      this.$emit('update:isShow', false)
    },

    switchStatusChange (handelType) {
      if (
        this.peopleStatus === true ||
        this.carStatus === true ||
        this.boatStatus === true
      ) {
        this.people_status = this.car_status = this.boat_status = 1
      }
      if (
        this.peopleStatus === false ||
        this.carStatus === false ||
        this.boatStatus === false
      ) {
        this.people_status = this.car_status = this.boat_status = 0
      }

      var params = {
        algorithmType: handelType,
        deviceCode: this.checkDevice.deviceCode,
        status: `${handelType === 0 ? this.people_status : ''}${
          handelType === 1 ? this.boat_status : ''
        }${handelType === 2 ? this.car_status : ''}`,
        streamType: '',
        type: Number(1)
      }
      // console.log(this.params)
      this.$axios
        .post(settingApi.addDeviceConfig, params)
        .then(res => {
          // console.log('新增设备事件/告警接口返回:', res)
          if (res && res.data && res.data.code === 0) {
            this.$notify.closeAll()
            this.$notify.success({
              title: '提示',
              message: '操作成功!',
              duration: 3 * 1000
            })
            this.deviceConfigList = res.data.data
          }
        })
        .catch(err => {
          console.log('settingApi.addDeviceConfig Err : ' + err)
        })
    },

    queryDeviceConfig () {
      var params = {
        accessType: this.checkDevice.accessType,
        algorithmType: '',
        channelInfo: this.checkDevice.channelInfo,
        deviceCode: this.checkDevice.deviceCode,
        deviceTypeCode: this.checkDevice.deviceTypeCode,
        type: 1
      }
      this.$axios
        .post(settingApi.queryDeviceConfig, params)
        .then(res => {
          // console.log('查询设备事件/告警接口返回:', res)
          if (res && res.data && res.data.code === 0) {
            this.queryStatusList = res.data.data
            this.queryStatusList.forEach(t => {
              if (t.status === 0) {
                t.status = false
              } else if (t.status === 1) {
                t.status = true
              } else {
                t.status = false
              }
              if (
                t.deviceCode != null &&
                t.algorithmType != null &&
                t.deviceCode === this.checkDevice.deviceCode
              ) {
                switch (t.algorithmType) {
                  case 0:
                    this.peopleStatus = t.status
                    break
                  case 1:
                    this.boatStatus = t.status
                    break
                  case 2:
                    this.carStatus = t.status
                    break
                }
              } else {
                this.peopleStatus = this.carStatus = this.boatStatus = false
              }
            })
          }
        })
        .catch(err => {
          console.log('settingApi.queryDeviceConfig Err : ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 970px;
    background-color: transparent;
    .el-dialog__body {
      height: 530px;
      position: relative;
    }
    .monitor-header {
      width: 218px;
      height: 30px;
      background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      line-height: 30px;
      padding: 0 20px;
      margin-top: 18px;
    }
    .monitor-content {
      margin-top: 20px;
      padding: 0 20px;
      .people-test,
      .car-test,
      .boat-test {
        display: flex;
        align-items: center;
        height: 50px;
        margin-bottom: 10px;
        .test-title {
          width: 100px;
          font-size: 16px;
          color: #00d1ff;
        }
        .el-switch {
          display: block;
          margin-left: 15px;
        }
      }
    }
    .handelBtns {
      position: absolute;
      right: 0;
      bottom: 0;
      span {
        display: inline-block;
        box-sizing: border-box;
        width: 87px;
        height: 32px;
        border: 1px solid #1eb0fc;
        border-radius: 2px;
        line-height: 32px;
        text-align: center;
        background: transparent;
        font-size: 16px;
        color: #1eb0fc;
        cursor: pointer;
      }
      span:last-child {
        margin-left: 20px;
        background: #1eb0fc;
        color: #fff;
      }
    }
  }
  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #00b7ff;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
