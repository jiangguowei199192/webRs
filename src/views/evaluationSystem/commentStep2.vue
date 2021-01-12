<template>
  <div class="commentBox">
    <div class="stepContainer">
      <div class="stepBox webFsScroll">
        <el-steps direction="vertical" :active="activeStep" :space="80">
          <el-step :title="activity.content" v-for="(activity, index) in activities" :key="index">
            <template slot="description">
              <div class="descBox">
                <el-date-picker
                  ref="datepicker"
                  class="date"
                  :class="{disable:index !== activeStep}"
                  v-model="activity.eventTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  :clearable="false"
                  value-format="timestamp"
                ></el-date-picker>
                <el-input
                  ref="input"
                  :readonly="activity.readonly"
                  class="name"
                  v-model="activity.eventName"
                  placeholder="自定义事件"
                  maxlength="10"
                  :class="{active:!activity.readonly}"
                  @blur="inputBlur(index)"
                ></el-input>
                <span
                  @click.stop="setEditMode(true,index)"
                  :class="{disable:index !== activeStep}"
                  @mousedown="editMouseDown($event)"
                ></span>
                <span
                  v-show="!activity.eventTime"
                  @click.stop="showDatePicker(index)"
                  :class="{disable:index !== activeStep}"
                  @mousedown="editMouseDown($event)"
                ></span>
                <span
                  @click.stop="deleteComment(index)"
                  :class="{disable:index !== activeStep}"
                ></span>
                <span
                  v-show="activity.eventTime"
                  @click.stop="showDatePicker(index)"
                  :class="{disable:index !== activeStep}"
                  @mousedown="editMouseDown($event)"
                >{{timeFormat2(activity.eventTime)}}</span>
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
        <div v-for="(item, index) in datas" :key="index">
          <span class="text">{{item.text}}</span>
          <el-input v-model.number="item.value" type="number"></el-input>
        </div>
      </div>
      <div class="title" style="margin-top:0px">
        <span></span>
        <span>描述</span>
      </div>
      <el-input type="textarea" resize="none" v-model="describe" class="describe" maxlength="100"></el-input>
      <div class="title">
        <span></span>
        <span>文件</span>
      </div>
      <div class="fileBox">
        <div class="upload" @click.stop="upload">
          <span></span>
          <span>上传文件</span>
        </div>
        <span
          class="fileDesc"
        >{{ (activities.length > 0 && activities[activeStep].fileName) || defaultName}}</span>
        <span class="car" :style="{background: 'url('+ serverUrl + curIcon +') no-repeat'}"></span>
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
              :style="{background: 'url('+ serverUrl + item.path +') no-repeat'}"
            ></span>
          </div>
          <div slot="reference" class="upload uploadIcon">
            <span></span>
            <span>选择图标</span>
          </div>
        </el-popover>
      </div>
      <input type="file" ref="uploadFile" style="display:none" @change="fileChange" />
      <div class="btns">
        <span @click.stop="$router.go(-1)">取消</span>
        <span @click.stop="submitEvent">完成</span>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFormat2 } from '@/utils/date'
