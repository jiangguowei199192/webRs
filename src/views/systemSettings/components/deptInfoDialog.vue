<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="1080px"
    class="add-dept-dlg"
  >
    <div class="add-dept-div">
      <gMap
        ref="gduMap"
        handleType="devMap"
        :bShowAllTools="false"
        :baseMapIndex="2"
        class="map-tool"
      ></gMap>

      <div class="add-dept-header">
        <div class="header-icon"></div>
        <div class="header-text">新增机构</div>
      </div>

      <!-- <div class="toolBox">
        <div
          v-for="(item, index) in toolItems"
          :key="index"
          class="toolBtn"
          :class="[item.className, { toolBtnSelect: item.isSelect }]"
          @click="clickToolItem(item)"
        ></div>
      </div> -->

      <transition name="showUnfoldBtn">
        <div
          class="unfold-btn"
          @click="unfoldClick"
          v-show="showUnfoldBtn"
        ></div>
      </transition>
      <transition name="hideCourseList">
        <div class="add-dept-base" v-show="showDeptContent">
          <div class="fold-tool">
            <div class="fold-btn" @click="foldClick"></div>
          </div>
          <div class="add-dept-content">
            <div class="content-header">
              <div class="icon"></div>
              <div class="text">机构信息</div>
            </div>
            <el-form
              ref="addDeptRef"
              :model="addDeptForm"
              :inline="true"
              label-width="80px"
              class="add-dept-form"
            >
              <el-form-item label="机构名称" prop="deptName">
                <el-input
                  v-model="deptInfo.deptName"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构地址" prop="address">
                <el-input
                  v-model="deptInfo.deptAddress"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="上级机构" prop="fatherDept">
                <el-input
                  v-model="deptInfo.parentDeptCodeName"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构电话">
                <el-input
                  v-model="deptInfo.deptTel"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构编码">
                <el-input
                  v-model="deptInfo.deptCode"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构简称">
                <el-input
                  v-model="deptInfo.deptShortName"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="经度">
                <el-input
                  v-model="deptInfo.deptLatitude"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="纬度">
                <el-input
                  v-model="deptInfo.deptLongitude"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构状态">
                <el-input
                  v-model="deptInfo.deptStatus"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="num">
                <el-input
                  v-model="deptInfo.orderNum"
                  placeholder=""
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <div class="icon-tool">
                  <el-avatar :size="30" :src="deptIconUrl" @error="avatarError">
                    <img src="../../../assets/images/backgroundManagement/nopicture.png">
                  </el-avatar>
                </div>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="deptInfo.deptRemark"
                  placeholder=""
                  type="textarea"
                  resize="none"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </transition>
      <div class="confirm-tool">
        <div class="confirm-btn" @click="confirmClick">关闭</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import globalApi from '@/utils/globalApi'

