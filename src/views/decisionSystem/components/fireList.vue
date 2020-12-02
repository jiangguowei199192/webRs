<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_3.0
 * @Author: liangkaiLee
 * @Date: 2020-11-26 15:31:30
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2020-12-02 14:22:40
-->
<template>
  <div>
    <!-- 火情列表 -->
    <div class="fire_list">
      <div class="list_header">
        <div class="title">火情列表</div>
        <div class="add" @click.stop="addFire"></div>
      </div>
      <div class="list_content webFsScroll">
        <div
          style="text-align: center; line-height: 96px"
          v-if="!todayFireInfos || todayFireInfos.length == 0"
        >
          <h3 style="color: #1eb0fc">暂无火情</h3>
        </div>
        <div
          v-else
          style="margin-bottom: 13px"
          v-for="(fire_item, fire_index) in todayFireInfos"
          :key="fire_index"
        >
          <div class="top">
            <el-tooltip
              popper-class="gTooltip plotTooltip"
              :content="fire_item.deviceName"
              placement="top"
              :open-delay="500"
            >
              <span
                ><img :src="fireImg" alt="" />{{ fire_item.deviceName }}</span
              ></el-tooltip
            >
            <span>三级</span>
          </div>
          <div class="bottom">
            <div>
              <span>时间：{{ fire_item.alarmTime }}</span>
              <el-tooltip
                popper-class="gTooltip plotTooltip"
                :content="fire_item.alarmAddress"
                placement="top"
                :open-delay="500"
                ><span>地点：{{ fire_item.alarmAddress }}</span></el-tooltip
              >
            </div>
            <div>出动</div>
          </div>
        </div>
      </div>
      <div class="list_bottom">
        <span v-for="(btn_item, btn_index) in btnAction" :key="btn_index"
          ><img :src="btn_item.iconSrc" alt="" />{{ btn_item.content }}
        </span>
      </div>
    </div>
    <!-- 新增火情 -->
    <div class="fire_add">
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="1000px"
        class="dialog_wrap"
      >
        <div class="add_header">
          <div class="title">新增案件</div>
          <div class="close" @click.stop="closeDialog">×</div>
        </div>
        <div class="add_content">
          <el-form
            ref="addFireRef"
            label-width="90px"
            :inline="true"
            :model="addFireForm"
            :rules="addFireRules"
          >
            <div class="content_info">
              <el-form-item label="火情编号">
                <el-input
                  placeholder="自动生成"
                  :disabled="true"
                  v-model="addFireForm.number"
                ></el-input
              ></el-form-item>
              <el-form-item label="案件名称" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.name"
                ></el-input>
              </el-form-item>
            </div>
            <div class="content_info">
              <el-form-item label="信息来源" prop="source">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.source"
                ></el-input>
              </el-form-item>
              <el-form-item label="报警人" prop="person">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.person"
                ></el-input>
              </el-form-item>
            </div>
            <div class="content_info">
              <el-form-item label="报警电话" prop="phone">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.phone"
                ></el-input>
              </el-form-item>
              <el-form-item label="举报地址" prop="address">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.address"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item label="手动定位" prop="coord">
              <div style="width: 850px; height: 180px">
                <gMap
                  ref="gduMap"
                  handleType="devMap"
                  :bShowSimpleSearchTools="true"
                  :bShowBasic="false"
                  :bShowMeasure="false"
                  :bShowLonLat="false"
                  :bAutoLocate="false"
                ></gMap>
              </div>
            </el-form-item>
            <el-form-item label="报警时间" prop="time">
              <el-date-picker
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="addFireForm.time"
              ></el-date-picker> </el-form-item
            ><br />
            <el-form-item label="简要描述" prop="description">
              <el-input
                placeholder="请输入"
                type="textarea"
                v-model="addFireForm.description"
              ></el-input> </el-form-item
            ><br />
            <el-form-item label="重点记录" prop="record">
              <el-input
                placeholder="请输入"
                type="textarea"
                v-model="addFireForm.record"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="add_bottom">
          <span class="btn_cancel" @click.stop="closeDialog">取消</span>
          <span class="btn_confirm" @click.stop="addFireSubmit">确定</span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fireListApi } from '@/api/fireList'
import { isNotNull, limitLength, selectValidator } from '@/utils/validate'
import { timeFormat } from '@/utils/date'

