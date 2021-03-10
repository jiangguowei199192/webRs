<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-05 11:30:49
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-10 14:16:59
-->
<template>
  <div class="caseCenter">
    <!-- 案件列表 -->
    <CasePage
      class="case-table"
      :tableInfo="tableInfo"
      :subTitle="subTitle"
      :api="getFireList"
      @handelDisposeClick="handelDisposeClick"
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
                <span>案件名称: </span> <span>{{ "执法专班巡逻" }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>案发时间: </span><span>{{ "2020-11-04 16:06:00" }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>举报人: </span><span>{{ "王伟军" }}</span>
              </p>
              <p>
                <span>性别: </span><span>{{ "男" }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>身份证: </span><span>{{ "2345432345678905433" }}</span>
              </p>
              <p>
                <span>举报电话: </span><span>{{ "15523489371" }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>举报地址: </span><span>{{ "江夏区金口水域" }}</span>
              </p>
            </div>
            <div class="simple-describe">
              <p>
                <span>简要描述: </span
                ><span>{{
                  "执法专班于长江金口水域发现疑似电捕鱼船 执法专班于长江金口水域发现疑似电捕鱼船 执法专班于长江金口水域发现疑似电捕鱼船"
                }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>接案人: </span><span>{{ "刘秀敏" }}</span>
              </p>
            </div>
          </div>
          <div class="handel">
            <h4>处置信息</h4>
            <div>
              <p>
                <span>处置时间: </span><span>{{ "2020-11-04 16:06:00" }}</span>
              </p>
              <p>
                <span>处置人: </span><span>{{ "王伟军" }}</span>
              </p>
            </div>
            <div class="handel-result">
              <p>
                <span>处置结果:</span
                ><span>
                  {{
                    "渔政执法快艇到达案发水域后首先对龙口闸水域非法捕捞行为进行打击查处，随后才进入倒水河水域，但此时嫌疑人员已经上岸逃离。执法人员乘坐执法快艇进一步巡查后，发现嫌疑人驾驶的船舶，并将其带回渔政码头扣押并作进一步调查。"
                  }}</span
                >
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
          <CaseStep></CaseStep>
        </div>
      </div>
    </div>
    <!-- 处置记录弹窗 -->
    <DisposeRecDialog
      ref="addDictRef"
      :isShow.sync="isShow"
      title="火情详情"
      :fireInfo.sync="fireInfo"
      @confirmFireClick="confirmFireClick"
    ></DisposeRecDialog>
  </div>
</template>

<script>
// import { fireApi } from '@/api/videoSystem/fireAlarm.js'
import CasePage from './components/casePage'
import CaseStep from '@/components/caseStep'
import DisposeRecDialog from './components/disposeRecDialog'

export default {
  components: {
    CasePage,
    CaseStep,
    DisposeRecDialog
  },

  data () {
    return {
      subTitle: '火情列表',
      // 表格项
      tableInfo: {
        refresh: 0,
        data: [
          {
            caseBelong: '渔政执法二大队',
            caseDesc: '童家湖水域查获涉嫌使用电鱼捕捞',
            caseImg: null,
            caseNo: '20201228797173',
            caseStatus: '已处置',
            dispositionImgUrl: null,
            dispositionMan: '渔政执法大队 ',
            dispositionRecord: null,
            dispositionTime: '2020-04-04 18:00:00',
            id: '72e0cb580297ad7bfbda59a9da88d26a',
            importantRecord: null,
            infoSource: '通江支流府河童家湖水域电鱼非法捕捞',
            latitude: 30.7602145,
            longitude: 114.180492,
            reportAddr: '通江支流府河童家湖水域',
            reportMan: ' ',
            reportTel: null,
            reportTime: '2020-04-04 14:00:00'
          },
          {
            caseBelong: '江夏区渔政船检港监管理站',
            caseDesc: '执法专班于长江金口水域发现疑似电捕鱼船',
            caseImg: null,
            caseNo: '20201229347324',
            caseStatus: '未处置',
            dispositionImgUrl: null,
            dispositionMan: null,
            dispositionRecord: null,
            dispositionTime: null,
            id: '1bb161a6ef9d0c5b05eb74da7e3b4b3d',
            importantRecord: null,
            infoSource: '执法专班巡逻',
            latitude: 30.2845938,
            longitude: 114.091783,
            reportAddr: '江夏区金口水域',
            reportMan: '无',
            reportTel: '无',
            reportTime: '2020-11-04 16:06:00'
          },
          {
            caseBelong: '江夏区渔政船检港监管理站',
            caseDesc: '执法专班于长江金口水域发现疑似电捕鱼船',
            caseImg: null,
            caseNo: '20201229347324',
            caseStatus: '未处置',
            dispositionImgUrl: null,
            dispositionMan: null,
            dispositionRecord: null,
            dispositionTime: null,
            id: '1bb161a6ef9d0c5b05eb74da7e3b4b3d',
            importantRecord: null,
            infoSource: '执法专班巡逻',
            latitude: 30.2845938,
            longitude: 114.091783,
            reportAddr: '江夏区金口水域',
            reportMan: '无',
            reportTel: '无',
            reportTime: '2020-11-04 16:06:00'
          }
        ],
        fieldList: [
          { label: '案件名称', value: 'infoSource' },
          { label: '举报地点', value: 'reportAddr' },
          { label: '简要描述', value: 'caseDesc' },
          { label: '案发时间', value: 'reportTime' },
          { label: '接案时间', value: 'dispositionTime' },
          { label: '处置状态', value: 'caseStatus', type: 'handelStatus' }
        ]
      },
      isShow: false,
      fireInfo: {},
      imgList: [
        {
          picPath:
            'http://122.112.203.178:80/cloud-river/case/1609136356400_1609136356400.png'
        },
        {
          picPath:
            'http://122.112.203.178:80/cloud-river/case/1609136356400_1609136356400.png'
        },
        {
          picPath:
            'http://122.112.203.178:80/cloud-river/case/1609136356400_1609136356400.png'
        },
        {
          picPath:
            'http://122.112.203.178:80/cloud-river/case/1609136356400_1609136356400.png'
        },
        {
          picPath:
            'http://122.112.203.178:80/cloud-river/case/1609136356400_1609136356400.png'
        },
        {
          picPath:
            'http://122.112.203.178:80/cloud-river/case/1609136356400_1609136356400.png'
        }
      ]
    }
  },

  mounted () {
    // this.refreshTable()
  },

  beforeDestroy () {
    this.tableInfo.refresh = ''
  },

  methods: {
    // 刷新table
    refreshTable () {
      this.tableInfo.refresh = Math.random()
    },

    // 获取火情列表
    getFireList (params) {
      // console.log("params:", params);
      // return this.$axios.get(fireApi.getDurationFireAlarmInfos, {
      //   params: params
      // });
    },

    // 单击处置按钮
    handelDisposeClick (id, info) {
      // console.log("index:", id, "data:", info);
      // this.fireInfo = info
      this.isShow = true
    },

    // 按钮操作提交
    confirmFireClick () {
      this.refreshTable()
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
