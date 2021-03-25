<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_3.1
 * @Author: liangkaiLee
 * @Date: 2021-01-26 09:16:43
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-24 16:26:56
-->
<template>
  <el-dialog
    :visible.sync="isShow"
    :close-on-click-modal="false"
    width="480px"
    class="add-dict-dlg dialog-wrap"
  >
    <div class="add-dict-header">
      <div class="header-icon"></div>
      <div class="header-text">{{ title }}</div>
    </div>
    <el-form
      ref="addDictForm"
      :model="addDictForm"
      :rules="addDictRules"
      :inline="true"
      label-width="80px"
      class="add-dict-form"
    >
      <el-form-item label="类型名称 :" prop="name">
        <el-input
          v-model="addDictForm.name"
          :placeholder="placeholder"
          :disabled="isDisabled"
          :class="isDisabled ? 'value_disabled' : ''"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="类型码 :" prop="code">
        <el-input
          v-model="addDictForm.code"
          :placeholder="placeholder"
          :disabled="(isDisabled, codeDisabled)"
          :class="isDisabled || codeDisabled ? 'value_disabled' : ''"
          maxlength="20"
          show-word-limit
          @input="limitIntOrCharMaxLength($event, 20, addDictForm, 'code')"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态 :" prop="status">
        <el-select
          v-model="addDictForm.status"
          :popper-append-to-body="false"
          placeholder="请选择"
          :disabled="isDisabled"
          :class="isDisabled ? 'value_disabled' : ''"
        >
          <el-option
            v-for="item in statusType"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序 :" prop="order">
        <el-input
          v-model="addDictForm.order"
          :placeholder="placeholder"
          :disabled="isDisabled"
          :class="isDisabled ? 'value_disabled' : ''"
          @input="lengthLimitedNumber($event, 4, addDictForm, 'order')"
        ></el-input>
      </el-form-item>
      <el-form-item label="图标 :" prop="icon">
        <div class="iconTool">
          <img :src="avatarUrl || defIcon" class="icon" draggable="false" />
          <el-popover
            placement="right"
            trigger="click"
            popper-class="iconPopover"
            v-model="showPopover"
            v-if="!isDisabled"
          >
            <div class="iconBox webFsScroll">
              <span
                class="icon"
                v-for="(item, index) in icons"
                :key="index"
                :style="{
                  background:
                    'url(' + serverUrl + item.iconPath + ') no-repeat',
                }"
                @click.stop="selectIcon(item)"
              ></span>
            </div>
            <div class="chooseBox" slot="reference" @click.stop="iconBoxCilck">
              <el-image
                class="btn"
                :src="chooseIcon"
                draggable="false"
              ></el-image>
              <span>选择图标</span>
            </div>
          </el-popover>
        </div>
      </el-form-item>
      <el-form-item label="备注 :" prop="note">
        <el-input
          v-model="addDictForm.note"
          :placeholder="placeholder"
          type="textarea"
          resize="none"
          :disabled="isDisabled"
          :class="isDisabled ? 'value_disabled' : ''"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 操作信息log -->
    <div
      class="handelNote"
      v-if="handelType == 'checkParentDict' || handelType == 'checkChildDict'"
    >
      <div>
        <span>创建时间：{{ addDictForm.createTime }}</span>
        <span>创建人：{{ addDictForm.createUserName }}</span>
      </div>
      <div style="margin-top: 15px">
        <span>最后修改时间：{{ addDictForm.updateTime }}</span>
        <span>最后修改人：{{ addDictForm.updateUserName }}</span>
      </div>
    </div>
    <!-- 操作按钮 -->
    <div
      v-if="handelType == 'checkParentDict' || handelType == 'checkChildDict'"
      class="handelBtns"
    >
      <span style="margin-right: 190px" @click.stop="cancelClick('addDictForm')"
        >关闭</span
      >
    </div>
    <div v-else class="handelBtns">
      <span @click.stop="cancelClick('addDictForm')">取消</span>
      <span @click.stop="confirmClick('addDictForm')">确定</span>
    </div>
  </el-dialog>
</template>

<script>
import {
  isNotNull,
  numberValidate,
  validateName,
  limitIntOrCharMaxLength,
  lengthLimitedNumber
} from '@/utils/formRules'
import { iconLibaryApi } from '@/api/iconLibary'
import globalApi from '@/utils/globalApi'

