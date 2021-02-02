<template>
  <div class="commentBox">
    <div class="stepContainer">
      <div class="stepBox webFsScroll">
        <el-steps direction="vertical" :active="activeStep" :space="80">
          <el-step
            :title="activity.content"
            v-for="(activity, index) in activities"
            :key="index"
          >
            <template slot="description">
              <div class="descBox">
                <el-date-picker
                  ref="datepicker"
                  class="date"
                  :class="{ disable: index !== activeStep }"
                  v-model="activity.eventTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  :clearable="false"
                  value-format="timestamp"
                  @blur="datepickerBlur"
                ></el-date-picker>
                <el-input
                  ref="input"
                  :readonly="activity.readonly"
                  class="name"
                  v-model="activity.eventName"
                  placeholder="自定义事件"
                  maxlength="10"
                  :class="{ active: !activity.readonly }"
                  @blur="inputBlur(index)"
                ></el-input>
                <span
                  @click.stop="setEditMode(true, index)"
                  :class="{ disable: index !== activeStep }"
                  @mousedown="editMouseDown($event)"
                ></span>
                <span
                  v-show="!activity.eventTime"
                  @click.stop="showDatePicker(index)"
                  :class="{ disable: index !== activeStep }"
                  @mousedown="editMouseDown($event)"
                ></span>
                <span
                  @click.stop="deleteComment(index)"
                  :class="{ disable: index !== activeStep }"
                ></span>
                <span
                  v-show="activity.eventTime"
                  @click.stop="showDatePicker(index)"
                  :class="{ disable: index !== activeStep }"
                  @mousedown="editMouseDown($event)"
                  >{{ timeFormat2(activity.eventTime) }}</span
                >
                <span class="num" @click.stop="stepNumClick(index)"></span>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
      <div class="addBox" @click.stop="addComment">
        <div></div>
        <div>
          <span></span>
        </div>
      </div>
    </div>
    <div class="dataBox">
      <div class="title">
        <span></span>
        <span>数据</span>
      </div>
      <div class="data">
        <el-form
          :model="form"
          :inline="true"
          label-width="92px"
          :rules="formRules"
          ref="dataForm"
        >
          <template v-for="(item, index) in form.datas">
            <el-form-item :label="item.text" :prop="item.type" :key="index">
              <el-input
                v-model.number="form[item.type]"
                type="number"
                @input="checkNum($event, item)"
              ></el-input>
            </el-form-item>
          </template>
          <el-form-item class="note" prop="describe">
            <span class="dTitle" slot="label">
              <span></span>
              <span>描述</span>
            </span>
            <el-input
              type="textarea"
              resize="none"
              v-model="form.describe"
              maxlength="200"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="title">
        <span></span>
        <span>文件</span>
      </div>
      <div class="fileBox battleUpload">
        <el-upload
          ref="upload"
          :limit="1"
          :file-list="uploadList"
          :action="uploadUrl"
          :on-remove="onRemoveFile"
          :before-upload="beforeUpload"
          name="file"
          :headers="headers"
          :on-success="handleUploadSuccess"
          :on-exceed="handleUploadExceed"
        >
          <div class="upload">
            <span></span>
            <span>上传文件</span>
          </div>
          <span slot="tip" class="tip">{{ defaultName }}</span>
        </el-upload>
        <span
          class="car"
          :style="{ background: 'url(' + serverUrl + curIcon + ') no-repeat' }"
        ></span>
        <el-popover
          placement="top"
          trigger="click"
          popper-class="iconPopover"
          v-model="showPopover"
        >
          <div class="iconBox">
            <span class="close" @click.stop="showPopover = false"></span>
            <span
              @click.stop="selectIcon(item)"
              class="icon"
              v-for="(item, index) in icons"
              :key="index"
              :style="{
                background: 'url(' + serverUrl + item.path + ') no-repeat',
              }"
            ></span>
          </div>
          <div slot="reference" class="upload uploadIcon">
            <span></span>
            <span>*</span>
            <span>选择图标</span>
          </div>
        </el-popover>
      </div>
      <div class="btns">
        <span @click.stop="lastStep">上一步</span>
        <span @click.stop="cancel()">取消</span>
        <span @click.stop="submitEvent">完成</span>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFormat2 } from '@/utils/date'
