<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-09 17:11:42
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-22 15:10:31
-->
<template>
  <div class="step-box listScroll">
    <el-steps :active="eventStep" finish-status="success" direction="vertical">
      <el-step
        v-for="(event, event_index) in events"
        :key="event_index"
        :title="
          event.dispositionNode == '召集'
            ? event.dispositionNode +
              ' (' +
              event.dispositionStatus +
              ' | ' +
              event.content[0].designateStatus +
              ')'
            : event.dispositionNode + ' (' + event.dispositionStatus + ')'
        "
      >
        <img :src="event.icon" slot="icon" />
        <template slot="description">
          <div class="step-row">
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              class="processing-content"
            >
              <tr>
                <td>
                  <div v-if="event.dispositionNode == '受理'">
                    <EllipsisTooltip
                      v-if="!caseCenter"
                      :contentText="
                        '接案人员: ' + event.content.receivingAlarmMan
                      "
                      class="name alarmMan"
                    ></EllipsisTooltip>
                    <div v-else class="processing-content-detail fl">
                      <span>{{
                        "接案人员：" + event.content.receivingAlarmMan
                      }}</span>
                    </div>
                    <div class="processing-content-detail fr">
                      <span>{{ event.createTime }}</span>
                    </div>
                  </div>
                  <div
                    v-else-if="event.dispositionNode == '批示'"
                    v-for="(content_item, content_index) in event.content"
                    :key="content_index"
                  >
                    <div class="processing-content-detail fl">
                      <span>{{ "推送人：" + content_item.pushMan }}</span>
                    </div>
                    <div class="processing-content-detail fr">
                      <span>{{ content_item.pushTime }}</span>
                    </div>
                  </div>
                  <div v-else-if="event.dispositionNode == '召集'">
                    <div class="processing-content-detail">
                      已推送{{ event.content.length }}人
                    </div>
                    <template v-for="(content_item, index) in event.content">
                      <div
                        :key="index"
                        class="together"
                        :class="{
                          hasBorder: index !== event.content.length - 1
                        }"
                      >
                        <div class="fl eTooltip">
                          <img
                            class="police"
                            src="../assets/images/caseCenter/police.svg"
                          />
                          <EllipsisTooltip
                            v-if="!caseCenter"
                            :contentText="
                              content_item.employeeName +
                                ' ' +
                                content_item.deptName
                            "
                            class="name"
                          ></EllipsisTooltip>
                          <span v-else>{{
                            content_item.employeeName +
                              " " +
                              content_item.deptName
                          }}</span>
                        </div>
                        <div class="processing-content-detail fr">
                          <span>{{ content_item.createTime }}</span>
                        </div>
                        <div
                          class="processing-content-detail"
                          style="clear: both"
                        >
                          <span>{{ content_item.designateStatus }}</span>
                        </div>
                        <div>
                          <span>{{
                            formatAcceptTime(
                              content_item.receivingAlarmTime,
                              content_item.createTime
                            )
                          }}</span>
                          <span style="color: red">{{
                            formatExceedTime(
                              content_item.receivingAlarmTime,
                              content_item.createTime
                            )
                          }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div
                    class="processing-content-detail"
                    v-else-if="event.dispositionNode == '处置'"
                  >
                    <div class="dispose">
                      <div class="eTooltip">
                        <img
                          class="police"
                          src="../assets/images/caseCenter/police.svg"
                        />
                        <EllipsisTooltip
                          v-if="!caseCenter"
                          :contentText="
                            event.content.employeeName +
                              ' ' +
                              event.content.deptName
                          "
                          class="name"
                        ></EllipsisTooltip>
                        <span v-else>{{
                          event.content.employeeName +
                            " " +
                            event.content.deptName
                        }}</span>
                      </div>
                      <span>{{ event.createTime }}</span>
                    </div>
                    <div class="picBox">
                      <span>上传照片</span>
                      <div
                        class="imgScroll"
                        :class="[caseCenter ? 'box1' : 'box2']"
                      >
                        <template v-for="(item, index) in event.imgListPath">
                          <img
                            :key="index"
                            :src="serverUrl + item"
                            alt=""
                            @click.stop="previewImg(item)"
                          />
                        </template>
                      </div>
                    </div>
                  </div>
                  <div
                    class="processing-content-detail detail-result"
                    v-else-if="event.dispositionNode == '回告'"
                  >
                    <p>处置记录：{{ event.content.dispositionRecord }}</p>
                    <div :class="[caseCenter ? 'row' : 'column']">
                      <span>处置人：{{ event.content.employeeName }}</span>
                      <span>处置时间：{{ event.content.dispositionTime }}</span>
                    </div>
                    <div>
                      <span>相关附件：</span>
                      <div
                        class="img-box imgScroll"
                        :class="[caseCenter ? 'img-box1' : 'img-box2']"
                        v-if="event.imgListPath.length !== 0"
                      >
                        <img
                          v-for="(img_item, img_index) in event.imgListPath"
                          :key="img_index"
                          :src="serverUrl + img_item"
                          alt=""
                          @click.stop="previewImg(img_item)"
                        />
                      </div>
                      <div
                        class="file-box"
                        v-if="event.fileListPath.length !== 0"
                      >
                        <p
                          v-for="(file_item, file_index) in event.fileListPath"
                          :key="file_index"
                          v-download="file_item"
                        >
                          {{ file_item.split("_")[1] }}&nbsp;<em
                            style="color: #1ed8a0; font-weight: bold"
                            >点击下载</em
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </template>
      </el-step></el-steps
    >
    <!-- 预览图片弹窗 -->
    <el-dialog
      :visible.sync="imgDialogVisible"
      custom-class="el-dialog-custom"
      :show-close="false"
      type="primary"
      @click.native="imgDialogVisible = false"
      center
    >
      <img style="width: 100%; height: 100%" :src="clickImgSrc" />
    </el-dialog>
  </div>
</template>

<script>
import { EventBus } from '@/utils/eventBus.js'
import EllipsisTooltip from './ellipsisTooltip'
import globalApi from '@/utils/globalApi'

export default {
  name: 'caseStep',

  components: {
    EllipsisTooltip
  },

  props: {
    clickRowId: { type: String, required: false }
  },

  data () {
    return {
      eventStep: 0,
      caseCenter: true,
      // events: {
      //   id: "",
      //   caseId: "", // 案件id
      //   dispositionNode: "", // 节点（0接警、1推送、2处警、3处置、4结案）
      //   dispositionStatus: "", // 节点状态(0进行中、1已完成、2未完成)
      //   content: "", // 节点内容
      //   createTime: "", // 创建时间
      //   dispositionException: "" // 异常数量
      // },
      events: [],
      serverUrl: globalApi.headImg,
      imgDialogVisible: false,
      clickImgSrc: ''
    }
  },

  watch: {},

  mounted () {
    EventBus.$on('selectedCaseRecord', info => {
      this.disposeCaseInfo(info)
    })

    if (this.$route.path !== '/caseCenter') {
      this.caseCenter = false
    }
  },

  beforeDestroy () {
    EventBus.$off('selectedCaseRecord')
  },

  methods: {
    /**
     * 格式化接警时间
     */
    formatAcceptTime (formatAcceptTime, createTime) {
      if (!formatAcceptTime) return ''
      const end = new Date(formatAcceptTime).getTime()
      const start = new Date(createTime).getTime()
      let minute = Math.ceil((end - start) / 1000.0 / 60)
      if (minute === 0 && end > start) minute = 1
      return '用时' + minute + '分钟'
    },

    /**
     * 格式化超时时间
     */
    formatExceedTime (formatAcceptTime, createTime) {
      if (!formatAcceptTime) return ''
      const end = new Date(formatAcceptTime).getTime()
      const start = new Date(createTime).getTime()
      if (end - start > 10 * 60 * 1000) {
        const minute = Math.ceil((end - start) / 1000.0 / 60)
        return '超时' + minute + '分钟'
      }
      return ''
    },

    // 处理处置记录info
    disposeCaseInfo (info) {
      this.events = info
      if (this.events.length !== 0) {
        this.events.forEach(item => {
          switch (item.dispositionNode) {
            case 0:
              item.dispositionNode = '受理'
              item.icon = require('../assets/images/caseCenter/step1.svg')
              break
            case 1:
              item.dispositionNode = '批示'
              item.icon = require('../assets/images/caseCenter/step2.svg')
              break
            case 2:
              item.dispositionNode = '召集'
              item.icon = require('../assets/images/caseCenter/step3.svg')
              break
            case 3:
              item.dispositionNode = '处置'
              item.icon = require('../assets/images/caseCenter/step4.svg')
              break
            case 4:
              item.dispositionNode = '回告'
              item.imgListPath = []
              item.fileListPath = []
              if (item.content.disFinishAttachment) {
                const list = item.content.disFinishAttachment.split(',')
                this.disposeUploadConfig(list, item)
              }
              item.icon = require('../assets/images/caseCenter/step5.svg')
              break
          }
          switch (item.dispositionStatus) {
            case 0:
              item.dispositionStatus = '进行中'
              break
            case 1:
              item.dispositionStatus = '已完成'
              break
            case 2:
              item.dispositionStatus = '未完成'
              break
          }
        })
      }
    },

    // 处理已上传文件返回info
    disposeUploadConfig (info, item) {
      if (info.length !== 0) {
        info.forEach(t => {
          const type = t.split('.')[1]
          if (type === 'jpg' || type === 'jpeg' || type === 'png') {
            item.imgListPath.push(t)
          } else if (
            type === 'doc' ||
            type === 'docx' ||
            type === 'xls' ||
            type === 'xlsx' ||
            type === 'rar' ||
            type === 'zip'
          ) {
            item.fileListPath.push(t)
          }
        })
      }
    },

    // 图片预览
    previewImg (path) {
      this.imgDialogVisible = true
      this.clickImgSrc = this.serverUrl + path
    }
  }
}
</script>

<style lang="scss" scoped>
.imgScroll::-webkit-scrollbar {
  height: 3px;
}
.imgScroll::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 3px;
  background: #00b7ff;
}
.imgScroll::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: transparent;
}