export default {
  name: 'fireList',

  data () {
    return {
      dialogVisible: false,
      // 今日火情信息
      todayFireInfos: [],
      // 动作按钮
      btnAction: [
        {
          id: 0,
          iconSrc: require('../../../assets/images/fire-list/fire_nor.png'),
          content: '标记火点'
        },
        {
          id: 1,
          iconSrc: require('../../../assets/images/fire-list/fight.png'),
          content: '加入战斗'
        },
        {
          id: 2,
          iconSrc: require('../../../assets/images/fire-list/sync.png'),
          content: '警情同步'
        }
      ],
      // 火情icon
      fireImg: require('../../../assets/images/fire-list/fire.png'),
      // 表单字段
      addFireForm: {
        number: '',
        name: '',
        source: '',
        person: '',
        phone: '',
        address: '',
        time: '',
        description: '',
        record: '',
        coord: ''
      },
      // 验证规则
      addFireRules: {
        name: isNotNull('请输入案件名称').concat(limitLength(1, 30)),
        source: isNotNull('请输入信息来源').concat(limitLength(1, 50)),
        person: isNotNull('请输入报警人')
          .concat(limitLength(1, 15))
          .concat(selectValidator('validateUsername')),
        address: isNotNull('请输入报警地址').concat(limitLength(1, 50)),
        coord: isNotNull('请选择坐标')
      }
    }
  },

  mounted () {
    this.getTodayFire()
  },

  methods: {
    // 关闭/取消
    closeDialog () {
      this.dialogVisible = false
      this.addFireForm.number = this.addFireForm.name = this.addFireForm.source = this.addFireForm.person = this.addFireForm.phone = this.addFireForm.address = this.addFireForm.time = this.addFireForm.description = this.addFireForm.record = this.addFireForm.coord =
        ''
      this.$refs.addFireRef.resetFields()
    },

    // 新增按钮
    addFire () {
      this.dialogVisible = true
      const _this = this
      setTimeout(() => {
        const tmpMap = this.$refs.gduMap.map2D
        tmpMap.clickEvent.addEventListener((lonlat) => {
          // console.log(lonlat);
          _this.addFireForm.coord = lonlat[0]
          tmpMap.customMarkerLayerManager.clear()
          tmpMap.customMarkerLayerManager.addMarker({
            name: null,
            lon: lonlat[0],
            lat: lonlat[1],
            _bWgs2Gcj: false
          })
        })
        tmpMap._map.updateSize()
        tmpMap.zoomToCenter(114.30196, 30.54486)
        tmpMap.setZoom(12)
      }, 300)
    },

    // 新增火情提交
    addFireSubmit () {
      this.$refs.addFireRef.validate((valid) => {
        if (!valid) return
        const lonlat = this.getSelectedLocation()
        const reportedFire = {
          fireName: this.addFireForm.name,
          infoSource: this.addFireForm.source,
          reportMan: this.addFireForm.person,
          reportTel: this.addFireForm.phone,
          reportAddr: this.addFireForm.address,
          reportTime: this.addFireForm.time,
          longitude: lonlat[0],
          latitude: lonlat[1],
          fireDesc: this.addFireForm.description,
          importantRecord: this.addFireForm.record
        }
        this.$axios
          .post(fireListApi.addFire, reportedFire, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then((res) => {
            console.log('新增火情接口返回: ', res)
            if (res && res.data && res.data.code === 0) {
              this.$notify.success({
                title: '提示',
                message: '新增成功!',
                duration: 5 * 1000
              })
              setTimeout(() => {
                this.dialogVisible = false
              }, 300)
              this.getTodayFire()
              return
            }
            this.$notify.warning({
              title: '提示',
              message: '新增失败!',
              duration: 5 * 1000
            })
          })
          .catch((err) => {
            console.log('接口错误: ' + err)
          })
      })
    },

    // 获取所选位置
    getSelectedLocation () {
      const tmpMap = this.$refs.gduMap
      const tmpFs = tmpMap.map2D.customMarkerLayerManager._source.getFeatures()
      if (tmpFs.length > 0) {
        return tmpFs[0].getGeometry().getCoordinates()
      } else {
        return [tmpMap.lon, tmpMap.lat]
      }
    },

    // 获取今日火情
    getTodayFire () {
      this.$axios
        .get(fireListApi.queryTodayFire)
        .then((res) => {
          // console.log('今日火情接口返回：', res)
          if (res && res.data && res.data.code === 0) {
            const fireDatas = res.data.data.deviceDetectedFire
            const reportedDatas = res.data.data.reportedFire
            if (!fireDatas || fireDatas.length === 0) return
            fireDatas.forEach((fire) => {
              fire.alarmTime = timeFormat(fire.alarmTime)
              this.todayFireInfos.push(fire)
            })
            if (!reportedDatas || reportedDatas.length === 0) return
            reportedDatas.forEach(
              ({
                reportTime: alarmTime,
                fireName: deviceName,
                reportAddr: alarmAddress
              }) => {
                this.todayFireInfos.push({
                  alarmTime,
                  deviceName,
                  alarmAddress
                })
              }
            )
            return
          }
          this.$notify.warning({
            title: '提示',
            message: '暂无火情数据!',
            duration: 5 * 1000
          })
        })
        .catch((err) => {
          console.log('接口错误: ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.fire_list {
  width: 454px;
  height: 225px;
  background: url(../../../assets/images/fire-list/firelist_wrap.png) no-repeat
    center/100%;
  padding: 16px 14px 10px 10px;
  .list_header {
    .add {
      width: 30px;
      height: 30px;
      line-height: 30px;
      background: url(../../../assets/images/fire-list/add.png) no-repeat
        center/100%;
      cursor: pointer;
    }
  }
  .list_content {
    width: 415px;
    height: 96px;
    border: 1px solid #1eb0fc;
    margin: 15px 0 0 4px;
    padding: 12px 15px;
    overflow-y: auto;
    .top,
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .top {
      span:nth-child(1) {
        color: #ffd800;
        width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        img {
          width: 34px;
          height: 34px;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
      span:nth-child(2) {
        display: block;
        width: 44px;
        height: 20px;
        background: #ffd800;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
        color: #000;
      }
    }
    .bottom {
      font-size: 14px;
      margin-top: 10px;
      div:nth-child(1) {
        display: flex;
        flex-direction: column;
        margin-left: 40px;
        span:nth-child(2) {
          margin-top: 5px;
          width: 250px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      div:nth-child(2) {
        width: 47px;
        height: 47px;
        line-height: 47px;
        text-align: center;
        background: url(../../../assets/images/fire-list/action.png) no-repeat
          center/100%;
      }
    }
  }
  .list_bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 15px;
    span {
      width: 144px;
      height: 38px;
      line-height: 38px;
      border: 1px solid #1eb0fc;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
}
.list_header,
.add_header {
  display: flex;
  justify-content: space-between;
  .title {
    width: 165px;
    height: 34px;
    line-height: 34px;
    background: url(../../../assets/images/fire-list/info-title.png) no-repeat
      center/100%;
    padding-left: 15px;
    font-size: 16px;
    font-weight: bold;
  }
}
.fire_add {
  .dialog_wrap {
    background-color: rgba($color: #040404, $alpha: 0.86);
    top: -40px;
    /deep/.el-dialog {
      background-color: transparent;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
        height: 755px;
        background: url(../../../assets/images/2d/entrytab_dialog.png) no-repeat
          top/100% 100%;
      }
      .add_header {
        padding: 20px 20px 0 20px;
        color: #fff;
        .close {
          font-size: 30px;
          cursor: pointer;
        }
      }
      .add_content {
        margin: 25px 30px 0 20px;
        .content_info {
          display: flex;
          justify-content: space-between;
        }
        .el-input__inner {
          width: 310px;
        }
        .el-textarea__inner {
          width: 850px;
          height: 64px;
        }
        .el-input__inner,
        .el-textarea__inner {
          border: 1px solid #0fbfe0;
          background-color: transparent;
          color: rgb(243, 243, 243);
        }
        .el-form-item__label {
          color: #0fbfe0;
          font-size: 15px;
        }
      }
      .add_bottom {
        padding: 0 40px;
        display: flex;
        justify-content: flex-end;
        .btn_confirm,
        .btn_cancel {
          display: block;
          width: 87px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          border: 1px solid #1eb0fc;
          border-radius: 4px;
          font-size: 15px;
          cursor: pointer;
        }
        .btn_confirm {
          background: #1eb0fc;
          color: #fff;
        }
        .btn_cancel {
          background: transparent;
          color: #1eb0fc;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
