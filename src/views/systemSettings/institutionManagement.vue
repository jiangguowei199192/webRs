<template>
  <div>
    <div class="title">基础数据 / 机构管理</div>
    <div class="left-div">
      <div class="left-title">组织机构树</div>
      <el-input
        class="institution-search-input"
        suffix-icon="el-icon-search"
        v-model="institutionSearch"
        placeholder=""
      ></el-input>
      <div v-show="showDeptTreeRightMenu">
        <!-- <ul id="menu" class="dept-tree-right-menu">
          <li class="menu-item" @click="deptEditClick">
            <div class="menu-div">
              <el-image :src="deptEditIcon" class="item-icon"></el-image>
              <span class="item-span">编辑</span>
            </div>
          </li>
          <li class="menu-item" @click="deptSeeClick">
            <div class="menu-div">
              <el-image :src="deptSeeIcon" class="item-icon"></el-image>
              <span class="item-span">查看</span>
            </div>
          </li>
          <li class="menu-item" @click="deptDeleteClick">
            <div class="menu-div">
              <el-image :src="deptDeleteIcon" class="item-icon"></el-image>
              <span class="item-span">删除</span>
            </div>
          </li>
        </ul> -->
        <el-menu id="menu" text-color="#fff">
          <el-menu-item index="1" @click="deptEditClick">
            <el-image :src="deptEditIcon"></el-image>
            <span>修改</span>
          </el-menu-item>
          <el-menu-item index="2" @click="deptSeeClick">
            <el-image :src="deptSeeIcon"></el-image>
            <span>查看</span>
          </el-menu-item>
          <el-menu-item index="3" @click="deptDeleteClick">
            <el-image :src="deptDeleteIcon"></el-image>
            <span>删除</span>
          </el-menu-item>
        </el-menu>
      </div>
      <el-tree
        ref="insDeptTreeRef"
        :data="deptTree"
        :props="{
          children: 'children',
          label: 'deptName',
          value: 'deptCode',
        }"
        default-expand-all
        @node-click="deptTreeClick"
        :expand-on-click-node="false"
        node-key="id"
        :current-node-key="selectedDept.id"
        v-if="selectedDept.id"
        class="dept-tree"
        @node-contextmenu="deptTreeRightCick"
        :filter-node-method="filterNode"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
      <div class="add-institution-btn" @click="addDeptClick">╋ 新增机构</div>
    </div>
    <div class="right-div">
      <div class="right-title">人员列表</div>
      <div class="search-tool">
        <el-input
          class="people-search-input"
          v-model="peopleSearch"
          placeholder="请输入人员姓名/身份证号进行搜索"
          @keydown.enter.native="peopleSearchClick"
        ></el-input>
        <div class="people-search-btn" @click="peopleSearchClick">
          <img :src="peopleSearchIcon" class="people-search-icon" />
          <span class="people-search-text">查询</span>
        </div>
        <div class="people-reset-btn" @click="peopleResetClick">
          <img :src="peopleResetIcon" class="people-reset-icon" />
          <span class="people-reset-text">重置</span>
        </div>
      </div>
      <div class="operate-table-tool">
        <span class="selected-count"
          >已选<span style="color: #1eb0fc">{{ selectedPeoples.length }}</span
          >项</span
        >
        <div class="delete-btn" @click="deletePeopleClick">批量删除</div>
        <div class="add-btn" @click="addPeopleClick">添加</div>
      </div>

      <el-table
        class="manageTable"
        :data="peopleList"
        empty-text="暂无数据"
        height="630"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="姓名"
          prop="employeeName"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="所属机构"
          prop="deptName"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="联系方式"
          prop="employeeTel"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="排序"
          prop="employeeSort"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="table-btn" @click="editPeopleClick(scope.row)">
              修改
            </div>
            <div
              class="table-btn table-btn-see"
              @click="seePeopleClick(scope.row)"
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
          @size-change="pageSizeChange"
        ></el-pagination>
      </div>
    </div>

    <AddPeopleDialog
      :isShow.sync="showAddPeople"
      title="新增人员"
      :deptTree="deptTree"
      :selectedDept="selectedDept"
      @close="showAddPeople = false"
      @confirmClick="addPeopleConfirmClick"
      @cancelClick="addPeopleCancelClick"
    ></AddPeopleDialog>

    <AddPeopleDialog
      :isShow.sync="showEditPeople"
      :peopleInfo="peopleInfo"
      title="修改人员"
      :deptTree="deptTree"
      @close="showEditPeople = false"
      @confirmClick="editPeopleConfirmClick"
      @cancelClick="showEditPeople = false"
    ></AddPeopleDialog>

    <PeopleInfoDialog
      :isShow.sync="showPeopleInfo"
      :peopleInfo="peopleInfo"
      @close="showPeopleInfo = false"
      @confirmClick="showPeopleInfo = false"
    ></PeopleInfoDialog>

    <DeleteDialog
      :isShow.sync="showDeleteTip"
      @close="showDeleteTip = false"
      @confirmClick="deleteTipConfirmClick"
      @cancelClick="showDeleteTip = false"
    ></DeleteDialog>

    <DeleteDialog
      :isShow.sync="showDeleteDeptTip"
      @close="showDeleteDeptTip = false"
      @confirmClick="deleteDeptTipConfirm"
      @cancelClick="showDeleteDeptTip = false"
    ></DeleteDialog>

    <AddDeptDialog
      :isShow.sync="showAddDept"
      title="新增机构"
      :deptTree="deptTree"
      :icons="iconList"
      @close="showAddDept = false"
      @confirmClick="addDeptConfirmClick"
      @cancelClick="showAddDept = false"
    ></AddDeptDialog>

    <AddDeptDialog
      :isShow.sync="showEditDept"
      title="修改机构"
      :deptInfo="deptDetail"
      :deptTree="deptTree"
      :icons="iconList"
      @close="showEditDept = false"
      @confirmClick="editDeptConfirmClick"
      @cancelClick="showEditDept = false"
    ></AddDeptDialog>

    <DeptInfoDialog
      :isShow.sync="showDeptInfo"
      :deptInfo="deptDetail"
      @close="showDeptInfo = false"
      @confirmClick="showDeptInfo = false"
    ></DeptInfoDialog>
  </div>
