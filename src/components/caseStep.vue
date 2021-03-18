<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-09 17:11:42
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-18 19:48:40
-->
<template>
  <div class="step-box listScroll">
    <el-steps :active="eventStep" finish-status="success" direction="vertical">
      <el-step
        v-for="(event, event_index) in events"
        :key="event_index"
        :title="
          event_index == 2
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
                    <div class="processing-content-detail fl">
                      <span>{{
                        "接案人员: " + event.content.receivingAlarmMan
                      }}</span>
                    </div>
                    <div class="processing-content-detail fr">
                      <span
                        ><i class="el-icon-time"></i>&nbsp;&nbsp;{{
                          event.createTime
                        }}</span
                      >
                    </div>
                  </div>
                  <div
                    v-else-if="event.dispositionNode == '批示'"
                    v-for="(content_item, content_index) in event.content"
                    :key="content_index"
                  >
                    <div class="processing-content-detail fl">
                      <span>{{ "推送人: " + content_item.pushMan }}</span>
                    </div>
                    <div class="processing-content-detail fr">
                      <span
                        ><i class="el-icon-time"></i>&nbsp;&nbsp;{{
                          content_item.pushTime
                        }}</span
                      >
                    </div>
                  </div>
                  <div
                    v-else-if="event.dispositionNode == '召集'"
                    v-for="(content_item, content_index) in event.content"
                    :key="content_index"
                  >
                    <div class="processing-content-detail fl">
                      <span>{{
                        content_item.employeeName + " " + content_item.deptName
                      }}</span>
                    </div>
                    <div class="processing-content-detail fr">
                      <span
                        ><i class="el-icon-time"></i>&nbsp;&nbsp;{{
                          event.createTime
                        }}</span
                      >
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
                    <p>处置记录：{{ event.content.dispositionRecord }}</p>
                    <span>处置人：{{ event.content.employeeName }}</span>
                    <span>处置时间：{{ event.content.dispositionTime }}</span>
                    <div><span>附件：</span></div>
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
// import { caseApi } from '@/api/case'
import { EventBus } from '@/utils/eventBus.js'

export default {
  name: 'caseStep',

  props: {
    clickRowId: { type: String, required: false }
  },

  data () {
    return {
      eventStep: 0,
      // events: {
      //   id: "",
      //   caseId: "", // 案件id
      //   dispositionNode: "", // 节点（0接警、1推送、2处警、3处置、4结案）
      //   dispositionStatus: "", // 节点状态(0进行中、1已完成、2未完成)
      //   content: "", // 节点内容
      //   createTime: "", // 创建时间
      //   dispositionException: "" // 异常数量
      // },
      events: []
    }
  },

  watch: {},

  mounted () {
    EventBus.$on('selectedCaseRecord', info => {
      this.disposeCaseInfo(info)
      console.log('info:', info)
    })
  },

  beforeDestroy () {
    EventBus.$off('selectedCaseRecord')
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
  /deep/.el-step.is-vertical .el-step__main {
    background: rgba(5, 31, 46, 0.9);
    margin: 0 15px 30px 10px;
  }
  /deep/.el-step__title.is-process,
  /deep/.el-step__title.is-wait {
    font-weight: 700;
    color: #82f3fa;
  }
  .step-row {
    width: 560px;
    margin: 12px 0;
  }
  .processing-content {
    background: rgba(5, 31, 46, 0.9);
  }
  .processing-content-detail {
    margin-right: 10px;
    padding: 15px 0;
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
    span {
      margin-right: 50px;
    }
    div {
      margin-top: 15px;
    }
  }
}
</style>
