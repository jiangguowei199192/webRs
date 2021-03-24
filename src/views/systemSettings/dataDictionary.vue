<template>
  <div style="margin: auto 23px">
    <!-- 头部面包屑 -->
    <div class="head-title">系统设置 / 数据字典</div>
    <div style="display: flex">
      <!-- 左侧字典树 -->
      <div class="left-tree">
        <div class="tree-title">数据字典树</div>
        <el-input
          class="dict-search-input"
          suffix-icon="el-icon-search"
          v-model="dictSearch"
          placeholder="请输入搜索关键字"
        ></el-input>
        <!-- 右键操作菜单 -->
        <div v-show="treeRightMenuShow">
          <el-menu id="menu" @select="handleSelect" text-color="#fff">
            <el-menu-item index="1">
              <el-image :src="dictEditIcon"></el-image>
              <span>修改</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-image :src="dictSeeIcon"></el-image>
              <span>查看</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-image :src="dictDeleteIcon"></el-image>
              <span>删除</span>
            </el-menu-item>
          </el-menu>
        </div>
        <!-- 字典树 -->
        <el-tree
          class="dict-tree webFsScroll"
          ref="dictTreeRef"
          :data="dictTree"
          :props="dictTreeProps"
          default-expand-all
          node-key="id"
          :expand-on-click-node="false"
          @node-click="dictTreeClick"
          :filter-node-method="dictSearchChange"
          @node-contextmenu="dictTreeRightCick"
        ></el-tree>
        <el-button class="add-dict-btn" @click.prevent="addDictClick"
          >十 新增字典</el-button
        >
      </div>
      <!-- 右侧字典详情表 -->
      <DictPage
        class="right-table"
        :tableInfo="tableInfo"
        :subTitle="subTitle"
        :query="queryParams"
        :api="getChildDictList"
      ></DictPage>
    </div>

    <!-- 新增/修改/查看字典弹窗 -->
    <AddDictDialog
      ref="addDictRef"
      :isShow.sync="isShow"
      :title="
        `${handelType == 'addParentDict' ? '新增字典' : ''}${
          handelType == 'editParentDict' ? '修改字典' : ''
        }${handelType == 'checkParentDict' ? '查看字典' : ''}`
      "
      :dictInfo="dictInfo"
      :handelType.sync="handelType"
      @confirmClick="confirmClickSubmit"
    ></AddDictDialog>
  </div>
</template>

<script>
import DictPage from './components/dictPage.vue'
import AddDictDialog from './components/addDictDialog.vue'
import { dataDictApi } from '@/api/dataDict'
import { EventBus } from '@/utils/eventBus.js'

