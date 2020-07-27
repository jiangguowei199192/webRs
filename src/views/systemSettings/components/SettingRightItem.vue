<template>
  <div>
    <div class="base" id="background" @click="clicked">
      <el-avatar :size="40" class="img" id="img">
        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
      </el-avatar>
      <div class="title" id="title">{{data.title}}</div>
      <div class="subTitle" id="subTitle">{{data.subTitle}}</div>
      <div class="text" id="text">{{data.text}}</div>
      <i class="el-icon-caret-right" style="float: right; margin: 18px 25px 0px 0px; color: #39a4dd;" id="icon"></i>
    </div>

    <el-dialog
      title="补充信息"
      :visible.sync="showExtraInfo"
      width="30%">
      <el-form ref="extraInfoRef" :model="extraInfoForm" :rules="extraInfoRules">
        <el-form-item prop="company">
          <el-input v-model="extraInfoForm.company" placeholder="公司/组织/所属机构"></el-input>
        </el-form-item>
        <el-form-item prop="job">
          <el-input v-model="extraInfoForm.job" placeholder="职务/岗位"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="extraInfoConfirm" style="float: right;">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="头像"
      :visible.sync="showUploadIcon"
      width="30%">
      <div style="text-align: center;">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div>
          <span>请选择jpg、gif格式，小于2M的图片（使用高质量图片，可生成高清头像）</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showUploadIcon = false">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showExtraInfo: false,
      extraInfoForm: {
        company: '',
        job: ''
      },
      extraInfoRules: {
        company: [
          { required: true, message: '请输入组织' }
        ],
        job: [
          { required: true, message: '请输入职务' }
        ]
      },
      showUploadIcon: false,
      imageUrl: ''
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
  },
  methods: {
    // 点击行
    clicked () {
      if (this.data.id === 10) { // 用户管理
        this.$router.push({ path: '/systemSettings/userManagement' })
      } else if (this.data.id === 11) { // 角色权限管理
        this.$router.push({ path: '/systemSettings/rolePermissionManagement' })
      } else if (this.data.id === 12) { // 组织管理
        this.$router.push({ path: '/systemSettings/organizationManagement' })
      } else if (this.data.id === 2) { // 补充信息
        this.showExtraInfo = true
      } else if (this.data.id === 1) {
        this.showUploadIcon = true
      }
    },
    // 补充信息-保存
    extraInfoConfirm () {
      this.$refs.extraInfoRef.validate(async valid => {
        if (!valid) return
        this.showExtraInfo = false
      })
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
    border-color: #409EFF;
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
</style>
