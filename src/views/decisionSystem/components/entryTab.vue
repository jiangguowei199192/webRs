<template>
  <div class="wrap">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="85%"
      class="dialog_wrap"
    >
      <div class="container">
        <div class="content">
          <!-- 头部标题 -->
          <h3 class="title">选择图片</h3>
          <!-- 左容器 -->
          <div class="left_tab fl">
            <ul v-for="(item, index) in info" :key="index">
              <li
                type="button"
                class="item_li"
                :class="{ active: currentClass == index }"
                @click="tabChecked(index)"
              >
                <span class="fl"></span>
                {{ item.title }}
              </li>
            </ul>
          </div>
          <!-- 右容器 -->
          <div class="right_tab fr">
            <!-- 上部分tab内容容器 -->
            <div class="top_img">
              <div class="tab_wrap" v-show="currentTab == 0">
                <gMap
                  ref="gduMap"
                  handleType="devMap"
                  :bShowSimpleSearchTools="true"
                  :bShowBasic="true"
                  :bShowMeasure="false"
                  :bAutoLocate="false"
                ></gMap>
              </div>
              <div class="tab_wrap" v-show="currentTab == 1">
                <div v-if="this.buildInfo.length == 0" class="tab_img_wrap">
                  <h2>暂无建筑平面图</h2>
                </div>
                <div v-else>
                  <div v-for="(item, index) in info" :key="index">
                    <div
                      class="tab_img_wrap fl"
                      v-for="(children_item, children_index) in item.children"
                      :key="children_index"
                      @click="imgChecked(children_index)"
                    >
                      <span>{{ children_item.title }}</span>
                      <div
                        style="margin-top: 5px; height: 80px; padding: 1px"
                        :class="{ active: selectClass == children_index }"
                      >
                        <img :src="children_item.image" alt />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab_wrap" v-show="currentTab == 2">
                <img
                  src="http://img.zcool.cn/community/0146735edf53c8a801215aa09f6def.png@2o.png"
                  alt
                />
              </div>
            </div>
            <!-- 下部分操作按钮 -->
            <div class="bottom_btn">
              <el-button
                type="primary"
                size="mini"
                style="width: 70px"
                @click="goToFightDeploy"
                :disabled="isDisabled"
                >确定</el-button
              >
              <el-button
                type="info"
                size="mini"
                style="width: 70px"
                @click="backToPlan"
                >取消</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // Tab弹窗显隐状态
      dialogVisible: false,
      // Tab弹窗info
      info: [],
      // 建筑平面图info
      buildInfo: [],
      // 确定按钮禁用状态
      isDisabled: false,
      // 当前选中Tab的class
      currentClass: 0,
      // 当前选中Tab的index
      currentTab: 0,
      // 当前选中建筑平面图的class
      selectClass: 0
    }
  },

  methods: {
    // Tab入口弹窗操作
    show (info) {
      this.info = info
      this.dialogVisible = true
    },

    // 点击每个Tab选项
    tabChecked (current) {
      this.currentClass = current
      this.currentTab = current
      //   console.log(this.info)
      this.buildInfo = this.info[1].children
      // 无建筑平面图
      if (this.buildInfo.length === 0) {
        if (current === 1) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      }
    },

    // 点击Tab图片
    imgChecked (select) {
      this.selectClass = select
    },

    // 跳转到FightDeploy页
    goToFightDeploy () {
      this.$router.push({ path: '/fightDeploy' })
      setTimeout(() => {
        this.dialogVisible = false
      }, 300)
    },

    // 返回到Plan页
    backToPlan () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap /deep/ .el-dialog__wrapper {
  background-color: rgba($color: #040404, $alpha: 0.86);
}
.dialog_wrap {
  overflow: auto;
  /deep/.el-dialog {
    background-color: transparent;
  }
  /deep/.el-dialog__header {
    display: none;
  }
  /deep/.el-dialog__body {
    background-color: transparent;
    padding: 0;
  }
  .container {
    width: 100%;
    margin: 0 auto;
    .content {
      margin-top: 50px;
      width: 70%;
      height: 550px;
      border: 1px solid #eee;
      margin-left: 15%;
      background: #fff;
      .title {
        text-align: left;
        line-height: 40px;
        background-color: #fff;
        padding: 0 15px;
        border-bottom: 1px solid #eee;
      }
      .left_tab {
        width: 19%;
        overflow: hidden;
        .item_li {
          width: 100%;
          line-height: 30px;
          font-size: 14px;
          color: rgb(99, 99, 99);
          margin-top: 15px;
          display: flex;
          align-items: center;
          cursor: pointer;
          span {
            display: block;
            width: 3px;
            height: 24px;
            background-color: transparent;
            margin-right: 20px;
          }
        }
        .item_li.active {
          color: #eb3030;
          span {
            background-color: #eb3030;
          }
        }
      }
      .right_tab {
        width: 80%;
        height: calc(100% - 43px);
        border: 1px solid #eee;
        .top_img {
          position: relative;
          border-bottom: 1px solid #eee;
          height: 90%;
          .tab_wrap {
            width: 90%;
            height: 80%;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            img {
              width: 100%;
              height: 100%;
              cursor: pointer;
            }
          }
          .tab_img_wrap {
            width: 23%;
            margin: 0 13px 20px 0;
            text-align: center;
            font-size: 13px;
          }
          .tab_img_wrap > div.active {
            border: 1.5px solid #eb3030;
          }
        }
        .bottom_btn {
          padding: 10px 15px;
          text-align: right;
        }
      }
    }
  }
}
</style>
