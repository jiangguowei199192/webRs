<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="1145px"
    class="permission-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">数据授权</div>
    </div>

    <el-tabs v-model="activeTab" class="permission-tab">
      <el-tab-pane label="部门" name="apartment">
        <div class="tab-div1">
          <div class="range-div">
            <div class="range-title">权限范围</div>
            <el-radio-group
              v-model="selectedRadio"
              class="range-radio"
              @change="radioGroupChange"
            >
              <el-radio :label="0">本级</el-radio>
              <el-radio :label="1">本级及其上级</el-radio>
              <el-radio :label="2">本级及其下级</el-radio>
              <el-radio :label="3">自定义</el-radio>
            </el-radio-group>
          </div>
          <div class="apartment-dept-div" v-show="showRangeDept">
            <div class="dept-title">机构列表</div>
            <el-input
              class="dept-search-input"
              suffix-icon="el-icon-search"
              v-model="institutionSearch"
              placeholder="请输入机构进行搜索"
            ></el-input>
            <el-tree
              ref="deptTreeRef1"
              :data="deptTree"
              :props="deptTreeProps"
              default-expand-all
              show-checkbox
              node-key="deptCode"
              :default-checked-keys="depts"
              class="dept-tree listScroll"
              style="height: 422px; margin-top: 10px; margin-left: 16px"
              :filter-node-method="filterNode"
              @check-change="deptTree1Change"
            ></el-tree>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="用户" name="user">
        <div class="tab-div2">
          <div class="user-list-div">
            <div class="user-list-title">用户列表</div>
            <div class="user-dept-div">
              <div class="user-dept-title">机构列表</div>
              <el-tree
                :data="deptTree"
                :props="deptTreeProps"
                default-expand-all
                @node-click="deptTree2Click"
                :expand-on-click-node="false"
                node-key="id"
                :current-node-key="selectedDept2.id"
                class="dept-tree listScroll"
                style="margin: 0 0px 0 20px; height: 400px"
              ></el-tree>
            </div>

            <div class="account-div">
              <div class="account-title">账号列表</div>
              <div class="search-tool">
                <div class="account-status-text">账号状态</div>

                <el-select
                  v-model="userStatusSearch"
                  class="account-status-select"
                  @change="userStatusClick"
                >
                  <el-option
                    v-for="item in userStatusOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>

                <el-input
                  class="account-search-input"
                  v-model="userNameSearch"
                  placeholder="请输入用户名/账号进行搜索"
                ></el-input>

                <div class="account-search-btn" @click="accountSearchClick">
                  <i class="el-icon-search"></i>
                  <span class="account-search-text">查询</span>
                </div>

                <div class="account-reset-btn" @click="accountResetClick">
                  <i class="el-icon-refresh"></i>
                  <span class="account-reset-text">重置</span>
                </div>
              </div>

              <el-table
                ref="accountTableRef"
                class="accountTable listScroll"
                :data="userList"
                :row-key="getRowKeys"
                empty-text="暂无数据"
                height="320"
                @selection-change="accountSelectionChange"
              >
                <el-table-column
                  type="selection"
                  :reserve-selection="true"
                ></el-table-column>
                <el-table-column
                  label="用户名"
                  prop="username"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="姓名"
                  prop="employeeName"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="联系方式"
                  prop="mobile"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="排序"
                  prop="userSort"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="账号状态"
                  prop="enable"
                  align="center"
                ></el-table-column>
              </el-table>

              <div style="text-align: center">
                <el-pagination
                  class="tablePagination"
                  popper-class="pageSelect"
                  :total="pageTotal"
                  :page-size="pageSize"
                  :current-page.sync="currentPage"
                  layout="total, prev, pager, next"
                  @current-change="currentPageChange"
                ></el-pagination>
              </div>
            </div>
          </div>

          <div class="selected-user-div">
            <div class="selected-title">已关联用户</div>
            <div class="selected-box listScroll">
              <div
                class="selected-item"
                v-for="item in selectedAccounts"
                :key="item.userNum"
                @click="deleteSelectedAccount(item)"
              >
                <span class="item-text">{{ item.username }}</span>
                <i class="el-icon-close item-delete"></i>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">确定</div>
      <div class="cancel-btn" @click="$emit('cancelClick')">取消</div>
    </div>
  </el-dialog>
</template>

<script>
import { backApi } from '@/api/back'

