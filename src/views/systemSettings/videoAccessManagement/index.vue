<template>
  <div>
    <div class="container">
      <button type="button" class="back" @click="back">
        <img :src="backImg" />
        视频接入管理
      </button>
      <div class="container1">
        <div class="leftBox">
          <!-- <div style="height: 598px; margin-left: 15px; margin-right: 15px;">
            <el-tree
              ref="roleTree"
              :data="roleList"
              :props="defaultProps"
              node-key="roleCode"
              :current-node-key="selectedRoleCode"
              @node-click="roleTreeClick"
              v-if="selectedRoleCode"
            ></el-tree>
          </div> -->
        </div>

        <div class="rightBox">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { settingApi } from '@/api/setting'
// import { Notification } from 'element-ui'

export default {
  created () {
  },
  data () {
    return {
      backImg: require('../../../assets/images/Setting/setting-back.png')
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    }
  }
}
</script>

<style lang="scss" scoped>
.back {
  width: 150px;
  height: 36px;
  border: none;
  font-size: 18px;
  color: #ffffff;
  outline: none;
  display: block;
  background: url("../../../assets/images/plan/plan-back-background.png") no-repeat;
  background-size: 100% 100%;
}
.container {
  width: 1242px;
  height: 756px;
  margin: 55px auto 0 auto;
}
.container1 {
  width: 1048px;
  height: 685px;
  margin: 30px auto 0 auto;
}
.leftBox {
  width: 220px;
  height: 682px;
  border: solid 2px #39a4dd;
  border-radius: 10px;
  float: left;
  overflow: hidden;
}
.rightBox {
  width: 796px;
  height: 682px;
  border: solid 2px #39a4dd;
  border-radius: 10px;
  margin-left: 24px;
  float: left;
}
.el-table::before {
  height: 0px;
}
.el-table {
  color: white;
  font-size: 14px;
  background-color: transparent;
  /* 表格表头样式 */
  /deep/.el-table__header-wrapper th {
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    height: 26px;
    padding: 0;
    background-color: rgba(54, 143, 187, 1);
  }
  /* 表格每行高度*/
  /deep/.el-table__body td {
    height: 38px;
    padding: 0;
  }
  /deep/.el-table__body tr {
    background-color: rgba(51, 105, 132, 1);
  }
  /* 鼠标hover每行的样式*/
  /deep/.el-table__body tr:hover > td {
    background-color: rgba(51, 105, 132, 1);
  }
  /deep/td,
  /deep/th {
    border: none;
  }
  //单选框样式
  /deep/ .el-radio__inner {
    border: 1px solid rgba(255, 255, 255, 1);
    background: transparent;
  }

  //单选框选中样式
  /deep/ .el-radio__input.is-checked .el-radio__inner::after {
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 1);
  }
}
/* 修改偶数行颜色*/
/deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: rgba(54, 143, 187, 1);
}

/* 树形列表 */
/deep/.el-tree {
  color: #23cefd;
  background-color: transparent;
  .el-tree-node {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .el-tree-node__content {
      height: 35px;
      line-height: 35px;
      border: 1px solid transparent;
    }
    .el-tree-node__content:hover,
    .el-tree-node:focus > .el-tree-node__content {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .el-tree-node__expand-icon {
      color: #23cefd;
    }
    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
    }
  }
}
/deep/ .el-tree-node.is-current > .el-tree-node__content {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white;
}

</style>
