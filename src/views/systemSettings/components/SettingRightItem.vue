<template>
  <div>
    <div class="base" id="background" @click="clicked">
      <el-avatar :size="40" class="img" id="img">
        <img :src="data.headerImg" />
      </el-avatar>
      <div class="title" id="title">{{data.title}}</div>
      <div class="subTitle" id="subTitle">{{data.subTitle}}</div>
      <div class="text" id="text">{{data.text}}</div>
      <i
        class="el-icon-caret-right"
        style="float: right; margin: 18px 25px 0px 0px; color: #39a4dd;"
        id="icon"
      ></i>
    </div>

    <el-dialog title="补充信息" :visible.sync="showExtraInfo" width="30%" class="dialogStyle">
      <el-form ref="extraInfoRef" :model="extraInfoForm" :rules="extraInfoRules">
        <el-form-item prop="orgName">
          <!-- <el-input v-model="extraInfoForm.orgName" placeholder="公司/组织/所属机构"></el-input> -->
          <el-input v-model="extraInfoForm.orgName" :placeholder="this.userDetail.orgName"></el-input>
        </el-form-item>
        <el-form-item prop="jobDesc">
          <!-- <el-input v-model="extraInfoForm.jobDesc" placeholder="职务/岗位"></el-input> -->
          <el-input v-model="extraInfoForm.jobDesc" :placeholder="this.userDetail.jobDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="extraInfoConfirm"
            style="float: right;"
            class="trueBtn"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="头像" :visible.sync="showUploadIcon" width="30%" class="dialogStyle">
      <div style="text-align: center;">
        <el-upload
          class="avatar-uploader"
          ref="uploadImage"
          action
          :show-file-list="false"
          :auto-upload="false"
          accept="image/*"
          :on-change="onUploadChange"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div>
          <span style="color: white;">请选择jpg、gif格式，小于2M的图片（使用高质量图片，可生成高清头像）</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload" class="trueBtn">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="我的信息" :visible.sync="showMyInfo" width="30%" class="dialogStyle">
      <el-form ref="myInfoFormRef" :model="myInfoForm" label-width="80px" :rules="myInfoRules">
        <!-- <el-form-item
          v-for="(item, index) in myInfoForm.domains" :key="index"
          :label="item.title"
          :prop="'domains.' + index + '.input'"
          :rules="[{ required: true, message: '请输入' + item.title }]">
          <el-input v-model="item.input"></el-input>
        </el-form-item>-->
        <el-form-item label="登录名">
          <el-input v-model="userDetail.useraccount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="username" label="真实姓名">
          <el-input v-model="myInfoForm.username" style="width: 208px;"></el-input>
          <el-select
            :popper-append-to-body="false"
            v-model="realNameSelect"
            class="selectStyle"
            popper-class="select-popper"
          >
            <el-option
              v-for="item in realNameSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="myInfoForm.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="myInfoConfirm" style="float: right;" class="trueBtn">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
