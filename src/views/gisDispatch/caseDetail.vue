<template>
  <caseMain ref="caseMain">
    <div class="caseDetail" slot="main">
      <div class="singleCase">
        <div class="gisTitle">
          <span>案件信息</span>
        </div>
        <div class="caseInfo"></div>
      </div>
    </div>
  </caseMain>
</template>

<script>
import caseMain from './components/caseMain'
export default {
  name: 'caseDetail',
  data () {
    return {}
  },
  components: {
    caseMain
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.caseDetail {
  height: 100%;
  position: relative;
  .singleCase {
    width: 349px;
    height: 208px;
    pointer-events: auto;
    position: absolute;
    top: 157px;
    left: 17px;
    background: url(../../assets/images/gisDispatch/single-case.svg) no-repeat;
    background-size: 100% 100%;
    .caseInfo {
      width: 329px;
      height: 188px;
      background-color: rgba($color: #004157, $alpha: 0.8);
    }
  }
}
</style>
