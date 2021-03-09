<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-09 17:11:42
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-09 17:19:40
-->
<template>
  <div class="step__box webFsScroll">
    <el-steps :active="eventStep" finish-status="success" direction="vertical">
      <el-step
        :title="event.content"
        v-for="(event, event_index) in events"
        :key="event_index"
      >
        <template slot="description">
          <div class="step-row">
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              class="processing__content"
            >
              <tr>
                <td>
                  <div class="processing__content__detail fl">
                    <span>{{ event.describe + event.count }}</span>
                  </div>
                  <div
                    class="processing__content__detail fr"
                    v-if="event_index == 0 || event_index == 1"
                  >
                    <span
                      ><i class="el-icon-time"></i>&nbsp;&nbsp;{{
                        event.time
                      }}</span
                    >
                  </div>
                  <div
                    class="processing__content__detail detail__img webFsScroll"
                    v-if="event_index == 3"
                  >
                    <img
                      v-for="(event_pic, pic_index) in event.picList"
                      :key="pic_index"
                      :src="event_pic.picPath"
                      alt=""
                    />
                  </div>
                  <div
                    class="processing__content__detail detail__result"
                    v-if="event_index == 4"
                  >
                    <span>{{ event.person + event.name }}</span>
                    <span>处置时间: {{ event.time }}</span>
                    <div><span>附件: </span></div>
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
export default {
  name: 'caseStep',

  data () {
    return {
      eventStep: 0,
      events: [
        {
          id: '0',
          content: '接案(已完成 | 正常)',
          describe: '接案人员: ',
          count: '王伟军',
          time: '2020-12-27 09:52:00 '
        },
        {
          id: '1',
          content: '推送(已完成 | 正常)',
          describe: '已推送: ',
          count: '5人',
          time: '2020-11-16 22:09:00 '
        },
        {
          id: '2',
          content: '处警(已完成 | 异常: 2)',
          describe: '已推送: ',
          count: '9人',
          time: '2020-07-18 17:17:00 '
        },
        {
          id: '3',
          content: '处置(进行中)',
          describe: '上传照片: ',
          count: '',
          picList: [
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
          ],
          time: '2020-06-21 12:45:00 '
        },
        {
          id: '4',
          content: '结案',
          describe: '处置结果: ',
          count:
            '这里是处置记录这里是处置记录这里是处置记录这里是处置记录这里是处置记录这里是处置记录这里是处置记录这里是处置记录这里是处置记录这里是处置记录这里是处置记录这里是处置记录',
          person: '处置人: ',
          name: '张大大',
          time: '2020-09-18 17:09:00 '
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.step__box {
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
  /deep/.el-step.is-vertical .el-step__main {
    padding-left: 20px;
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
  .processing__content {
    background: rgba(5, 31, 46, 0.9);
  }
  .processing__content__detail {
    margin: 0 10px;
    padding: 15px 5px;
    color: #fff;
  }
  .detail__img {
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
  .detail__result {
    span {
      margin-right: 50px;
    }
    div {
      margin-top: 15px;
    }
  }
}
</style>
