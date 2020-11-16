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
          <div class="title"><p>选择图片</p></div>
          <!-- 左容器 -->
          <div class="left_tab fl">
            <ul v-for="(item, index) in info" :key="index">
              <!-- 临时禁用 -->
              <li
                v-if="index == 0 || index == 2"
                type="button"
                class="item_li disabled"
              >
                {{ item.title }}
              </li>
              <!-- 正常切换 -->
              <li
                v-else
                type="button"
                class="item_li"
                :class="{
                  active: currentClass == index,
                }"
                @click.stop="tabChecked(index)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
          <!-- 右容器 -->
          <div class="right_tab fr" ref="tab_wrap">
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

                <!-- <div
                  id="map"
                  class="map"
                  style="width: 100%; height: 100%"
                ></div> -->
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
                      @click.stop="imgChecked(children_index)"
                    >
                      <span>{{ children_item.title }}</span>
                      <div
                        style="margin-top: 5px; height: 80px"
                        :class="{ active: selectClass == children_index }"
                      >
                        <img :src="children_item.image" alt="图片加载失败" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab_wrap" v-show="currentTab == 2">
                <!-- <img src="../../../assets/images/plan/3d.png" alt /> -->
                <div v-if="this.realImgUrl == ''" class="tab_img_wrap">
                  <h2>暂无实时二维图</h2>
                </div>
                <div v-else><img :src="realImgUrl" alt="" /></div>
              </div>
            </div>
            <!-- 下部分操作按钮 -->
            <div class="bottom_btn">
              <el-button
                v-show="currentTab == 0"
                type="success"
                size="mini"
                style="width: 70px"
                id="screenshot"
                @click.stop="screenShot"
                >截屏</el-button
              >
              <el-button
                type="info"
                size="mini"
                style="
                  width: 70px;
                  color: #1eb0fc;
                  background: transparent;
                  border: 1px solid #1eb0fc;
                "
                @click.stop="backToPlan"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                style="width: 70px; background: #1eb0fc; border: none"
                @click.stop="goToFightDeploy"
                :disabled="isDisabled"
                >确定</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import kscreenshot from 'kscreenshot'

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
      selectClass: null,
      // 实时二维底图
      realImgUrl: '',
      // 地图截图
      mapImgUrl: '',
      // 二维预案查询id
      enterpriseId: '',
      // 二维预案保存返回路径
      configPath: ''
    }
  },

  mounted () {
    // new kscreenshot({ key: 65, needDownload: true })
  },

  methods: {
    screenShot () {
      alert('开始截屏')
    },

    // Tab入口弹窗操作
    show (info, id, path) {
      this.info = info
      this.enterpriseId = id
      this.configPath = path
      this.dialogVisible = true
      this.tabChecked(1)
    },

    // 点击每个Tab选项
    tabChecked (current) {
      this.currentClass = this.currentTab = current
      // console.log(this.info)
      this.buildInfo = this.info[1].children

      const actions = {
        // 无地图截图
        0: () => {
          this.changeDisabled(this.mapImgUrl === '')
        },
        // 无建筑平面图
        1: () => {
          this.changeDisabled(this.buildInfo.length === 0)
        },
        // 无实时二维图
        2: () => {
          this.changeDisabled(this.realImgUrl === '')
        },
        default: () => {
          this.changeDisabled(null)
        }
      }
      const action = actions[`${current}`] || actions.default
      action.call(this)
    },

    // 切换按钮状态
    changeDisabled (conditions) {
      if (conditions) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    },

    // 点击每个建筑平面图
    imgChecked (select) {
      this.selectClass = select
    },

    // 跳转到FightDeploy页
    goToFightDeploy () {
      if (this.currentTab === 1 && this.selectClass === null) {
        this.$notify.warning({
          title: '提示',
          message: '请选择一张图片!',
          duration: 5 * 1000
        })
      } else {
        this.$router.push({
          path: '/fightDeploy',
          query: {
            enterpriseId: this.enterpriseId,
            selectBuildImg: this.info[1].children[this.selectClass],
            configPath: this.configPath,
            buildingInfo: this.info[1].children
          }
        })
        setTimeout(() => {
          this.dialogVisible = false
        }, 300)
      }
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
      width: 1032px;
      height: 686px;
      margin-left: 15%;
      background: url("../../../assets/images/2d/entrytab_dialog.png") no-repeat;
      background-size: 100% 100%;
      padding-left: 8px;
      padding-right: 8px;
      .title {
        padding: 20px 0 15px 15px;
        border-bottom: 1px solid#35B3ED;
        p {
          background: url("../../../assets/images/device/info-title.png")
            no-repeat;
          width: 196px;
          height: 34px;
          line-height: 34px;
          padding-left: 30px;
          color: #fff;
        }
      }
      .left_tab {
        width: 17%;
        overflow: hidden;
        padding: 0 10px;
        text-align: center;
        .item_li {
          width: 140px;
          height: 40px;
          line-height: 40px;
          margin: 25px 0 0 22px;
          font-size: 14px;
          color: #aef0f4;
          cursor: pointer;
          background: url("../../../assets/images/2d/entrytab_unchecked.png")
            no-repeat;
          background-size: 100% 100%;
        }
        .item_li.active {
          color: #fff;
          background: url("../../../assets/images/2d/entrytab_checked.png")
            no-repeat;
          background-size: 100% 100%;
        }
        .item_li.disabled {
          cursor: not-allowed;
        }
      }
      .right_tab {
        width: 80%;
        height: calc(100% - 75px);
        border-left: 1px solid #35b3ed;
        .top_img {
          position: relative;
          border-bottom: 1px solid #35b3ed;
          height: 89%;
          color: #aef0f4;
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
            .tab_img_wrap {
              width: 23%;
              margin: 0 13px 20px 0;
              text-align: center;
              font-size: 13px;
              .active {
                border: 2px solid #eb3030;
              }
            }
          }
        }
        .bottom_btn {
          padding: 18px 20px;
          text-align: right;
        }
      }
    }
  }
}
</style>