import { loginApi } from '@/api/login'
import { isNotNull, length, selectvalidator } from '@/utils/validate'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    userDetail: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      showExtraInfo: false,
      extraInfoForm: {
        orgName: '',
        jobDesc: ''
      },
      extraInfoRules: {
        orgName: [{ required: true, message: '请输入组织' }],
        jobDesc: [{ required: true, message: '请输入职务' }]
      },

      showUploadIcon: false,
      imageUrl: '',
      imageFile: '',

      showMyInfo: false,
      authCodeItem: {
        title: '验证码',
        input: ''
      },
      myInfoForm: {
        username: '',
        mobile: ''
      },
      myInfoRules: {
        username: isNotNull('请输入用户名').concat(
          length(3, 30).concat(selectvalidator('isAccountValid'))
        ),
        mobile: isNotNull('请输入手机号码').concat(
          selectvalidator('validatePhone')
        )
      },
      realNameSelect: 'realNameSelectOptions1',
      realNameSelectOptions: [
        { label: '仅自己可见', value: 'realNameSelectOptions1' },
        { label: '所有人可见', value: 'realNameSelectOptions2' }
      ]
    }
  },
  mounted () {
    var background = document.getElementById('background')
    var img = document.getElementById('img')
    var title = document.getElementById('title')
    var subTitle = document.getElementById('subTitle')
    var icon = document.getElementById('icon')
    // var text = document.getElementById('text')

    if (this.data.type === 'RightItemType_MyInfo') {
      background.style.height = '66px'
      img.style.display = 'inline-block'
      title.style.margin = '16px 0px 0px 27px'
      subTitle.style.display = 'block'
      subTitle.style.margin = '43px 0px 0px -150px'
      icon.style.margin = '28px 25px 0px 0px'
    } else if (this.data.type === 'RightItemType_SubTitle') {
      // text.style.display = 'inline-block'
    }
    // eslint-disable-next-line no-unused-vars
    const userDetail = JSON.parse(localStorage.getItem('userDetail'))
    // console.log(userDetail);
  },
  methods: {
    // 点击行
    clicked () {
      if (this.data.id === 10) {
        // 用户管理
        this.$router.push({ path: '/systemSettings/userManagement' })
      } else if (this.data.id === 11) {
        // 角色权限管理
        this.$router.push({ path: '/systemSettings/rolePermissionManagement' })
      } else if (this.data.id === 12) {
        // 组织管理
        this.$router.push({ path: '/systemSettings/organizationManagement' })
      } else if (this.data.id === 2) {
        // 补充信息
        this.showExtraInfo = true
      } else if (this.data.id === 1) {
        // 上传头像
        this.showUploadIcon = true
      } else if (this.data.id === 0) {
        // 我的信息
        this.showMyInfo = true
      } else if (this.data.id === 31) {
        // 火情地图
        this.$router.push({ path: '/systemSettings/fireMap' })
      } else if (this.data.id === 30) {
        // 火情报警
        this.$router.push({ path: '/systemSettings/firePolice' })
      }
    },
    // 补充信息-保存
    async extraInfoConfirm () {
      this.$refs.extraInfoRef.validate(async (valid) => {
        if (!valid) return
        var param = {
          id: this.userDetail.id,
          orgName: this.extraInfoForm.orgName,
          jobDesc: this.extraInfoForm.jobDesc
        }
        this.$axios
          .post(loginApi.updateUser, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then((res) => {
            if (res.data.code === 0) {
              this.showExtraInfo = false
              this.$emit('refreshData')
              Notification({
                title: '提示',
                message: '用户修改成功',
                type: 'success',
                duration: 5 * 1000
              })
              return
            }
            Notification({
              title: '提示',
              message: '用户修改失败',
              type: 'warning',
              duration: 5 * 1000
            })
          })
      })
    },
    // 上传头像前的处理
    onUploadChange (file) {
      const isJPG =
        file.raw.type === 'image/jpeg' ||
        file.raw.type === 'image/png' ||
        file.raw.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        Notification({
          title: '提示',
          message: '图片格式错误',
          type: 'warning',
          duration: 5 * 1000
        })
        return false
      }
      if (!isLt2M) {
        Notification({
          title: '提示',
          message: '图片大小不能超过2MB',
          type: 'warning',
          duration: 5 * 1000
        })
        return false
      }
      this.imageFile = file.raw
      var urlCreator = window.URL || window.webkitURL
      this.imageUrl = urlCreator.createObjectURL(file.raw)
    },
    // 上传头像-保存
    async submitUpload () {
      const formData = new FormData()
      formData.append('id', this.userDetail.id)
      formData.append('file', this.imageFile)
      this.$axios
        .post(loginApi.updateHeadImg, formData, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          // console.log(res)
          if (res.data.code === 0) {
            this.showUploadIcon = false
            this.$emit('refreshData')
            Notification({
              title: '提示',
              message: '头像上传成功',
              type: 'success',
              duration: 5 * 1000
            })
            return
          }
          Notification({
            title: '提示',
            message: '头像上传失败',
            type: 'warning',
            duration: 5 * 1000
          })
        })
    },
    // 我的信息-保存
    myInfoConfirm () {
      this.$refs.myInfoFormRef.validate(async (valid) => {
        if (!valid) return

        var visible = 0
        if (this.realNameSelect === 'realNameSelectOptions1') {
          visible = 0
        } else if (this.realNameSelect === 'realNameSelectOptions2') {
          visible = 1
        }
        var param = {
          id: this.userDetail.id,
          username: this.myInfoForm.username,
          mobile: this.myInfoForm.mobile,
          userNameVisible: visible
        }
        this.$axios
          .post(loginApi.updateUser, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then((res) => {
            if (res.data.code === 0) {
              this.showMyInfo = false
              this.$emit('refreshData')
              Notification({
                title: '提示',
                message: '更新成功',
                type: 'success',
                duration: 5 * 1000
              })
              return
            }
            Notification({
              title: '提示',
              message: '更新失败',
              type: 'warning',
              duration: 5 * 1000
            })
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.base {
  height: 50px;
}
.img {
  float: left;
  // width: 40px;
  // height: 40px;
  margin: 16px 0px 0px 43px;
  display: none;
}
.title {
  width: 150px;
  float: left;
  margin: 16px 0px 0px 43px;
  color: #ffffff;
  font-size: 14px;
  // background-color: red;
}
.subTitle {
  float: left;
  margin: 43px 0px 0px -150px;
  color: #b4b4b4;
  font-size: 12px;
  // background-color: blue;
  width: 150px;
  display: none;
}
.text {
  float: left;
  margin: 17px 0px 0px 37px;
  font-size: 14px;
  color: #ffffff;
  // display: none;
}

/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.dialogStyle {
  min-width: 1500px;
  /deep/.el-dialog__header {
    background-color: #39a4dd;
  }
  /deep/.el-dialog__title {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    background-color: #336984;
  }
  /deep/.el-dialog__footer {
    background-color: #336984;
  }
  /deep/.el-icon-close:before {
    color: white;
  }
  .trueBtn {
    background-color: #1eb0fc;
    font-size: 14px;
    color: white;
    width: 66px;
    height: 30px;
    padding: 0;
  }
  /deep/.el-input__inner {
    color: white;
    background-color: #3688b1;
    border: none;
  }
  /deep/.el-form-item__label {
    color: white;
  }
}
.selectStyle {
  width: 110px;
  float: right;
  /deep/.el-input__inner {
    font-size: 12px;
  }
}
/deep/.select-popper {
  background-color: #3688b1;
  font-size: 12px;
  color: white;
  border: none;
  .el-select-dropdown__item.selected {
    background-color: #3688b1;
  }
  .el-select-dropdown__item {
    font-size: 12px;
    color: white;
  }
  .el-select-dropdown__item.hover {
    background-color: #3688b1;
  }
  .popper__arrow {
    border-bottom-color: #3688b1;
  }
  .popper__arrow::after {
    border-bottom-color: #3688b1;
  }
}
</style>
