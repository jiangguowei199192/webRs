<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" center>

    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: this.isShow
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
