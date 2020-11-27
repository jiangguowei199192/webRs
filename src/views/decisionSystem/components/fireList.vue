<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_3.0
 * @Author: liangkaiLee
 * @Date: 2020-11-26 15:31:30
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2020-11-27 16:37:02
-->
<template>
  <div>
    <!-- 火情列表 -->
    <div class="fire_list">
      <div class="list_header">
        <div class="title">火情列表</div>
        <div class="add" @click.stop="addFire"></div>
      </div>
      <div class="list_content">
        <div class="top">
          <span><img :src="fireImg" alt="" />水果湖支队火灾扑救</span>
          <span>三级</span>
        </div>
        <div class="bottom">
          <div>
            <span>时间：2020-12-12 12:12:12</span
            ><span>地点：汉街国际B座23层</span>
          </div>
          <div>出动</div>
        </div>
      </div>
      <div class="list_bottom">
        <span v-for="(item, index) in btnAction" :key="index"
          ><img :src="item.iconSrc" alt="" />{{ item.content }}
        </span>
      </div>
    </div>
    <!-- 新增案件 -->
    <div class="fire_add">
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="1000px"
        class="dialog_wrap"
      >
        <div class="add_header">
          <div class="title">新增案件</div>
          <div class="close" @click.stop="closeDialog">×</div>
        </div>
        <div class="add_content">
          <el-form
            ref="addFireRef"
            label-width="90px"
            :inline="true"
            :model="addFireForm"
            :rules="addFireRules"
          >
            <div class="content_info">
              <el-form-item label="火情编号">
                <el-input
                  placeholder="自动生成"
                  :disabled="true"
                  v-model="addFireForm.number"
                ></el-input
              ></el-form-item>
              <el-form-item label="案件名称" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.name"
                ></el-input>
              </el-form-item>
            </div>
            <div class="content_info">
              <el-form-item label="信息来源" prop="source">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.source"
                ></el-input>
              </el-form-item>
              <el-form-item label="报警人" prop="person">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.person"
                ></el-input>
              </el-form-item>
            </div>
            <div class="content_info">
              <el-form-item label="报警电话" prop="phone">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.phone"
                ></el-input>
              </el-form-item>
              <el-form-item label="举报地址" prop="address">
                <el-input
                  placeholder="请输入"
                  v-model="addFireForm.address"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item label="手动定位" prop="coord">
              <div style="width: 850px; height: 180px">
                <gMap
                  ref="gduMap"
                  handleType="devMap"
                  :bShowSimpleSearchTools="true"
                  :bShowBasic="false"
                  :bShowMeasure="false"
                  :bShowLonLat="false"
                  :bAutoLocate="false"
                ></gMap>
              </div>
            </el-form-item>
            <el-form-item label="报警时间" prop="time">
              <el-date-picker
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="addFireForm.time"
              ></el-date-picker> </el-form-item
            ><br />
            <el-form-item label="简要描述" prop="description">
              <el-input
                placeholder="请输入"
                type="textarea"
                v-model="addFireForm.description"
              ></el-input> </el-form-item
            ><br />
            <el-form-item label="重点记录" prop="record">
              <el-input
                placeholder="请输入"
                type="textarea"
                v-model="addFireForm.record"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="add_bottom">
          <span class="btn_cancel" @click.stop="closeDialog">取消</span>
          <span class="btn_confirm" @click="addFireSubmit">确定</span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { isNotNull, limitLength, selectValidator } from '@/utils/validate'

