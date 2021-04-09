<template>
  <div class="mapResBox">
    <div class="title">地图数据 / {{ subTitle }}</div>
    <div class="mainBox">
      <div>{{ subTitle }}</div>
      <div class="toolBox">
        <span class="txt1">资源类型:</span>
        <el-select
          v-model="query.resourcesType"
          placeholder="请选择"
          clearable
          class="select"
          @change="search"
        >
          <el-option
            v-for="item in resTypes"
            :key="item.typeCode"
            :label="item.typeName"
            :value="item.typeCode"
          ></el-option>
        </el-select>
        <span class="txt2">所属机构:</span>
        <el-cascader
          v-model="query.belongOrg"
          placeholder="请选择"
          :options="organs"
          :props="organsProps"
          :show-all-levels="false"
          class="select"
          @change="search"
        ></el-cascader>
        <el-input
          class="search"
          v-model="query.searchContent"
          placeholder="请输入资源名称/地址进行搜索"
          @keydown.enter.native="search"
        ></el-input>
        <div class="btn" @click.stop="search">
          <img :src="searchIcon" />
          <span>搜索</span>
        </div>
        <div class="btn resetBtn" @click.stop="reset">
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
          <span @click.stop="addRes">添加</span>
          <span @click.stop="confirmDelete">批量删除</span>
        </div>
      </div>
      <PageTable
        ref="pageTable"
        :checkBox="true"
        :refresh="tableInfo.refresh"
        :fieldList="tableInfo.fieldList"
        :handle="tableInfo.handle"
        :initCurpage="tableInfo.initCurpage"
        :data.sync="tableInfo.data"
        :query="query"
        :api="getListApi"
        :checkedList.sync="checkedList"
        @handleClick="handleClick"
      ></PageTable>
    </div>
    <component ref="dlg" :is="dlgView" @refreshTable="getList"></component>
    <DeleteDialog
      :isShow.sync="showDelDlg"
      @close="showDelDlg = false"
      @confirmClick="deleteRes"
      @cancelClick="showDelDlg = false"
    ></DeleteDialog>
  </div>
</template>

<script>
import PageTable from './pageTable.vue'
import PointResDlg from './pointResDlg.vue'
import LineResDlg from './lineResDlg.vue'
import SurfaceResDlg from './surfaceResDlg.vue'
import { mapResApi } from '@/api/mapRes'
import mapResMixin from './mixins/mapResMixin'
import DeleteDialog from './deleteDialog.vue'
export default {
  props: {
    // 对话框组件名称
    dlgView: {
      type: String,
      default: 'PointResDlg'
    },
    // 子标题
    subTitle: {
      type: String
    },
    // 数据资源(0点资源 1线资源 2面资源)
    resourcesDataType: {
      type: String,
      default: '0'
    },
    // 表格字段配置
    fieldList: {
      type: Array,
      default: () => {
        return [
          { label: '资源名称', value: 'resourcesName' },
          { label: '地址', value: 'resourcesAddr' },
          { label: '类型', value: 'resourcesTypeName' },
          { label: '所属机构', value: 'deptName' },
          { label: '排序', value: 'resourcesSort' }
        ]
      }
    }
  },
  mixins: [mapResMixin],
  data () {
    return {
      showDelDlg: false,
      selectCount: 0,
      searchIcon: require('../../../assets/images/backgroundManagement/searchIcon.png'),
      resetIcon: require('../../../assets/images/backgroundManagement/resetIcon.png'),
      checkedList: [],
      query: {
        belongOrg: '',
        resourcesDataType: 0,
        resourcesType: '',
        searchContent: ''
      }, // 表格相关
      tableInfo: {
        initCurpage: 1,
        refresh: 1,
        data: [],
        fieldList: [],
        handle: {
          label: '操作',
          width: '130',
          btList: [
            {
              label: '修改',
              event: 'modify'
            },
            {
              label: '查看',
              event: 'look'
            }
          ]
        }
      }
    }
  },
  components: {
    PageTable,
    PointResDlg,
    LineResDlg,
    SurfaceResDlg,
    DeleteDialog
  },
  mounted () {
    this.tableInfo.fieldList = this.fieldList
    this.query.resourcesDataType = this.resourcesDataType
    this.getList()
    this.getOrgans()
    this.getResType()
  },
  methods: {
    getListApi (params) {
      return this.$axios.post(mapResApi.selectPage, params, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      })
    },
    /**
     *  搜索
     */
    search () {
      // 重置分页
      this.tableInfo.initCurpage = Math.random()
      this.getList()
    },
    /**
     *  获取列表
     */
    getList () {
      this.tableInfo.data = []
      this.tableInfo.refresh = Math.random()
    },
    /**
     *  清空选中
     */
    clearSelection () {
      this.$refs.pageTable.clearSelection()
    },
    /**
     *  添加资源
     */
    addRes () {
      this.$refs.dlg.addRes()
    },
    /**
     *  获取资源类型
     */
    getResType () {
      if (this.resourcesDataType === '0') {
        this.getResources('pointresources', false)
      } else if (this.resourcesDataType === '1') {
        this.getResources('lineresources', false)
      } else if (this.resourcesDataType === '2') {
        this.getResources('surfaceresources', false)
      }
    },
    /**
     *  重置
     */
    reset () {
      this.query.belongOrg = ''
      this.query.resourcesType = ''
      this.query.searchContent = ''
      this.getList()
    },
    /**
     *  确认删除
     */
    confirmDelete () {
      if (this.checkedList.length <= 0) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '提示',
          message: '请选择您要删除的资源'
        })
        return
      }
      this.showDelDlg = true
    },
    /**
     *  批量删除资源
     */
    deleteRes () {
      this.showDelDlg = false
      const ids = []
      this.checkedList.forEach(item => {
        ids.push(item.id)
      })
      const param = { ids: ids }
      this.$axios
        .post(mapResApi.batchDel, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            if (this.tableInfo.data.length === ids.length) {
              // 重置分页
              this.tableInfo.initCurpage = Math.random()
            }
            this.getList()
          }
        })
        .catch(err => {
          console.log('mapResApi.batchDel Err : ' + err)
        })
    },
    /**
     *  点击操作按钮
     */
    handleClick (event, data) {
      if (event === 'look') {
        this.lookDetail(data)
      } else if (event === 'modify') {
        this.lookDetail(data, true)
      }
    },
    /**
     *  查看详情
     */
    lookDetail (row, update = false) {
      this.$axios
        .get(mapResApi.selectDetail, {
          params: { resourcesId: row.id }
        })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            if (update) {
              this.$refs.dlg.updateRes(res.data.data)
            } else this.$refs.dlg.lookRes(res.data.data)
          }
        })
        .catch(err => {
          console.log('mapResApi.selectDetail Err : ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.mapResBox {
  font-size: 16px;
  padding: 20px 31px 0px 20px;
  .title {
    font-size: 16px;
    color: #fff;
  }
  .mainBox {
    margin-top: 16px;
    font-size: 15px;
    .toolBox {
      margin-top: 18px;
      .txt1 {
        margin: 0 17px 0 12px;
      }
      .txt2 {
        margin: 0 17px;
      }
    }
    /deep/.tablePagination {
      margin-top: 20px;
    }
  }
}
</style>
