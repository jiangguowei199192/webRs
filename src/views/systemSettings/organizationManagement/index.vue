<template>
  <div>
    <button type="button" class="back-sty" @click="back">
      <img :src="backImg" />
      组织管理
    </button>
    <div class="container1">
      <div class="leftBox">
        <div class="leftTip">
          <i class="el-icon-warning"></i>
          {{ userCountOfNoDept }}位用户未分配所属组织
        </div>
        <div class="tree-box">
          <el-tree
            :data="deptTree"
            :props="deptTreeProps"
            default-expand-all
            @node-click="deptTreeClick"
            :expand-on-click-node="false"
            node-key="deptCode"
            :current-node-key="selectedDeptCode"
            v-if="selectedDeptCode"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              style="width: 100%"
            >
              <span class="nodeTitleSty">{{
                node.label +
                (data.children ? "[" + data.children.length + "]" : "")
              }}</span>

              <el-popover
                placement="right"
                width="150"
                trigger="hover"
                popper-class="el-popover-more"
              >
                <div style="text-align: center">
                  <el-button class="popoverBtn" @click="organizationAdd(data)"
                    >新增下级组织</el-button
                  >
                  <el-button class="popoverBtn" @click="organizationEdit(data)"
                    >修改组织</el-button
                  >
                  <el-button v-show="data.showDelOrg" class="popoverBtn" @click="organizationDelete(data)"
                    >删除组织</el-button
                  >
                  <el-button class="popoverBtn" @click="bindDeviceClick(data)"
                    >绑定设备</el-button
                  >
                </div>

                <el-button
                  slot="reference"
                  icon="el-icon-setting"
                  v-show="data.showSetting"
                  class="settingStyle"
                ></el-button>
              </el-popover>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="rightBox">
        <button type="button" class="addUser" @click="addUser">添加用户</button>
        <div class="tableBox">
          <el-table
            @row-click="ClickTableRow"
            :data="userList"
            stripe
            empty-text="暂无数据"
            tooltip-effect="light"
          >
            <!-- <el-table-column label width="33" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index">{{
                  ""
                }}</el-radio>
              </template>
            </el-table-column> -->
            <el-table-column
              align="center"
              label="用户姓名"
              prop="username"
            ></el-table-column>
            <el-table-column
              align="center"
              label="角色"
              prop="roleName"
            ></el-table-column>
            <el-table-column
              align="center"
              label="手机号"
              prop="mobile"
            ></el-table-column>
            <el-table-column
              align="center"
              label="所属组织"
              prop="deptName"
            ></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteClick(scope.$index, scope.row)"
                  style="width: 55px"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="tablePagination"
            popper-class="pageSelect"
            :total="pageData.total"
            :page-size="pageData.pageSize"
            layout="total, prev, pager, next, jumper"
            :current-page.sync="pageData.currentPage"
            @current-change="currentPageChange"
          ></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      title="添加用户"
      :visible.sync="showAddUser"
      :close-on-click-modal="clickfalse"
      width="30%"
      class="dialogStyle"
    >
      <el-form
        ref="addUserFormRef"
        :model="addUserForm"
        label-width="80px"
        :rules="addUserRules"
      >
        <el-form-item label="选择用户" prop="user">
          <el-select
            v-model="addUserForm.user"
            multiple
            :popper-append-to-body="false"
            placeholder="请选择用户"
            class="selectStyle"
            popper-class="select-popper"
          >
            <el-option
              v-for="item in addUser_userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUserConfirm" class="trueBtn"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="showDeleteTip"
      :close-on-click-modal="clickfalse"
      width="30%"
      class="dialogStyle"
    >
      <div style="height: 50px">
        是否从{{ radio >= 0 ? userList[radio].deptName : "" }}中移除用户 {{
          radio >= 0 ? userList[radio].username : ""
        }} ?
      </div>
      <div style="height: 30px">
        <el-button type="primary" @click="deleteTipSave" class="trueBtn"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="addOrganizationTitle"
      :visible.sync="showAddOrganization"
      :close-on-click-modal="clickfalse"
      width="30%"
      class="dialogStyle"
    >
      <el-form
        ref="addOrganizationFormRef"
        :model="addOrganizationForm"
        label-width="80px"
        :rules="addOrganizationRules"
      >
        <el-form-item label="组织名称" prop="organizationName">
          <el-input v-model="addOrganizationForm.organizationName"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="organizationType">
          <el-select
            v-model="addOrganizationForm.organizationType"
            :popper-append-to-body="false"
            placeholder
            popper-class="select-popper"
          >
            <el-option
              v-for="item in organizationTypes"
              :key="item.typeCode"
              :label="item.typeName"
              :value="item.typeCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级组织" prop="previousOrganization" :hidden="hidePreOrg">
          <el-cascader
            placeholder
            :options="deptTree"
            :props="addOrganizationProps"
            :show-all-levels="false"
            v-model="addOrganizationForm.previousOrganization"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input
            v-model="addOrganizationForm.createTime"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="addOrganizationConfirm"
            class="trueBtn"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="showBindDevice"
      :close-on-click-modal="clickfalse"
      width="584px"
      class="bindDeviceDlg"
    >
      <div>
        <div class="addTitleSty">组织绑定设备</div>
        <div class="addContentSty">
          <tree-transfer
            :from_data="formData"
            :to_data="toData"
            :title="['可选设备', '已选设备']"
            :defaultProps="{ label: 'label' }"
            openAll
            height="416px"
            @addBtn="bindDeviceAdd"
            @removeBtn="bindDeviceRemove"
          ></tree-transfer>
          <div style="height: 32px; margin-top: 20px">
            <div class="selectedDeviceNo">
              已选设备
              <span style="color: #00ff36">{{ bindSelectedDeviceNo }}</span>
              台
            </div>
            <div class="bindDialtrueBtn" @click="bindDeviceConfirm">保存</div>
            <div class="bindDialCancelBtn" @click="bindDeviceCancel">取消</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