import { battleApi } from '@/api/battle.js'
import {
  stringIsNullOrEmpty,
  isNotNull,
  limitLength,
  limitIntegerRange
} from '@/utils/validate'
import globalApi from '@/utils/globalApi'
export default {
  data () {
    return {
      uploading: false,
      uploadUrl: '',
      headers: { Authorization: '' },
      showPopover: false,
      activeStep: 0,
      curIcon: '',
      defaultName: '可上传文件和视频',
      serverUrl: globalApi.headImg,
      icons: [
        {
          path: '/cloud-oneMap/combatEvent/1608349933941_1608349933941.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350408597_1608350408597.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350573010_1608350573010.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350504537_1608350504537.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350546000_1608350546000.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350378214_1608350378214.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350440076_1608350440076.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350478586_1608350478586.png'
        }
      ],
      formRules: {
        attendanceVehicle: isNotNull('请输入出勤车辆').concat(
          limitIntegerRange(0, 999)
        ),
        attendancePeople: isNotNull('请输入出勤无人机').concat(
          limitIntegerRange(0, 9999)
        ),
        attendanceUav: isNotNull('请输入出勤人数').concat(
          limitIntegerRange(0, 999)
        ),
        foam: isNotNull('请输入出请输入泡沫勤车辆').concat(
          limitIntegerRange(0, 999)
        ),
        waterSource: isNotNull('请输入水源').concat(limitIntegerRange(0, 999)),
        dryPowder: isNotNull('请输入干粉').concat(limitIntegerRange(0, 999)),
        fireExtinguisher: isNotNull('请输入灭火器').concat(
          limitIntegerRange(0, 999)
        ),
        describe: isNotNull('请输入描述').concat(limitLength(1, 200))
      },

      form: {
        describe: '',
        attendanceVehicle: '',
        attendancePeople: '',
        attendanceUav: '',
        waterSource: '',
        foam: '',
        dryPowder: '',
        fireExtinguisher: '',
        datas: [
          {
            text: '出勤车辆',
            type: 'attendanceVehicle',
            maxlength: 3
          },
          {
            text: '出勤人数',
            type: 'attendancePeople',
            maxlength: 4
          },
          {
            text: '出勤无人机',
            type: 'attendanceUav',
            maxlength: 3
          },
          {
            text: '水源',
            type: 'waterSource',
            maxlength: 3
          },
          {
            text: '泡沫',
            type: 'foam',
            maxlength: 3
          },
          {
            text: '干粉',
            type: 'dryPowder',
            maxlength: 3
          },
          {
            text: '灭火器',
            type: 'fireExtinguisher',
            maxlength: 3
          }
        ]
      },
      uploadList: [],
      event: {
        eventName: '',
        eventTime: '',
        readonly: true,
        fileName: '',
        eventFileUrl: '', // 文件URL
        attendancePeople: '', // 到达人数
        attendanceUav: '', // 到达无人机
        attendanceVehicle: '', // 到达车辆
        dryPowder: '', // 干粉
        eventDescription: '', // 描述
        fireExtinguisher: '', // 灭火器
        foam: '', // 泡沫
        icon: '', // 图标
        waterSource: '' // 水源
      },
      isRequest: false,
      activities: [],
      fileTypes: ['mp4', 'png', 'jpg', 'jpeg'],
      isInit: false
    }
  },
  props: {
    combatId: {
      type: Number,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    eventDatas: {
      type: Array,
      required: true
    },
    lastObj: {
      type: Object,
      required: true
    }
  },
  watch: {
    activeStep (val, oldVal) {
      this.saveEventData(oldVal)
      this.setEventData(val)
    }
  },
  methods: {
    timeFormat2,
    /**
     * 取消
     */
    cancel () {
      this.$router.go(-1)
      this.refs.upload.abort()
    },
    /**
     * 校验事件时间是否合法
     */
    checkEventTime (time) {
      const start = new Date(this.lastObj.fireData.fireTimeStart).getTime()
      const end = new Date(this.lastObj.fireData.fireTimeEnd).getTime()
      if (time > end || time < start) return false
      else return true
    },
    /**
     * 校验时间是否合法
     */
    datepickerBlur () {
      const time = this.activities[this.activeStep].eventTime
      if (!this.checkEventTime(time)) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '已超过受灾时间范围，请重新选择'
        })
        this.activities[this.activeStep].eventTime = ''
      }
    },
    /**
     * 校验战评事件输入数据
     */
    checkNum (str, item) {
      if (str.length > item.maxlength) {
        this.form[item.type] = str.slice(0, item.maxlength)
      }
    },
    /**
     * 显示日期时间选择器
     */
    showDatePicker (index) {
      this.$refs.datepicker[index].focus()
    },
    /**
     * 阻止编辑按钮按下时，input失去焦点
     */
    editMouseDown (event) {
      this.showPopover = false
      event.preventDefault()
    },
    /**
     * 设置编辑模式
     */
    setEditMode (canEdit, index) {
      this.activities[index].readonly = !canEdit
      if (canEdit) {
        this.$refs.input[index].focus()
      }
    },
    /**
     * 删除战评
     */
    deleteComment (index) {
      this.showPopover = false
      if (index < 5) {
        this.activities.splice(
          index,
          1,
          JSON.parse(JSON.stringify(this.event))
        )
        this.setEventData(index)
      } else {
        this.activities.splice(index, 1)
        if (this.activeStep > this.activities.length - 1) {
          this.activeStep = this.activities.length - 1
        } else this.setEventData(this.activeStep)
      }
    },
    /**
     * input失去焦点
     */
    inputBlur (index) {
      this.activities[index].readonly = true
    },
    /**
     *  上传图片或视频
     */
    upload () {
      this.$refs.uploadFile.click()
    },
    /**
     *  新增站评
     */
    addComment () {
      this.showPopover = false
      var clone = JSON.parse(JSON.stringify(this.event))
      this.activities.push(clone)
      this.activeStep = this.activities.length - 1
    },
    /**
     *  选择图标
     */
    selectIcon (item) {
      this.showPopover = false
      this.curIcon = item.path
    },
    // 移除上传文件
    onRemoveFile (file, fileList) {
      this.activities[this.activeStep].fileName = ''
      this.activities[this.activeStep].eventFileUrl = ''
    },
    // 上传图片前的处理
    beforeUpload (file) {
      const fileType = file.name
        .substring(file.name.lastIndexOf('.') + 1, file.name.length)
        .toLowerCase()
      if (this.fileTypes.indexOf(fileType) === -1) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '只能上传图片或者视频'
        })
        return false
      }

      // 找出当前上传了多少个图片和视频
      const files = this.activities.filter((a) => a.eventFileUrl)
      let totalImg = 0
      let totalVideo = 0
      files.forEach((f) => {
        const fileType = f.eventFileUrl
          .substring(f.eventFileUrl.lastIndexOf('.') + 1, f.eventFileUrl.length)
          .toLowerCase()
        if (fileType === 'mp4') {
          totalVideo += 1
        } else {
          totalImg += 1
        }
      })
      if (fileType === 'mp4' && totalVideo >= 5) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '视频个数已到达上限5，无法上传'
        })
        return false
      } else if (fileType !== 'mp4' && totalImg >= 10) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '图片个数已到达上限10，无法上传'
        })
        return false
      }
      const maxSize = fileType === 'mp4' ? 20 : 3
      if (file.size > maxSize * 1024 * 1024) {
        const message =
          fileType === 'mp4'
            ? '单个视频大小不能超过20M'
            : '单个图片大小不能超过3M'
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: message
        })
        return false
      }
      this.uploading = true
    },
    /**
     *  上传文件超出限制
     */
    handleUploadExceed () {
      this.$notify.closeAll()
      this.$notify.warning({
        title: '警告',
        message: '当前位置已上传文件，如果需要替换，请删除原有文件后重新上传'
      })
    },
    /**
     *  上传成功
     */
    handleUploadSuccess (response, file) {
      this.uploading = false
      if (response.code === 0 && response.data) {
        this.activities[this.activeStep].fileName = file.name
        this.activities[this.activeStep].eventFileUrl = response.data
      } else { this.uploadList = [] }
    },
    /**
     *  判断文件是否正在上传中
     */
    isUploadingFile () {
      if (this.uploading) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '文件正在上传中，请稍后操作'
        })
        return true
      }
      return false
    },
    /**
     *  点击步骤
     */
    stepNumClick (index) {
      if (this.isUploadingFile()) {
        return
      }
      this.activeStep = index
      this.showPopover = false
    },
    /**
     *  设置事件的数据
     */
    setEventData (index) {
      if (index >= this.activities.length) return
      const data = this.activities[index]
      for (var b in data) {
        if (Object.prototype.hasOwnProperty.call(this.form, b)) {
          this.form[b] = data[b]
        }
      }
      this.form.describe = data.eventDescription
      this.curIcon = data.icon
      this.uploadList = []
      if (data.eventFileUrl) {
        const file = {
          name: data.fileName,
          url: globalApi.headImg + data.eventFileUrl
        }
        this.uploadList.push(file)
      }
      this.$refs.dataForm.validate((v) => {})
    },
    /**
     *  缓存事件的数据
     */
    saveEventData (index) {
      if (index >= this.activities.length) return
      const activity = this.activities[index]
      for (var b in activity) {
        if (Object.prototype.hasOwnProperty.call(this.form, b)) {
          activity[b] = this.form[b]
        }
      }
      activity.eventDescription = this.form.describe
      activity.icon = this.curIcon
    },
    /**
     *  新增战评事件
     */
    addBattleEvent (data) {
      const config = {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      }
      this.$axios
        .post(battleApi.combatEventAdd, data, config)
        .then((res) => {
          this.isRequest = false
          if (res.data.code === 0) {
            this.$router.push({ path: '/battleReview' })
          }
        })
        .catch((err) => {
          this.isRequest = false
          console.log('combatEventAdd Err : ' + err)
        })
    },
    lastStep () {
      if (this.isUploadingFile()) {
        return
      }
      this.lastObj.bNext = false
    },
    /**
     *  新增战评
     */
    addBattle (eventDatas) {
      const config = {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      }
      this.$axios
        .post(battleApi.addNewBattleReview, this.lastObj.fireData, config)
        .then((res) => {
          if (res.data.code === 0) {
            const combatId = res.data.data
            eventDatas.forEach((e) => {
              e.combatId = combatId
            })
            this.addBattleEvent(eventDatas)
          } else {
            this.isRequest = false
            console.log(battleApi.addNewBattleReview + '.Err:', res)
          }
        })
        .catch((error) => {
          this.isRequest = false
          console.log(battleApi.addNewBattleReview + '.Excep : ' + error)
        })
    },
    /**
     *  编辑战评
     */
    editBattle (eventDatas) {
      const config = {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      }
      this.$axios
        .post(battleApi.updateBattleReview, this.lastObj.fireData, config)
        .then((res) => {
          if (res.data.code === 0) {
            eventDatas.forEach((e) => {
              e.combatId = this.combatId
            })
            if (this.eventDatas && this.eventDatas.length > 0) {
              this.$axios
                .post(battleApi.delCombatEvent, { combatId: this.combatId })
                .then((res) => {
                  if (res.data.code === 0) {
                    this.addBattleEvent(eventDatas)
                  } else this.isRequest = false
                })
                .catch((error) => {
                  this.isRequest = false
                  console.log('deleteBattleReview Err : ' + error)
                })
            } else {
              this.addBattleEvent(eventDatas)
            }
          } else {
            this.isRequest = false
            console.log(battleApi.addNewBattleReview + '.Err:', res)
          }
        })
        .catch((error) => {
          this.isRequest = false
          console.log(battleApi.addNewBattleReview + '.Excep : ' + error)
        })
    },
    initData () {
      this.uploading = false
      if (this.isInit) {
        this.activeStep = 0
        return
      }
      this.isInit = true
      this.event.icon = this.icons[0].path
      if (this.isEdit) {
        this.eventDatas.forEach((e) => {
          var data = JSON.parse(JSON.stringify(this.event))
          for (var b in data) {
            if (Object.prototype.hasOwnProperty.call(e, b)) {
              data[b] = e[b]
            }
          }
          if (e.eventFileUrl) {
            var pos = e.eventFileUrl.lastIndexOf('/')
            data.fileName = e.eventFileUrl.substring(pos + 1)
          }
          data.eventTime = new Date(data.eventTime).getTime()
          this.activities.push(data)
        })
        const len = 5 - this.activities.length
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            var c = JSON.parse(JSON.stringify(this.event))
            this.activities.push(c)
          }
        }
        this.setEventData(0)
      } else {
        this.curIcon = this.icons[0].path
        for (let i = 0; i < 5; i++) {
          var clone = JSON.parse(JSON.stringify(this.event))
          this.activities.push(clone)
        }
        this.activities[0].eventName = '发现火情'
      }
    },
    /**
     *  提交事件
     */
    submitEvent () {
      if (this.isRequest) return
      if (this.isUploadingFile()) {
        return
      }
      let valid = true
      if (
        this.activities[this.activeStep].eventName ||
        this.activities[this.activeStep].eventTime
      ) {
        this.$refs.dataForm.validate((v) => {
          valid = v
        })
      }
      if (!valid) return
      this.saveEventData(this.activeStep)
      // 检查是否有未填写的内容
      let i = 0
      const data = []
      for (; i < this.activities.length; i++) {
        const ac = JSON.parse(JSON.stringify(this.activities[i]))
        delete ac.readonly
        delete ac.eventFileUrl
        delete ac.fileName
        const ac2 = JSON.parse(JSON.stringify(ac))
        delete ac2.icon
        // 判断属性是否都不为空
        const result = Object.values(ac).every(
          (item) => !stringIsNullOrEmpty(item)
        )
        if (result) {
          const time = this.activities[i].eventTime
          if (!this.checkEventTime(time)) {
            this.$notify.closeAll()
            this.$notify.warning({
              title: '警告',
              message: '事件时间中存在数据超过火灾时间范围，请重新选择'
            })
            return
          }
          ac.eventFileUrl = this.activities[i].eventFileUrl
          data.push(ac)
        } else if (
          !Object.values(ac2).every((item) => stringIsNullOrEmpty(item))
        ) {
          // 属性不都为空
          // console.log(ac2)
          valid = false
          break
        }
      }
      if (!valid) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '步骤' + (i + 1) + '有未填写内容，请填写后保存'
        })
        return
      }
      if (data.length === 0) {
        this.$notify.closeAll()
        this.$notify.warning({ title: '警告', message: '请先填写步骤后保存' })
        return
      }
      this.isRequest = true
      if (this.isEdit) {
        this.editBattle(data)
      } else this.addBattle(data)
    }
  },
  mounted () {
    let token = ''
    token = sessionStorage.getItem('token')
    this.headers = { Authorization: token }
    this.uploadUrl = globalApi.baseUrl + '/fms-one-map/combatEvent/upload'
  }
}
</script>

