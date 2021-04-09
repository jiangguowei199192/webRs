<template>
  <div class="organBox pointBox gisBox">
    <div class="gisTitle">
      <span>点位信息</span>
    </div>
    <div class="ulBox">
      <ul>
        <li>
          <span class="left">点位名称：</span>
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
          <span class="left">地址：</span>
          <EllipsisTooltip
            :contentText="dataInfo.resourcesAddr || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">联系方式：</span>
          <EllipsisTooltip
            :contentText="dataInfo.contactTel || ''"
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
  name: 'pointBox',
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
