<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    class="add-dept-dlg browserScroll"
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
        <div class="header-text">{{ title }}</div>
      </div>

      <div class="toolBox">
        <div
          v-for="(item, index) in toolItems"
          :key="index"
          class="toolBtn"
          :class="[item.className, { toolBtnSelect: item.isSelect }]"
          @click="clickToolItem(item)"
        ></div>
      </div>

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
              :rules="addDeptRules"
              :inline="true"
              class="add-dept-form"
            >
              <el-form-item label="机构名称 :" prop="deptName">
                <el-input
                  v-model="addDeptForm.deptName"
                  placeholder="请输入"
                  maxlength="20"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构地址 :" prop="address">
                <el-input
                  v-model="addDeptForm.address"
                  placeholder="请输入"
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item label="上级机构 :" prop="fatherDept">
                <el-cascader
                  v-model="addDeptForm.fatherDept"
                  :options="deptTree"
                  :props="{
                    expandTrigger: 'hover',
                    label: 'deptName',
                    value: 'deptCode',
                    checkStrictly: true,
                    emitPath: false,
                  }"
                  :show-all-levels="false"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="机构电话 :">
                <el-input
                  v-model="addDeptForm.phone"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构编码 :">
                <el-input
                  v-model="addDeptForm.deptCode"
                  placeholder="请输入"
                  maxlength="20"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构简称 :">
                <el-input
                  v-model="addDeptForm.shortName"
                  placeholder="请输入"
                  maxlength="10"
                ></el-input>
              </el-form-item>
              <el-form-item label="经度 :">
                <el-input
                  v-model="addDeptForm.longitude"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="纬度 :">
                <el-input
                  v-model="addDeptForm.latitude"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构状态 :" prop="status">
                <el-select
                  v-model="addDeptForm.status"
                  :popper-append-to-body="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in deptStatusTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序 :" prop="num">
                <el-input
                  v-model="addDeptForm.num"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="图标 :">
                <div class="icon-tool">
                  <!-- <el-avatar :size="30" :src="deptIconUrl" @error="avatarError">
                    <img
                      src="../../../assets/images/backgroundManagement/nopicture.png"
                    />
                  </el-avatar> -->
                  <img :src="deptIconUrl || defIcon" class="icon" />
                  <el-popover
                    placement="top"
                    trigger="click"
                    popper-class="iconPopover"
                    v-model="showPopover"
                  >
                    <div class="iconBox listScroll">
                      <!-- <span
                        class="close"
                        @click.stop="showPopover = false"
                      ></span> -->
                      <span
                        @click.stop="selectIcon(item)"
                        class="icon"
                        v-for="(item, index) in icons"
                        :key="index"
                        :style="{
                          background:
                            'url(' + serverUrl + item.iconPath + ') no-repeat',
                        }"
                      ></span>
                    </div>
                    <div class="choose-icon-btn" slot="reference">
                      <el-image class="btn-icon" :src="chooseIcon"></el-image>
                      选择图标
                    </div>
                  </el-popover>
                </div>
              </el-form-item>
              <el-form-item label="备注 :">
                <el-input
                  v-model="addDeptForm.note"
                  placeholder="请输入"
                  type="textarea"
                  resize="none"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </transition>
      <div class="confirm-tool">
        <div class="confirm-btn" @click="confirmClick">确定</div>
        <div class="cancel-btn" @click="cancelClick">取消</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import globalApi from '@/utils/globalApi'
import { numberValidate } from '@/utils/formRules'

