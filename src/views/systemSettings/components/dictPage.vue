<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_3.1
 * @Author: liangkaiLee
 * @Date: 2021-01-26 13:56:08
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-04 14:41:35
-->
<template>
  <div class="dictDetBox">
    <div class="mainBox">
      <div>{{ subTitle }}</div>
      <div class="toolBox">
        <el-input
          class="search"
          v-model="searchStr"
          placeholder="请输入子类名称进行搜索"
          @keyup.enter.native="searchDictDatas"
        ></el-input>
        <div class="btn" @click.stop="searchDictDatas">
          <img :src="searchIcon" />
          <span>搜索</span>
        </div>
        <div class="btn resetBtn" @click.stop="resetSearchParams">
          <img :src="resetIcon" />
          <span>重置</span>
        </div>
      </div>
      <div class="tablTool">
        <div class="left">
          <span>已选</span>
          <span>{{ checkedList.length }}</span>
          <span>项</span>
          <!-- <span @click.stop="clearSelection">清空</span> -->
        </div>
        <div class="right">
          <span @click.stop="addDict">添加</span>
          <span @click.stop="delDicts">批量删除</span>
        </div>
      </div>
      <PageTable
        ref="pageTable"
        :checkBox="true"
        :refresh="tableInfo.refresh"
        :fieldList="tableInfo.fieldList"
        :handle="tableInfo.handle"
        :data.sync="tableInfo.data"
        :tableHeight="610"
        :query="query"
        :api="api"
        :checkedList.sync="checkedList"
        @handleClick="handleClick"
        @switchClick="switchClick"
      ></PageTable>

      <!-- 添加/修改/查看子级字典弹窗 -->
      <AddDictDialog
        ref="dictDlg"
        :isShow.sync="isShow"
        :title="
          `${handelType == 'addChildDict' ? '添加子级字典' : ''}${
            handelType == 'editChildDict' ? '修改子级字典' : ''
          }${handelType == 'checkChildDict' ? '查看子级字典' : ''}`
        "
        :dictInfo="dictInfo"
        :handelType.sync="handelType"
        @confirmClick="confirmClickSubmit"
      ></AddDictDialog>
      <!-- 批量删除弹窗 -->
      <DeleteDialog
        :isShow.sync="showDeleteTip"
        @close="showDeleteTip = false"
        @confirmClick="delTipConfirmClick"
        @cancelClick="showDeleteTip = false"
      ></DeleteDialog>
    </div>
  </div>
</template>

<script>
import PageTable from './pageTable.vue'
import AddDictDialog from './addDictDialog.vue'
import DeleteDialog from './deleteDialog.vue'
import { dataDictApi } from '@/api/dataDict'
import { EventBus } from '@/utils/eventBus.js'

export default {
  name: 'dictPage',

  components: {
    PageTable,
    AddDictDialog,
    DeleteDialog
  },

  props: {
    // 子标题
    subTitle: { type: String },
    // 获取数据的接口
    api: { type: Function },
    // 查询条件
    query: {
      type: Object,
      default: () => {
        return {
          typeName: '',
          typeCode: '',
          status: '',
          orderNum: ''
        }
      }
    },
    tableInfo: {
      type: Object,
      default: () => {
        return {
          refresh: 1,
          data: [],
          fieldList: [],
          handle: {}
        }
      }
    }
  },

  data () {
    return {
      searchIcon: require('../../../assets/images/backgroundManagement/searchIcon.png'),
      resetIcon: require('../../../assets/images/backgroundManagement/resetIcon.png'),
      searchStr: '',
      checkedList: [],
      showAddDict: false,
      showDeleteTip: false,
      isShow: false,
      dictInfo: {},
      selectId: '',
      selectChildId: '',
      handelType: ''
    }
  },

  created () {
    const _this = this
    EventBus.$on('selectChildId', data => {
      // console.log('data:', data)
      _this.selectId = data
    })
  },

  methods: {
    //  获取列表
    getList () {
      this.tableInfo.refresh = Math.random()
    },

    //  清空选中
    clearSelection () {
      this.$refs.pageTable.clearSelection()
    },

    // 查询更新表数据
    updateTableList () {
      // console.log(this.searchStr)
      this.query.typeName = this.searchStr
      this.getList()
    },

    // 搜索子级字典
    searchDictDatas () {
      if (this.searchStr === '') {
        this.$notify.warning({
          title: '提示',
          message: '请输入子类名称后查询 !',
          duration: 3 * 1000
        })
        return
      }
      this.updateTableList()
    },

    // 重置搜索
    resetSearchParams () {
      this.searchStr = ''
      this.updateTableList()
    },

    //  点击添加字典
    addDict () {
      this.dictInfo = {}
      this.isShow = true
      this.handelType = 'addChildDict'
    },

    // 添加子级字典提交
    submitAddChildDict (formData) {
      const params = {
        parentId: this.selectId,
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
          // console.log('新增子级字典接口返回: ', res)
          if (res && res.data && res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '新增成功!',
              duration: 3 * 1000
            })
            this.getList()
            this.isShow = false
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
    },

    // 修改子级字典提交
    submitEditChildDict (formData) {
      const params = {
        id: this.selectChildId,
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
          // console.log('修改子级字典接口返回: ', res)
          if (res && res.data && res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '修改成功!',
              duration: 3 * 1000
            })
            this.getList()
            this.isShow = false
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
    },

    // 新增/修改子级字典确定
    confirmClickSubmit (data) {
      if (this.handelType === 'addChildDict') this.submitAddChildDict(data)
      else if (this.handelType === 'editChildDict') {
        this.submitEditChildDict(data)
      }
    },

    // 修改/查看子级字典
    handleClick (event, data) {
      if (event === 'modify') {
        this.handelType = 'editChildDict'
        this.handelData(data)
      } else if (event === 'readonly') {
        this.handelType = 'checkChildDict'
        this.handelData(data)
      }
    },

    handelData (data) {
      this.isShow = true
      this.dictInfo = data
      this.selectChildId = data.id
    },

    // 字典状态切换
    switchClick (event, data) {
      // console.log(event, data)
      const params = {
        id: data.id,
        status: event ? 1 : 0
      }
      this.$axios
        .post(dataDictApi.editDict, params)
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            this.getList()
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
    },

    // 点击批量删除
    delDicts () {
      if (this.checkedList.length <= 0) {
        this.$notify.warning({
          title: '提示',
          message: '请选择要删除的字典!',
          duration: 3 * 1000
        })
        return
      }
      this.showDeleteTip = true
    },

    // 批量删除确定
    delTipConfirmClick () {
      var arr = []
      this.checkedList.forEach(item => {
        arr.push(item.id)
      })
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
              duration: 2 * 1000
            })
            this.getList()
            this.showDeleteTip = false
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dictDetBox {
  margin-left: 30px;
  .toolBox {
    margin-top: 13px;
  }
}
</style>
