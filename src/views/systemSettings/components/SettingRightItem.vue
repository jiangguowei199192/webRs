<template>
  <div>
    <div class="base" id="background" @click="clicked">
      <!-- <img src class="img" id="img" /> -->
      <el-avatar :size="40" class="img" id="img">
        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
      </el-avatar>
      <div class="title" id="title">{{data.title}}</div>
      <div class="subTitle" id="subTitle">{{data.subTitle}}</div>
      <div class="text" id="text">{{data.text}}</div>
      <i class="el-icon-caret-right" style="float: right; margin: 18px 25px 0px 0px; color: #39a4dd;" id="icon"></i>
    </div>
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
    return {}
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
    clicked: function () {
      if (this.data.id === 10) {
        this.$router.push({ path: '/systemSettings/userManagement' })
      } else if (this.data.id === 11) {
        this.$router.push({ path: '/systemSettings/rolePermissionManagement' })
      } else if (this.data.id === 12) {
        this.$router.push({ path: '/systemSettings/organizationManagement' })
      }
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
</style>
