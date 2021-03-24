<template>
  <el-dialog :visible="isShow" class="resDlg">
    <div>
      <gMap
        ref="gduMap"
        handleType="devMap"
        :bShowAllTools="false"
        :baseMapIndex="2"
        :bAutoLocate="true"
        class="map"
      ></gMap>
      <div class="title">
        <span></span>
        <span>{{ title }}</span>
      </div>
      <div class="toolBox">
        <div
          v-show="item.isShow"
          v-for="(item, index) in toolItems"
          :key="index"
          class="toolBtn"
          :class="[item.className, { toolBtnSelect: item.isSelect }]"
          @click="clickToolItem(item)"
        ></div>
      </div>
      <transition name="hideContent">
        <div
          class="contentBox"
          :style="'top:' + infoTop + 'px;'"
          v-show="!unfold"
        >
          <div
            class="unfold"
            v-show="!unfold"
            @click.stop="unfold = true"
          ></div>
          <div
            class="content"
            :style="'height:' + infoHeight + 'px;width:' + infoWidth + 'px;'"
          >
            <slot name="content"></slot>
          </div>
        </div>
      </transition>
      <transition name="showUnfoldBtn">
        <div class="fold" v-show="unfold" @click.stop="unfold = false"></div>
      </transition>
    </div>
    <div class="handelBtns" v-show="!isRead">
      <span @click="cancel">取消</span>
      <span @click="save">保存</span>
    </div>
    <div class="resDlgClose" v-show="isRead">
      <div class="infos">
        <span>创建时间:</span>
        <span class="value">{{ createTime }}</span>
        <span class="name">创建人:</span>
        <span class="value">{{ createUser }}</span>
        <span class="name">最后修改时间:</span>
        <span class="value">{{ updateTime }}</span>
        <span class="name">最后修改人:</span>
        <span class="value">{{ updateUser }}</span>
      </div>
      <span class="btnClose" @click.stop="cancel">关闭</span>
    </div>
  </el-dialog>
</template>

