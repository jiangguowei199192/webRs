<template>
  <div>
    <button type="button" class="back-sty" @click="back">
      <img :src="backImg" />
      视频接入管理
    </button>
    <div class="container1">
      <div class="boxSty1">
        <div class="boxSty2">
          <el-select
            v-model="deviceTypeSelected"
            placeholder="设备类型"
            clearable
            @change="getDeviceList"
            class="selectSty1"
          >
            <el-option
              v-for="(item, index) in deviceTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="onlineStatusSelected"
            placeholder="在线状态"
            clearable
            @change="getDeviceList"
            class="selectSty1"
            style="margin-left: 77px"
          >
            <el-option
              v-for="(item, index) in onlineStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="useStatusSelected"
            placeholder="启用状态"
            clearable
            @change="getDeviceList"
            class="selectSty1"
            style="margin-left: 77px"
          >
            <el-option
              v-for="(item, index) in useStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="qualityDateSelected"
            type="date"
            placeholder="质保日期"
            value-format="timestamp"
            @change="qualityDateChange"
            class="selectSty1"
            style="width: 190px; margin-left: 77px"
          ></el-date-picker>
        </div>
        <div class="boxSty3">
          <el-input
            v-model="deviceNameInput"
            placeholder="设备名称"
            clearable
            class="inputSty1"
          ></el-input>
          <el-input
            v-model="deviceNoInput"
            placeholder="设备编号"
            clearable
            class="inputSty1"
            style="margin-left: 77px"
          ></el-input>
          <el-popover
            placement="right"
            width="150"
            trigger="click"
            v-model="showMorePopover"
            popper-class="el-popover-more"
          >
            <div style="text-align: center">
              <el-button
                class="popoverBtnSty"
                @click="addInputDevice"
                >新增接入设备</el-button
              >
              <el-button
                class="popoverBtnSty"
                @click="changeInputDevice"
                >修改接入设备</el-button
              >
              <el-button class="popoverBtnSty" @click="deleteInputDevice"
                >删除接入设备</el-button
              >
            </div>
            <div slot="reference" class="btnSty1 moreSty"></div>
          </el-popover>
          <div
            @click="refreshClick"
            class="btnSty1 refreshSty"
            style="margin-right: 15px"
          ></div>
          <div
            @click="searchClick"
            class="btnSty1 searchSty"
            style="margin-right: 15px"
          ></div>
        </div>

        <div class="tableBox">
          <el-table
            @row-click="clickTableRow"
            :data="deviceList"
            empty-text="暂无数据"
            tooltip-effect="light"
            :row-class-name="tableStatusChange"
            class="webFsScroll"
          >
            <el-table-column label width="33" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index">{{
                  ""
                }}</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="设备类型"
              prop="deviceType"
              width="100"
            ></el-table-column>
            <el-table-column
              align="center"
              label="设备名称"
              prop="deviceName"
              width="200"
            ></el-table-column>
            <el-table-column
              align="center"
              label="设备编号"
              prop="deivceNo"
              width="200"
            ></el-table-column>
            <el-table-column
              align="center"
              label="经度"
              prop="lon"
              width="100"
            ></el-table-column>
            <el-table-column
              align="center"
              label="纬度"
              prop="lat"
              width="100"
            ></el-table-column>
            <el-table-column
              align="center"
              label="在线状态"
              prop="onlineStatus"
              width="80"
            ></el-table-column>
            <el-table-column align="center" label="启用" width="100">
              <template slot-scope="scope">
                <el-switch
                  v-model="deviceList[scope.$index].useStatus"
                  @change="activeChange(scope.$index, scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="所属组织"
              prop="deptName"
              width="200"
            ></el-table-column>
            <el-table-column
              align="center"
              label="离线时间"
              prop="offlineTime"
              width="200"
            ></el-table-column>
          </el-table>
          <el-pagination
            class="tablePagination"
            popper-class="pageSelect"
            :total="pageTotal"
            :page-size="currentPageSize"
            :current-page.sync="currentPage"
            layout="total, prev, pager, next, jumper"
            @current-change="currentPageChange"
          ></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="showAddDevice"
      :close-on-click-modal="false"
      width="600px"
      class="addDeviceDlg"
    >
      <div>
        <div class="addTitleSty">{{ addDeviceTitle }}</div>
        <div class="addContentSty">
          <el-form
            ref="addDeviceRef"
            :model="addDeviceForm"
            label-width="90px"
            :inline="true"
            :rules="addDeviceRules"
          >
            <div class="subTitleSty">设备基本信息</div>

            <el-form-item
              label="设备名称"
              prop="deviceName"
              style="margin-left: 48px"
            >
              <el-input v-model="addDeviceForm.deviceName"></el-input>
            </el-form-item>

            <el-form-item label="设备编号" prop="deviceNo">
              <el-input
                v-model="addDeviceForm.deviceNo"
                :disabled="editDeviceNo"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="设备类型"
              prop="deviceType"
              style="margin-left: 48px"
            >
              <el-select
                v-model="addDeviceForm.deviceType"
                placeholder=""
                @change="deviceTypeSelectChanged"
                :disabled="editDeviceType"
              >
                <el-option
                  v-for="(item, index) in deviceTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所在地点" prop="address">
              <el-input v-model="addDeviceForm.address"></el-input>
            </el-form-item>

            <el-form-item
              label="是否启用"
              prop="enable"
              style="margin-left: 48px"
            >
              <el-select v-model="addDeviceForm.enable" placeholder="">
                <el-option
                  v-for="(item, index) in useStatusList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="设备品牌" prop="deviceBrand">
              <el-input v-model="addDeviceForm.deviceBrand"></el-input>
            </el-form-item>

            <el-form-item
              label="用户名"
              v-show="isGdjk"
              prop="username"
              style="margin-left: 48px"
            >
              <el-input v-model="addDeviceForm.username"></el-input>
            </el-form-item>

            <el-form-item label="密码" v-show="isGdjk" prop="password">
              <el-input v-model="addDeviceForm.password"></el-input>
            </el-form-item>

            <el-form-item
              label="所属区域"
              v-show="isGdjk"
              prop="belongArea"
              style="margin-left: 48px"
            >
              <el-select v-model="addDeviceForm.belongArea" placeholder="">
                <el-option
                  v-for="(item, index) in districtList"
                  :key="index"
                  :label="item.deptName"
                  :value="item.deptCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <div class="subTitleSty" style="margin-top: -20px">
              设备位置信息
            </div>

            <el-form-item
              label="设备经度"
              prop="longitude"
              style="margin-left: 48px"
            >
              <el-input v-model="addDeviceForm.longitude"></el-input>
            </el-form-item>

            <el-form-item label="设备纬度" prop="latitude">
              <el-input v-model="addDeviceForm.latitude"></el-input>
            </el-form-item>

            <el-form-item
              label="设备高度"
              prop="height"
              style="margin-left: 48px"
            >
              <el-input v-model="addDeviceForm.height"></el-input>
            </el-form-item>

            <el-form-item
              label="底座方向角"
              v-show="isGdjk"
              prop="directionAngle"
            >
              <el-input v-model="addDeviceForm.directionAngle"></el-input>
            </el-form-item>

            <div class="subTitleSty" style="margin-top: -20px">
              设备扩展信息
            </div>

            <el-form-item
              label="质保日期"
              prop="qualityDate"
              style="margin-left: 48px"
            >
              <el-date-picker
                v-model="addDeviceForm.qualityDate"
                type="date"
                placeholder=""
                value-format="timestamp"
                style="width: 146px"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <div style="height: 32px">
            <div class="npdConfirm" @click="addDeviceConfirm">保存</div>
            <div class="npdCancel" @click="addDeviceCancel">取消</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { settingApi } from '@/api/setting'
