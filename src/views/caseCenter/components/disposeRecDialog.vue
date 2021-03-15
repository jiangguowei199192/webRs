<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-10 16:07:40
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-13 15:41:40
-->
<template>
  <div>
    <el-dialog
      :visible.sync="isShow"
      :close-on-click-modal="false"
      class="add-case-dlg dialog-wrap"
    >
      <div class="add-case-header">{{ title }}</div>
      <el-form
        ref="addCaseForm"
        :model="addCaseForm"
        :rules="addCaseFormRules"
        :inline="true"
        label-width="auto"
        class="add-case-form"
      >
        <el-form-item label="处置结果 :" prop="result">
          <el-input
            v-model="addCaseForm.result"
            :placeholder="placeholder"
            type="textarea"
            resize="none"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
        <div style="display: flex; justify-content: space-between">
          <el-form-item label="处置时间 :" prop="time">
            <el-date-picker
              v-model="addCaseForm.time"
              type="datetime"
              :placeholder="placeholder"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="处置人 :"
            prop="people"
            style="margin-right: 20px"
          >
            <el-input
              v-model="addCaseForm.people"
              :placeholder="placeholder"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="上传文件 :" prop="uploadFile">
          <el-upload
            class="upload-box"
            multiple
            name="flies"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            :limit="10"
            :file-list="uploadList"
            :auto-upload="false"
            :on-change="onUploadChange"
            :on-remove="onRemoveFile"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
              <p>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="handelBtns">
        <span @click.stop="updateIsShow('addCaseForm')">取消</span>
        <span @click.stop="confirmCaseRecord('addCaseForm')">确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isNotNull } from '@/utils/formRules'
import { caseApi } from '@/api/case'

export default {
  props: {
    isShow: { type: Boolean, required: true },
    title: { type: String, required: true },
    clickRowId: { type: String, required: true }
  },

  data () {
    return {
      placeholder: '请输入',
      addCaseForm: {
        id: 0,
        time: '',
        result: '',
        people: '',
        uploadFile: null
      },
      addCaseFormRules: {
        result: isNotNull('请输入处置结果'),
        people: isNotNull('请输入处置人'),
        time: isNotNull('请选择报警时间')
      },
      uploadList: []
    }
  },

  watch: {
    isShow (val) {
      if (val) {
        // console.log("clickRowId:", this.clickRowId);
        this.addCaseForm.id = this.clickRowId
      }
    }
  },

  mounted () {},

  methods: {
    // 处置info录入提交
    confirmCaseRecord (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        // console.log('addCaseForm:', this.addCaseForm)
        this.$axios
          .post(caseApi.finishCase, this.addCaseForm, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then(res => {
            console.log('处置记录提交res:', res)
            if (res && res.data && res.data.code === 0) {
              this.updateIsShow()
              this.$emit('confirmRecordClick', this.addCaseForm)
            }
          })
          .catch(err => {
            console.log('caseApi.caseAdd Err : ' + err)
          })
      })
    },

    // 更新isShow状态
    updateIsShow (formName) {
      this.$refs[formName].resetFields()
      this.$emit('update:isShow', false)
      this.$emit('update:clickRowId', '')
    },

    onUploadChange () {},

    onRemoveFile () {}
  }
}
</script>

<style lang="scss" scoped>
.add-case-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    max-width: 780px;
    // background-color: rgba(0, 65, 87, 0.85);
    .add-case-header {
      width: 218px;
      height: 30px;
      background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      line-height: 30px;
      padding: 0 20px;
    }
    .add-case-form {
      margin: 30px 0 0 5px;
      .el-input__inner {
        background-color: rgba(9, 84, 109, 0.85);
        border-color: #00d2ff;
        border-radius: 0;
        width: 240px;
        height: 28px;
        color: #00caf6;
        font-size: 12px;
      }
      .el-form-item {
        display: block;
        margin: 5px 0 25px 0;
      }
      .el-form-item__label {
        color: #fff;
        font-size: 12px;
      }
      // .el-form-item__error {
      //   margin-top: -5px;
      // }
      .el-textarea__inner {
        background-color: rgba(9, 84, 109, 0.85);
        border-color: #00d2ff;
        border-radius: 0;
        width: 635px;
        height: 85px;
        color: #00caf6;
        font-size: 12px;
        margin-top: 8px;
      }
      .el-input .el-input__count .el-input__count-inner,
      .el-textarea .el-input__count {
        background: transparent;
        bottom: -5px;
      }
      .upload-box {
        width: 404px;
        height: 208px;
        background-color: rgba(9, 84, 109, 0.85);
        border-radius: 4px;
        cursor: pointer;
        .el-upload-dragger {
          background-color: transparent;
          border: 1px dashed #00d2ff;
          box-sizing: border-box;
          width: 404px;
          height: 208px;
        }
        .el-icon-upload {
          font-size: 80px;
          color: #c0c4cc;
          margin: 30px 0 0 5px;
        }
        .el-upload__text {
          color: #fff;
        }
      }
    }
    .handelBtns {
      margin-right: 0;
      display: flex;
      justify-content: flex-end;
      span {
        display: inline-block;
        box-sizing: border-box;
        width: 87px;
        height: 32px;
        border: 1px solid #1eb0fc;
        border-radius: 2px;
        line-height: 32px;
        text-align: center;
        background: transparent;
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
}
</style>