</template>

<script>
import AddPeopleDialog from './components/addPeopleDialog.vue'
import DeleteDialog from './components/deleteDialog.vue'
import PeopleInfoDialog from './components/peopleInfoDialog.vue'
import AddDeptDialog from './components/addDeptDialog.vue'
import DeptInfoDialog from './components/deptInfoDialog.vue'
import { backApi } from '@/api/back'
import { iconLibaryApi } from '@/api/iconLibary'
import { Notification } from 'element-ui'

export default {
  components: {
    AddPeopleDialog,
    DeleteDialog,
    PeopleInfoDialog,
    AddDeptDialog,
    DeptInfoDialog
  },
  watch: {
    institutionSearch (val) {
      this.$refs.insDeptTreeRef.filter(val)
    }
  },
  data () {
    return {
      peopleSearchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      peopleResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),
      deptEditIcon: require('../../assets/images/backgroundManagement/deptEdit.png'),
      deptSeeIcon: require('../../assets/images/backgroundManagement/deptSee.png'),
      deptDeleteIcon: require('../../assets/images/backgroundManagement/deptDelete.png'),

      institutionSearch: '',
      deptTree: [],
      selectedDept: '',
      rightClickDept: {},
      showDeptTreeRightMenu: false,

      peopleSearch: '',
      peopleList: [],
      peopleInfo: {},
      selectedPeoples: [],

      pageTotal: 0,
      pageSize: 15,
      currentPage: 1,

      showAddPeople: false,
      showEditPeople: false,
      showDeleteTip: false,
      showPeopleInfo: false,
      showAddDept: false,
      showDeptInfo: false,
      deptDetail: '',
      showEditDept: false,

      showDeleteDeptTip: false,
      iconList: []
    }
  },
  created () {
    this.getDeptTree()
    this.getIconList()
  },
  methods: {
    async getDeptTree () {
      var _this = this
      this.$axios.post(backApi.getDeptTree).then((res) => {
        if (res && res.data && res.data.code === 0) {
          _this.deptTree = this.handleDeptTree(res.data.data)
          if (_this.deptTree.length > 0) {
            _this.selectedDept = _this.deptTree[0]
            _this.getPeoplePage()
          }
        }
      })
    },
    // children为" "时置为null
    handleDeptTree (tree) {
      tree.forEach((item) => {
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

    async getPeoplePage () {
      var param = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        deptCode: this.selectedDept.deptCode,
        content: this.peopleSearch
      }
      const _this = this
      this.$axios
        .post(backApi.getPeoplePage, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.peopleList = res.data.data.records
            _this.currentPage = res.data.data.current
            _this.pageTotal = res.data.data.total
          }
        })
    },

    async getIconList () {
      const params = {
        currentPage: 1,
        pageSize: 1000
      }
      const _this = this
      this.$axios
        .post(iconLibaryApi.getAllPic, params, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.iconList = res.data.data.records
          }
        })
    },

    // 搜索机构时触发
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.deptName.indexOf(value) !== -1
    },

    // 单击机构时触发
    deptTreeClick (item) {
      this.selectedDept = item
      this.currentPage = 1
      this.peopleSearch = ''
      this.getPeoplePage()
    },

    // 右击机构时触发
    deptTreeRightCick (event, data, node, obj) {
      this.rightClickDept = data

      this.showDeptTreeRightMenu = false
      this.showDeptTreeRightMenu = true
      const menu = document.querySelector('#menu')
      menu.style.left = event.pageX - 350 + 'px'
      menu.style.top = event.pageY - 250 + 'px'
      // 添加监听鼠标事件，点击任何位置将菜单关闭
      document.addEventListener('click', this.closeRightMenu, true)
    },
    closeRightMenu () {
      this.showDeptTreeRightMenu = false
      // 及时关掉鼠标监听事件
      document.removeEventListener('click', this.closeRightMenu, true)
    },

    // 编辑机构
    async deptEditClick () {
      const param = { id: this.rightClickDept.id }
      const _this = this
      this.$axios
        .post(backApi.deptInfo, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.deptDetail = res.data.data
            _this.showEditDept = true
          }
        })
    },
    async editDeptConfirmClick (form) {
      this.showEditDept = false
      const param = {
        id: this.rightClickDept.id,
        deptName: form.deptName,
        parentDeptCode: form.fatherDept,
        deptAddress: form.address,
        deptIcon: form.icon,
        deptLatitude: form.latitude,
        deptLongitude: form.longitude,
        deptRemark: form.note,
        deptShortName: form.shortName,
        deptStatus: form.status,
        deptTel: form.phone,
        orderNum: form.num
      }
      const _this = this
      this.$axios
        .post(backApi.editDept, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.getDeptTree()
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    // 查看机构
    async deptSeeClick () {
      const param = { id: this.rightClickDept.id }
      const _this = this
      this.$axios
        .post(backApi.deptInfo, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.showDeptInfo = true
            _this.deptDetail = res.data.data
          }
        })
    },

    // 删除机构
    deptDeleteClick () {
      this.showDeleteDeptTip = true
    },
    async deleteDeptTipConfirm () {
      this.showDeleteDeptTip = false

      const param = { id: this.rightClickDept.id }
      const _this = this
      this.$axios
        .post(backApi.deleteDept, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.getDeptTree()
            _this.peopleSearch = ''
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    // 添加机构时触发
    addDeptClick () {
      this.showAddDept = true
    },

    // 添加机构确定时触发
    async addDeptConfirmClick (form) {
      this.showAddDept = false
      const param = {
        deptName: form.deptName,
        parentDeptCode: form.fatherDept,
        deptAddress: form.address,
        deptIcon: form.icon,
        deptLatitude: form.latitude,
        deptLongitude: form.longitude,
        deptRemark: form.note,
        deptShortName: form.shortName,
        deptStatus: form.status,
        deptTel: form.phone,
        orderNum: form.num
      }
      const _this = this
      this.$axios
        .post(backApi.addDept, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.getDeptTree()
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    // 搜索人员时触发
    peopleSearchClick () {
      this.getPeoplePage()
    },

    // 重置时触发
    peopleResetClick () {
      this.peopleSearch = ''
      this.currentPage = 1
      this.getPeoplePage()
    },

    // 多选时触发
    handleSelectionChange (items) {
      this.selectedPeoples = items
    },

    // 查看人员时触发
    async seePeopleClick (item) {
      this.showPeopleInfo = true

      const param = { id: item.id }
      const _this = this
      this.$axios
        .post(backApi.peopleInfo, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.peopleInfo = res.data.data
          }
        })
    },

    // 切换分页时触发
    currentPageChange (curPage) {
      this.currentPage = curPage
      this.getPeoplePage()
    },
    pageSizeChange (curSize) {
      this.pageSize = curSize
      this.getPeoplePage()
    },

    // 添加人员时触发
    addPeopleClick () {
      this.showAddPeople = true
    },

    // 添加人员确定时触发
    addPeopleConfirmClick (form) {
      // console.log(form)
      this.showAddPeople = false
      const param = {
        employeeName: form.name,
        deptCode: form.dept,
        employeeGender: form.six,
        employeeIdentity: form.idcard,
        employeeRemark: form.note,
        employeeSort: form.num,
        employeeTel: form.phone,
        officePhone: form.telphone
      }
      const _this = this
      this.$axios
        .post(backApi.addPeople, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.data) {
            _this.getPeoplePage()
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    // 添加人员取消时触发
    addPeopleCancelClick () {
      this.showAddPeople = false
    },

    // 编辑人员时触发
    editPeopleClick (item) {
      const param = { id: item.id }
      const _this = this
      this.$axios
        .post(backApi.peopleInfo, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.peopleInfo = res.data.data
            this.showEditPeople = true
          }
        })
    },

    // 编辑人员确定时触发
    editPeopleConfirmClick (form) {
      this.showEditPeople = false
      const param = {
        id: this.peopleInfo.id,
        employeeName: form.name,
        deptCode: form.dept,
        employeeGender: form.six,
        employeeIdentity: form.idcard,
        employeeRemark: form.note,
        employeeSort: form.num,
        employeeTel: form.phone,
        officePhone: form.telphone
      }
      const _this = this
      this.$axios
        .post(backApi.editPeople, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.data) {
            _this.getPeoplePage()
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    // 删除人员时触发
    deletePeopleClick () {
      if (this.selectedPeoples.length <= 0) {
        Notification({
          title: '提示',
          message: '请选择人员',
          type: 'warning',
          duration: 2 * 1000
        })
        return
      }
      this.showDeleteTip = true
    },

    // 删除人员确定时触发
    deleteTipConfirmClick () {
      this.showDeleteTip = false

      var peopleIds = []
      this.selectedPeoples.forEach((item) => {
        peopleIds.push(item.id)
      })
      const param = { ids: peopleIds }
      const _this = this
      this.$axios
        .post(backApi.deletePeople, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.data) {
            _this.getPeoplePage()
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
.custom-tree-node {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
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
  position: relative;
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
        font-size: 13px;
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
  .add-institution-btn {
    text-align: center;
    width: 150px;
    height: 38px;
    background-color: #39a4dd;
    line-height: 38px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translate(50%, -50%);
  }
}

.dept-btn {
  width: 18px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
  background: orange;
}
.right-div {
  min-width: 800px;
  height: 804px;
  background-color: rgba(0, 65, 87, 0.85);
  margin: 0 30px 0 360px;
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
    .delete-btn {
      float: right;
      width: 96px;
      height: 30px;
      margin-top: 10px;
      background-color: #ff0000;
      color: #ffffff;
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
      color: #fff;
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
  width: 46px;
  height: 26px;
  background-color: #0b779e;
  color: #fefefe;
  font-size: 14px;
  line-height: 26px;
  display: inline-block;
  cursor: pointer;
}
.table-btn-see {
  margin-left: 18px;
}

// .dept-tree-right-menu {
//   z-index: 1;
//   position: absolute;
//   height: 81px;
//   width: 80px;
//   border-radius: 2px;
//   background-color: rgba(0, 65, 87, 0.85);
//   border: 1px solid #00ccff;
//   overflow: hidden;
//   .menu-item {
//     cursor: pointer;
//     text-align: center;
//     padding: 0 5px;
//     color: #fff;
//     .menu-div {
//       border-bottom: 1px solid rgba($color: #00ccff, $alpha: 0.8);
//       height: 27px;
//       .item-icon {
//         width: 14px;
//         height: 14px;
//         top: 3px;
//       }
//       .item-span {
//         display: inline-block;
//         margin-left: 10px;
//         font-size: 12px;
//         color: #fff;
//         line-height: 27px;
//       }
//     }
//   }
// }
/deep/.el-menu {
  z-index: 1;
  position: absolute;
  width: 80px;
  height: 81px;
  border-radius: 2px;
  background-color: rgba(0, 65, 87, 0.85);
  border: 1px solid #00ccff;
  border-bottom: 0;
  overflow: hidden;
  .el-menu-item {
    height: 27px;
    line-height: 27px;
    text-align: center;
    border-bottom: 1px solid rgba($color: #00ccff, $alpha: 0.8);
    cursor: pointer;
    .el-image {
      width: 14px;
      height: 14px;
      right: 8px;
      margin-left: 3px;
    }
    span {
      font-size: 12px;
    }
  }
  .el-menu-item.is-active,
  .el-menu-item:hover {
    background-color: rgba(11, 119, 158, 0.66) !important;
    color: #fff;
  }
}
</style>