export default {
  props: ['isShow', 'deptTree', 'icons', 'title', 'deptInfo'],
  watch: {
    isShow (newS) {
      if (!newS) {
        if (this.$refs.addDeptRef) {
          this.$refs.addDeptRef.resetFields()
          this.deptIconUrl = ''
          this.addDeptForm.icon = ''
        }
      }
    },
    deptInfo (newD) {
      if (newD) {
        // console.log(newD)
        this.addDeptForm.deptName = newD.deptName
        this.addDeptForm.address = newD.deptAddress
        this.addDeptForm.fatherDept = newD.parentDeptCode
        this.addDeptForm.phone = newD.deptTel
        this.addDeptForm.deptCode = newD.deptCode
        this.addDeptForm.shortName = newD.deptShortName
        this.addDeptForm.longitude = newD.deptLongitude
        this.addDeptForm.latitude = newD.deptLatitude
        this.addDeptForm.note = newD.deptRemark
        this.addDeptForm.num = newD.orderNum
        if (newD.deptStatus === '在用') {
          this.addDeptForm.status = 0
        }
        if (newD.deptStatus === '已注销') {
          this.addDeptForm.status = 1
        }
        this.deptIconUrl = newD.deptIcon ? this.serverUrl + newD.deptIcon : ''
        this.addDeptForm.icon = newD.deptIcon
      }
    }
  },
  data () {
    return {
      defIcon: require('../../../assets/images/backgroundManagement/nopicture.png'),
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
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
        status: 0,
        note: '',
        num: '',
        icon: ''
      },
      addDeptRules: {
        deptName: [{ required: true, message: '请输入' }],
        address: [{ required: true, message: '请输入' }],
        fatherDept: [{ required: true, message: '请选择' }],
        num: numberValidate('请输入数字')
      },
      deptStatusTypes: [
        {
          id: 0,
          label: '在用'
        },
        {
          id: 1,
          label: '已注销'
        }
      ],
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
      this.$refs.addDeptRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        this.$emit('confirmClick', this.addDeptForm)
      })
    },

    cancelClick () {
      this.$emit('cancelClick')
    },

    avatarError () {
      return true
    },

    // 选择图标
    selectIcon (item) {
      this.showPopover = false
      this.deptIconUrl = this.serverUrl + item.iconPath
      this.addDeptForm.icon = item.iconPath
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
      if (item.name === 'point') {
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
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 1080px;
    background-color: transparent;
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
      background-color: rgba(0, 65, 87, 0.85);
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
        width: 19px;
        height: 16px;
        background-image: url("../../../assets/images/fire_title.png");
        background-size: 100% 100%;
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
      width: 522px;
      height: 449px;
      top: 97px;
      right: 0px;
      background-color: rgba(0, 65, 87, 0.95);
      .fold-tool {
        float: left;
        width: 14px;
        height: 100%;
        .fold-btn {
          position: absolute;
          width: 14px;
          height: 61px;
          top: 50%;
          left: -13px;
          margin-top: -30px;
          background-image: url("../../../assets/images/backgroundManagement/fold.png");
          background-size: 100% 100%;
          cursor: pointer;
        }
      }
      .add-dept-content {
        overflow-y: auto;
        height: 100%;
        .content-header {
          height: 33px;
          border-bottom: 1px solid #1eb0fc;
          .icon {
            display: inline-block;
            width: 19px;
            height: 16px;
            background-image: url("../../../assets/images/fire_title.png");
            background-size: 100% 100%;
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
            width: 142px;
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
            width: 100px;
          }
          .el-form-item__error {
            margin-top: -10px;
          }
          .el-textarea__inner {
            background-color: rgba($color: #09546d, $alpha: 0.3);
            border-color: #1eb0fc;
            border-radius: 0;
            width: 390px;
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
            margin: 8px 0 10px 0;
            .icon {
              width: 0.3rem;
              height: 0.3rem;
              border-radius: 50%;
            }
            .choose-icon-btn {
              display: inline-block;
              width: 102px;
              height: 24px;
              border: 1px solid #1ea7f0;
              color: #fff;
              font-size: 12px;
              line-height: 24px;
              vertical-align: top;
              margin: 3px 0 0 8px;
              cursor: pointer;
              .btn-icon {
                width: 12px;
                height: 12px;
                margin-left: 10px;
                margin-top: 6px;
                vertical-align: top;
              }
            }
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
      .cancel-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: transparent;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin-right: 20px;
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
