<template>
  <div style="width: 250px;">
    <div style="text-align: center;">
      <el-input v-model="info.name" class="inputStyle">
        <i class="el-icon-edit el-input__icon" slot="suffix" style="color: white;"></i>
      </el-input>
    </div>
    <div style="position: relative; margin: 0 auto; width: 220px; height: 118px;" @mouseenter="mouseEnterDelete" @mouseleave="mouseleaveDelete">
      <div class="uploadContainerStyle">
        <el-upload
          ref="uploadImage"
          action
          :show-file-list="false"
          :auto-upload="false"
          accept="image/*"
          :on-change="onUploadChange"
        >
          <img v-if="info.imageUrl" :src="info.imageUrl" class="uploadImageStyle" />
          <img v-else :src="addImg" class="uploadImageStyle" />
        </el-upload>
      </div>
      <div class="deleteStyle" v-if="info.imageUrl && showDelete" @click="deleteClick">
        <i class="el-icon-delete" style="margin-top: 50px;"></i>
      </div>
    </div>
    <div class="fontStyle2">格式要求：{{info.subTitle}}</div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      required: false
    },
    index: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      addImg: require('../../../assets/images/Setting/setting-addImage.png'),

      showDelete: false
    }
  },
  methods: {
    mouseEnterDelete () {
      this.showDelete = true
    },
    mouseleaveDelete () {
      this.showDelete = false
    },

    // 删除
    deleteClick () {
      this.$emit('deleteClick', this.index)
    },

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
      this.info.imageUrl = urlCreator.createObjectURL(file.raw)
      this.$emit('doUploadImage', file.raw, this.info)
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

.uploadImageStyle {
  width: 220px;
  height: 118px;
  display: block;
}

.uploadContainerStyle {
  width: 220px;
  height: 118px;
  margin-top: 14px;
  position: relative;
  z-index: 1;
}
.deleteStyle {
  width: 220px;
  height: 118px;
  position: absolute;
  background-color: rgba($color: #000000, $alpha: 0.3);
  z-index: 2;
  top: 0px;
  margin: 0 auto 0 auto;
  text-align: center;
}
</style>
