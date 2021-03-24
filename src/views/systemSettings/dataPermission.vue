<template>
  <div>
    <div class="title">用户权限 / 数据权限</div>
    <div class="left-div">
      <div class="left-title">权限类型</div>
      <el-input
        class="institution-search-input"
        suffix-icon="el-icon-search"
        v-model="institutionSearch"
        placeholder=""
      ></el-input>
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTypeTree"
        :props="permissionTypeTreeProps"
        default-expand-all
        @node-click="permissionTypeTreeClick"
        :expand-on-click-node="false"
        node-key="id"
        :current-node-key="selectedType.id"
        v-if="selectedType.id"
        class="dept-tree"
        :filter-node-method="filterNode"
      ></el-tree>
    </div>
    <div class="right-div">
      <div class="right-title">资源列表</div>
      <div class="search-tool">
        <el-input
          class="people-search-input"
          v-model="resourceSearch"
          placeholder="请输入名称进行搜索"
        ></el-input>
        <div class="people-search-btn" @click="resourceSearchClick">
          <img :src="userSearchIcon" class="people-search-icon" />
          <span class="people-search-text">查询</span>
        </div>
        <div class="people-reset-btn" @click="resetClick">
          <img :src="peopleResetIcon" class="people-reset-icon" />
          <span class="people-reset-text">重置</span>
        </div>
      </div>
      <div class="operate-table-tool">
        <span class="selected-count"
          >已选<span style="color: #1eb0fc">{{ selectedResources.length }}</span
          >项</span
        >
        <div class="add-btn" @click="dataAuthClick">数据授权</div>
      </div>

      <el-table
        class="manageTable"
        :data="resourceList"
        empty-text="暂无数据"
        height="630"
        @selection-change="handleSelectionChange"
        v-if="fieldList"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.value"
          :label="item.label"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          class="tablePagination"
          popper-class="pageSelect"
          :total="pageTotal"
          :page-size="pageSize"
          :page-sizes="[15, 30, 50, 100]"
          :current-page.sync="currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="currentPageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>
    </div>

    <DataPermissionDialog
      :isShow.sync="showDataPermission"
      :depts="defaultAuthDepts"
      :radio="defauleAuthRadio"
      :users="defaultAuthUsers"
      @close="showDataPermission = false"
      @cancelClick="showDataPermission = false"
      @confirmClick="dataAuthConfirmClick"
    ></DataPermissionDialog>
  </div>
</template>

<script>
import DataPermissionDialog from './components/dataPermissionDialog.vue'
import { backApi } from '@/api/back'
import { Notification } from 'element-ui'

