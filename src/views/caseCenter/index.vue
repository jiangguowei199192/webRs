<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-05 11:30:49
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-31 14:26:28
-->
<template>
  <div class="caseCenter">
    <!-- 案件列表 -->
    <CasePage
      ref="table"
      class="case-table"
      @handelDisposeClick="handelDisposeClick"
      @handelClickRowInfo="handelClickRowInfo"
    ></CasePage>
    <!-- 案件详情 -->
    <div class="case-detail">
      <div class="case-info">
        <h3 class="case-header">案件记录</h3>
        <div class="case-content listScroll">
          <div class="base">
            <h4>基本信息</h4>
            <div class="content-item">
              <p>
                <span>案件名称: </span>
                <span>{{ caseDetailInfo.caseName }}</span>
              </p>
            </div>
            <div class="content-item">
              <p>
                <span>案发时间: </span
                ><span>{{ caseDetailInfo.caseStartTime }}</span>
              </p>
            </div>
            <div class="content-item">
              <p>
                <span>举报人: </span><span>{{ caseDetailInfo.reportMan }}</span>
              </p>
              <p>
                <span>性别: </span
                ><span>{{ caseDetailInfo.reporterGender }}</span>
              </p>
            </div>
            <div class="content-item">
              <p>
                <span>身份证: </span
                ><span>{{ caseDetailInfo.reporterIdentity }}</span>
              </p>
              <p>
                <span>举报电话: </span
                ><span>{{ caseDetailInfo.reportTel }}</span>
              </p>
            </div>
            <div class="content-item">
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
            <div class="content-item">
              <p>
                <span>接案人: </span
                ><span>{{ caseDetailInfo.receivingAlarmMan }}</span>
              </p>
            </div>
          </div>
          <div class="handel">
            <h4>处置信息</h4>
            <div class="content-item">
              <p>
                <span>处置时间: </span
                ><span>{{ caseDetailInfo.dispositionTime }}</span>
              </p>
              <p>
                <span>处置人: </span
                ><span>{{ caseDetailInfo.dispositionMan }}</span>
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
              <div class="img-box listScroll" v-if="imgListPath.length !== 0">
                <img
                  v-for="(img_item, img_index) in imgListPath"
                  :key="img_index"
                  :src="serverUrl + img_item"
                  alt=""
                  @click.stop="previewImg(img_index)"
                />
              </div>
              <div class="file-box listScroll" v-if="fileListPath.length !== 0">
                <p
                  class=""
                  v-for="(file_item, file_index) in fileListPath"
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
        </div>
      </div>
      <div class="handel-info">
        <h3>
          <span :class="{ select: active === 0 }" @click.stop="active = 0"
            >处置记录</span
          ><span> | </span
          ><span :class="{ select: active === 1 }" @click.stop="active = 1"
            >聊天记录</span
          >
        </h3>
        <!-- 处置记录 -->
        <CaseStep class="handel-chat-record" v-show="active === 0"></CaseStep>
        <!-- 聊天记录 -->
        <ChatContent
          class="handel-chat-record"
          v-show="active === 1"
          ref="chatContent"
          :caseId="clickRowId"
        ></ChatContent>
      </div>
    </div>
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
    <!-- 处置记录弹窗 -->
    <DisposeRecDialog
      ref="disposeRecRef"
      :isShow.sync="isShow"
      title="处置记录"
      :clickRowId.sync="clickRowId"
      :reportTime="caseDetailInfo.reportTime"
      @confirmRecordClick="confirmRecordClick"
    ></DisposeRecDialog>
  </div>
</template>

<script>
import CasePage from './components/casePage'
import CaseStep from '@/components/caseStep'
import DisposeRecDialog from './components/disposeRecDialog'
import ChatContent from '../gisDispatch/components/chatContent'
import { caseApi } from '@/api/case'
import { EventBus } from '@/utils/eventBus.js'
import globalApi from '@/utils/globalApi'

