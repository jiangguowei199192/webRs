<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-09 17:11:42
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-20 13:52:14
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
                  <div
                    v-else-if="event.dispositionNode == '召集'"
                    v-for="(content_item, content_index) in event.content"
                    :key="content_index"
                  >
                    <div v-if="!caseCenter" class="fl eTooltip">
                      <img
                        class="police"
                        src="../assets/images/caseCenter/police.svg"
                      />
                      <EllipsisTooltip
                        :contentText="
                          content_item.employeeName +
                            ' ' +
                            content_item.deptName
                        "
                        class="name"
                      ></EllipsisTooltip>
                    </div>
                    <div v-else class="processing-content-detail fl eTooltip">
                      <img
                        class="police"
                        src="../assets/images/caseCenter/police.svg"
                      />
                      <span>{{
                        content_item.employeeName + " " + content_item.deptName
                      }}</span>
                    </div>
                    <div class="processing-content-detail fr">
                      <span>{{ event.createTime }}</span>
                    </div>
                  </div>
                  <div
                    class="processing-content-detail detail-img listScroll"
                    v-else-if="event.dispositionNode == '处置'"
                  >
                    <!-- <img
                      v-for="(event_pic, pic_index) in event.picList"
                      :key="pic_index"
                      :src="event_pic.picPath"
                      alt=""
                    /> -->
                  </div>
                  <div
                    class="processing-content-detail detail-result"
                    v-else-if="event.dispositionNode == '回告'"
                  >
                    <p class="result-item">
                      处置记录：{{ event.content.dispositionRecord }}
                    </p>
                    <div
                      :class="[caseCenter ? 'row' : 'column']"
                      class="result-item"
                    >
                      <span>处置人：{{ event.content.employeeName }}</span>
                      <span>处置时间：{{ event.content.dispositionTime }}</span>
                    </div>
                    <div class="result-item">
                      <span>附件：</span>
                      <div
                        class="img-box listScroll"
                        v-if="imgListPath.length !== 0"
                      >
                        <img
                          v-for="(img_item, img_index) in imgListPath"
                          :key="img_index"
                          :src="serverUrl + img_item"
                          alt=""
                        />
                      </div>
                      <div
                        class="file-box listScroll"
                        v-if="fileListPath.length !== 0"
                      >
                        <p
                          class=""
                          v-for="(file_item, file_index) in fileListPath"
                          :key="file_index"
                          v-download="file_item"
                        >
                          {{ file_item.split("_")[1] }}&nbsp;<em
                            style="color: #1ed8a0;font-weight: bold;"
                            >点击上传</em
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
    // uploadFilesConfig: { type: Array, required: false }
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
      uploadFilesConfig: [],
      imgListPath: [],
      fileListPath: [],
      serverUrl: globalApi.headImg
    }
  },

  watch: {},

  mounted () {
    EventBus.$on('selectedCaseRecord', info => {
      this.disposeCaseInfo(info)
    })

    EventBus.$on('uploadFilesConfig', info => {
      this.disposeUploadConfig(info)
    })

    if (this.$route.path !== '/caseCenter') {
      this.caseCenter = false
    }
  },

  beforeDestroy () {
    EventBus.$off('selectedCaseRecord')
    EventBus.$off('uploadFilesConfig')
  },

  methods: {
    // 处理处置记录info
    disposeCaseInfo (info) {
      // console.log("caseRecordInfo:", this.caseRecordInfo);
      this.events = info
      if (this.events.length !== 0) {
        this.events.forEach(item => {
          switch (item.dispositionNode) {
            case 0:
              item.dispositionNode = '受理'
              break
            case 1:
              item.dispositionNode = '批示'
              break
            case 2:
              item.dispositionNode = '召集'
              break
            case 3:
              item.dispositionNode = '处置'
              break
            case 4:
              item.dispositionNode = '回告'
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
    disposeUploadConfig (info) {
      this.uploadFilesConfig = info
      if (this.uploadFilesConfig.length !== 0) {
        this.uploadFilesConfig.forEach(t => {
          const type = t.split('.')[1]
          if (type === 'jpg' || type === 'jpeg' || type === 'png') {
            this.imgListPath.push(t)
          } else if (
            type === 'doc' ||
            type === 'docx' ||
            type === 'xls' ||
            type === 'xlsx' ||
            type === 'rar' ||
            type === 'zip'
          ) {
            this.fileListPath.push(t)
          }
        })
        console.log('uploadFilesConfig:', this.uploadFilesConfig)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step-box {
  color: #fff;
  font-size: 14px;
  background: transparent;
  margin: 20px 0 0 15px;
  height: 470px;
  overflow-y: auto;
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
    //background: rgba(5, 31, 46, 0.9);
    //margin: 0 15px 30px 10px;
    padding: 0px 10px 28px 12px;
  }
  /deep/.el-step__title.is-process,
  /deep/.el-step__title.is-wait {
    font-weight: 700;
    color: #82f3fa;
  }
  // .step-row {
  //   width: 560px;
  //   margin: 12px 0;
  // }
  // .processing-content {
  //   background: rgba(5, 31, 46, 0.9);
  // }
  .eTooltip {
    display: flex;
    align-items: center;
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
  .processing-content-detail {
    //margin-right: 10px;
    //padding: 15px 0;
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
    // width: 600px;
    .row {
      display: flex;
      justify-content: space-between;
    }
    .column {
      display: flex;
      flex-direction: column;
    }
    .result-item {
      margin-top: 10px;
    }
    .img-box {
      height: 80px;
      margin-top: 10px;
      overflow-x: auto;
      overflow-y: hidden;
      cursor: pointer;
      img {
        width: 120px;
        height: 68px;
        margin-right: 10px;
        vertical-align: top;
      }
    }
    .file-box {
      padding-bottom: 20px;
      p {
        font-size: 12px;
        line-height: 26px;
      }
      p:nth-child(1) {
        margin-top: 20px;
      }
    }
  }
}
</style>
