<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-10 16:07:40
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-30 09:57:17
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
        class="add-case-form"
      >
        <el-form-item label="处置结果 :" prop="record">
          <el-input
            v-model="addCaseForm.record"
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
              @change="selectDisposeTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="处置人 :"
            prop="people"
            style="margin-right: 10px"
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
            ref="uploadForm"
            multiple
            drag
            action="http://172.16.63.43:8850/fms-river-protection/file/uploads"
            accept=".jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx, .pdf, .rar, .zip"
            :limit="10"
            :file-list="uploadList"
            :auto-upload="false"
            :on-change="onUploadChange"
            :on-remove="onRemoveFile"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em style="color: #1ed8a0">点击上传</em>
              <p>
                支持文件类型:xls、xlsx、docx、jpg、jpeg、png、zip...(10M以内)
              </p>
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
// import { debounce } from '../../../utils/public'

export default {
  props: {
    isShow: { type: Boolean, required: true },
    title: { type: String, required: true },
    clickRowId: { type: String, required: false },
    reportTime: { type: String, required: false }
  },

  data () {
    return {
      placeholder: '请输入',
      addCaseForm: {
        id: 0,
        time: '',
        record: '',
        people: '',
        uploadFileUrl: ''
      },
      addCaseFormRules: {
        record: isNotNull('请输入处置结果'),
        people: isNotNull('请输入处置人'),
        time: isNotNull('请选择处置时间')
      },
      uploadList: [],
      uploadFiles: []
    }
  },

  watch: {
    isShow (val) {
      if (val) {
        this.addCaseForm.id = this.clickRowId
      }
    }
  },

  mounted () {},

  methods: {
    // 更新isShow状态
    updateIsShow (formName) {
      this.$refs[formName].resetFields()
      this.uploadFiles = this.uploadList = []
      this.$emit('update:isShow', false)
      this.$emit('update:clickRowId', '')
    },

    /**
     * 选择处置时间
     */
    selectDisposeTime () {
      if (!this.addCaseForm.time) return
      const time = new Date(this.reportTime).getTime()
      const dispose = new Date(this.addCaseForm.time).getTime()
      if (dispose <= time) {
        this.addCaseForm.time = ''
        this.$notify.closeAll()
        this.$notify.info({
          title: '提示',
          message: '当前所选时间已早于报警时间，请重新选择'
        })
      }
    },

    // 上传文件前的处理
    onUploadChange (file) {
      const fileName = file.name
        .substring(file.name.lastIndexOf('.') + 1)
        .toLowerCase()
      const fileType = [
        'jpg',
        'jpeg',
        'png',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'pdf',
        'rar',
        'zip'
      ]
      if (fileType.indexOf(fileName) === -1) {
        this.uploadList.splice(this.uploadList.length - 1, 1)
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message:
            '上传文件只能是 jpg/jpeg/png/doc/docx/xls/xlsx/pdf/rar/zip 等格式',
          duration: 3 * 1000
        })
        return
      }
      const limitSize = file.size / 1024 / 1024 < 10
      if (!limitSize) {
        this.uploadList.splice(this.uploadList.length - 1, 1)
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '单个文件大小不能超过 10MB',
          duration: 3 * 1000
        })
        return
      }

      this.uploadFiles.push(file.raw)
      // this.uploadFileList()
    },

    // 移除上传文件
    onRemoveFile (file, fileList) {
      const index = this.uploadFiles.indexOf(file.raw)
      if (index !== -1) {
        this.uploadFiles.splice(index, 1)
      }
    },

    onUploadSuccess (response, file, fileList) {
      console.log(response, file, fileList)
    },

    // 上传文件
    uploadFileList () {
      if (this.uploadFiles.length !== 0) {
        const formData = new FormData()
        this.uploadFiles.forEach(f => {
          formData.append('files', f)
        })
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        this.$axios
          .post(caseApi.uploadFiles, formData, config)
          .then(res => {
            // console.log('上传文件res:', res)
            if (res && res.data && res.data.code === 0) {
              this.addCaseForm.uploadFileUrl = res.data.data
              this.finishCase()
            }
          })
          .catch(err => {
            console.log('caseApi.uploadFile Err : ' + err)
          })
      } else this.finishCase()
    },

    // 结案
    finishCase () {
      const params = {
        id: this.addCaseForm.id,
        dispositionMan: this.addCaseForm.people,
        dispositionRecord: this.addCaseForm.record,
        dispositionTime: this.addCaseForm.time,
        disFinishAttachment: this.addCaseForm.uploadFileUrl
      }
      this.$axios
        .post(caseApi.finishCase, params, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then(res => {
          // console.log('处置记录提交res:', res)
          if (res && res.data && res.data.code === 0) {
            this.$emit('confirmRecordClick', this.addCaseForm)
            this.updateIsShow('addCaseForm')
            this.$emit('finishCaseSuccess')
          }
        })
        .catch(err => {
          console.log('caseApi.finishCase Err : ' + err)
        })
    },

    // 处置info录入提交
    confirmCaseRecord (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.uploadFileList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-case-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 750px;
    // background-color: rgba(0, 65, 87, 0.85);
    background-color: transparent;
    .add-case-header {
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
    .add-case-form {
      margin: 25px 0 0 5px;
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
        width: 100px;
      }
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
          color: #00caf6;
          margin: 30px 0 0 5px;
        }
        .el-upload__text {
          color: #00caf6;
          font-size: 13px;
        }
        .el-upload-list {
          height: 50px;
          overflow-y: auto;
        }
        .el-upload-list__item {
          font-size: 12px;
          margin-top: 0;
        }
        .el-upload-list__item-name,
        .el-icon-document {
          color: #00caf6;
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
