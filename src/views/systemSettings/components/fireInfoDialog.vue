<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_2.0
 * @Author: liangkaiLee
 * @Date: 2021-02-26 13:33:14
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-03 09:38:27
-->
<template>
  <div>
    <el-dialog
      :visible.sync="isShow"
      :close-on-click-modal="false"
      width="460px"
      class="add-dict-dlg dialog-wrap"
    >
      <div class="add-dict-header">
        <div class="header-icon"></div>
        <div class="header-text">{{ title }}</div>
      </div>
      <el-form
        ref="fireListForm"
        :model="fireListForm"
        :inline="true"
        label-width="80px"
        class="add-dict-form"
      >
        <el-form-item label="接警时间 :" prop="time">
          <el-input
            v-model="fireListForm.time"
            :placeholder="placeholder"
            :readonly="isReadonly"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型 :" prop="type">
          <el-input
            v-model="fireListForm.type"
            :placeholder="placeholder"
            :readonly="isReadonly"
          ></el-input>
        </el-form-item>
        <el-form-item label="报警设备 :" prop="device">
          <el-input
            v-model="fireListForm.device"
            :placeholder="placeholder"
            :readonly="isReadonly"
          ></el-input>
        </el-form-item>
        <el-form-item label="经纬度 :" prop="longlat">
          <el-input
            v-model="fireListForm.longlat"
            :placeholder="placeholder"
            :readonly="isReadonly"
          ></el-input>
        </el-form-item>
        <el-form-item label="报警图片 :" prop="image">
          <div class="img-box">
            <el-image
              fit="fill"
              class="img-box-item"
              :src="imgSrc1"
              @click.stop="previewImg(1)"
            >
            </el-image>
            <el-image
              fit="fill"
              class="img-box-item"
              :src="imgSrc2"
              @click.stop="previewImg(2)"
            >
            </el-image>
          </div>
        </el-form-item>
        <el-form-item
          label="报警地点 :"
          prop="address"
          style="margin-bottom: 5px"
        >
          <el-input
            v-model="fireListForm.address"
            :placeholder="placeholder"
            :readonly="isReadonly"
          ></el-input>
        </el-form-item>
        <div class="map-box">
          <gMap
            class="gduMap"
            ref="gduMap"
            handleType="devMap"
            :bShowSimpleSearchTools="false"
            :bShowBasic="false"
            :bShowMeasure="false"
            :bShowLonLat="false"
            :bAutoLocate="false"
          ></gMap>
        </div>
      </el-form>
      <div class="handelBtns">
        <div v-if="fireListForm.showConfirm" class="span-box">
          <span @click.stop="confirmFireDetail('confirmed')">确认</span>
          <span @click.stop="confirmFireDetail('mistaken')">误报</span>
        </div>
        <span style="margin-left:20px;" @click.stop="updateIsShow">取消</span>
      </div>
    </el-dialog>
    <!-- 预览图片弹框 -->
    <el-dialog
      :visible.sync="imgDialogVisible"
      custom-class="el-dialog-custom"
      :show-close="false"
      type="primary"
      @click.native="imgDialogVisible = false"
      center
    >
      <img style="width: 100%;height: 100%;" :src="clickImgSrc" />
    </el-dialog>
  </div>
</template>

<script>
import { fireApi } from '@/api/videoSystem/fireAlarm'

export default {
  props: {
    isShow: { type: Boolean, required: true },
    title: { type: String, required: true },
    fireInfo: { type: Object, required: false }
  },

  data () {
    return {
      placeholder: '暂无数据',
      fireListForm: {
        id: 0,
        time: '',
        type: '',
        device: '',
        longlat: '',
        address: '',
        showConfirm: true
      },
      imgSrc1: '',
      imgSrc2: '',
      isReadonly: true,
      imgDialogVisible: false,
      clickImgSrc: ''
    }
  },

  watch: {
    isShow (val) {
      if (val && this.fireInfo) {
        this.fireListForm.id = this.fireInfo.id
        this.fireListForm.time = this.fireInfo.alarmTime
        this.fireListForm.type = this.fireInfo.alarmTypeName
        this.fireListForm.device = this.fireInfo.deviceName
        this.fireListForm.longlat =
          this.fireInfo.alarmLongitude + ',  ' + this.fireInfo.alarmLatitude
        this.imgSrc1 = this.fireInfo.alarmPicList[0].picPath
        this.imgSrc2 = this.fireInfo.alarmPicList[1].picPath
        this.fireListForm.address = this.fireInfo.alarmAddress
        setTimeout(() => {
          const tmpMap = this.$refs.gduMap.map2D
          tmpMap._map.updateSize()
          tmpMap.zoomToCenter(
            this.fireInfo.alarmLongitude,
            this.fireInfo.alarmLatitude
          )
          tmpMap.customMarkerLayerManager.clear()
          tmpMap.customMarkerLayerManager.addMarker({
            lon: this.fireInfo.alarmLongitude,
            lat: this.fireInfo.alarmLatitude
          })
          tmpMap.setZoom(14)
        }, 300)
        if (
          this.fireInfo.alarmStatus === '确认' ||
          this.fireInfo.alarmStatus === '误报'
        ) {
          this.fireListForm.showConfirm = false
        } else this.fireListForm.showConfirm = true
      }
    }
  },

  methods: {
    // 图片预览
    previewImg (index) {
      this.imgDialogVisible = true
      if (index === 1) this.clickImgSrc = this.imgSrc1
      else this.clickImgSrc = this.imgSrc2
    },

    // 火情确认/误报提交
    confirmFireDetail (type) {
      this.$axios
        .post(
          fireApi.confirmFireAlarmInfo + '/' + this.fireListForm.id + '/' + type
        )
        .then(res => {
          //   console.log('火情确认/误报提交接口返回: ', res)
          if (res && res.data && res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '操作成功!',
              duration: 3 * 1000
            })
            this.$emit('confirmFireClick')
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
      this.updateIsShow()
    },

    // 更新isShow状态
    updateIsShow () {
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-dict-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    .add-dict-form {
      margin-top: 30px;
      .el-input__inner {
        // background-color: rgba($color: #09546d, $alpha: 0.3);
        background-color: transparent;
        border-color: #1eb0fc;
        border-radius: 0;
        width: 370px;
        height: 28px;
        color: #fff;
        font-size: 12px;
        border: none;
      }
      .el-form-item {
        display: block;
        margin: -15px 0 25px 0;
      }
      .el-form-item__label {
        color: #fff;
        font-size: 12px;
      }
      .img-box {
        height: 158px;
        margin-left: 45px;
        border: solid 1px #39a4dd;
        border-radius: 4px;
        .img-box-item {
          width: 196px;
          height: 151px;
          margin: 3px 0 0 3px;
          cursor: pointer;
        }
      }
      .map-box {
        width: 404px;
        height: 158px;
        border: solid 1px #39a4dd;
        border-radius: 4px;
        margin-left: 45px;
        cursor: pointer;
        .gduMap {
          width: 395px;
          height: 147px;
          background-color: #eee;
          margin: 5px 0 0 5px;
        }
      }
    }
    .handelBtns {
      margin-right: 0;
      display: flex;
      justify-content: flex-end;
      span {
        background: #1eb0fc;
        color: #fff;
        border: none;
      }
      .span-box > span:nth-child(1) {
        background: #38c90c;
      }
      .span-box > span:nth-child(2) {
        background: #fc891e;
      }
    }
  }
}
</style>