<style lang="scss" scoped>
.commentBox {
  width: 1121px;
  height: 786px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  .stepContainer {
    display: flex;
    flex-direction: column;
    .addBox {
      position: relative;
      top: -46px;
      left: 100px;
      width: 34px;
      div:nth-child(1) {
        width: 1px;
        height: 46px;
        background: #00ccff;
        margin-left: 17px;
      }
      div:nth-child(2) {
        cursor: pointer;
        width: 34px;
        height: 34px;
        border: 1px solid #00ccff;
        border-radius: 50%;
        box-sizing: border-box;
        span {
          margin-top: 8px;
          margin-left: 8px;
          display: inline-block;
          width: 15px;
          height: 15px;
          background: url(../../assets/images/fireBattle/+.png) no-repeat;
        }
      }
      div:nth-child(2):active {
        background: #00ccff;
        span {
          background: url(../../assets/images/fireBattle/+-select.png) no-repeat;
        }
      }
    }
    .stepBox {
      overflow-y: auto;
      max-height: 640px;
      margin-top: 90px;
      width: 350px;
      padding: 0px 10px 0px 0px;
      box-sizing: border-box;
      /deep/.el-step {
        margin-left: 100px;
      }
      /deep/.el-step__icon.is-text {
        border: 1px solid #00ccff;
      }
      /deep/.el-step__icon {
        width: 34px;
        height: 34px;
        background: transparent;
        color: #00ccff;
      }
      /deep/ .el-step.is-vertical .el-step__line {
        width: 1px;
        top: 34px;
        left: 17px;
        background-color: #00ccff;
      }
      /deep/.el-step__line-inner {
        border-style: none;
      }
      /deep/.el-step.is-vertical .el-step__title {
        padding-bottom: 0px;
      }
      /deep/.el-step__description {
        margin-top: 0px;
        padding-right: 0px;
      }
      /deep/.el-step__head.is-wait {
        color: #c0c4cc !important;
        border-color: #c0c4cc;
      }
      /deep/.el-step__head.is-process {
        .el-step__icon {
          background: #00ccff;
          color: #fff;
        }
      }
      .descBox {
        position: relative;
        span:nth-child(3),
        span:nth-child(4),
        span:nth-child(5),
        span:nth-child(6),
        span:nth-child(7) {
          display: inline-block;
          position: absolute;
          cursor: pointer;
        }
        span:nth-child(3) {
          width: 18px;
          height: 18px;
          background: url(../../assets/images/fireBattle/edit.png) no-repeat;
          right: 0px;
          top: 8px;
        }
        span:nth-child(4) {
          width: 24px;
          height: 24px;
          background: url(../../assets/images/fireBattle/calendar.png) no-repeat;
          left: -70px;
          top: 5px;
        }
        span:nth-child(5) {
          width: 24px;
          height: 24px;
          background: url(../../assets/images/fireBattle/delete.png) no-repeat;
          left: -128px;
          top: 5px;
        }
        span:nth-child(6) {
          width: 48px;
          line-height: 14px;
          color: #fff;
          text-align: right;
          left: -94px;
          top: 3px;
        }
        span:nth-child(3).disable,
        span:nth-child(4).disable,
        span:nth-child(5).disable,
        span:nth-child(6).disable {
          opacity: 0.5;
          pointer-events: none;
        }
        .name.el-input {
          width: auto;
          box-sizing: border-box;
          margin-left: 10px;
          margin-right: 28px;
          /deep/.el-input__inner {
            background-color: transparent;
            border-radius: 0px;
            border: none;
            color: #00ccff;
            height: 34px;
            line-height: 34px;
            padding: 0px 2px;
            border: 1px solid transparent;
          }
          /deep/.el-input__inner::placeholder {
            color: #c5f3ff;
          }
        }
        /deep/.name.el-input.active .el-input__inner {
          border: 1px solid #00ccff;
        }
        .date {
          position: absolute;
          left: -100px;
          /deep/.el-input__inner {
            opacity: 0;
            pointer-events: none;
          }
          /deep/.el-input__prefix {
            display: none;
          }
        }
        .date.disable {
          /deep/.el-input__inner {
            pointer-events: none;
          }
        }
        .num {
          z-index: 10;
          left: -34px;
          width: 34px;
          height: 34px;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
  }
  .dataBox {
    width: 749px;
    height: 487px;
    border: 1px solid #00ccff;
    position: absolute;
    top: 80px;
    left: 370px;
    background: linear-gradient(90deg, #08111f7f, #1339637f);
    .title {
      width: 100%;
      height: 21px;
      box-sizing: border-box;
      margin-top: 16px;
      margin-left: 21px;
      span:nth-child(1) {
        display: inline-block;
        width: 21px;
        height: 16px;
        background-image: url("../../assets/images/fire_title.png");
        margin-right: 10px;
        position: relative;
        top: 2px;
      }
      span:nth-child(2) {
        line-height: 21px;
      }
    }
    .data {
      margin-top: 6px;
      display: flex;
      flex-wrap: wrap;
      margin-left: 52px;
      /deep/.el-form-item__label {
        text-align: left;
        font-size: 14px;
        color: #ffffff;
        line-height: 50px;
      }
      /deep/.el-form-item__content {
        line-height: 50px;
      }
      /deep/.el-form-item__error {
        margin-top: -10px;
      }
      /deep/.el-input {
        width: 112px;
        margin-right: 20px;
        .el-input__inner {
          background: #09546d4c;
          border-radius: 0px;
          border: 1px solid #27bce5;
          color: #00ccff;
          height: 26px;
        }
      }
    }
    .note {
      margin-top: 4px;
      /deep/.el-textarea {
        margin-top: 6px;
        width: 668px;
        height: 70px;
        background: #09546d4c;
        margin-bottom: 12px;
        .el-textarea__inner {
          height: 100%;
          background-color: transparent;
          border-radius: 0px;
          border: 1px solid #27bce5;
          color: #00ccff;
          line-height: 26px;
        }
      }
    }
    .dTitle {
      position: relative;
      left: -38px;
      box-sizing: border-box;
      span:nth-child(1) {
        display: inline-block;
        width: 21px;
        height: 16px;
        background-image: url("../../assets/images/fire_title.png");
        position: relative;
        top: 2px;
      }
      span:nth-child(2) {
        line-height: 40px;
        font-size: 16px;
        position: relative;
        left: 16px;
      }
    }
    .fileBox {
      display: flex;
      //align-items: center;
      margin-left: 51px;
      margin-top: 18px;
      .car {
        display: inline-block;
        height: 28px;
        width: 28px;
        margin-left: 70px;
      }
      .tip {
        font-size: 12px;
        color: #ffffff;
        opacity: 0.4;
        margin-left: 16px;
      }
      .upload {
        width: 100px;
        height: 32px;
        border: 1px solid #27bce5;
        box-sizing: border-box;
        background: #09546d4c;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        span:nth-child(1) {
          display: inline-block;
          width: 14px;
          height: 13px;
          background: url("../../assets/images/fireBattle/upload.png") no-repeat;
          margin-right: 11px;
        }
      }
      .uploadIcon {
        margin-left: 15px;
        span:nth-child(1) {
          width: 15px;
          height: 15px;
          background: url("../../assets/images/fireBattle/selectIcon.png")
            no-repeat;
        }
        span:nth-child(2) {
          color: #f56c6c;
          margin-right: 2px;
        }
      }
    }
    .btns {
      position: absolute;
      bottom: 17px;
      right: 30px;
      span {
        cursor: pointer;
        box-sizing: border-box;
        display: inline-block;
        width: 87px;
        height: 32px;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        font-size: 16px;
        line-height: 32px;
        text-align: center;
        background: #1eb0fc;
        color: #fff;
      }
      span:active {
        opacity: 0.8;
      }
      span:nth-child(2) {
        margin-left: 20px;
        margin-right: 20px;
        background: transparent;
        color: #1eb0fc;
      }
    }
  }
}
</style>