export default {
  components: {
    CasePage,
    CaseStep,
    ChatContent,
    DisposeRecDialog
  },

  data () {
    return {
      isShow: false,
      active: 0,
      caseDetailInfo: {},
      clickRowId: '',
      caseRecordInfo: [],
      uploadFilesConfig: [],
      imgListPath: [],
      fileListPath: [],
      serverUrl: globalApi.headImg,
      imgDialogVisible: false,
      clickImgSrc: '',
      caseId: ''
    }
  },

  watch: {
    active (now, old) {
      if (now === 1) {
        this.$nextTick(() => {
          this.$refs.chatContent.getChatList()
        })
      }
    }
  },

  mounted () {},

  beforeDestroy () {},

  methods: {
    // 刷新table
    refreshTable () {
      this.$refs.table.getList()
    },

    // 单击处置按钮
    handelDisposeClick (index, info) {
      // console.log('index:', index, 'data:', info)
      this.isShow = true
      this.clickRowId = info.id
    },

    // 单击表格行
    handelClickRowInfo (info) {
      // console.log('rowdata:', info)
      this.clickRowId = info.id
      this.getCaseDetail()
      this.getCaseRecord()
      this.$nextTick(() => {
        this.$refs.chatContent.getChatList()
      })
    },

    // 按钮操作提交
    confirmRecordClick (data) {
      this.refreshTable()
      this.uploadFilesConfig = data.uploadFileUrl.split(',')
      this.uploadFilesConfig.forEach((t) => {
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
      // console.log('uploadFilesConfig:', this.uploadFilesConfig)
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
        .then((res) => {
          // console.log('基本信息res：', res)
          if (res && res.data && res.data.code === 0) {
            this.caseDetailInfo = res.data.data
            this.disposeUploadConfig()
          }
        })
        .catch((err) => {
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
        .then((res) => {
          // console.log('处置记录res：', res)
          if (res && res.data && res.data.code === 0) {
            this.caseRecordInfo = res.data.data.records
            EventBus.$emit('selectedCaseRecord', this.caseRecordInfo)
            EventBus.$emit('uploadFilesConfig', this.uploadFilesConfig)
          }
        })
        .catch((err) => {
          console.log('caseApi.selectCaseRecord Err : ' + err)
        })
    },

    // 处理已上传文件返回info
    disposeUploadConfig () {
      this.imgListPath = []
      this.fileListPath = []
      if (this.caseDetailInfo.disFinishAttachment) {
        this.uploadFilesConfig = this.caseDetailInfo.disFinishAttachment.split(
          ','
        )
        this.uploadFilesConfig.forEach((t) => {
          const type = t.split('.')[1]
          if (type === 'jpg' || type === 'jpeg' || type === 'png') {
            this.imgListPath.push(t)
          } else if (
            type === 'doc' ||
            type === 'docx' ||
            type === 'xls' ||
            type === 'xlsx' ||
            type === 'pdf' ||
            type === 'rar' ||
            type === 'zip'
          ) {
            this.fileListPath.push(t)
          }
        })
      }
      // console.log('uploadFilesConfig:', this.uploadFilesConfig)
    },

    // 图片预览
    previewImg (index) {
      this.imgDialogVisible = true
      this.clickImgSrc = this.serverUrl + this.imgListPath[index]
    }
  }
}
</script>

<style lang="scss" scoped>
.caseCenter {
  display: flex;
  padding: 0 25px 16px 25px;
  .case-table {
    width: 1180px;
  }
  .case-detail {
    width: 654px;
    margin: 58px 0 0 20px;
    .case-info {
      height: 258px;
      // background-color: rgba(0, 65, 87, 0.6);
      background: url(../../assets/images/caseCenter/case_wrap.svg) no-repeat
        center/100% 100%;
      padding: 10px 0 20px 12px;
      .case-header {
        width: 168px;
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
        width: 624px;
        height: 216px;
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
          padding: 0 20px;
          .content-item {
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
        .handel-result,
        .handel-attach {
          line-height: 28px;
          span:nth-child(1) {
            color: #82f3fa;
            font-weight: bold;
          }
        }
        .handel-attach {
          margin-top: 15px;
          flex-direction: column;
          .img-box {
            display: flex;
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
    }
    .handel-info {
      width: 634px;
      height: 530px;
      // background-color: rgba(0, 65, 87, 0.6);
      background: url(../../assets/images/caseCenter/chat_wrap.svg) no-repeat
        center/100% 100%;
      padding: 10px;
      margin-top: 10px;
      overflow-x: hidden;
      position: relative;
      h3 {
        position: absolute;
        font-size: 16px;
        font-weight: 700;
        line-height: 35px;
        padding: 5px 15px;
        cursor: pointer;
        span.select {
          color: #1ae256;
        }
      }
      .handel-chat-record {
        height: 450px;
        font-size: 14px;
        padding-right: 8px;
        margin-top: 50px;
        padding: 0px 15px;
      }
    }
  }
  ::-webkit-scrollbar {
    width: 3px;
    height: 5px;
  }
}
</style>
