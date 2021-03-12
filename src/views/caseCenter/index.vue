<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-05 11:30:49
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-12 14:09:02
-->
<template>
  <div class="caseCenter">
    <!-- 案件列表 -->
    <CasePage
      class="case-table"
      :tableInfo="tableInfo"
      :subTitle="subTitle"
      :api="getCaseList"
      @handelDisposeClick="handelDisposeClick"
      @handelClickRowInfo="handelClickRowInfo"
    ></CasePage>
    <!-- 案件详情 -->
    <div class="case-detail">
      <div class="case-info">
        <h3 class="case-header">案件记录</h3>
        <div class="case-content webFsScroll">
          <div class="base">
            <h4>基本信息</h4>
            <div>
              <p>
                <span>案件名称: </span>
                <span>{{ caseDetailInfo.caseName }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>案发时间: </span
                ><span>{{ caseDetailInfo.caseStartTime }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>举报人: </span><span>{{ caseDetailInfo.reportMan }}</span>
              </p>
              <p>
                <span>性别: </span
                ><span>{{ caseDetailInfo.reporterGender }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>身份证: </span
                ><span>{{ caseDetailInfo.reporterIdentity }}</span>
              </p>
              <p>
                <span>举报电话: </span
                ><span>{{ caseDetailInfo.reportTel }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>举报地址: </span
                ><span>{{ caseDetailInfo.reportAddr }}</span>
              </p>
            </div>
            <div class="simple-describe">
              <p>
                <span>简要描述: </span
                ><span>{{ caseDetailInfo.caseDesc }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>接案人: </span
                ><span>{{ caseDetailInfo.receivingAlarmMan }}</span>
              </p>
            </div>
          </div>
          <div class="handel">
            <h4>处置信息</h4>
            <div>
              <p>
                <span>处置时间: </span
                ><span>{{ caseDetailInfo.dispositionTime }}</span>
              </p>
              <p>
                <span>处置人: </span
                ><span>{{ caseDetailInfo.disManName }}</span>
              </p>
            </div>
            <div class="handel-result">
              <p>
                <span>处置结果:</span
                ><span> {{ caseDetailInfo.dispositionRecord }}</span>
              </p>
            </div>
            <div class="handel-attach">
              <span>相关附件: </span>
              <div class="webFsScroll">
                <img
                  v-for="(img_item, img_index) in imgList"
                  :key="img_index"
                  :src="img_item.picPath"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="handel-info ">
        <h3><span>处置记录 | </span><span>聊天记录</span></h3>
        <div class="handel-chat-record ">
          <!-- 处置记录|聊天记录步骤条 -->
          <CaseStep :caseRecordInfo.sync="caseRecordInfo"></CaseStep>
        </div>
      </div>
    </div>
    <!-- 处置记录弹窗 -->
    <DisposeRecDialog
      ref="addDictRef"
      :isShow.sync="isShow"
      title="处置记录"
      :fireInfo.sync="fireInfo"
      @confirmFireClick="confirmFireClick"
    ></DisposeRecDialog>
  </div>
</template>

<script>
import CasePage from './components/casePage'
import CaseStep from '@/components/caseStep'
import DisposeRecDialog from './components/disposeRecDialog'
import { caseApi } from '@/api/case'
// import { EventBus } from "@/utils/eventBus.js";

export default {
  components: {
    CasePage,
    CaseStep,
    DisposeRecDialog
  },

  data () {
    return {
      subTitle: '案件列表',
      // 表格项
      tableInfo: {
        refresh: 0,
        data: [],
        fieldList: [
          { label: '案件名称', value: 'caseName' },
          { label: '举报地点', value: 'reportAddr' },
          { label: '简要描述', value: 'caseDesc' },
          { label: '案发时间', value: 'caseStartTime' },
          { label: '接案时间', value: 'createTime' },
          { label: '处置状态', value: 'caseStatus', type: 'handelStatus' }
        ]
      },
      isShow: false,
      fireInfo: {},
      imgList: [
        {
          picPath:
            'http://122.112.203.178:80/cloud-river/case/1609136356400_1609136356400.png'
        }
      ],
      caseDetailInfo: {},
      clickRowId: '',
      // caseRecordInfo:
      //   {
      //     caseId: '',
      //     content: '',
      //     createTime: '',
      //     dispositionException: '',
      //     dispositionNode: '',
      //     dispositionStatus: '',
      //     id: ''
      //   }

      caseRecordInfo: null
    }
  },

  mounted () {
    this.refreshTable()
    this.getCaseDetail()
    this.getCaseRecord()
  },

  beforeDestroy () {
    this.tableInfo.refresh = ''
  },

  methods: {
    // 刷新table
    refreshTable () {
      this.tableInfo.refresh = Math.random()
    },

    // 单击处置按钮
    handelDisposeClick (id, info) {
      // console.log("index:", id, "data:", info);
      this.isShow = true
    },

    // 单击表格行
    handelClickRowInfo (info) {
      // console.log('rowdata:', info)
      this.clickRowId = info.id

      this.getCaseDetail()
      this.getCaseRecord()
    },

    // 按钮操作提交
    confirmFireClick () {
      this.refreshTable()
    },

    // 获取案件列表
    getCaseList (params) {
      return this.$axios.post(caseApi.selectPage, params, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      })
    },

    // 获取案件记录-基本信息
    getCaseDetail () {
      this.$axios
        .post(
          caseApi.selectDetail,
          { id: this.clickRowId },
          { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
        )
        .then(res => {
          console.log('基本信息res：', res)
          if (res && res.data && res.data.code === 0) {
            if (this.caseDetailInfo === {}) {
              this.caseDetailInfo = res.data.data[0]
            }
            this.caseDetailInfo = res.data.data
          }
        })
        .catch(err => {
          console.log('caseApi.selectDetail Err : ' + err)
        })
    },

    // 获取案件记录-处置记录
    getCaseRecord () {
      this.$axios
        .post(
          caseApi.selectCaseRecord,
          { id: this.clickRowId },
          { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
        )
        .then(res => {
          console.log('处置记录res：', res)
          if (res && res.data && res.data.code === 0) {
            if (!this.caseRecordInfo) {
              this.caseRecordInfo = res.data.data.records[0]
            }
            this.caseRecordInfo = res.data.data.records
            // console.log('caseRecordInfo:', this.caseRecordInfo)
          }
        })
        .catch(err => {
          console.log('caseApi.selectDetail Err : ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.caseCenter {
  display: flex;
  padding: 12px 60px 60px 60px;
  .case-table {
    width: 1140px;
  }
  .case-detail {
    width: 644px;
    margin: 80px 0 0 10px;
    .case-info {
      height: 278px;
      background: rgba(0, 65, 87, 0.6);
      .case-header {
        width: 178px;
        height: 30px;
        line-height: 30px;
        background: linear-gradient(
          90deg,
          #00d2ff 0%,
          rgba(0, 210, 255, 0) 100%
        );
        font-size: 18px;
        padding: 0 20px;
      }
      .case-content {
        width: 644px;
        height: 236px;
        margin-top: 10px;
        overflow-y: auto;
        h4 {
          font-size: 16px;
          font-weight: bold;
          color: #82f3fa;
          border-bottom: 1px solid #82f3fa;
          height: 35px;
          line-height: 35px;
        }
        .base,
        .handel {
          font-size: 14px;
          color: #fff;
          height: 36px;
          line-height: 36px;
          padding: 0 30px;
          div {
            display: flex;
            justify-content: space-between;
            p {
              width: 100%;
              span:nth-child(1) {
                color: #82f3fa;
                font-weight: bold;
              }
            }
            p:nth-child(2) {
              width: 80%;
              margin-left: 140px;
            }
          }
        }
        .base {
          height: auto;
          margin-bottom: 10px;
        }
        .simple-describe,
        .handel-result {
          line-height: 28px;
        }
        .handel-attach {
          height: 80px;
          margin-top: 15px;
          span {
            color: #82f3fa;
            font-weight: bold;
          }
          div {
            width: 500px;
            overflow-x: auto;
            cursor: pointer;
            img {
              width: 120px;
              height: 68px;
              margin-right: 10px;
              vertical-align: top;
            }
          }
        }
      }
    }
    .handel-info {
      width: 644px;
      height: 536px;
      background: rgba(0, 65, 87, 0.6);
      margin-top: 10px;
      h3 {
        font-size: 16px;
        font-weight: bold;
        line-height: 35px;
        padding: 5px 15px;
        span:nth-child(1) {
          color: #82f3fa;
        }
      }
      .handel-chat-record {
      }
    }
  }
}
</style>
