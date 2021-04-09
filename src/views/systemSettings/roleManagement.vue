<template>
  <div>
    <div class="title">用户权限 / 角色管理</div>
    <div class="base-div">
      <div class="right-title">角色列表</div>
      <div class="search-tool">
        <div class="role-status-text" style="margin-left: 10px">是否授权</div>
        <el-select
          v-model="authorizationSearch"
          class="role-status-select"
          @change="authClick"
        >
          <el-option
            v-for="item in authorizationOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-input
          class="people-search-input"
          v-model="roleNameSearch"
          placeholder="请输入角色名称进行搜索"
        ></el-input>
        <div class="people-search-btn" @click="roleNameClick">
          <img :src="userSearchIcon" class="people-search-icon" />
          <span class="people-search-text">查询</span>
        </div>
        <div class="people-reset-btn" @click="roleResetClick">
          <img :src="peopleResetIcon" class="people-reset-icon" />
          <span class="people-reset-text">重置</span>
        </div>
      </div>

      <div class="operate-table-tool">
        <span class="selected-count"
          >已选<span style="color: #1eb0fc">{{ selectedRoles.length }}</span
          >项</span
        >
        <div class="delete-btn" @click="deleteRoleClick">批量删除</div>
        <div class="add-btn" @click="addRoleClick">添加</div>
      </div>

      <el-table
        class="manageTable"
        :data="roleList"
        empty-text="暂无数据"
        height="630"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="关联用户数"
          prop="userCount"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="是否授权"
          prop="isAuth"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="排序"
          prop="roleSort"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="210">
          <template slot-scope="scope">
            <div class="table-btn" @click="editRoleClick(scope.row)">修改</div>
            <div
              class="table-btn"
              style="margin-left: 10px; width: 76px"
              @click="authorizationClick(scope.row)"
            >
              角色授权
            </div>
            <div
              class="table-btn"
              style="margin-left: 10px"
              @click="seeRoleClick(scope.row)"
            >
              查看
            </div>
          </template>
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

    <AddRoleDialog
      :isShow.sync="showAddRole"
      title="新增角色"
      @close="showAddRole = false"
      @confirmClick="addRoleConfirmClick"
      @cancelClick="showAddRole = false"
    ></AddRoleDialog>

    <AddRoleDialog
      :isShow.sync="showEditRole"
      title="修改角色"
      :roleInfo="currentRoleDetail"
      @close="showEditRole = false"
      @confirmClick="editRoleConfirmClick"
      @cancelClick="showEditRole = false"
    ></AddRoleDialog>

    <DeleteDialog
      :isShow.sync="showDeleteRole"
      @close="showDeleteRole = false"
      @confirmClick="deleteUserConfirmClick"
      @cancelClick="showDeleteRole = false"
    ></DeleteDialog>

    <RoleInfoDialog
      :isShow.sync="showRoleInfo"
      :roleInfo="currentRoleDetail"
      @close="showRoleInfo = false"
      @confirmClick="showRoleInfo = false"
    ></RoleInfoDialog>

    <RoleAuthDialog
      :isShow="showAuthorization"
      :permissionTree="permissionTree"
      :selectedPms="selectedPms"
      @close="showAuthorization = false"
      @confirmClick="authConfirmClick"
      @cancelClick="showAuthorization = false"
    ></RoleAuthDialog>
  </div>
</template>

<script>
import AddRoleDialog from './components/addRoleDialog.vue'
import DeleteDialog from './components/deleteDialog.vue'
import RoleInfoDialog from './components/roleInfoDialog.vue'
import RoleAuthDialog from './components/roleAuthorizationDialog.vue'
import { backApi } from '@/api/back'
import { Notification } from 'element-ui'