.step-box {
  color: #fff;
  font-size: 14px;
  background: transparent;
  margin: 20px 0 0 15px;
  height: 470px;
  overflow-y: auto;
  overflow-x: hidden;
  /deep/.el-step__icon.is-text {
    border: 1px solid #00ccff;
  }
  /deep/.el-step__icon {
    width: 34px;
    height: 34px;
    background: #00ccff;
    color: #fff;
  }
  /deep/ .el-step.is-vertical .el-step__line {
    width: 1px;
    top: 34px;
    left: 17px;
    background-color: #00ccff;
  }
  /deep/.el-step.is-vertical .el-step__head {
    width: auto;
  }
  /deep/.el-step .el-step__description {
    padding-right: 0px;
  }

  /deep/.el-step.is-vertical .el-step__main {
    padding: 0px 10px 28px 12px;
  }
  /deep/.el-step__title.is-process,
  /deep/.el-step__title.is-wait {
    font-size: 15px;
    font-weight: 700;
    color: #82f3fa;
  }
  .eTooltip {
    display: flex;
    align-items: center;
    color: #fff;
  }
  .police {
    width: 16px;
    height: 15px;
    margin-right: 8px;
    vertical-align: middle;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .name {
    width: 110px;
    color: #fff;
    display: inline-block;
    height: 20px;
  }
  .alarmMan {
    width: 135px;
  }
  .dispose {
    display: flex;
    justify-content: space-between;
  }
  .together {
    box-sizing: border-box;
    height: 57px;
    padding: 8px 0px;
  }
  .together.hasBorder {
    border-bottom: 1px dashed #00b8ff;
  }
  .picBox {
    box-sizing: border-box;
    margin-top: 10px;
    clear: both;
    display: flex;
    height: 70px;
    span {
      display: inline-block;
      width: 20px;
      line-height: 15px;
    }
    .box2 {
      width: 240px;
    }
    > div {
      display: flex;
      overflow-x: auto;
      img {
        width: 100px;
        margin-right: 20px;
        margin-bottom: 6px;
      }
    }
  }
  .processing-content-detail {
    color: #fff;
  }
  .detail-img {
    display: flex;
    width: 450px;
    height: 80px;
    overflow-x: auto;
    img {
      width: 120px;
      height: 68px;
      margin-right: 10px;
      vertical-align: top;
    }
  }
  .detail-result {
    .row {
      display: flex;
      justify-content: space-between;
    }
    .column {
      display: flex;
      flex-direction: column;
    }
    .img-box {
      box-sizing: border-box;
      display: flex;
      margin-top: 10px;
      overflow-x: auto;
      overflow-y: hidden;
      cursor: pointer;
      img {
        width: 100px;
        margin-right: 20px;
        margin-bottom: 6px;
      }
    }
    .img-box2 {
      width: 240px;
    }
    .img-box1 {
      width: 480px;
    }
    .file-box {
      padding-bottom: 20px;
      p {
        font-size: 12px;
        line-height: 26px;
      }
      p:nth-child(1) {
        margin-top: 10px;
      }
    }
  }
}
</style>
