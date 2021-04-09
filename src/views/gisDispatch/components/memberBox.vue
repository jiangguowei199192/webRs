<template>
  <div class="routeBox gisBox">
    <div class="gisTitle">
      <span>人员信息</span>
    </div>
    <div class="ulBox">
      <ul>
        <li>
          <span class="left">姓名：</span>
          <EllipsisTooltip
            :contentText="dataInfo.employeeName || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">所属单位：</span>
          <EllipsisTooltip
            :contentText="dataInfo.deptName || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">联系电话：</span>
          <EllipsisTooltip
            :contentText="dataInfo.employeeTel || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">机构电话：</span>
          <EllipsisTooltip
            :contentText="dataInfo.officePhone || ''"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">人员状态：</span>
          <EllipsisTooltip
            :contentText="dataInfo.designateStatus || ''"
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
  name: 'memberBox',
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