export default {
  components: {
    AddRoleDialog,
    DeleteDialog,
    RoleInfoDialog,
    RoleAuthDialog
  },
  data () {
    return {
      userSearchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      peopleResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),

      authorizationSearch: '',
      authorizationOptions: [
        { id: '全部', label: '全部' },
        { id: '已授权', label: '已授权' },
        { id: '未授权', label: '未授权' }
      ],
      roleNameSearch: '',
      roleList: [],
      selectedRoles: [],
      currentRoleDetail: '',

      pageTotal: 100,
      pageSize: 15,
      currentPage: 1,

      showAddRole: false,
      showDeleteRole: false,
      showEditRole: false,
      showAuthorization: false,
      showRoleInfo: false,

      permissionTree: [],
      selectedPms: [],

      currentRole: ''
    }
  },
  created () {
    this.getRoleList()
    this.getMenuTree()
  },
  methods: {
    async getRoleList () {
      const param = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        isAuth:
          this.authorizationSearch === '全部' ? '' : this.authorizationSearch,
        roleName: this.roleNameSearch
      }
      const _this = this
      this.$axios
        .post(backApi.getRoleList, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            _this.roleList = res.data.data.records
            _this.pageTotal = res.data.data.total
          }
        })
    },

    // 切换分页时触发
    currentPageChange (curPage) {
      this.currentPage = curPage
      this.getRoleList()
    },

    sizeChange (size) {
      this.pageSize = size
      this.getRoleList()
    },

    authClick () {
      this.currentPage = 1
      this.getRoleList()
    },

    // 搜索角色时触发
    roleNameClick () {
      this.currentPage = 1
      this.getRoleList()
    },

    // 重置搜索项时触发
    roleResetClick () {
      this.currentPage = 1
      this.authorizationSearch = ''
      this.roleNameSearch = ''
      this.getRoleList()
    },

    // 多选时触发
    handleSelectionChange (items) {
      this.selectedRoles = items
    },

    // 角色授权时触发
    authorizationClick (row) {
      this.currentRole = row
      const param = { roleCode: row.roleCode }
      const _this = this
      this.$axios
        .post(backApi.getMenuTreeByRole, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            _this.selectedPms = _this.handleSelectedMenu(res.data.data)
            _this.showAuthorization = true
          }
        })
    },
    handleSelectedMenu (tree) {
      tree.forEach(item => {
        item.id = item.menuId
        item.children = item.roleMenuList
        if (item.roleMenuList) {
          if (item.roleMenuList.length <= 0) {
            item.children = null
          } else {
            this.handleSelectedMenu(item.roleMenuList)
          }
        }
      })
      return tree
    },
    getMenuTree () {
      const _this = this
      this.$axios.post(backApi.getMenuTree).then(res => {
        if (res && res.data && res.data.code === 0) {
          _this.permissionTree = _this.handlePermissionTree(res.data.data)
        }
      })
    },
    handlePermissionTree (tree) {
      var tag = false
      tree.forEach(item => {
        if (item.children && item.children.length) {
          tag = true
        }
      })
      const _this = this
      tree.forEach(item => {
        item.especially = tag
        if (item.children && item.children.length) {
          _this.handlePermissionTree(item.children)
        }
      })
      return tree
    },
    authConfirmClick (permissions) {
      this.showAuthorization = false
      if (permissions && permissions.length) {
        const param = {
          menuIds: permissions,
          roleCode: this.currentRole.roleCode
        }
        const _this = this
        this.$axios
          .post(backApi.roleAuth, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then(res => {
            if (res && res.data && res.data.code === 0) {
              _this.getRoleList()
              Notification({
                title: '提示',
                message: '操作成功',
                type: 'success',
                duration: 2 * 1000
              })
            }
          })
      }
    },

    // 查看角色时触发
    seeRoleClick (row) {
      const param = { id: row.id }
      const _this = this
      this.$axios.get(backApi.roleInfo, { params: param }).then(res => {
        if (res && res.data && res.data.code === 0) {
          _this.currentRoleDetail = res.data.data
          _this.showRoleInfo = true
        }
      })
    },

    // 添加角色时触发
    addRoleClick () {
      this.showAddRole = true
    },

    // 添加角色确认时触发
    addRoleConfirmClick (form) {
      this.showAddRole = false
      const param = {
        roleName: form.roleName,
        roleSort: form.num,
        roleDescribe: form.note
      }
      const _this = this
      this.$axios
        .post(backApi.addRole, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            _this.getRoleList()
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    // 删除角色时触发
    deleteRoleClick () {
      if (this.selectedRoles.length <= 0) {
        Notification({
          title: '提示',
          message: '请选择角色',
          type: 'warning',
          duration: 2 * 1000
        })
        return
      }
      this.showDeleteRole = true
    },

    // 删除角色确认时触发
    async deleteUserConfirmClick () {
      this.showDeleteRole = false
      var roleIds = []
      let flag = false
      this.selectedRoles.forEach(item => {
        roleIds.push(item.id)
        if (item.userCount > 0) {
          Notification({
            title: '警告',
            message: '当前存在关联用户数不为0的角色, 不允许进行删除操作 !',
            type: 'warning',
            duration: 3 * 1000
          })
          flag = true
        }
      })
      if (!flag) {
        const param = { ids: roleIds }
        const _this = this
        this.$axios
          .post(backApi.deleteRole, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then(res => {
            if (res && res.data && res.data.code === 0) {
              _this.getRoleList()
              Notification({
                title: '提示',
                message: '操作成功',
                type: 'success',
                duration: 2 * 1000
              })
            }
          })
      }
    },

    // 修改角色时触发
    editRoleClick (row) {
      const param = { id: row.id }
      const _this = this
      this.$axios.get(backApi.roleInfo, { params: param }).then(res => {
        if (res && res.data && res.data.code === 0) {
          _this.currentRoleDetail = res.data.data
          _this.showEditRole = true
        }
      })
    },

    // 修改角色确认时触发
    editRoleConfirmClick (form, roleInfo) {
      this.showEditRole = false
      const param = {
        id: roleInfo.id,
        roleName: form.roleName,
        roleDescribe: form.note,
        // roleStatus: '状态',
        roleSort: form.num
      }
      const _this = this
      this.$axios
        .post(backApi.editRole, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            _this.getRoleList()
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
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
  min-width: 1150px;
  height: 804px;
  background-color: rgba(0, 65, 87, 0.85);
  margin: 0 30px;
  padding: 0 14px;
  position: relative;
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
    .role-status-text {
      color: #fff;
      font-size: 16px;
    }
    .role-status-select {
      width: 150px;
      margin-left: 17px;
      vertical-align: top;
      /deep/.el-input__inner {
        background: #09546d;
        border-color: #1eb0fc;
        border-radius: 0;
        color: white;
      }
    }
    .people-search-input {
      width: 450px;
      vertical-align: top;
      margin-left: 10px;
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
        display: inline-block;
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
    .delete-btn {
      float: right;
      width: 96px;
      height: 30px;
      margin-top: 10px;
      background-color: #ff0000;
      color: #fff;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
    }
    .add-btn {
      float: right;
      margin-right: 12px;
      margin-top: 10px;
      width: 54px;
      height: 30px;
      background-color: #1eb0fc;
      color: #ffffff;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .pagination-wrap {
    text-align: center;
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%, 0%);
    .tablePagination {
      height: 35px;
      line-height: 35px;
      // margin-top: 35px;
    }
  }
  .manageTable.el-table {
    height: 670px !important;
    /deep/.el-table__body-wrapper {
      height: 550px !important;
    }
  }
}

.table-btn {
  width: 40px;
  height: 26px;
  background-color: #0b779e;
  color: #fefefe;
  font-size: 14px;
  line-height: 26px;
  display: inline-block;
  cursor: pointer;
}
</style>