export default {
  props: {
    isShow: { type: Boolean, required: true },
    title: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    dictInfo: { type: Object, required: false },
    handelType: { type: String, required: false }
  },

  data () {
    return {
      placeholder: '请输入',
      serverUrl: globalApi.headImg,
      showPopover: false,
      icons: [],
      avatarUrl: '',
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      defIcon: require('../../../assets/images/backgroundManagement/nopicture.png'),
      addDictForm: {
        name: '',
        code: '',
        status: '',
        order: '',
        icon: '',
        note: '',
        createTime: '',
        createUserName: '',
        updateTime: '',
        updateUserName: ''
      },
      addDictRules: {
        name: isNotNull('请输入类型名称').concat(
          validateName('名称只包含汉字/数字/字母/下划线且不能以下划线开头结尾')
        ),
        code: isNotNull('请输入类型码'),
        status: isNotNull('请选择状态'),
        order: numberValidate('输入必须为数字')
      },
      statusType: [
        {
          id: 0,
          label: '有效'
        },
        {
          id: 1,
          label: '无效'
        }
      ],
      isDisabled: false,
      codeDisabled: false
    }
  },

  watch: {
    isShow (val) {
      if (val && this.dictInfo) {
        this.addDictForm.name = this.dictInfo.typeName
        this.addDictForm.code = this.dictInfo.typeCode
        this.addDictForm.status = this.dictInfo.status
        this.addDictForm.order = this.dictInfo.orderNum
        this.addDictForm.icon = this.dictInfo.icon
        this.addDictForm.note = this.dictInfo.remark
        this.addDictForm.createTime = this.dictInfo.createTime
        this.addDictForm.createUserName = this.dictInfo.createUser
        this.addDictForm.updateTime = this.dictInfo.updateTime
        this.addDictForm.updateUserName = this.dictInfo.updateUser
      }
      if (val && this.handelType) {
        switch (this.handelType) {
          case 'checkParentDict':
          case 'checkChildDict':
            this.isDisabled = this.codeDisabled = true
            break
          case 'editChildDict':
          case 'editParentDict':
            this.codeDisabled = true
            break
        }
      }
    },

    resourcesIcon (val) {
      if (val && val !== undefined) {
        this.avatarUrl = this.serverUrl + val
      } else this.avatarUrl = ''
    }
  },

  computed: {
    resourcesIcon () {
      return this.addDictForm.icon
    }
  },

  methods: {
    limitIntOrCharMaxLength,
    lengthLimitedNumber,

    confirmClick (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$emit('confirmClick', this.addDictForm)
      })
    },

    cancelClick (formName) {
      this.$refs[formName].resetFields()
      this.isDisabled = this.codeDisabled = false
      this.$emit('update:isShow', false)
      this.$emit('update:handelType', '')
    },

    getIconList () {
      const params = {
        pageSize: 1000,
        isQuote: '',
        currentPage: 1
      }
      this.$axios
        .post(iconLibaryApi.getAllPic, params, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          // console.log('图标库接口返回:', res)
          if (res && res.data && res.data.code === 0) {
            this.icons = res.data.data.records
          }
        })
        .catch((err) => {
          console.log('接口错误: ' + err)
        })
    },

    selectIcon (item) {
      this.showPopover = false
      this.addDictForm.icon = item.iconPath
      this.$refs.addDictForm.validateField('icon', (valid) => {})
    },

    iconBoxCilck () {
      // console.log('iconBox被点击了！')
      this.getIconList()
    }
  }
}
</script>

<style lang="scss" scoped>
.add-dict-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    .add-dict-form {
      margin-top: 30px;
      .el-input__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 390px;
        height: 28px;
        color: #fff;
        font-size: 12px;
      }
      .el-form-item {
        display: block;
        margin: -15px 0 25px 0;
      }
      .el-form-item__label {
        color: #fff;
        font-size: 12px;
      }
      .el-form-item__error {
        margin-top: -5px;
      }
      .el-textarea__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 390px;
        height: 85px;
        color: #fff;
        font-size: 12px;
        margin-top: 8px;
      }
      .el-input .el-input__count .el-input__count-inner,
      .el-textarea .el-input__count {
        background: transparent;
        bottom: -5px;
      }
    }
    .value_disabled {
      .el-input__inner,
      .el-textarea__inner {
        color: rgba($color: #fff, $alpha: 0.7);
      }
    }
    .handelNote {
      margin-top: 20px;
      font-size: 12px;
      color: rgba($color: #fff, $alpha: 0.7);
      div {
        display: flex;
        justify-content: space-around;
      }
    }
    .handelBtns {
      margin-right: 0;
      span {
        background: #1eb0fc;
        color: #fff;
      }
    }
  }
}
</style>