export default {
  props: ['isShow', 'radio', 'depts', 'users'],
  data () {
    return {
      activeTab: 'apartment',
      showRangeDept: false,
      institutionSearch: '',
      selectedRadio: '',
      deptTree: [],
      deptTreeProps: {
        children: 'children',
        label: 'deptName',
        value: 'deptCode'
      },
      selectedDept1: [],
      selectedDept2: '',
      userStatusSearch: '',
      userStatusOptions: [
        { id: 2, label: '全部' },
        { id: 1, label: '有效' },
        { id: 0, label: '无效' }
      ],
      userNameSearch: '',
      userList: [],
      pageTotal: 100,
      pageSize: 10,
      currentPage: 1,
      selectedAccounts: []
    }
  },
  created () {
    this.getDeptTree()
  },
  watch: {
    isShow (newI) {
      if (!newI) {
        if (this.$refs.deptTreeRef1) {
          this.$refs.deptTreeRef1.setCheckedKeys([])
        }
        if (this.$refs.accountTableRef) {
          this.$refs.accountTableRef.clearSelection()
        }
      }
    },
    radio (newR) {
      this.selectedRadio = newR
    },
    institutionSearch (val) {
      this.$refs.deptTreeRef1.filter(val)
    },
    users (newU) {
      if (newU && newU.length) {
        // 用户回显
        this.selectedAccounts = newU
        const _this = this
        this.$nextTick(() => {
          if (_this.$refs.accountTableRef) {
            _this.selectedAccounts.forEach(item => {
              const user = _this.userList.find(u => u.id === item.id)
              if (user !== undefined) {
                _this.$refs.accountTableRef.selection.push(user)
              } else {
                _this.$refs.accountTableRef.selection.push(item)
              }
            })
          }
        })
      }
    }
  },
  methods: {
    confirmClick () {
      if (this.selectedRadio !== 3) {
        this.selectedDept1 = []
      }
      this.$emit(
        'confirmClick',
        this.selectedRadio,
        this.selectedDept1,
        this.selectedAccounts
      )
    },

    async getDeptTree () {
      const _this = this
      this.$axios.post(backApi.getDeptTree).then(res => {
        if (res && res.data && res.data.code === 0) {
          _this.deptTree = this.handleDeptTree(res.data.data)
          _this.selectedDept2 = _this.deptTree[0]
          _this.getUserList()
        }
      })
    },
    // children为" "时置为null
    handleDeptTree (tree) {
      tree.forEach(item => {
        if (item.children) {
          if (item.children.length <= 0) {
            item.children = null
          } else {
            this.handleDeptTree(item.children)
          }
        }
      })
      return tree
    },

    radioGroupChange (label) {
      if (label === 3) {
        this.showRangeDept = true
      } else {
        this.showRangeDept = false
      }
    },

    // 搜索机构时触发
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.deptName.indexOf(value) !== -1
    },

    deptTree1Change (row, selected) {
      if (selected) {
        this.selectedDept1.push(row)
      } else {
        const index = this.selectedDept1.indexOf(row)
        if (index > -1) {
          this.selectedDept1.splice(index, 1)
        }
      }
    },

    // 获取用户列表
    async getUserList (func) {
      var param = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status: this.userStatusSearch === 2 ? '' : this.userStatusSearch,
        searchContent: this.userNameSearch,
        deptCode: this.selectedDept2.deptCode
      }
      const _this = this
      this.$axios
        .post(backApi.getUserList, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            res.data.data.records.forEach(item => {
              if (item.status === 0) {
                item.enable = '无效'
              } else {
                item.enable = '有效'
              }
            })
            _this.userList = res.data.data.records
            _this.pageTotal = res.data.data.total
          }
        })
    },

    deptTree2Click (item) {
      this.selectedDept2 = item
      this.currentPage = 1
      this.userNameSearch = ''
      this.userStatusSearch = ''
      this.getUserList()
    },

    userStatusClick () {
      this.currentPage = 1
      this.getUserList()
    },

    accountSearchClick () {
      this.currentPage = 1
      this.getUserList()
    },

    accountResetClick () {
      this.currentPage = 1
      this.userStatusSearch = ''
      this.userNameSearch = ''
      this.getUserList()
    },

    currentPageChange (curPage) {
      this.currentPage = curPage
      this.getUserList()
    },

    getRowKeys (row) {
      return row.id
    },

    accountSelectionChange (val) {
      this.selectedAccounts = val
    },

    // 删除已选中用户时触发
    deleteSelectedAccount (item) {
      const index = this.selectedAccounts.indexOf(item)
      if (index > -1) {
        this.selectedAccounts.splice(index, 1)
      }
      // 取消表格中当前行的选中
      this.$nextTick(() => {
        if (
          this.$refs.accountTableRef &&
          this.$refs.accountTableRef.selection
        ) {
          const user = this.$refs.accountTableRef.selection.find(
            u => u.id === item.id
          )
          if (user !== undefined) {
            const ind = this.$refs.accountTableRef.selection.indexOf(user)
            if (ind > -1) {
              this.$refs.accountTableRef.selection.splice(ind, 1)
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.permission-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    background-color: transparent;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px 20px;
      width: 100%;
      border: 1px solid #1eb0fc;
      background-color: rgba(0, 65, 87, 0.85);
      .add-people-header {
        height: 40px;
        .header-icon {
          display: inline-block;
          width: 19px;
          height: 16px;
          background-image: url("../../../assets/images/fire_title.png");
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
      .permission-tab {
        margin-left: 20px;
        width: 1065px;
        .el-tabs__item {
          width: 100px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          box-sizing: none;
        }
        /* 选中时的字体颜色 */
        .el-tabs__item.is-active {
          color: #00ccff;
        }
        /* 选中的下划线颜色 */
        .el-tabs__active-bar {
          background-color: #00ccff;
        }
        /* 线条颜色 */
        .el-tabs__nav-wrap::after {
          background-color: rgba($color: #1eb0fc, $alpha: 0.5);
        }
        /* 去除边框 */
        .el-tabs__item.is-active.is-focus:not(:active) {
          -webkit-box-shadow: none !important;
          box-shadow: none !important;
        }
      }
      .tab-div1 {
        height: 503px;
        .range-div {
          float: left;
          width: 243px;
          height: 100%;
          // background-color: rgba($color: #183157, $alpha: 0.95);
          background-color: rgb(1, 77, 99);
          .range-title {
            height: 36px;
            width: 100%;
            font-size: 14px;
            color: #00ccff;
            text-align: center;
            line-height: 36px;
          }
          .range-radio {
            margin-top: 10px;
            .el-radio {
              display: block;
              height: 27px;
              margin-left: 10px;
            }
            .el-radio__inner {
              background-color: transparent;
              border-color: #fff;
              border-radius: 0px;
            }
            .el-radio__label {
              color: #fff;
              font-size: 13px;
            }
          }
        }
        .apartment-dept-div {
          float: left;
          width: 311px;
          height: 100%;
          // background-color: rgba($color: #183157, $alpha: 0.95);
          background-color: rgb(1, 77, 99);
          margin-left: 5px;
          .dept-title {
            height: 36px;
            width: 100%;
            font-size: 14px;
            color: #00ccff;
            text-align: center;
            line-height: 36px;
          }
          .dept-search-input {
            width: 278px;
            margin-left: 16px;
            .el-input__inner {
              background: #09546d;
              border-color: #1eb0fc;
              border-radius: 0;
              color: white;
            }
            .el-icon-search {
              color: #c5f3ff;
            }
          }
        }
      }
      .dept-tree {
        overflow: auto;
        background-color: transparent;
        color: #fff;
        .el-tree-node {
          .el-tree-node__content {
            display: block !important;
            height: 30px;
            line-height: 30px;
            border: 1px solid transparent;
            background-color: transparent;
          }
          .el-tree-node__label {
            font-size: 12px;
          }
          .el-tree-node__content:hover,
          .el-tree-node:focus > .el-tree-node__content {
            background-color: rgba(15, 95, 134, 0.5) !important;
          }
          .el-checkbox__inner {
            background-color: transparent;
            border-color: #fff;
            border-radius: 0px;
          }
        }
        .el-tree-node.is-current > .el-tree-node__content {
          background: rgba(15, 95, 134, 0.5) !important;
          color: #1eb0fc;
        }
      }
      .tab-div2 {
        height: 503px;
        .user-list-div {
          float: left;
          width: 870px;
          height: 100%;
          // background-color: rgba($color: #183157, $alpha: 0.95);
          background-color: rgb(1, 77, 99);
          .user-list-title {
            width: 100%;
            height: 40px;
            line-height: 40px;
            color: #00ccff;
            font-size: 14px;
            text-align: center;
          }
          .user-dept-div {
            float: left;
            width: 270px;
            height: 440px;
            margin-left: 10px;
            border: 1px solid #1eb0fc;
            .user-dept-title {
              height: 40px;
              line-height: 40px;
              margin-left: 20px;
              font-size: 14px;
              color: #00ccff;
            }
          }
          .account-div {
            float: left;
            width: 566px;
            height: 440px;
            border: 1px solid #1eb0fc;
            margin-left: 10px;
            .account-title {
              height: 40px;
              line-height: 40px;
              margin-left: 15px;
              font-size: 14px;
              color: #00ccff;
            }
            .search-tool {
              height: 24px;
              margin: 0 15px;
              .account-status-text {
                float: left;
                color: #fff;
                display: inline-block;
                font-size: 12px;
                height: 24px;
                line-height: 24px;
              }
              .account-status-select {
                float: left;
                width: 91px;
                height: 24px;
                margin-left: 10px;
                .el-input__inner {
                  background: #09546d;
                  border-color: #1eb0fc;
                  border-radius: 0;
                  color: white;
                  height: 24px;
                  font-size: 12px;
                }
                /* 使箭头居中 */
                .el-input__icon {
                  line-height: 24px;
                }
              }
              .account-search-input {
                float: left;
                width: 233px;
                margin-left: 10px;
                .el-input__inner {
                  background: #09546d;
                  border-color: #1eb0fc;
                  border-radius: 0;
                  color: white;
                  height: 24px;
                  font-size: 12px;
                }
              }
              .account-search-btn {
                float: left;
                width: 56px;
                height: 24px;
                margin-left: 10px;
                background: -webkit-linear-gradient(top, #086384, #0b779e);
                font-size: 12px;
                line-height: 24px;
                color: #c5f3ff;
                text-align: center;
                cursor: pointer;
                .account-search-text {
                  margin-left: 5px;
                }
              }
              .account-reset-btn {
                float: left;
                width: 56px;
                height: 24px;
                margin-left: 10px;
                background: -webkit-linear-gradient(top, #086384, #0b779e);
                font-size: 12px;
                line-height: 24px;
                color: #c5f3ff;
                text-align: center;
                cursor: pointer;
                .account-reset-text {
                  margin-left: 5px;
                }
              }
            }

            /* 删除表格下横线 */
            .accountTable.el-table::before {
              height: 0px;
            }
            .accountTable.el-table {
              color: #c5f3ff;
              font-size: 12px;
              background: transparent;
              border: none;
              margin-top: 10px;
              margin-left: 15px;
              width: 536px;
              overflow-y: auto;
              /* 表格表头样式 */
              .el-table__header-wrapper th {
                color: #c5f3ff;
                font-size: 12px;
                height: 40px;
                padding: 0;
                background-color: rgba(11, 119, 158, 0.66);
              }

              /* 表格每行高度*/
              .el-table__body td {
                height: 28px;
                padding: 0;
              }

              /* 每行的背景颜色 */
              .el-table__body td {
                background-color: transparent;
              }

              /* 所有单元格颜色、无边框 */
              td,
              tr,
              th {
                border: none;
                background-color: transparent;
              }

              /* 复选框样式 */
              .el-checkbox__inner {
                background-color: transparent;
                border-color: #c5f3ff;
                border-radius: 0px;
              }

              /*鼠标移入某行时的背景色*/
              tbody tr:hover > td {
                background-color: transparent;
              }
            }
          }
        }

        .selected-user-div {
          float: left;
          width: 190px;
          height: 100%;
          // background-color: rgba($color: #183157, $alpha: 0.95);
          background-color: rgb(1, 77, 99);
          margin-left: 5px;
          .selected-title {
            height: 40px;
            line-height: 40px;
            color: #00ccff;
            font-size: 14px;
            text-align: center;
          }
          .selected-box {
            height: 440px;
            .selected-item {
              display: inline-block;
              width: 80px;
              height: 25px;
              margin-left: 10px;
              margin-bottom: 10px;
              background-color: #39a4dd;
              border-radius: 2px;
              text-align: center;
              cursor: pointer;
              .item-text {
                display: inline-block;
                max-width: 50px;
                font-size: 12px;
                color: #fff;
                line-height: 25px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .item-delete {
                color: #fff;
                line-height: 25px;
                float: right;
                margin-right: 7px;
              }
            }
          }
        }
      }
    }

    .confirm-tool {
      height: 50px;
      margin-top: 17px;
      .confirm-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin-right: 15px;
        cursor: pointer;
      }
      .cancel-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: transparent;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin-right: 20px;
        cursor: pointer;
      }
    }
  }
  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #00b7ff;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