export default {
  components: {
    DataPermissionDialog
  },
  data () {
    return {
      userSearchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      peopleResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),

      institutionSearch: '',
      permissionTypeTree: [],
      permissionTypeTreeProps: {
        children: 'children',
        label: 'typeName',
        value: 'id'
      },
      resourceSearch: '',
      resourceList: [],
      fieldList: '',
      pageTotal: 0,
      pageSize: 12,
      currentPage: 1,
      showDataPermission: false,
      selectedType: '',
      selectedResources: [],

      defaultAuthDepts: [],
      defauleAuthRadio: '',
      defaultAuthUsers: []
    }
  },
  watch: {
    institutionSearch (val) {
      this.$refs.permissionTreeRef.filter(val)
    }
  },
  created () {
    this.getPermissionType()
  },
  methods: {
    async getPermissionType () {
      const _this = this
      this.$axios
        .get(backApi.getTypeDict, { params: { typeCode: 'resources' } })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            _this.permissionTypeTree = res.data.data
            _this.selectedType = res.data.data[0]
            _this.setFieldList(res.data.data[0].typeCode)
            _this.getResourceList()
          }
        })
    },

    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.typeName.indexOf(value) !== -1
    },

    permissionTypeTreeClick (item) {
      this.selectedType = item
      this.setFieldList(item.typeCode)

      this.currentPage = 1
      this.resourceSearch = ''
      this.getResourceList()
    },

    async getResourceList () {
      if (this.selectedType.typeCode.indexOf('resources') === -1) {
        // 视频资源
        const param = {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          deviceTypeCode:
            this.selectedType.typeCode === 'JKSB'
              ? ''
              : this.selectedType.typeCode,
          deviceNameOrCode: this.resourceSearch
        }
        const _this = this
        this.$axios.post(backApi.getVideoListByType, param).then(res => {
          if (res && res.data && res.data.code === 0) {
            res.data.data.data.forEach(item => {
              item.deviceStatus =
                item.deviceStatus === 'enabled' ? '启用' : '禁用'
              item.onlineStatus =
                item.onlineStatus === 'online' ? '在线' : '离线'
            })
            _this.resourceList = res.data.data.data
            _this.pageTotal = res.data.data.paginator.totalCount
          }
        })
      } else {
        // 点线面资源
        var dataType = 0
        if (this.selectedType.typeCode.indexOf('line') !== -1) {
          dataType = 1
        }
        if (this.selectedType.typeCode.indexOf('surface') !== -1) {
          dataType = 2
        }
        const param = {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          resourcesType: this.selectedType.parentId
            ? this.selectedType.typeCode
            : '',
          searchContent: this.resourceSearch,
          resourcesDataType: dataType
        }
        const _this = this
        this.$axios
          .post(backApi.getResourceListByType, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then(res => {
            if (res && res.data && res.data.code === 0) {
              _this.resourceList = res.data.data.records
              _this.pageTotal = res.data.data.total
            }
          })
      }
    },

    setFieldList (typeCode) {
      var list = []
      if (typeCode.indexOf('resources') === -1) {
        list = [
          { label: '设备类型', value: 'deviceTypeCode' },
          { label: '设备名称', value: 'deviceName' },
          { label: '设备编码', value: 'deviceCode' },
          { label: '所属单位', value: 'deviceDeptName' },
          { label: '在线状态', value: 'onlineStatus' },
          { label: '启用', value: 'deviceStatus', type: 'switch' },
          { label: '排序', value: 'orderNum' }
        ]
      } else {
        if (typeCode.indexOf('point') !== -1) {
          list = [
            { label: '资源名称', value: 'resourcesName' },
            { label: '地址', value: 'resourcesAddr' },
            { label: '类型', value: 'resourcesTypeName' },
            { label: '所属机构', value: 'deptName' },
            { label: '排序', value: 'resourcesSort' }
          ]
        }
        if (typeCode.indexOf('line') !== -1) {
          list = [
            { label: '线路名称', value: 'resourcesName' },
            { label: '类型', value: 'resourcesTypeName' },
            { label: '起点', value: 'lineOrigin' },
            { label: '终点', value: 'lineDestination' },
            {
              label: '长度',
              value: 'totalLength',
              formatter: row => {
                return row.totalLength + '千米'
              }
            },
            { label: '所属机构', value: 'deptName' },
            { label: '排序', value: 'resourcesSort' }
          ]
        }
        if (typeCode.indexOf('surface') !== -1) {
          list = [
            { label: '名称', value: 'resourcesName' },
            { label: '类型', value: 'resourcesTypeName' },
            { label: '所属单位', value: 'deptName' },
            { label: '所属辖区', value: 'belongAreaName' },
            { label: '排序', value: 'resourcesSort' }
          ]
        }
      }
      this.fieldList = list
    },

    resourceSearchClick () {
      this.getResourceList()
    },

    // 重置搜索项时触发
    resetClick () {
      this.currentPage = 1
      this.resourceSearch = ''
      this.getResourceList()
    },

    // 数据授权时触发
    dataAuthClick () {
      if (this.selectedResources.length <= 0) {
        Notification({
          title: '提示',
          message: '请选择资源',
          type: 'warning',
          duration: 2 * 1000
        })
      } else if (this.selectedResources.length === 1) {
        // 获取授权详情进行回显
        const param = { id: this.selectedResources[0].id }
        const _this = this
        this.$axios
          .post(backApi.authDetail, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then(res => {
            if (res && res.data && res.data.code === 0) {
              _this.showDataPermission = true
              var resDept = res.data.data.authDept
              if (resDept && resDept.length) {
                var deptCodes = []
                resDept.forEach(item => {
                  deptCodes.push(item.authDept)
                })
                _this.defaultAuthDepts = deptCodes
                _this.defauleAuthRadio = resDept[0].authScope
              }

              _this.defaultAuthUsers = res.data.data.authUser
            }
          })
      } else {
        this.showDataPermission = true
      }
    },

    // 数据授权确认时触发
    dataAuthConfirmClick (lever, depts, users) {
      this.showDataPermission = false

      var selectResIdArr = []
      this.selectedResources.forEach(item => {
        selectResIdArr.push(item.id)
      })

      var deptCodes = []
      depts.forEach(dept => {
        deptCodes.push(dept.deptCode)
      })

      var userIds = []
      users.forEach(user => {
        userIds.push(user.id)
      })

      const param = {
        authDept: {
          authScope: lever,
          authDept: deptCodes.join()
        },
        authUser: {
          authUserId: userIds.join()
        },
        resourcesIds: selectResIdArr.join()
      }
      this.$axios
        .post(backApi.resourcesAuth, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    // 多选时触发
    handleSelectionChange (items) {
      this.selectedResources = items
    },

    // 切换分页时触发
    currentPageChange (curPage) {
      this.currentPage = curPage
      this.getResourceList()
    },

    sizeChange (size) {
      this.pageSize = size
      this.getResourceList()
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
.left-div {
  float: left;
  width: 280px;
  height: 804px;
  background-color: rgba(0, 65, 87, 0.85);
  margin-left: 30px;
  padding: 0 10px;
  .left-title {
    color: #fff;
    font-size: 16px;
    height: 42px;
    line-height: 42px;
  }
  .institution-search-input {
    width: 278px;
    margin-top: 4px;
    display: block;
    /deep/.el-input__inner {
      background: #09546d;
      border-color: #1eb0fc;
      border-radius: 0;
      color: white;
    }
    /deep/.el-icon-search {
      color: #c5f3ff;
    }
  }
  .dept-tree {
    height: 646px;
    overflow: auto;
    margin-top: 15px;
    background-color: transparent;
    color: #fff;
    /deep/.el-tree-node {
      .el-tree-node__content {
        // display: block !important;
        height: 30px;
        line-height: 30px;
        border: 1px solid transparent;
        background-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-tree-node__label {
        font-size: 14px;
      }
      .el-tree-node__content:hover,
      .el-tree-node:focus > .el-tree-node__content {
        background-color: rgba(15, 95, 134, 0.5) !important;
      }

      // 展开折叠图标
      .el-tree-node__expand-icon.expanded {
        // 动画取消
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      .el-icon-caret-right:before {
        // 收起
        content: url("../../assets/images/backgroundManagement/deptTreeUnfold.png");
      }
      .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        // 展开
        content: url("../../assets/images/backgroundManagement/deptTreeFold.png");
      }
      .el-tree-node__expand-icon.is-leaf::before {
        display: none;
      }
    }
    /deep/ .el-tree-node.is-current > .el-tree-node__content {
      background: rgba(15, 95, 134, 0.5) !important;
      color: #1eb0fc;
    }
  }
}

.right-div {
  min-width: 800px;
  height: 804px;
  background-color: rgba(0, 65, 87, 0.85);
  margin: 0 30px 0 360px;
  padding: 0 14px;
  .right-title {
    color: #fff;
    font-size: 16px;
    height: 42px;
    line-height: 42px;
  }
  .search-tool {
    height: 34px;
    margin-top: 4px;
    display: flex;
    justify-content: flex-start;
    .people-search-input {
      width: 450px;
      vertical-align: top;
      /deep/.el-input__inner {
        background: #09546d;
        border-color: #1eb0fc;
        border-radius: 0;
        color: white;
      }
    }
    .people-search-btn {
      width: 80px;
      height: 34px;
      margin-left: 10px;
      background: -webkit-linear-gradient(top, #086384, #0b779e);
      font-size: 16px;
      line-height: 34px;
      color: #c5f3ff;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
      .people-search-icon {
        margin-top: 5px;
      }
      .people-search-text {
        vertical-align: top;
        margin-left: 5px;
      }
    }
    .people-reset-btn {
      width: 80px;
      height: 34px;
      margin-left: 10px;
      background: -webkit-linear-gradient(top, #086384, #0b779e);
      font-size: 16px;
      line-height: 34px;
      color: #c5f3ff;
      text-align: center;
      cursor: pointer;
      .people-reset-icon {
        margin-top: 8px;
      }
      .people-reset-text {
        vertical-align: top;
        margin-left: 5px;
      }
    }
  }
  .operate-table-tool {
    height: 53px;
    .selected-count {
      float: left;
      margin: 18px 0 0 10px;
      font-size: 16px;
    }
    .add-btn {
      float: right;
      margin-right: 12px;
      margin-top: 10px;
      width: 96px;
      height: 30px;
      background-color: #1eb0fc;
      color: #fff;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .pagination-wrap {
    text-align: center;
    .tablePagination {
      height: 35px;
      line-height: 35px;
    }
  }
}
</style>