<script>
import { timeFormat } from '@/utils/date'
export default {
  props: {
    isShow: {
      type: Boolean,
      required: false
    },
    isRead: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    drawType: {
      type: Number,
      default: 0
    },
    bVideoPoint: {
      type: Boolean,
      required: false
    },
    infoTop: {
      type: Number,
      default: 97
    },
    infoWidth: {
      type: Number,
      default: 496
    },
    infoHeight: {
      type: Number,
      default: 447
    }
  },
  data () {
    return {
      // 折叠
      unfold: false,
      toolItems: [
        {
          name: 'zoomIn',
          className: 'zoomIn',
          isSelect: false,
          isShow: true
        },
        {
          name: 'zoomOut',
          className: 'zoomOut',
          isSelect: false,
          isShow: true
        }
      ],
      pointItem: {
        name: 'point',
        className: 'point',
        isSelect: false,
        isShow: true
      },
      lineItem: {
        name: 'line',
        className: 'line',
        isSelect: false,
        isShow: true
      },
      areaItem: {
        name: 'area',
        className: 'area',
        isSelect: false,
        isShow: true
      },
      bHasInitDrawHelper: false,
      createTime: '',
      createUser: '',
      updateTime: '',
      updateUser: ''
    }
  },
  watch: {
    isShow (val) {
      if (val) {
        this.toolItems.forEach((t) => {
          t.isSelect = false
        })
        setTimeout(() => {
          this.$refs.gduMap.map2D._map.updateSize()
        }, 200)
      } else {
        this.$refs.gduMap.map2D.customDrawHelper.clear()
        this.$refs.gduMap.map2D.customDrawHelper.stop()
      }
    },
    isRead (val) {
      if (val) {
        this.pointItem.isShow = false
        this.lineItem.isShow = false
        this.areaItem.isShow = false
      } else {
        this.pointItem.isShow = true
        this.lineItem.isShow = true
        this.areaItem.isShow = true
      }
    }
  },
  created () {
    if (this.drawType === 0) {
      this.toolItems.push(this.pointItem)
      if (!this.bVideoPoint) {
        this.toolItems.push(this.areaItem)
      }
    } else if (this.drawType === 1) {
      this.toolItems.push(this.lineItem)
      this.toolItems.push(this.pointItem)
    } else if (this.drawType === 2) {
      this.toolItems.push(this.areaItem)
      this.toolItems.push(this.pointItem)
    } else {
      console.log('Unsupported draw type!')
    }
  },
  methods: {
    /**
     *  取消
     */
    cancel () {
      this.$emit('update:isShow', false)
    },
    /**
     * 功能按钮
     */
    clickToolItem (item) {
      if (
        item.name === 'point' ||
        item.name === 'line' ||
        item.name === 'area'
      ) {
        this.toolItems.forEach((t) => {
          if (item !== t) {
            t.isSelect = false
          }
        })

        this.initCoustomDrawHelper()
        if (item.isSelect) {
          item.isSelect = false
          this.$refs.gduMap.map2D.customDrawHelper.stop()
        } else {
          item.isSelect = true
          if (item.name === 'point') {
            this.$refs.gduMap.map2D.customDrawHelper.drawType = 0
          } else if (item.name === 'line') {
            this.$refs.gduMap.map2D.customDrawHelper.drawType = 1
          } else if (item.name === 'area') {
            this.$refs.gduMap.map2D.customDrawHelper.drawType = 2
          }
        }
      } else if (item.name === 'zoomIn') {
        this.$refs.gduMap.map2D.zoomIn()
      } else if (item.name === 'zoomOut') {
        this.$refs.gduMap.map2D.zoomOut()
      }
    },
    initCoustomDrawHelper () {
      if (this.bHasInitDrawHelper) {
        return
      }
      this.bHasInitDrawHelper = true
      const drawHelper = this.$refs.gduMap.map2D.customDrawHelper
      // 0:不能修改；1:仅能修改当前类型；2:可修改所有类型。
      drawHelper.modifyFlag = 2
      // true:多边形或线段可以添加顶点;false:多边形或线段不可以添加顶点。
      drawHelper.bCanAddVertex = true
      // true，显示线段长度；false，不显示线段长度。
      drawHelper.bShowLineText = true
      // true，显示面积；false，不显示面积。
      drawHelper.bShowAreaText = false
      // 是否实时显示长度、面积。[与bShowLineText或bShowAreaText有关]
      drawHelper.bShowMeasureTip = true
      // 设置长度、面积显示的背景色及文字颜色
      // drawHelper.setTextStyle('rgba(128,0,88,1)','rgba(33,128,66,0.6)')
      // true,显示"单击继续,双击结束!"提示；false,不显示。
      drawHelper.bShowDrawToolTip = true
      // 限定绘图类型及该类型图案个数
      drawHelper.limitedType = this.drawType
      drawHelper.limitedCount = 1
      // 设置是否自动删除一个图案，继而可以继续绘图。
      drawHelper.bAutoRemove = true
      // 注册新绘图或修改图案回调事件
      drawHelper.addOrMoveEvent.addEventListener(
        this.addOrModifyEventCB.bind(this)
      )
    },
    /**
     *  地图操作回调
     */
    addOrModifyEventCB (data) {
      console.log('addOrModifyEventCB:', data)
      this.$emit('mapResAddOrModify', data)
    },
    /**
     *  删除绘制元素
     */
    removeFeatureByID (id) {
      this.$refs.gduMap.map2D.customDrawHelper.removeFeatureByID(id)
    },
    /**
     *  修改绘制元素
     */
    addOrUpdateFeature (data) {
      const tmpFt = this.$refs.gduMap.map2D.customDrawHelper.addOrUpdateFeature(
        data
      )
      setTimeout(() => {
        // 待自动定位结束后定位到指定图形
        this.$refs.gduMap.map2D.customDrawHelper.locateFeatureByID(data.drawId)
      }, 500)
      return tmpFt
    },
    /**
     *  清除绘制
     */
    clearCustomDraw () {
      this.$refs.gduMap.map2D.customDrawHelper.clear()
    },
    /**
     *  保存
     */
    save () {
      this.$emit('submitResForm')
    },
    /**
     * 传入显示信息
     */
    showInfos (data) {
      this.createTime = timeFormat(data.createTime)
      this.createUser = data.createUser
      this.updateTime = timeFormat(data.updateTime)
      this.updateUser = data.updateUser
    },
    /**
     * 获取绘图个数
     */
    getFeatureSize (drawType) {
      return this.$refs.gduMap.map2D.customDrawHelper.getFeatureSize(drawType)
    }
  }
}
</script>