export default {
  name: 'fireList',

  data () {
    return {
      dialogVisible: false,
      // 动作按钮
      btnAction: [
        {
          id: 0,
          iconSrc: require('../../../assets/images/fire-list/fire_nor.png'),
          content: '标记火点'
        },
        {
          id: 1,
          iconSrc: require('../../../assets/images/fire-list/fight.png'),
          content: '加入战斗'
        },
        {
          id: 2,
          iconSrc: require('../../../assets/images/fire-list/sync.png'),
          content: '警情同步'
        }
      ],
      // 火情icon
      fireImg: require('../../../assets/images/fire-list/fire.png'),
      // 表单字段
      addFireForm: {
        number: '',
        name: '',
        source: '',
        person: '',
        phone: '',
        address: '',
        time: '',
        description: '',
        record: '',
        coord: ''
      },
      // 验证规则
      addFireRules: {
        name: isNotNull('请输入案件名称').concat(limitLength(1, 30)),
        source: isNotNull('请输入信息来源').concat(limitLength(1, 50)),
        person: isNotNull('请输入报警人')
          .concat(limitLength(1, 15))
          .concat(selectValidator('validateUsername')),
        address: isNotNull('请输入报警地址').concat(limitLength(1, 50)),
        coord: isNotNull('请选择坐标')
      }
    }
  },

  methods: {
    addFire () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
      this.addFireForm.number = this.addFireForm.name = this.addFireForm.source = this.addFireForm.person = this.addFireForm.phone = this.addFireForm.address = this.addFireForm.time = this.addFireForm.description = this.addFireForm.record = this.addFireForm.coord =
        ''
    },
    addFireSubmit () {
      this.$refs.addFireRef.validate((valid) => {
        if (!valid) return
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fire_list {
  width: 454px;
  height: 225px;
  background: url(../../../assets/images/fire-list/firelist_wrap.png) no-repeat
    center/100%;
  padding: 16px 14px 10px 10px;
  .list_header {
    .add {
      width: 30px;
      height: 30px;
      line-height: 30px;
      background: url(../../../assets/images/fire-list/add.png) no-repeat
        center/100%;
      cursor: pointer;
    }
  }
  .list_content {
    width: 415px;
    height: 96px;
    border: 1px solid #1eb0fc;
    margin: 15px 0 0 4px;
    padding: 12px 15px;
    .top,
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .top {
      span:nth-child(1) {
        color: #ffd800;
        img {
          width: 34px;
          height: 34px;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
      span:nth-child(2) {
        display: block;
        width: 44px;
        height: 20px;
        background: #ffd800;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
        color: #000;
      }
    }
    .bottom {
      font-size: 14px;
      margin-top: 10px;
      div:nth-child(1) {
        display: flex;
        flex-direction: column;
        margin-left: 40px;
        span:nth-child(2) {
          margin-top: 5px;
        }
      }
      div:nth-child(2) {
        width: 47px;
        height: 47px;
        line-height: 47px;
        text-align: center;
        background: url(../../../assets/images/fire-list/action.png) no-repeat
          center/100%;
      }
    }
  }
  .list_bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 15px;
    span {
      width: 144px;
      height: 38px;
      line-height: 38px;
      border: 1px solid #1eb0fc;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
}
.list_header,
.add_header {
  display: flex;
  justify-content: space-between;
  .title {
    width: 165px;
    height: 34px;
    line-height: 34px;
    background: url(../../../assets/images/fire-list/info-title.png) no-repeat
      center/100%;
    padding-left: 15px;
    font-size: 16px;
    font-weight: bold;
  }
}
.fire_add {
  .dialog_wrap {
    background-color: rgba($color: #040404, $alpha: 0.86);
    top: -40px;
    /deep/.el-dialog {
      background-color: transparent;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
        height: 755px;
        background: url(../../../assets/images/2d/entrytab_dialog.png) no-repeat
          top/100% 100%;
      }
      .add_header {
        padding: 20px 20px 0 20px;
        color: #fff;
        .close {
          font-size: 30px;
          cursor: pointer;
        }
      }
      .add_content {
        margin: 25px 30px 0 20px;
        .content_info {
          display: flex;
          justify-content: space-between;
        }
        .el-input__inner {
          width: 310px;
        }
        .el-textarea__inner {
          width: 850px;
          height: 64px;
        }
        .el-input__inner,
        .el-textarea__inner {
          border: 1px solid #0fbfe0;
          background-color: transparent;
          color: rgb(243, 243, 243);
        }
        .el-form-item__label {
          color: #0fbfe0;
          font-size: 15px;
        }
      }
      .add_bottom {
        padding: 0 40px;
        display: flex;
        justify-content: flex-end;
        .btn_confirm,
        .btn_cancel {
          display: block;
          width: 87px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          border: 1px solid #1eb0fc;
          border-radius: 4px;
          font-size: 15px;
          cursor: pointer;
        }
        .btn_confirm {
          background: #1eb0fc;
          color: #fff;
        }
        .btn_cancel {
          background: transparent;
          color: #1eb0fc;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