import { loginApi } from '@/api/login'
import { settingApi } from '@/api/setting'
import videoMixin from '../../videoSystem/mixins/videoMixin'
import treeTransfer from 'el-tree-transfer'

export default {
  mixins: [videoMixin],
  components: { treeTransfer },
  created () {
    this.getUserOfNoDept()
    this.getDeptTree()
    this.getOrganizationTypes()
  },
  data () {
    return {
      backImg: require('../../../assets/images/Setting/setting-back.png'),
      clickfalse: false,

      showMorePopover: false,

      deptTree: [],
      deptTreeProps: {
        children: 'children',
        label: 'deptName',
        value: 'deptCode'
      },

      selectedDeptCode: '',
      pageData: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      radio: -1,
      userList: [],

      showAddUser: false,
      addUserForm: {
        user: []
      },
      addUserRules: {
        user: [{ required: true, message: '请选择用户' }]
      },
      addUser_userList: [],

      showDeleteTip: false,

      showAddOrganization: false,
      addOrganizationForm: {
        organizationName: '',
        organizationType: '',
        previousOrganization: '',
        createTime: ''
      },
      addOrganizationRules: {
        organizationName: [{ required: true, message: '请输入组织名称' }],
        organizationType: [{ required: true, message: '请选择类型' }],
        previousOrganization: [{ required: true, message: '请选择上级组织' }]
      },
      addOrganizationProps: {
        emitPath: false,
        checkStrictly: true,
        children: 'children',
        label: 'deptName',
        value: 'deptCode'
      },
      organizationTypes: [],
      addOrganizationTitle: '',
      currentOrganization: '',

      showBindDevice: false,
      toData: [],
      formData: [],
      bindSelectedDeviceNo: 0,

      userCountOfNoDept: 0,

      hidePreOrg: false // 修改组织弹窗隐藏上级组织
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    },

    // 获取未分配组织的用户数量
    async getUserOfNoDept () {
      this.$axios.get(settingApi.countDeptUser).then((res) => {
        if (res && res.data && res.data.code === 0) {
          this.userCountOfNoDept = res.data.data
        }
      })
    },

    // 获取组织类型集合
    async getOrganizationTypes () {
      this.$axios
        .get(settingApi.queryByTypeCode, { params: { typeCode: 'dept_type' } })
        .then((res) => {
          if (res.data.code === 0) {
            this.organizationTypes = res.data.data
          }
        })
    },

    // 获取组织树
    async getDeptTree () {
      this.$axios.post(loginApi.getDeptTree).then((res) => {
        if (res.data.code === 0) {
          var temp = res.data.data
          // 一级
          temp.forEach((item) => {
            item.showSetting = false
            item.showDelOrg = true
            if (item.children) {
              if (item.children.length <= 0) {
                item.children = null
              } else {
                // 二级
                var temp2 = item.children
                temp2.forEach((item2) => {
                  item2.showSetting = false
                  item2.showDelOrg = true
                  if (item2.children) {
                    if (item2.children.length <= 0) {
                      item2.children = null
                    } else {
                      // 三级
                      var temp3 = item2.children
                      temp3.forEach((item3) => {
                        item3.showSetting = false
                        item3.showDelOrg = true
                        if (item3.children) {
                          if (item3.children.length <= 0) {
                            item3.children = null
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          })
          this.deptTree = temp
          this.deptTree[0].showSetting = true
          this.deptTree[0].showDelOrg = false

          this.selectedDeptCode = res.data.data[0].deptCode
          this.getUserList()
        }
      })
    },

    // 获取用户列表
    async getUserList () {
      var param = {
        currentPage: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        deptCode: this.selectedDeptCode
      }
      this.$axios.post(settingApi.queryUserDeptPage, param).then((res) => {
        if (res.data.code === 0) {
          this.userList = res.data.data.records
          this.pageData.total = res.data.data.total
        }
      })
    },

    // 选中组织
    deptTreeClick (item) {
      this.deptTree[0].showSetting = false
      this.deptTree[0].children.forEach(item => {
        item.showSetting = false
        if (item.children) {
          item.children.forEach(item => {
            item.showSetting = false
          })
        }
      })
      item.showSetting = true

      this.selectedDeptCode = item.deptCode
      this.getUserList()
    },

    // 分页页数改变
    currentPageChange () {
      this.getUserList()
    },

    // 点击表格行
    ClickTableRow (row) {
      this.radio = this.userList.indexOf(row)
    },

    // 移除用户
    deleteClick (index, row) {
      this.showDeleteTip = true
    },

    // 移除用户-确定
    deleteTipSave () {
      this.showDeleteTip = false

      var param = {
        id: this.userList[this.radio].id,
        deptCode: null
      }
      this.$axios
        .post(settingApi.updateUserDept, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.radio = -1
            this.getUserList()
            Notification({
              title: '提示',
              message: '移除成功',
              type: 'success',
              duration: 5 * 1000
            })
            return
          }
          Notification({
            title: '提示',
            message: '移除失败',
            type: 'warning',
            duration: 5 * 1000
          })
        })
    },

    // 添加用户
    addUser () {
      if (this.$refs.addUserFormRef) {
        this.$refs.addUserFormRef.resetFields()
      }

      this.$axios.post(settingApi.queryUserList).then((res) => {
        if (res.data.code === 0) {
          this.addUser_userList = res.data.data
          this.showAddUser = true
        }
      })
    },

    // 添加用户-保存
    addUserConfirm () {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return
        this.showAddUser = false

        var param = []
        this.addUserForm.user.forEach((item) => {
          var temp = {
            id: item,
            deptCode: this.selectedDeptCode
          }
          param.push(temp)
        })
        this.$axios
          .post(settingApi.batchUpdateUserDeptCode, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then((res) => {
            if (res.data.code === 0) {
              this.getUserList()
              Notification({
                title: '提示',
                message: '添加成功',
                type: 'success',
                duration: 5 * 1000
              })
              return
            }
            Notification({
              title: '提示',
              message: '添加失败',
              type: 'warning',
              duration: 5 * 1000
            })
          })
      })
    },

    // 新增组织
    organizationAdd (data) {
      if (this.$refs.addOrganizationFormRef) {
        this.$refs.addOrganizationFormRef.resetFields()
      }
      this.currentOrganization = data
      this.addOrganizationTitle = '新增组织'
      this.addOrganizationForm.createTime = this.getCurrentDate()
      this.addOrganizationForm.previousOrganization = data.deptCode
      this.showAddOrganization = true
    },
    // 修改组织
    organizationEdit (data) {
      this.currentOrganization = data
      this.addOrganizationTitle = '修改组织'
      this.addOrganizationForm.createTime = this.getCurrentDate()
      this.addOrganizationForm.organizationName = data.deptName
      this.addOrganizationForm.organizationType = data.deptTypeCode

      this.showAddOrganization = true

      // 第一级没有上级组织，所以隐藏上级组织
      if (data.deptCode === 'department_fire_220') {
        this.hidePreOrg = true
        this.addOrganizationForm.previousOrganization = 'parent_001'
      } else {
        this.hidePreOrg = false
        this.addOrganizationForm.previousOrganization = data.parentDeptCode
      }
    },
    // 删除组织
    organizationDelete (data) {
      console.log(data)
      if (this.userList.length) {
        Notification({
          title: '提示',
          message: '请先移除该组织下的所有用户',
          type: 'warning',
          duration: 5 * 1000
        })
        return
      }

      var param = { id: data.id }
      this.$axios.post(settingApi.deleteDept, param).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.getDeptTree()
          Notification({
            title: '提示',
            message: '删除成功',
            type: 'success',
            duration: 5 * 1000
          })
        }
      })
    },

    // 新增组织-保存
    async addOrganizationConfirm () {
      this.$refs.addOrganizationFormRef.validate(async (valid) => {
        if (!valid) return
        this.showAddOrganization = false

        if (this.addOrganizationTitle === '新增组织') {
          var param1 = {
            deptName: this.addOrganizationForm.organizationName,
            deptTypeCode: this.addOrganizationForm.organizationType,
            parentDeptCode: this.addOrganizationForm.previousOrganization
          }
          this.$axios
            .post(settingApi.addDept, param1, {
              headers: { 'Content-Type': 'application/json;charset=UTF-8' }
            })
            .then((res) => {
              if (res.data.code === 0) {
                this.getDeptTree()
                Notification({
                  title: '提示',
                  message: '新增成功',
                  type: 'success',
                  duration: 5 * 1000
                })
                return
              }
              Notification({
                title: '提示',
                message: '新增失败',
                type: 'warning',
                duration: 5 * 1000
              })
            })
        }

        if (this.addOrganizationTitle === '修改组织') {
          var param2 = {
            deptName: this.addOrganizationForm.organizationName,
            deptTypeCode: this.addOrganizationForm.organizationType,
            parentDeptCode: this.addOrganizationForm.previousOrganization,
            id: this.currentOrganization.id
          }
          this.$axios
            .post(settingApi.updateDept, param2, {
              headers: { 'Content-Type': 'application/json;charset=UTF-8' }
            })
            .then((res) => {
              if (res.data.code === 0) {
                this.getDeptTree()
                Notification({
                  title: '提示',
                  message: '修改成功',
                  type: 'success',
                  duration: 5 * 1000
                })
                return
              }
              Notification({
                title: '提示',
                message: '修改失败',
                type: 'warning',
                duration: 5 * 1000
              })
            })
        }
      })
    },

    // 绑定设备
    async bindDeviceClick (data) {
      this.$axios
        .get(settingApi.getDeviceTree, { params: { deptCode: data.deptCode } })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            // 处理数据
            this.handleDeviceTree(res.data.data)
            this.showBindDevice = true
          }
        })
    },
    handleDeviceTree (deviceData) {
      var toDataTemp = []
      if (deviceData.gdjkSelected.length > 0) {
        deviceData.gdjkSelected.forEach((item) => {
          item.id = item.deviceCode
          item.pid = 'gdjk'
          item.label = item.deviceName
        })
        var gdjkSelected = {
          id: 'gdjk',
          pid: '0',
          label: '高点监控',
          children: deviceData.gdjkSelected
        }
        toDataTemp.push(gdjkSelected)
      }
      if (deviceData.wrjSelected.length > 0) {
        deviceData.wrjSelected.forEach((item) => {
          item.id = item.deviceCode
          item.pid = 'wrj'
          item.label = item.deviceName
        })
        var wrjSelected = {
          id: 'wrj',
          pid: '0',
          label: '无人机',
          children: deviceData.wrjSelected
        }
        toDataTemp.push(wrjSelected)
      }
      this.toData = toDataTemp

      var formDataTemp = []
      if (deviceData.gdjkSelectAble.length > 0) {
        deviceData.gdjkSelectAble.forEach((item) => {
          item.id = item.deviceCode
          item.pid = 'gdjk'
          item.label = item.deviceName
        })
        var gdjkAble = {
          id: 'gdjk',
          pid: '',
          label: '高点监控',
          children: deviceData.gdjkSelectAble
        }
        formDataTemp.push(gdjkAble)
      }
      if (deviceData.wrjSelectAble.length > 0) {
        deviceData.wrjSelectAble.forEach((item) => {
          item.id = item.deviceCode
          item.pid = 'wrj'
          item.label = item.deviceName
        })
        var wrjAble = {
          id: 'wrj',
          pid: '',
          label: '无人机',
          children: deviceData.wrjSelectAble
        }
        formDataTemp.push(wrjAble)
      }
      this.formData = formDataTemp

      this.handleBindSelectedDevice(this.toData)
    },
    // 绑定设备-保存
    async bindDeviceConfirm () {
      this.showBindDevice = false

      console.log(this.toData)
      var deviceCodes = []
      this.toData.forEach(item => {
        item.children.forEach(item1 => {
          deviceCodes.push(item1.deviceCode)
        })
      })
      console.log(deviceCodes)
      var param = {
        deptCode: this.selectedDeptCode,
        deviceCodeList: deviceCodes
      }
      this.$axios.post(settingApi.deptBandDevice, param, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      }).then(res => {
        if (res && res.data && res.data.code === 0) {
          Notification({
            title: '提示',
            message: '绑定设备成功',
            type: 'success',
            duration: 5 * 1000
          })
          return
        }
        Notification({
          title: '提示',
          message: '绑定设备失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    },
    bindDeviceCancel () {
      this.showBindDevice = false
    },

    getCurrentDate () {
      var date = new Date()
      var seperator1 = '-'
      var seperator2 = ':'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (day >= 0 && day <= 9) {
        day = '0' + day
      }
      var currentDate =
        year +
        seperator1 +
        month +
        seperator1 +
        day +
        ' ' +
        date.getHours() +
        seperator2 +
        date.getMinutes()
      return currentDate
    },

    bindDeviceAdd (fromData, toData, obj) {
      this.toData = toData
      this.handleBindSelectedDevice(toData)
    },
    bindDeviceRemove (fromData, toData, obj) {
      this.toData = toData
      this.handleBindSelectedDevice(toData)
    },
    handleBindSelectedDevice (toData) {
      var count = 0
      toData.forEach((item) => {
        count = count + item.children.length
      })
      this.bindSelectedDeviceNo = count
    }
  }
}
</script>

<style lang="scss" scoped>
.back-sty {
  width: 120px;
  height: 36px;
  border: none;
  font-size: 18px;
  color: #ffffff;
  outline: none;
  display: block;
  background: url("../../../assets/images/plan/plan-back-background.png")
    no-repeat;
  background-size: 100% 100%;
  margin-top: 30px;
  margin-left: 30px;
  cursor: pointer;
}

.container1 {
  width: 1048px;
  height: 685px;
  margin: 50px auto 0 auto;
}
.leftBox {
  width: 220px;
  height: 682px;
  border: solid 2px #39a4dd;
  border-radius: 10px;
  overflow: hidden;
  float: left;
  .leftTip {
    height: 38px;
    line-height: 38px;
    background: black;
    color: #ff0000;
    font-size: 14px;
    text-align: center;
  }
}
.rightBox {
  width: 796px;
  height: 682px;
  border: solid 2px #39a4dd;
  border-radius: 10px;
  margin-left: 24px;
  float: left;
  .addUser {
    width: 75px;
    height: 25px;
    border: solid 1px #39a4dd;
    font-size: 12px;
    color: #ffffff;
    background-color: transparent;
    outline: none;
    display: block;
    float: right;
    margin: 21px 18px 0px 0px;
    cursor: pointer;
  }
  .tableBox {
    width: 760px;
    height: 598px;
    margin: 58px auto 20px auto;
  }
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

.dialogStyle {
  min-width: 1500px;
  /deep/.el-dialog__header {
    // 头部
    background-color: #39a4dd;
  }
  /deep/.el-dialog__title {
    // 头部-标题
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    // 内部
    background-color: #336984;
    color: white;
  }
  /deep/.el-dialog__footer {
    // 尾部
    background-color: #336984;
  }
  /deep/.el-icon-close:before {
    // 头部-关闭
    color: white;
  }
  .trueBtn {
    // 按钮
    background-color: #1eb0fc;
    font-size: 14px;
    color: white;
    width: 66px;
    height: 30px;
    padding: 0;
    float: right;
  }
  /deep/.el-input__inner {
    // 输入框
    color: white;
    background-color: #3688b1;
    border: none;
  }
  /deep/.el-form-item__label {
    // label
    color: white;
  }
  .el-radio {
    color: white;
  }
  .selectStyle {
    width: 80%;
    // // 下拉框
    // /deep/.el-input__inner {
    //   font-size: 12px;
    // }
    // /deep/.select-popper {
    //   background-color: #3688b1;
    //   font-size: 12px;
    //   color: white;
    //   border: none;
    //   .el-select-dropdown__item.selected {
    //     background-color: #3688b1;
    //   }
    //   .el-select-dropdown__item {
    //     font-size: 12px;
    //     color: white;
    //   }
    //   .el-select-dropdown__item.hover {
    //     background-color: #3688b1;
    //   }
    //   .popper__arrow {
    //     border-bottom-color: #3688b1;
    //   }
    //   .popper__arrow::after {
    //     border-bottom-color: #3688b1;
    //   }
    // }
  }
}

.settingStyle {
  width: 35px;
  height: 35px;
  background-color: transparent;
  color: white;
  border: none;
  margin-bottom: 10px;
  vertical-align: top;
}
.popoverBtn {
  background: transparent;
  color: white;
  border: 0;
  margin-left: 0px;
  border-radius: 0px;
}

.nodeTitleSty {
  display: inline-block;
  width: 110px;
  height: 35px;
  line-height: 35px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tree-box {
  height: 644px;
  overflow: auto;
  /* 树形列表 */
  /deep/.el-tree {
    color: #23cefd;
    background-color: transparent;
    .el-tree-node {
      .el-tree-node__content {
        display: block !important;
        height: 35px;
        line-height: 35px;
        border: 1px solid transparent;
      }
      .el-tree-node__children {
        overflow: visible !important;
      }
      .el-tree-node__content:hover,
      .el-tree-node:focus > .el-tree-node__content {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
      }
      .el-tree-node__expand-icon {
        color: transparent;
        pointer-events: none;
      }
    }
  }
  /deep/ .el-tree-node.is-current > .el-tree-node__content {
    background: rgba(255, 255, 255, 0.1) !important;
    color: white;
  }
}

.bindDeviceDlg.el-dialog__wrapper {
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    background: transparent;
    .el-dialog__body {
      display: inline-block;
      padding: 0px;
      width: 100%;
      .addTitleSty {
        height: 43px;
        color: white;
        font-size: 18px;
        font-weight: bold;
        line-height: 43px;
        background-color: #3aa4de;
        padding-left: 25px;
      }
      .addContentSty {
        background-color: #346a84;
        padding: 20px;
        /deep/.el-tree {
          color: #23cefd;
          background-color: transparent;
          .el-tree-node {
            .el-tree-node__content {
              display: block !important;
              height: 35px;
              line-height: 35px;
              border: 1px solid transparent;
            }
            .el-tree-node__children {
              overflow: visible !important;
            }
            .el-tree-node__content:hover,
            .el-tree-node:focus > .el-tree-node__content {
              color: #fff;
              background-color: rgba(255, 255, 255, 0.1);
            }
            .el-tree-node__expand-icon {
              color: transparent;
              pointer-events: none;
            }
          }
        }
        /deep/ .el-tree-node.is-current > .el-tree-node__content {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white;
        }
      }
      .el-button.is-circle {
        width: 40px;
        height: 40px;
      }
      .transfer-title {
        background-color: #3aa4de;
        border: none;
        color: white;
      }
      .transfer-left {
        border: 2px solid #3aa4de;
        border-radius: 0;
      }
      .transfer-right {
        border: 2px solid #3aa4de;
        border-radius: 0;
      }

      .bindDialtrueBtn {
        float: right;
        width: 66px;
        height: 30px;
        background: #1eb0fc;
        color: white;
        font-size: 14px;
        line-height: 32px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
      }
      .bindDialCancelBtn {
        float: right;
        width: 66px;
        height: 30px;
        background: transparent;
        color: #1eb0fc;
        margin-right: 20px;
        font-size: 14px;
        line-height: 32px;
        text-align: center;
        border-radius: 4px;
        border: solid 1px #1eb0fc;
        cursor: pointer;
      }
      .selectedDeviceNo {
        float: left;
        color: white;
        font-size: 14px;
      }
    }
  }
}
</style>
