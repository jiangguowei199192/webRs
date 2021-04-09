<template>
  <div class="organBox gisBox lineBox">
    <div class="gisTitle">
      <span>管控范围信息</span>
    </div>
    <div class="ulBox">
      <ul>
        <li>
          <span class="left">名称：</span>
          <EllipsisTooltip
            :contentText="dataInfo.resourcesName || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">类型：</span>
          <EllipsisTooltip
            :contentText="dataInfo.resourcesTypeName || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">备注：</span>
          <EllipsisTooltip
            :contentText="dataInfo.resourcesRemark || ''"
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
  name: 'areaBox',
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
