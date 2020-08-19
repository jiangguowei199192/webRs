<template>
  <div style="width: 250px;">
    <div style="text-align: center;">
      <el-input v-model="input" class="inputStyle">
        <i
          class="el-icon-edit el-input__icon"
          slot="suffix"
          style="color: white;">
        </i>
      </el-input>
    </div>
    <el-upload
      class="uploadStyle"
      ref="uploadImage"
      action
      :show-file-list="false"
      :auto-upload="false"
      accept="image/*"
      :on-change="onUploadChange"
    >
      <img v-if="imageUrl" :src="imageUrl" class="uploadImageStyle">
      <img v-else :src="addImg" class="uploadImageStyle">
    </el-upload>
    <div class="fontStyle2">格式要求：{{subTitle}}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false
    },
    subTitle: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      addImg: require('../../../assets/images/Setting/setting-addImage.png'),

      input: '',
      imageUrl: ''
    }
  },
  methods: {
    // 上传头像前的处理
    onUploadChange (file) {
      const isJPG =
        file.raw.type === 'image/jpeg' ||
        file.raw.type === 'image/png' ||
        file.raw.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 5
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
          message: '图片大小不能超过5MB',
          type: 'warning',
          duration: 5 * 1000
        })
        return false
      }
      // this.imageFile = file.raw
      var urlCreator = window.URL || window.webkitURL
      this.imageUrl = urlCreator.createObjectURL(file.raw)
    }
  }
}
</script>

<style lang="scss" scoped>
  .fontStyle2 {
    width: 220px;
    font-size: 10px;
    color: white;
    margin: 11px auto 0 auto;
  }
  .inputStyle {
    width: 160px;
    font-size: 16px;
    /deep/.el-input__inner {
      background-color: #39a3dd;
      color: white;
      border: none;
    }
  }

  .uploadStyle {
    text-align: center;
  }
  .uploadImageStyle {
    width: 220px;
    height: 118px;
    display: block;
    margin-top: 14px;
  }
</style>
