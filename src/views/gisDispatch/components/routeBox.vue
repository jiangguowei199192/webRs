<template>
  <div class="routeBox gisBox">
    <div class="gisTitle">
      <span>线路信息</span>
    </div>
    <div class="ulBox">
      <ul>
        <li>
          <span class="left">线路名称：</span>
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
          <span class="left">总长度：</span>
          <EllipsisTooltip
            :contentText="
              dataInfo.totalLength ? dataInfo.totalLength + '千米' : ''
            "
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">起点：</span>
          <EllipsisTooltip
            :contentText="dataInfo.lineOrigin || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">终点：</span>
          <EllipsisTooltip
            :contentText="dataInfo.lineDestination || ''"
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
  name: 'routeBox',
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
  mounted () {},
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
