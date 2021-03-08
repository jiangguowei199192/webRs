<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-05 11:30:49
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-08 15:55:10
-->
<template>
  <div class="caseCenter">
    <!-- 案件列表 -->
    <CasePage
      class="case__table"
      :tableInfo="tableInfo"
      :subTitle="subTitle"
      :api="getFireList"
      @handelImgClick="handelImgClick"
    ></CasePage>
    <!-- 案件详情 -->
    <div class="case__detail">
      <div class="case__info">
        <h3 class="case__header">案件记录</h3>
        <div class="case__content webFsScroll">
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
            <div class="simple_describe">
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
            <div class="handel__result">
              <p>
                <span>处置结果:</span
                ><span>
                  {{
                    "渔政执法快艇到达案发水域后首先对龙口闸水域非法捕捞行为进行打击查处，随后才进入倒水河水域，但此时嫌疑人员已经上岸逃离。执法人员乘坐执法快艇进一步巡查后，发现嫌疑人驾驶的船舶，并将其带回渔政码头扣押并作进一步调查。"
                  }}</span
                >
              </p>
            </div>
            <div class="handel__attach">
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
      <div class="handel__info"></div>
    </div>
  </div>
</template>

<script>
import CasePage from './components/casePage'
import { fireApi } from '@/api/videoSystem/fireAlarm.js'

export default {
  components: {
    CasePage
  },

  data () {
    return {
      subTitle: '火情列表',
      // 表格项
      tableInfo: {
        refresh: 0,
        data: [],
        fieldList: [
          { label: '案件名称', value: 'alarmTime' },
          { label: '举报地点', value: 'alarmAddress' },
          { label: '简要描述', value: 'alarmLongitude' },
          { label: '案发时间', value: 'deviceName' },
          { label: '接案时间', value: 'alarmStatus' },
          { label: '处置状态', value: 'updateTime' }
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
    this.refreshTable()
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
      //   console.log('params:', params)
      return this.$axios.get(fireApi.getDurationFireAlarmInfos, {
        params: params
      })
    },

    // 单击图片
    handelImgClick (data) {
      this.fireInfo = data
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
  .case__table {
    width: 1140px;
  }
  .case__detail {
    width: 644px;
    margin: 80px 0 0 10px;
    .case__info {
      height: 278px;
      background: rgba(0, 65, 87, 0.6);
      .case__header {
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
      .case__content {
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
        .simple_describe,
        .handel__result {
          line-height: 28px;
        }
        .handel__attach {
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
    .handel__info {
      width: 644px;
      height: 536px;
      background: rgba(0, 65, 87, 0.6);
      margin-top: 10px;
    }
  }
}
</style>