<style lang="scss" scoped>
.resDlg {
  font-size: 14px;
  /deep/.el-dialog {
    width:1440px;
    overflow: hidden;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      width: 100%;
      height: 690px;
      background: #121e3a;
      box-sizing: border-box;
      border: 1px solid #1eb0fc;
    }
    .map {
      width: 100%;
      height: 617px;
    }
    .title {
      background: -webkit-linear-gradient(
        top,
        rgba($color: #000, $alpha: 0.7),
        rgba($color: #000, $alpha: 0)
      );
      pointer-events: none;
      width: 100%;
      height: 103px;
      position: absolute;
      top: 0px;
      left: 0px;
      padding: 14px 0px 0px 18px;
      span:nth-child(1) {
        display: inline-block;
        width: 21px;
        height: 16px;
        background-image: url("../../../assets/images/fire_title.png");
        margin-right: 10px;
        position: relative;
        top: 2px;
      }
      span:nth-child(2) {
        line-height: 21px;
        color: #fff;
        font-size: 14px;
      }
    }
    /* 取消/确定按钮 */
    .resDlgClose {
      margin: 15px 20px 20px 0;
      text-align: center;
      position: relative;

      .infos {
        display: inline-block;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
        color: #fff;

        .name {
          margin-left: 45px;
        }

        .value {
          margin-left: 5px;
        }
      }

      .btnClose {
        position: absolute;
        top: 10px;
        right: 0px;
        cursor: pointer;
        box-sizing: border-box;
        display: inline-block;
        width: 66px;
        height: 30px;
        background: transparent;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
        margin-left: 20px;
        color: #1eb0fc;
      }

      .btnClose:active {
        opacity: 0.8;
      }
    }
    .toolBox {
      position: absolute;
      top: 77px;
      left: 15px;
      width: 36px;
      .toolBtn {
        display: block;
        height: 36px;
        width: 36px;
        background-size: 100% 100%;
        margin-bottom: 12px;
        background-color: cadetblue;
        cursor: pointer;
      }
      .toolBtn:active {
        opacity: 0.8;
      }
      .toolBtnSelect {
        opacity: 0.8;
      }
      .zoomIn {
        background-image: url("../../../assets/images/backgroundManagement/zoomIn.png");
      }
      .zoomOut {
        background-image: url("../../../assets/images/backgroundManagement/zoomOut.png");
      }
      .point {
        background-image: url("../../../assets/images/backgroundManagement/pointType.png");
      }
      .line {
        background-image: url("../../../assets/images/backgroundManagement/lineType.png");
      }
      .area {
        background-image: url("../../../assets/images/backgroundManagement/areaType.png");
      }
    }
    .hideContent-enter,
    .hideContent-leave-to {
      transform: translateX(496px);
    }
    .hideContent-enter-active,
    .hideContent-leave-active {
      transition: all 0.3s ease;
    }
    .contentBox {
      display: flex;
      position: absolute;
      right: 0px;
      align-items: center;
      .content {
        background: rgba($color: #121e3a, $alpha: 0.95);
      }
      .unfold {
        width: 14px;
        height: 61px;
        background-image: url("../../../assets/images/backgroundManagement/fold.png");
        cursor: pointer;
      }
    }
    .showUnfoldBtn-enter,
    .showUnfoldBtn-leave-to {
      opacity: 0;
    }
    .showUnfoldBtn-enter-active,
    .showUnfoldBtn-leave-active {
      transition: all 0.2s ease;
    }
    .fold {
      position: absolute;
      width: 14px;
      height: 61px;
      top: 283px;
      right: 0px;
      background-image: url("../../../assets/images/backgroundManagement/unfold.png");
      cursor: pointer;
    }
  }
}
</style>
