<template>
  <el-dialog
    :visible="isShow"
    v-if="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    class="role-auth-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">角色授权</div>
    </div>

    <div style="overflow: auto; margin-top: 10px" class="listScroll">
      <el-tree
        ref="permissionTree"
        :data="permissionTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="{
          children: 'children',
          label: 'menuName',
          value: 'id'
        }"
        :render-content="renderContent"
        class="permission-tree"
      ></el-tree>
    </div>

    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">确定</div>
      <div class="cancel-btn" @click="cancelClick">取消</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['isShow', 'permissionTree', 'selectedPms'],
  data () {
    return {
      keys: []
    }
  },
  watch: {
    isShow (newS) {
      if (newS) {
        this.$nextTick(() => {
          // console.log(this.selectedPms)
          this.keys = []
          this.handleSelectedKeys(this.selectedPms)
          this.$refs.permissionTree.setCheckedKeys(this.keys)
          this.changeTreeClass()
        })
      }
    }
  },
  methods: {
    handleSelectedKeys (tree) {
      tree.forEach(s => {
        if (s.roleMenuList && s.roleMenuList.length > 0) {
          this.handleSelectedKeys(s.roleMenuList)
        } else this.keys.push(s.id)
      })
    },

    confirmClick () {
      // console.log(this.$refs.permissionTree.getHalfCheckedKeys())
      // console.log(this.$refs.permissionTree.getCheckedKeys())
      this.$emit(
        'confirmClick',
        this.$refs.permissionTree.getCheckedKeys().concat(this.$refs.permissionTree.getHalfCheckedKeys())
      )
    },

    cancelClick () {
      this.$emit('cancelClick')
    },

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
    }
  }
}
</script>

<style lang="scss" scoped>
.role-auth-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 1080px;
    background-color: transparent;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px 20px;
      width: 100%;
      height: 690px;
      border: 1px solid #1eb0fc;
      background-color: rgba(0, 65, 87, 0.85);
      .add-people-header {
        height: 40px;
        border-bottom: 1px solid #1eb0fc;
        .header-icon {
          display: inline-block;
          width: 19px;
          height: 16px;
          background-image: url("../../../assets/images/fire_title.png");
          background-size: 100% 100%;
          margin-top: 15px;
        }
        .header-text {
          display: inline-block;
          vertical-align: top;
          margin-top: 13px;
          margin-left: 10px;
          font-size: 14px;
          color: #fff;
        }
      }
    }

    .permission-tree {
      background: transparent;
      color: #fff;
      font-size: 16px;
      // overflow: auto;
      height: 540px;
      margin-left: 80px;
      margin-right: 80px;
      margin-top: 40px;
      .el-tree-node {
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

    .confirm-tool {
      height: 50px;
      margin-top: 20px;
      .confirm-btn {
        width: 70px;
        height: 24px;
        background-color: #00cff9;
        float: right;
        margin-right: 19px;
        border-radius: 4px;
        color: white;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
      }
      .cancel-btn {
        width: 70px;
        height: 24px;
        background-color: transparent;
        float: right;
        margin-right: 10px;
        color: #00cff9;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        border: 1px solid #00cff9;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>