import { timeFormat } from '@/utils/date'
import { Notification } from 'element-ui'

export default {
  data () {
    var isNumber = (rule, value, callback) => {
      if (!Number(value)) {
        callback(new Error('请输入数字'))
      }
      callback()
    }

    return {
      backImg: require('../../../assets/images/Setting/setting-back.png'),

      deviceTypeSelected: '', // 设备类型
      deviceTypeList: [
        {
          label: '高点监控',
          value: 'GDJK'
        },
        {
          label: '无人机',
          value: 'WRJ'
        }
      ],
      onlineStatusSelected: '', // 在线状态
      onlineStatusList: [
        {
          label: '在线',
          value: 'online'
        },
        {
          label: '离线',
          value: 'offline'
        },
        {
          label: '未接入',
          value: 'empty'
        }
      ],
      useStatusSelected: '', // 启用状态
      useStatusList: [
        {
          label: '启用',
          value: 'enabled'
        },
        {
          label: '禁用',
          value: 'disabled'
        }
      ],
      deviceNameInput: '', // 设备名称
      deviceNoInput: '', // 设备编号
      qualityDateSelected: null, // 质保日期
      showMorePopover: false,

      deviceList: [],
      radio: -1,

      pageTotal: 0,
      currentPage: 1,
      currentPageSize: 10,

      showAddDevice: false,
      addDeviceForm: {
        deviceName: '',
        deviceNo: '',
        deviceType: 'GDJK',
        belongArea: '',
        address: '',
        enable: '',
        deviceBrand: '',
        username: '',
        password: '',
        longitude: '',
        latitude: '',
        height: '',
        directionAngle: '',
        qualityDate: ''
      },
      addDeviceRules: {},
      addGdjkRules: {
        deviceName: [{ required: true, message: '请输入设备名称' }],
        deviceNo: [{ required: true, message: '请输入设备编号' }],
        deviceType: [{ required: true, message: '请选择设备类型' }],
        enable: [{ required: true, message: '请选择是否启用' }],
        belongArea: [{ required: true, message: '请选择所属区域' }],
        longitude: [
          { required: true, message: '请输入设备经度' },
          { validator: isNumber, trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入设备纬度' },
          { validator: isNumber, trigger: 'blur' }
        ]
        // height: [{ validator: isNumber, trigger: 'blur' }],
        // directionAngle: [{ validator: isNumber, trigger: 'blur' }]
      },
      addWrjRules: {
        deviceName: [{ required: true, message: '请输入设备名称' }],
        deviceNo: [{ required: true, message: '请输入设备编号' }],
        deviceType: [{ required: true, message: '请选择设备类型' }],
        enable: [{ required: true, message: '请选择是否启用' }]
        // height: [{ validator: isNumber, trigger: 'blur' }],
        // longitude: [{ validator: isNumber, trigger: 'blur' }],
        // latitude: [{ validator: isNumber, trigger: 'blur' }]
      },

      districtList: [],
      isGdjk: true,
      addDeviceTitle: '',

      editDeviceNo: false,
      editDeviceType: false
    }
  },
  created () {
    this.getDeviceList()
    this.getDistrictList()
    this.addDeviceRules = this.addGdjkRules
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    },

    async getDeviceList () {
      var param = {
        currentPage: this.currentPage,
        pageSize: this.currentPageSize,
        deviceCode: this.deviceNoInput,
        deviceName: this.deviceNameInput,
        deviceStatus: this.useStatusSelected,
        deviceTypeCode: this.deviceTypeSelected,
        expirationDate: this.qualityDateSelected,
        onlineStatus: this.onlineStatusSelected
      }
      this.$axios.post(settingApi.queryDevicePage, param).then((res) => {
        if (res && res.data && res.data.code === 0) {
          this.handleDeviceListResData(res.data.data.data)
          this.pageTotal = res.data.data.paginator.totalCount
        }
      })
    },
    handleDeviceListResData (resData) {
      var tempArr = []
      resData.forEach((item) => {
        var deviceType = ''
        if (item.deviceTypeCode === 'GDJK') {
          deviceType = '高点监控'
        } else if (item.deviceTypeCode === 'WRJ') {
          deviceType = '无人机'
        }

        var useStatus = false
        if (item.deviceStatus === 'enabled') {
          useStatus = true
        } else if (item.deviceStatus === 'disabled') {
          useStatus = false
        }

        var onlineStatus = ''
        if (item.onlineStatus === 'online') {
          onlineStatus = '在线'
        } else if (item.onlineStatus === 'offline') {
          onlineStatus = '离线'
        } else if (item.onlineStatus === 'empty') {
          onlineStatus = '未接入'
        }

        var offlineTime = ''
        if (item.offlineTime != null) {
          offlineTime = timeFormat(item.offlineTime)
        }

        var dptName = ''
        item.deptList.forEach((dept) => {
          dptName = dptName + dept.deptName
        })

        var device = {
          deviceType: deviceType,
          deviceName: item.deviceName,
          deivceNo: item.deviceCode,
          lon: item.deviceLongitude,
          lat: item.deviceLatitude,
          useStatus: useStatus,
          deptName: dptName,
          onlineStatus: onlineStatus,
          offlineTime: offlineTime,
          address: item.deviceAddress,
          brand: item.deviceBrand,
          height: item.deviceHeight,
          expirationDate: item.deviceExpirationDate,
          deviceSeatAz: item.deviceSeatAz,
          deviceUserName: item.deviceUserName,
          devicePassword: item.devicePassword,
          deviceCode: item.deviceCode,
          district: item.districtCode
        }
        tempArr.push(device)
      })
      this.deviceList = tempArr
    },

    async getDistrictList () {
      this.$axios.get(settingApi.getDistrictList).then((res) => {
        if (res && res.data && res.data.code === 0) {
          this.districtList = res.data.data[0].subDept
        }
      })
    },

    // 质保日期搜索
    qualityDateChange (time) {
      this.getDeviceList()
    },

    // 刷新
    refreshClick () {
      this.deviceNoInput = ''
      this.deviceNameInput = ''
      this.useStatusSelected = ''
      this.deviceTypeSelected = ''
      this.qualityDateSelected = null
      this.onlineStatusSelected = ''

      this.currentPage = 1
      this.getDeviceList()
    },

    // 搜索
    searchClick () {
      this.currentPage = 1
      this.getDeviceList()
    },

    // 新增接入设备
    addInputDevice () {
      this.radio = -1
      this.showMorePopover = false
      this.addDeviceTitle = '新增接入设备'

      this.showAddDevice = true
      this.editDeviceNo = false
      this.editDeviceType = false

      this.addDeviceForm.deviceName = ''
      this.addDeviceForm.deviceNo = ''
      this.addDeviceForm.deviceType = 'GDJK'
      this.deviceTypeSelectChanged(this.addDeviceForm.deviceType)
      this.addDeviceForm.longitude = ''
      this.addDeviceForm.latitude = ''
      this.addDeviceForm.enable = ''
      this.addDeviceForm.deviceBrand = ''
      this.addDeviceForm.address = ''
      this.addDeviceForm.height = ''
      this.addDeviceForm.qualityDate = ''
      this.addDeviceForm.directionAngle = ''
      this.addDeviceForm.username = ''
      this.addDeviceForm.password = ''

      if (this.$refs.addDeviceRef) {
        this.$refs.addDeviceRef.clearValidate()
      }
    },

    // 修改接入设备
    changeInputDevice () {
      this.showMorePopover = false
      this.addDeviceTitle = '修改接入设备'

      if (this.radio < 0) {
        Notification({
          title: '提示',
          message: '请选择设备',
          type: 'warning',
          duration: 5 * 1000
        })
        return
      }

      this.showAddDevice = true
      this.editDeviceNo = true
      this.editDeviceType = true

      var selectedDevice = this.deviceList[this.radio]

      this.addDeviceForm.deviceName = selectedDevice.deviceName
      this.addDeviceForm.deviceNo = selectedDevice.deivceNo
      this.addDeviceForm.deviceType =
          selectedDevice.deviceType === '高点监控' ? 'GDJK' : 'WRJ'
      this.deviceTypeSelectChanged(this.addDeviceForm.deviceType)
      this.addDeviceForm.longitude = selectedDevice.lon
      this.addDeviceForm.latitude = selectedDevice.lat
      this.addDeviceForm.enable = selectedDevice.useStatus
        ? 'enabled'
        : 'disabled'
      this.addDeviceForm.deviceBrand = selectedDevice.brand
      this.addDeviceForm.address = selectedDevice.address
      this.addDeviceForm.height = selectedDevice.height
      this.addDeviceForm.qualityDate = selectedDevice.expirationDate
      this.addDeviceForm.directionAngle = selectedDevice.deviceSeatAz
      this.addDeviceForm.username = selectedDevice.deviceUserName
      this.addDeviceForm.password = selectedDevice.devicePassword
      this.addDeviceForm.belongArea = selectedDevice.district
    },

    // 删除接入设备
    deleteInputDevice () {
      this.showMorePopover = false

      if (this.radio < 0) {
        Notification({
          title: '提示',
          message: '请选择设备',
          type: 'warning',
          duration: 5 * 1000
        })
        return
      }

      var selectedDevice = this.deviceList[this.radio]
      var param = {
        deviceCode: selectedDevice.deviceCode
      }
      this.$axios.post(settingApi.deleteDevice, param).then((res) => {
        if (res && res.data && res.data.code === 0) {
          Notification({
            title: '提示',
            message: '删除设备成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getDeviceList()
          this.radio = -1
        }
      })
    },

    // 点击表格行
    clickTableRow (row) {
      this.radio = this.deviceList.indexOf(row)
    },

    // 分页页数改变
    currentPageChange () {
      this.getDeviceList()
    },

    // 激活
    async activeChange (index, row) {
      var param = {
        deviceCode: row.deviceCode,
        deviceStatus: row.useStatus ? 'enabled' : 'disabled'
      }
      this.$axios.post(settingApi.changeDeviceStatus, param).then((res) => {
        if (res && res.data && res.data.code === 0) {
          this.getDeviceList()
        }
      })
    },

    tableStatusChange (row) {
      if (row.row.onlineStatus === '未接入') {
        return 'table-info-row-disable'
      }
    },

    // 新增/修改设备-保存
    addDeviceConfirm () {
      this.$refs.addDeviceRef.validate(async (valid) => {
        if (!valid) return
        this.showAddDevice = false

        if (this.addDeviceTitle === '新增接入设备') {
          // 新增设备
          if (this.addDeviceForm.deviceType === 'GDJK') {
            var param = {
              deptDistrictCode: this.addDeviceForm.belongArea, // 行政区
              deviceAddress: this.addDeviceForm.address, // 地点
              deviceBrand: this.addDeviceForm.deviceBrand, // 品牌
              deviceCode: this.addDeviceForm.deviceNo, // 设备编码
              deviceHeight: this.addDeviceForm.height,
              deviceLatitude: this.addDeviceForm.latitude,
              deviceLongitude: this.addDeviceForm.longitude,
              deviceName: this.addDeviceForm.deviceName,
              devicePassword: this.addDeviceForm.password,
              deviceSeatAz: this.addDeviceForm.directionAngle, // 底座方位角
              deviceStatus: this.addDeviceForm.enable,
              deviceUserName: this.addDeviceForm.username,
              expirationDate: this.addDeviceForm.qualityDate // 质保期
            }
            this.$axios.post(settingApi.addGDJK, param).then((res) => {
              if (res && res.data && res.data.code === 0) {
                Notification({
                  title: '提示',
                  message: '新增设备成功',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.getDeviceList()
              }
            })
          }

          if (this.addDeviceForm.deviceType === 'WRJ') {
            var param1 = {
              deviceAddress: this.addDeviceForm.address, // 地点
              deviceBrand: this.addDeviceForm.deviceBrand, // 品牌
              deviceCode: this.addDeviceForm.deviceNo, // 设备编码
              deviceHeight: parseInt(this.addDeviceForm.height),
              deviceLatitude: this.addDeviceForm.latitude,
              deviceLongitude: this.addDeviceForm.longitude,
              deviceName: this.addDeviceForm.deviceName,
              deviceStatus: this.addDeviceForm.enable,
              expirationDate: this.addDeviceForm.qualityDate // 质保期
            }
            this.$axios.post(settingApi.addWRJ, param1).then((res) => {
              if (res && res.data && res.data.code === 0) {
                Notification({
                  title: '提示',
                  message: '新增设备成功',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.getDeviceList()
              }
            })
          }
        } else {
          // 修改设备
          var selectedDevice = this.deviceList[this.radio]
          if (selectedDevice.deviceType === '无人机') {
            var updWrjParam = {
              deviceCode: selectedDevice.deivceNo,
              deviceAddress: this.addDeviceForm.address,
              deviceBrand: this.addDeviceForm.deviceBrand,
              deviceHeight: this.addDeviceForm.height,
              deviceLatitude: this.addDeviceForm.latitude,
              deviceLongitude: this.addDeviceForm.longitude,
              deviceName: this.addDeviceForm.deviceName,
              deviceStatus: this.addDeviceForm.enable,
              expirationDate: this.addDeviceForm.qualityDate
            }
            this.$axios.post(settingApi.updateWRJ, updWrjParam).then((res) => {
              if (res && res.data && res.data.code === 0) {
                Notification({
                  title: '提示',
                  message: '修改设备成功',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.getDeviceList()
                return
              }
              Notification({
                title: '提示',
                message: '修改设备失败',
                type: 'warning',
                duration: 5 * 1000
              })
            })
          }

          if (selectedDevice.deviceType === '高点监控') {
            var updGdjkParam = {
              deviceCode: selectedDevice.deivceNo,
              deviceAddress: this.addDeviceForm.address,
              deviceBrand: this.addDeviceForm.deviceBrand,
              deviceHeight: this.addDeviceForm.height,
              deviceLatitude: this.addDeviceForm.latitude,
              deviceLongitude: this.addDeviceForm.longitude,
              deviceName: this.addDeviceForm.deviceName,
              deviceStatus: this.addDeviceForm.enable,
              expirationDate: this.addDeviceForm.qualityDate,
              deptDistrictCode: this.addDeviceForm.belongArea,
              deviceUserName: this.addDeviceForm.username,
              devicePassword: this.addDeviceForm.password,
              deviceSeatAz: this.addDeviceForm.directionAngle
            }
            this.$axios.post(settingApi.updateGDJK, updGdjkParam).then((res) => {
              if (res && res.data && res.data.code === 0) {
                Notification({
                  title: '提示',
                  message: '修改设备成功',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.getDeviceList()
                return
              }
              Notification({
                title: '提示',
                message: '修改设备失败',
                type: 'warning',
                duration: 5 * 1000
              })
            })
          }
        }
      })
    },

    // 新增/修改设备-取消
    addDeviceCancel () {
      this.showAddDevice = false
    },

    // 新增/修改设备-设备类型改变触发
    deviceTypeSelectChanged (value) {
      if (value === 'GDJK') {
        this.isGdjk = true
        this.addDeviceRules = this.addGdjkRules
      } else if (value === 'WRJ') {
        this.isGdjk = false
        this.addDeviceRules = this.addWrjRules
      }

      var p = this
      setTimeout(function () {
        p.$refs.addDeviceRef.clearValidate()
      }, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.back-sty {
  width: 150px;
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
}

.container1 {
  width: 1039px;
  height: 680px;
  margin: 52px auto 0 auto;
  border: solid 2px #39a4dd;
  border-radius: 10px;
  .boxSty1 {
    width: 991px;
    height: 626px;
    margin: 27px auto;
    .boxSty2 {
      height: 36px;
      .selectSty1 {
        /deep/.el-input__inner {
          width: 190px;
          color: #ffffff;
          border: solid 1px #1eb0fc;
          border-radius: 0;
          background-color: transparent;
          font-size: 12px;
        }
      }
    }
    .boxSty3 {
      height: 36px;
      margin-top: 15px;
      .inputSty1 {
        width: 190px;
        /deep/.el-input__inner {
          width: 190px;
          color: #ffffff;
          border: solid 1px #1eb0fc;
          border-radius: 0;
          background-color: transparent;
          font-size: 12px;
        }
      }
      .btnSty1 {
        width: 25px;
        height: 25px;
        float: right;
        margin-top: 10px;
      }
      .moreSty {
        background: url("../../../assets/images/Setting/setting-more.png")
          no-repeat;
        background-size: 100% 100%;
      }
      .refreshSty {
        background: url("../../../assets/images/Setting/setting-refresh.png")
          no-repeat;
        background-size: 100% 100%;
      }
      .searchSty {
        background: url("../../../assets/images/Setting/setting-search.png")
          no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}

.popoverBtnSty {
  background: transparent;
  color: white;
  border: 0;
  margin-left: 0px;
  border-radius: 0px;
}

.tableBox {
  margin-top: 27px;
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
    color: #ffffff;
    font-size: 14px;
    height: 26px;
    padding: 0;
    background-color: #3c9bce;
  }
  /* 表格每行高度*/
  /deep/.el-table__body td {
    height: 38px;
    padding: 0;
    background-color: #326680;
  }
  /deep/.el-table__body tr {
    color: #ffffff;
    font-size: 14px;
  }
  /* 鼠标hover每行的样式*/
  /deep/.el-table__body tr:hover > td {
    background-color: #326680;
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
  background-color: #368fbb;
}

/deep/.table-info-row-disable td {
  background: #3688b1 !important;
}
/deep/.table-info-row-enable td {
  color: white;
}

.addDeviceDlg.el-dialog__wrapper {
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    background: transparent;
    .el-dialog__body {
      display: inline-block;
      padding: 0px;
      width: 100%;
      // height: 610px;
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
        padding-bottom: 16px;
        // height: 567px;
        .subTitleSty {
          color: white;
          font-size: 14px;
          height: 34px;
          padding-left: 25px;
          padding-top: 17px;
          // background: red;
        }
        .el-form-item__label {
          color: white;
          font-size: 14px;
        }
        .el-input__inner {
          color: white;
          width: 146px;
          height: 28px;
          border: solid 1px #0fbfe0;
          background-color: transparent;
          border-radius: 0;
          font-size: 14px;
        }
      }
    }
  }
}

.npdConfirm {
  float: right;
  width: 66px;
  height: 30px;
  background: #1eb0fc;
  color: white;
  margin-right: 28px;
  font-size: 14px;
  line-height: 32px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
}
.npdCancel {
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
</style>