import { battleApi } from '@/api/battle.js'
import { stringIsNullOrEmpty } from '@/utils/validate'
import globalApi from '@/utils/globalApi'
export default {
  data () {
    return {
      showPopover: false,
      activeStep: 0,
      describe: '',
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
      datas: [
        {
          text: '出勤车辆',
          value: '',
          type: 'attendanceVehicle'
        },
        {
          text: '出勤人数',
          value: '',
          type: 'attendancePeople'
        },
        {
          text: '出勤无人机',
          value: '',
          type: 'attendanceUav'
        },
        {
          text: '水源',
          value: '',
          type: 'waterSource'
        },
        {
          text: '泡沫',
          value: '',
          type: 'foam'
        },
        {
          text: '干粉',
          value: '',
          type: 'dryPowder'
        },
        {
          text: '灭火器',
          value: '',
          type: 'fireExtinguisher'
        }
      ],
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
      activities: [],
      fileTypes: ['mp4', 'png', 'jpg', 'jpeg']
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
    /**
     *  文件选择完毕
     */
    fileChange (e) {
      if (e.target.files.length <= 0) return
      const f = e.target.files[0]
      this.$refs.uploadFile.value = null
      const fileType = f.name
        .substring(f.name.lastIndexOf('.') + 1, f.name.length)
        .toLowerCase()
      if (this.fileTypes.indexOf(fileType) === -1) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '只能上传图片或者视频'
        })
        return
      }
      this.activities[this.activeStep].fileName = f.name
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 20000
      }
      const formData = new FormData()
      formData.append('file', f)
      this.$axios
        .post(battleApi.combatEventUpload, formData, config)
        .then(res => {
          if (res.data.code === 0) {
            this.activities[this.activeStep].eventFileUrl = res.data.data
            this.$notify.closeAll()
            this.$notify.success({ title: '提示', message: '上传成功' })
          }
        })
        .catch(err => {
          this.$notify.closeAll()
          this.$notify.error({ title: '错误', message: '上传失败' })
          console.log('combatUpload Err : ' + err)
        })
    },
    /**
     *  点击步骤
     */
    stepNumClick (index) {
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
        const a = this.datas.find(a => a.type === b)
        if (a !== undefined) a.value = data[b]
      }
      this.describe = data.eventDescription
      this.curIcon = data.icon
    },
    /**
     *  缓存事件的数据
     */
    saveEventData (index) {
      if (index >= this.activities.length) return
      const activity = this.activities[index]
      for (var b in activity) {
        const a = this.datas.find(a => a.type === b)
        if (a !== undefined) activity[b] = a.value
      }
      activity.eventDescription = this.describe
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
        .then(res => {
          if (res.data.code === 0) {
            this.$router.push({ path: '/battleReview' })
          }
        })
        .catch(err => {
          console.log('combatEventAdd Err : ' + err)
        })
    },
    /**
     *  提交事件
     */
    submitEvent () {
      this.saveEventData(this.activeStep)
      // 检查是否有未填写的内容
      let valid = true
      let i = 0
      const data = []
      for (; i < this.activities.length; i++) {
        const ac = JSON.parse(JSON.stringify(this.activities[i]))
        delete ac.readonly
        delete ac.fileName
        const ac2 = JSON.parse(JSON.stringify(ac))
        delete ac2.icon
        // 判断属性是否都不为空
        const result = Object.values(ac).every(
          item => !stringIsNullOrEmpty(item)
        )
        if (result) {
          ac.combatId = this.combatId
          data.push(ac)
        } else if (
          !Object.values(ac2).every(item => stringIsNullOrEmpty(item))
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
      if (this.isEdit && this.eventDatas && this.eventDatas.length > 0) {
        this.$axios
          .post(battleApi.delCombatEvent, { combatId: this.combatId })
          .then(res => {
            if (res.data.code === 0) {
              this.addBattleEvent(data)
            }
          })
          .catch(error => {
            console.log('deleteBattleReview Err : ' + error)
          })
      } else {
        this.addBattleEvent(data)
      }
    }
  },
  mounted () {
    this.event.icon = this.icons[0].path
    if (this.isEdit) {
      this.eventDatas.forEach(e => {
        var data = JSON.parse(JSON.stringify(this.event))
        for (var b in data) {
          if (Object.prototype.hasOwnProperty.call(e, b)) {
            data[b] = e[b]
          }
        }
        var pos = e.eventFileUrl.lastIndexOf('/')
        data.fileName = e.eventFileUrl.substring(pos + 1)
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
      margin-top: 18px;
      display: flex;
      flex-wrap: wrap;
      margin-left: 52px;
      > div {
        display: flex;
        font-size: 14px;
        height: 26px;
        margin-bottom: 24px;
        box-sizing: border-box;
        .text {
          display: inline-block;
          width: 80px;
          line-height: 26px;
        }
        /deep/.el-input {
          width: 112px;
          height: 100%;
          background: #09546d4c;
          margin-right: 40px;
          .el-input__inner {
            background-color: transparent;
            border-radius: 0px;
            border: 1px solid #27bce5;
            color: #00ccff;
            height: 26px;
            line-height: 26px;
          }
        }
      }
    }
    /deep/.describe.el-textarea {
      width: 668px;
      height: 70px;
      background: #09546d4c;
      margin-top: 18px;
      margin-left: 50px;
      .el-textarea__inner {
        height: 100%;
        background-color: transparent;
        border-radius: 0px;
        border: 1px solid #27bce5;
        color: #00ccff;
        line-height: 26px;
      }
    }
    .fileBox {
      display: flex;
      align-items: center;
      margin-left: 51px;
      margin-top: 18px;
      .fileDesc {
        font-size: 12px;
        color: #ffffff;
        opacity: 0.4;
        margin-left: 16px;
      }
      .car {
        display: inline-block;
        height: 28px;
        width: 28px;
        margin-left: 70px;
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
        color: #1eb0fc;
        text-align: center;
      }
      span:active {
        opacity: 0.8;
      }
      span:nth-child(2) {
        margin-left: 20px;
        background: #1eb0fc;
        color: #fff;
      }
    }
  }
}
</style>
