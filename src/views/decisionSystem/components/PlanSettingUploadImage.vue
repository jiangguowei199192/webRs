<template>
  <div style="width: 250px;">
    <div style="text-align: center;">
      <!-- <span style="color: red;">*</span> -->
      <span class="fontStyle1">请上传{{info.title}}</span>
      <!-- <button type="button" class="exampleStyle">查看示例</button> -->
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
      <img v-if="imageUrl" :src="imageUrl" class="uploadImageStyle" />
      <img v-else :src="addImg" class="uploadImageStyle" />
    </el-upload>
    <div class="fontStyle2">格式要求：{{info.subTitle}}</div>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
import globalApi from '@/utils/globalApi'

export default {
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      addImg: require('../../../assets/images/Setting/setting-addImage.png'),

      imageUrl: (this.info.path === '') ? '' : (globalApi.headImg + this.info.path)
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
      var urlCreator = window.URL || window.webkitURL
      this.imageUrl = urlCreator.createObjectURL(file.raw)
      this.$emit('doUploadImage', file.raw, this.info)
    }
  }
}
</script>

<style lang="scss" scoped>
.fontStyle1 {
  font-size: 16px;
  color: white;
}
.exampleStyle {
  background-color: transparent;
  border: none;
  font-size: 16px;
  color: #35b0e6;
  outline: none;
}
.fontStyle2 {
  width: 220px;
  font-size: 10px;
  color: white;
  margin: 11px auto 0 auto;
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
