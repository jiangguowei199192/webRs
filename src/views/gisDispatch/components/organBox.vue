<template>
  <div class="organBox gisBox">
    <div class="gisTitle">
      <span>机构信息</span>
    </div>
    <div class="ulBox">
      <ul>
        <li>
          <span class="left">名称：</span>
          <EllipsisTooltip
            :contentText="dataInfo.deptName || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">地址：</span>
          <EllipsisTooltip
            :contentText="dataInfo.deptAddress || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">联系方式：</span>
          <EllipsisTooltip
            :contentText="dataInfo.deptTel || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
      </ul>
    </div>
    <div class="arrow"></div>
    <span class="close" @click.stop="close"></span>
  </div>
</template>

<script>
import EllipsisTooltip from '../../../components/ellipsisTooltip'
export default {
  name: 'organBox',
  data () {
    return {}
  },
  props: {
    dataInfo: {
      default: () => {}
    }
  },
  components: {
    EllipsisTooltip
  },
  mounted () {
  },
  methods: {
    /**
     *  关闭vue overlay
     */
    close () {
      if (this.closeOverlay) {
        this.closeOverlay()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
