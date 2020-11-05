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
              <li
                type="button"
                class="item_li"
                :class="{ active: currentClass == index }"
                @click="tabChecked(index)"
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
                <!-- <gMap
                  ref="gduMap"
                  id="gduMap"
                  class="map"
                  handleType="devMap"
                  :bShowSimpleSearchTools="true"
                  :bShowBasic="true"
                  :bShowMeasure="false"
                  :bAutoLocate="false"
                ></gMap> -->
                <div
                  id="map"
                  class="map"
                  style="width: 100%; height: 100%"
                ></div>
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
                @click.stop="screenshot"
                >截屏</el-button
              >
              <el-button
                type="info"
                size="mini"
                style="width: 70px; color: #1EB0FC; background: transparent; border: 1px solid #1EB0FC;"
                @click="backToPlan"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                style="width: 70px; background: #1EB0FC; border: none;"
                @click="goToFightDeploy"
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
import html2canvas from 'html2canvas'
import $ from 'jquery'
import { Notification } from 'element-ui'

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
      enterpriseId: '',
      configPath: ''
    }
  },

  mounted () {
    // new kscreenshot({ key: 65, needDownload: true })
  },

  methods: {
    screenshot () {
      alert('开始截屏')
      this.PrtScn('#map').then(result => {
        this.download(result)
      })
    },

    // Tab入口弹窗操作
    show (info, id, path) {
      this.info = info
      this.enterpriseId = id
      this.configPath = path
      this.dialogVisible = true

      this.$nextTick(() => {
        this.loadMap()
      })
    },

    // 点击每个Tab选项
    tabChecked (current) {
      this.currentClass = this.currentTab = current
      // console.log(this.info)
      this.buildInfo = this.info[1].children

      // 无建筑平面图
      if (current === 1) {
        if (this.buildInfo.length === 0) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      } else {
        this.isDisabled = false
      }
      // 无实时二维图
      if (current === 2) {
        if (this.realImgUrl === '') {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      }
    },

    // 点击每个建筑平面图
    imgChecked (select) {
      this.selectClass = select
    },

    // 跳转到FightDeploy页
    goToFightDeploy () {
      if (this.currentTab === 1 && this.selectClass === null) {
        Notification({
          title: '提示',
          message: '请选择一张图片!',
          type: 'warning',
          duration: 5 * 1000
        })
      } else {
        this.$router.push({
          path: '/fightDeploy',
          query: {
            enterpriseId: this.enterpriseId,
            selectBuildImg: this.info[1].children[this.selectClass],
            configPath: this.configPath
          }
        })
        setTimeout(() => {
          this.dialogVisible = false
        }, 300)

        localStorage.setItem(
          'selectBuildImg',
          JSON.stringify(this.info[1].children[this.selectClass])
        )
      }
    },

    // 返回到Plan页
    backToPlan () {
      this.dialogVisible = false
    },

    loadMap () {
      // eslint-disable-next-line no-undef
      const map = new AMap.Map('map', {
        zoom: 14, // 级别
        center: [116.397428, 39.90923], // 中心点坐标
        viewMode: '3D', // 使用3D视图
        layers: [
          // 使用多个图层
          // eslint-disable-next-line no-undef
          new AMap.TileLayer.Satellite(),
          // eslint-disable-next-line no-undef
          new AMap.TileLayer.RoadNet(),
          // eslint-disable-next-line no-undef
          new AMap.Buildings()
        ],
        zooms: [4, 18] // 设置地图级别范围
      })
      console.log(map)

      // eslint-disable-next-line no-undef
      AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
        var autoOptions = {
          // 城市，默认全国
          city: '北京',
          // 使用联想输入的input的id
          input: 'input'
        }
        // eslint-disable-next-line no-undef
        var autocomplete = new AMap.Autocomplete(autoOptions)
        // eslint-disable-next-line no-undef
        var placeSearch = new AMap.PlaceSearch({
          city: '北京',
          map: map
        })
        // eslint-disable-next-line no-undef
        AMap.event.addListener(autocomplete, 'select', function (e) {
          // TODO 针对选中的poi实现自己的功能
          placeSearch.search(e.poi.name)
        })
      })
    },

    /* 截图核心方法封装，获取base64 */
    PrtScn (domName) {
      if (domName == null || domName === '') {
        // eslint-disable-next-line no-throw-literal
        throw 'dom name should not be null'
      }
      if (domName.charAt(0) !== '#' && domName.charAt(0) !== '.') {
        // eslint-disable-next-line no-throw-literal
        throw 'dom element only supports id or class'
      }
      let domIsNull = null
      switch (domName.charAt(0)) {
        case '#':
          domIsNull = document.getElementById(domName.substr(1))
          break
        case '.':
          domIsNull = document.getElementsByClassName(domName.substr(1))[0]
          break
        default:
          break
      }
      if (domIsNull == null) {
        // eslint-disable-next-line no-throw-literal
        throw 'dom element should not be null'
      }
      // svg转canvas
      const nodesToRecover = []
      const nodesToRemove = []
      let svgElem
      switch (domName.charAt(0)) {
        case '#':
          svgElem = document
            .getElementById(domName.substr(1))
            .getElementsByTagName('svg')
          break
        case '.':
          svgElem = document
            .getElementsByClassName(domName.substr(1))[0]
            .getElementsByTagName('svg')
          break
        default:
          break
      }
      const prepare = []
      for (let i = 0; i < svgElem.length; i++) {
        prepare.push(0)
      }
      for (let i = 0; i < svgElem.length; i++) {
        const parentNode = svgElem[i].parentNode
        const canvas = document.createElement('canvas')
        canvas.style.position = svgElem[i].style.position
        canvas.width = parseInt(svgElem[i].style.width)
        canvas.height = parseInt(svgElem[i].style.height)
        canvas.style.left = 0
        canvas.style.top = 0 // 生成与svg对应尺寸的canvas
        const ctx = canvas.getContext('2d')
        // eslint-disable-next-line camelcase
        const svg_xml = new XMLSerializer().serializeToString(svgElem[i])
        const img = new Image()
        img.src = 'data:image/svg+xml;base64,' + window.btoa(svg_xml)
        img.onload = function () {
          ctx.drawImage(img, 0, 0)
          prepare[i] = 1
          // download(canvas.toDataURL("image/png")); // 调试用
        }
        parentNode.appendChild(canvas) // 使用canvas代替svg进行截图
        nodesToRemove.push({
          // 完成截图后删除canvas
          parent: parentNode,
          child: canvas
        })
        nodesToRecover.push({
          // 完成截图后恢复svg
          parent: parentNode,
          child: svgElem[i]
        })
        parentNode.removeChild(svgElem[i]) // 暂时移除svg
      }
      return new Promise(resolve => {
        const waitInterval = setInterval(() => {
          let isComplete = true // 创建定时器，等待上面img.onload的异步操作
          for (let i = 0; i < prepare.length; i++) {
            if (prepare[i] === 0) {
              isComplete = false
              break
            }
          }
          if (isComplete) {
            clearInterval(waitInterval)
            // div转canvas截图
            let domElem
            switch (domName.charAt(0)) {
              case '#':
                domElem = document.getElementById(domName.substr(1))
                break
              case '.':
                domElem = document.getElementsByClassName(domName.substr(1))[0]
                break
              default:
                break
            }
            html2canvas(domElem, {
              useCORS: true,
              logging: true
            }).then(cnv => {
              const imgUrl = cnv.toDataURL('image/png') // 将canvas转换成img的src流，base64
              for (let i = 0; i < nodesToRecover.length; i++) {
                nodesToRecover[i].parent.appendChild(nodesToRecover[i].child)
              }
              for (let i = 0; i < nodesToRemove.length; i++) {
                nodesToRemove[i].parent.removeChild(nodesToRemove[i].child)
              }
              resolve(imgUrl)
            })
          }
        }, 5)
      })
    },

    /* 下载图片的方法 */
    download (url) {
      const a = document.createElement('a')
      a.style.display = 'none'
      document.body.appendChild(a)
      const triggerDownload = $(a)
        .attr('href', url)
        .attr('download', 'gmap.png')
      triggerDownload[0].click()
      document.body.removeChild(a)
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
