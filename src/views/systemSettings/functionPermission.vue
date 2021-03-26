<template>
  <div>
    <div class="title">用户权限 / 功能权限</div>
    <div class="base-div listScroll">
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTree"
        :props="permissionProps"
        node-key="menuId"
        default-expand-all
        :render-content="renderContent"
        class="permission-tree "
      ></el-tree>
    </div>
  </div>
</template>

<script>
import { backApi } from '@/api/back'

export default {
  data () {
    return {
      permissionTree: [],
      permissionProps: {
        children: 'roleMenuList',
        label: 'menuName',
        value: 'menuId'
      }
    }
  },
  created () {
    this.getPermissionTree()
  },
  methods: {
    renderContent (h, { node, data }) {
      let className = ''
      if (!data.especially) {
        className = 'especially'
      }
      return <div class={className}>{data.menuName}</div>
    },

    changeTreeClass () {
      var classDomList = document.getElementsByClassName('especially')
      for (var i = 0; i < classDomList.length; i++) {
        classDomList[i].parentNode.style.cssText = 'float: left'
        classDomList[i].parentNode.className =
          'el-tree-node__content option-wrapper'
        classDomList[i].parentNode.parentNode.parentNode.style.marginLeft =
          '40px'
      }
    },

    async getPermissionTree () {
      const _this = this
      this.$axios.get(backApi.getPermissionTree).then(res => {
        if (res && res.data && res.data.code === 0) {
          _this.permissionTree = _this.handlePermissionTree(res.data.data[0])
          _this.$nextTick(() => {
            _this.changeTreeClass()
          })
        }
      })
    },
    handlePermissionTree (tree) {
      var tag = false
      tree.forEach(item => {
        if (item.roleMenuList && item.roleMenuList.length) {
          tag = true
        }
      })
      const _this = this
      tree.forEach(item => {
        item.especially = tag
        if (item.roleMenuList && item.roleMenuList.length) {
          _this.handlePermissionTree(item.roleMenuList)
        }
      })
      return tree
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  height: 54px;
  font-size: 16px;
  line-height: 54px;
  margin: 0 30px;
}

.base-div {
  min-width: 600px;
  height: 674px;
  background-color: rgba(0, 65, 87, 0.85);
  margin-left: 30px;
  margin-right: 30px;
  padding: 70px 120px;
  overflow: auto;
  .permission-tree {
    background: transparent;
    color: #fff;
    font-size: 16px;
    overflow: auto;
    /deep/.el-tree-node {
      .el-tree-node__content {
        height: 30px;
        background-color: transparent;
      }
      .el-tree-node__label {
        font-size: 16px;
      }
      /* 鼠标移入某行时的背景色 */
      .el-tree-node__content:hover,
      .el-tree-node:focus > .el-tree-node__content {
        color: #fff;
        background-color: transparent !important;
      }
      /* 复选框样式 */
      .el-checkbox__inner {
        background-color: transparent;
        border-color: #c5f3ff;
        border-radius: 0px;
      }
    }
  }
}
</style>
