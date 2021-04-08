<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-04-05 15:35:59
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-04-08 11:49:51
-->
<template>
  <div>
    <el-dialog
      :visible.sync="isShow"
      :close-on-click-modal="false"
      class="config-dlg dialog-wrap"
    >
      <div class="config-header">{{ title }}</div>
      <div class="config-content">
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="(item, tab_index) in tabList"
            :key="tab_index"
            :label="item.label"
            :name="item.name"
          >
            <div v-show="tab_index == 0">
              <div class="tab-pane-header">
                <span>{{ item.label }}</span>
                <span>{{ item.describe }}</span>
              </div>
              <div class="tab-pane-detail"></div>
            </div>
            <div v-show="tab_index == 1">
              <div class="tab-pane-header">
                <span>{{ item.label }}</span>
                <span>{{ item.describe }}</span>
              </div>
              <div class="tab-pane-detail"></div>
            </div>
            <div v-show="tab_index == 2">
              <div class="tab-pane-header">
                <span>{{ item.label }}</span>
                <span>{{ item.describe }}</span>
              </div>
              <div class="tab-pane-detail"></div>
            </div>
            <div v-show="tab_index == 3">
              <div class="tab-pane-header">
                <span>{{ item.label }}</span>
                <span>{{ item.describe }}</span>
              </div>
              <div class="tab-pane-detail"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="handelBtns">
        <span @click.stop="updateIsShow()">取消</span>
        <span>确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isShow: { type: Boolean, required: true },
    title: { type: String, required: true }
  },

  data () {
    return {
      placeholder: '请输入',
      activeName: 'boat',
      tabPosition: 'left',
      tabList: [
        {
          name: 'boat',
          label: '船舶出现',
          describe:
            '在监控图像或二维地图中设定检测区域，检测船舶在指定区域内出现的事件'
        },
        {
          name: 'fish',
          label: '钓鱼行为',
          describe:
            '在监控图像或二维地图中设定检测区域，检测钓鱼行为在指定区域内出现的事件'
        },
        {
          name: 'stranded',
          label: '人员滞留',
          describe:
            '在监控图像中设定检测区域和人员滞留时长，检测人员在警戒区域滞留超过设定时长的事件'
        },
        {
          name: 'invade',
          label: '人员入侵',
          describe: '在监控图像中设定检测区域，检测人员进入警戒区域的事件'
        }
      ]
    }
  },

  watch: {
    isShow (val) {}
  },

  mounted () {},

  methods: {
    // 更新isShow状态
    updateIsShow () {
      this.$emit('update:isShow', false)
    },

    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.config-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 1168px;
    background-color: transparent;
    .el-dialog__body {
      color: #fff;
      height: 720px;
      position: relative;
    }
    .config-header {
      width: 218px;
      height: 30px;
      background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      line-height: 30px;
      padding: 0 20px;
      margin-top: 18px;
    }
    .config-content {
      margin-top: 20px;
      .el-tabs__header {
        width: 150px;
        height: 620px;
        border-right: 1px solid #00a7e8;
      }
      .el-tabs__active-bar {
        background-color: transparent;
        // background-color: #00d1ff;
        height: 30px !important;
        margin-top: 7.5px;
      }
      .el-tabs__nav-wrap::after {
        background-color: transparent;
      }
      .el-tabs__item.is-left {
        text-align: center;
        margin-right: 20px;
        font-size: 16px;
        color: #00d1ff;
        height: 45px;
        line-height: 45px;
      }
      .el-tabs__item.is-left.is-active {
        color: #fff;
      }
      #tab-boat {
        margin-top: 15px;
      }
      .el-tab-pane {
        height: 580px;
        // background-color: #03585e44;
        padding-left: 20px;
      }
      .tab-pane-header {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #00a7e8;
        span:nth-child(1) {
          display: inline-block;
          width: 100px;
          color: #00d1ff;
          font-size: 20px;
        }
        span:nth-child(2) {
          display: inline-block;
          color: #ebebeb;
          font-size: 14px;
          margin-left: 20px;
        }
      }
    }
    .handelBtns {
      position: absolute;
      right: 0;
      bottom: 0;
      span {
        display: inline-block;
        box-sizing: border-box;
        width: 87px;
        height: 32px;
        border: 1px solid #1eb0fc;
        border-radius: 2px;
        line-height: 32px;
        text-align: center;
        background-color: transparent;
        font-size: 16px;
        color: #1eb0fc;
        cursor: pointer;
      }
      span:nth-child(2) {
        margin-left: 20px;
        background: #1eb0fc;
        color: #fff;
      }
    }
  }
  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #00b7ff;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