export default {
  components: {
    DictPage,
    AddDictDialog
  },

  data () {
    return {
      dictEditIcon: require('../../assets/images/backgroundManagement/deptEdit.png'),
      dictSeeIcon: require('../../assets/images/backgroundManagement/deptSee.png'),
      dictDeleteIcon: require('../../assets/images/backgroundManagement/deptDelete.png'),
      dictSearch: '',
      dictTree: [],
      dictTreeProps: {
        children: 'children',
        label: 'typeName',
        value: 'typeCode'
      },
      isShow: false,
      treeRightMenuShow: false,
      selectedDict: '',
      rightClickDict: '',
      dictInfo: {},
      selectedDictIds: [],
      subTitle: '字典项',
      // 表格项
      tableInfo: {
        refresh: 0,
        data: [],
        fieldList: [
          { label: '子类名称', value: 'typeName' },
          { label: '图标', value: 'icon', type: 'dictIcon' },
          { label: '子类编码', value: 'typeCode' },
          {
            label: '状态',
            value: 'status',
            type: 'switch',
            active: 0,
            inactive: 1
          },
          { label: '排序', value: 'orderNum' }
        ],
        handle: {
          label: '操作',
          width: '130',
          btList: [
            { label: '修改', event: 'modify' },
            { label: '查看', event: 'readonly' }
          ]
        }
      },
      queryParams: {
        parentId: ''
      },
      handelType: ''
    }
  },

  watch: {
    dictSearch (val) {
      this.$refs.dictTreeRef.filter(val)
    }
  },

  mounted () {
    this.getDictTree()
  },

  methods: {
    // 单击字典树
    dictTreeClick (node) {
      // console.log(node)
      this.selectedDict = node
      this.tableInfo.refresh = Math.random()
      this.dictSearch = ''
      EventBus.$emit('selectChildId', this.selectedDict.id)
    },

    // children为''时置为null
    handleDeptTree (data) {
      data.forEach(item => {
        if (item.children) {
          if (item.children.length <= 0) {
            item.children = null
          } else {
            this.handleDeptTree(item.children)
          }
        }
      })
      return data
    },

    // 获取字典树
    getDictTree () {
      this.$axios
        .get(dataDictApi.queryParentDict)
        .then(res => {
          // console.log('查询字典树接口返回: ', res)
          if (res && res.data && res.data.code === 0) {
            this.dictTree = this.handleDeptTree(res.data.data)
            if (this.dictTree.length > 0) {
              this.selectedDict = this.dictTree[0]
              this.tableInfo.refresh = Math.random()
            }
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
    },

    // 获取子级字典列表
    getChildDictList (params) {
      const ids = {
        parentId: parseInt(this.selectedDict ? this.selectedDict.id : 0)
      }
      Object.assign(params, ids)
      // console.log('queryParams:', params)
      return this.$axios.post(dataDictApi.queryChildDict, params)
    },

    // 搜索字典树
    dictSearchChange (value, data) {
      if (!value) return true
      return data.typeName.indexOf(value) !== -1
    },

    // 点击新增按钮
    addDictClick () {
      this.dictInfo = {}
      this.isShow = true
      this.handelType = 'addParentDict'
    },

    // 新增父级字典提交
    submitAddDict (formData) {
      const params = {
        parentId: parseInt(0),
        typeName: formData.name,
        typeCode: formData.code,
        status: formData.status,
        orderNum: formData.order,
        icon: formData.icon,
        remark: formData.note
      }
      this.$axios
        .post(dataDictApi.addDict, params)
        .then(res => {
          // console.log('新增数据字典接口返回: ', res)
          if (res && res.data && res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '新增成功!',
              duration: 3 * 1000
            })
            this.getDictTree()
            this.isShow = false
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
    },

    // 修改父级字典提交
    submitEditDict (formData) {
      const params = {
        id: this.rightClickDict.id,
        typeName: formData.name,
        // typeCode: formData.code,
        status: formData.status,
        orderNum: formData.order,
        icon: formData.icon,
        remark: formData.note
      }
      this.$axios
        .post(dataDictApi.editDict, params)
        .then(res => {
          // console.log('修改字典接口返回: ', res)
          if (res && res.data && res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '修改成功!',
              duration: 3 * 1000
            })
            this.getDictTree()
            this.isShow = false
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
    },

    // 删除父级字典提交
    delDictClickSubmit () {
      var arr = []
      arr.push(this.rightClickDict.id)
      var params = { ids: arr }
      this.$axios
        .post(dataDictApi.deleteDict, params, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then(res => {
          // console.log("删除字典接口返回: ", res);
          if (res && res.data && res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '删除成功!',
              duration: 3 * 1000
            })
            this.getDictTree()
            this.showDeleteTip = false
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
    },

    // 新增/修改字典确定
    confirmClickSubmit (data) {
      if (this.handelType === 'addParentDict') this.submitAddDict(data)
      else if (this.handelType === 'editParentDict') {
        this.submitEditDict(data)
      }
    },

    // 字典树操作
    handleSelect (key) {
      if (key === '1') {
        // 修改字典
        this.handelType = 'editParentDict'
        this.handelData()
      } else if (key === '2') {
        // 查看字典
        this.handelType = 'checkParentDict'
        this.handelData()
      } else if (key === '3') {
        // 删除字典
        this.$confirm('此操作将删除该节点, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false
        })
          .then(() => {
            this.delDictClickSubmit()
          })
          .catch(() => {})
      }
    },

    handelData () {
      this.isShow = true
      this.dictInfo = this.rightClickDict
    },

    // 鼠标右键点击字典树
    dictTreeRightCick (event, data, node, obj) {
      this.treeRightMenuShow = true
      this.rightClickDict = data
      const menu = document.querySelector('#menu')
      menu.style.left = event.pageX + 'px'
      menu.style.top = event.pageY + 'px'
      document.addEventListener('click', this.closeRightMenu)
    },

    // 关闭菜单
    closeRightMenu () {
      this.treeRightMenuShow = false
      document.removeEventListener('click', this.closeRightMenu)
    }
  }
}
</script>

<style lang="scss" scoped>
.head-title {
  height: 54px;
  line-height: 54px;
  font-size: 16px;
}

.left-tree {
  width: 280px;
  height: 804px;
  background-color: rgba(0, 65, 87, 0.85);
  padding: 0 10px;
  position: relative;
  .tree-title {
    color: #fff;
    font-size: 15px;
    height: 42px;
    line-height: 42px;
  }
  .dict-search-input {
    width: 278px;
    margin-top: 4px;
    display: block;
    /deep/.el-input__inner {
      background: rgba(9, 84, 109, 0.3);
      border-color: #1eb0fc;
      color: #fff;
      border-radius: 0;
    }
    /deep/.el-icon-search {
      color: #c5f3ff;
    }
  }
  .dict-tree {
    height: 646px;
    overflow: auto;
    margin-top: 15px;
    background-color: transparent;
    color: #fff;
    /deep/.el-tree-node {
      .el-tree-node__content {
        display: block !important;
        height: 30px;
        line-height: 30px;
        border: 1px solid transparent;
        background-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-tree-node__content:hover {
        color: #fff;
        background-color: rgba(11, 119, 158, 0.66);
      }
      .el-tree-node__expand-icon.is-leaf::before {
        display: none;
      }
    }
    /deep/.el-tree-node:focus > .el-tree-node__content {
      color: #85cfe8;
      background-color: rgba(11, 119, 158, 0.66);
    }
  }
  .add-dict-btn {
    // margin: 20px auto 0 62px;
    text-align: center;
    width: 150px;
    height: 38px;
    background-color: #39a4dd;
    color: #fff;
    border: none;
    font-size: 16px;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translate(50%, -50%);
  }
  /deep/.el-menu {
    z-index: 1;
    position: absolute;
    width: 80px;
    height: 81px;
    border-radius: 2px;
    background-color: #183157;
    border: 1px solid #00ccff;
    border-bottom: 0;
    overflow: hidden;
    .el-menu-item {
      height: 27px;
      line-height: 27px;
      text-align: center;
      font-size: 12px;
      border-bottom: 1px solid rgba($color: #00ccff, $alpha: 0.8);
      cursor: pointer;
      .el-image {
        width: 14px;
        height: 14px;
        right: 8px;
        margin-left: 3px;
      }
    }
    .el-menu-item.is-active,
    .el-menu-item:hover {
      background-color: rgba(11, 119, 158, 0.66) !important;
      color: #fff;
    }
  }
}

.right-table {
  margin-top: 0;
  flex-grow: 1;
  background-color: rgba(0, 65, 87, 0.85);
  min-width: 800px;
}
</style>