export default {
  props: ['isShow', 'deptInfo'],
  watch: {
    isShow (newS) {
      if (!newS) {
        if (this.$refs.addDeptRef) {
          this.$refs.addDeptRef.resetFields()
          this.deptIconUrl = ''
        }
      }
    },
    deptInfo (newInfo) {
      if (newInfo) {
        this.deptIconUrl = newInfo.deptIcon
      }
    }
  },
  data () {
    return {
      deptIconUrl: '',
      addDeptForm: {
        deptName: '',
        address: '',
        fatherDept: '',
        phone: '',
        deptCode: '',
        shortName: '',
        longitude: '',
        latitude: '',
        status: '',
        note: '',
        num: ''
      },
      showPopover: false,
      serverUrl: globalApi.headImg,
      showDeptContent: true,
      showUnfoldBtn: false,
      toolItems: [
        {
          name: 'zoomIn',
          className: 'zoomIn',
          isSelect: false
        },
        {
          name: 'zoomOut',
          className: 'zoomOut',
          isSelect: false
        },
        {
          name: 'point',
          className: 'point',
          isSelect: false
        }
      ],
      bHasInitDrawHelper: false
    }
  },
  methods: {
    confirmClick () {
      this.$emit('confirmClick')
    },

    avatarError () {
      return true
    },

    // 折叠
    foldClick () {
      this.showDeptContent = false
      this.showUnfoldBtn = true
    },

    // 展开
    unfoldClick () {
      this.showDeptContent = true
      this.showUnfoldBtn = false
    },

    clickToolItem (item) {
      if (
        item.name === 'point'
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
      // 设置长度、面积显示的背景色及文字颜色
      // drawHelper.setTextStyle('rgba(128,0,88,1)','rgba(33,128,66,0.6)')
      // true,显示"单击继续,双击结束!"提示；false,不显示。
      drawHelper.bShowDrawToolTip = true
      // 限定绘图类型及该类型图案个数
      drawHelper.limitedType = 0
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
      this.addDeptForm.longitude = data.coordinates[0].toFixed(7)
      this.addDeptForm.latitude = data.coordinates[1].toFixed(7)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-dept-dlg.el-dialog__wrapper {
  /deep/.el-dialog {
    overflow: hidden;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      width: 100%;
    }
    .add-dept-div {
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
    }
    .map-tool {
      width: 100%;
      height: 617px;
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
    }
    .add-dept-header {
      background: -webkit-linear-gradient(
        top,
        rgba($color: #000, $alpha: 0.7),
        rgba($color: #000, $alpha: 0)
      );
      position: absolute;
      height: 100px;
      width: 100%;
      top: 1px;
      left: 1px;
      .header-icon {
        display: inline-block;
        width: 22px;
        height: 16px;
        background-image: url("../../../assets/images/fire_title.png");
        margin-top: 15px;
        margin-left: 18px;
      }
      .header-text {
        display: inline-block;
        vertical-align: top;
        margin-top: 13px;
        margin-left: 10px;
        font-size: 14px;
        color: #fff;
      }
    }
    .unfold-btn {
      position: absolute;
      width: 14px;
      height: 61px;
      top: 291px;
      right: 0px;
      background-image: url("../../../assets/images/backgroundManagement/unfold.png");
      cursor: pointer;
    }
    .add-dept-base {
      position: absolute;
      width: 496px;
      height: 449px;
      top: 97px;
      right: 0px;
      .fold-tool {
        float: left;
        width: 14px;
        height: 100%;
        .fold-btn {
          position: absolute;
          width: 14px;
          height: 61px;
          top: 50%;
          margin-top: -30px;
          background-image: url("../../../assets/images/backgroundManagement/fold.png");
          cursor: pointer;
        }
      }
      .add-dept-content {
        float: right;
        width: 456px;
        height: 447px;
        border: 1px solid #1eb0fc;
        background-color: #121e3a;
        padding: 0 12px;
        .content-header {
          height: 33px;
          border-bottom: 1px solid #1eb0fc;
          .icon {
            display: inline-block;
            width: 22px;
            height: 16px;
            background-image: url("../../../assets/images/fire_title.png");
            margin-top: 10px;
          }
          .text {
            display: inline-block;
            vertical-align: top;
            margin-top: 8px;
            margin-left: 10px;
            font-size: 14px;
            color: #fff;
          }
        }
        .add-dept-form {
          margin-top: 35px;
          .el-input__inner {
            background-color: rgba($color: #09546d, $alpha: 0.3);
            border-color: #1eb0fc;
            border-radius: 0;
            width: 138px;
            height: 24px;
            color: #fff;
            font-size: 12px;
          }
          .el-form-item {
            margin-top: -20px;
          }
          .el-form-item__label {
            color: #fff;
            font-size: 12px;
          }
          .el-form-item__error {
            margin-top: -10px;
          }
          .el-textarea__inner {
            background-color: rgba($color: #09546d, $alpha: 0.3);
            border-color: #1eb0fc;
            border-radius: 0;
            width: 365px;
            height: 78px;
            color: #fff;
            font-size: 12px;
            margin-top: 8px;
          }
          .subtext1 {
            color: #fff;
            font-size: 12px;
            width: 180px;
          }
          .icon-tool {
            display: inline-block;
            height: 30px;
            vertical-align: middle;
          }
        }
      }
    }
    .confirm-tool {
      height: 50px;
      margin-top: 20px;
      margin-right: 15px;
      .confirm-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
    }
  }
}

.hideCourseList-enter,
.hideCourseList-leave-to {
  transform: translateX(505px);
}
.hideCourseList-enter-active,
.hideCourseList-leave-active {
  transition: all 0.3s ease;
}

.showUnfoldBtn-enter,
.showUnfoldBtn-leave-to {
  opacity: 0;
}
.showUnfoldBtn-enter-active,
.showUnfoldBtn-leave-active {
  transition: all 0.3s ease;
}
</style>
