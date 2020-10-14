<template>
  <div>
    <div class="container">
      <button type="button" class="back" @click="back">
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
              class="selectSty1"
            >
              <el-option
                v-for="(item, index) in deviceTypeList"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <el-select
              v-model="onlineStatusSelected"
              placeholder="在线状态"
              clearable
              class="selectSty1"
              style="margin-left: 77px"
            >
              <el-option
                v-for="(item, index) in onlineStatusList"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <el-select
              v-model="useStatusSelected"
              placeholder="启用状态"
              clearable
              class="selectSty1"
              style="margin-left: 77px"
            >
              <el-option
                v-for="(item, index) in useStatusList"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <el-date-picker
              v-model="qualityDateSelected"
              type="date"
              placeholder="质保日期"
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
              popper-class="el-popover-more"
            >
              <div style="text-align: center">
                <el-button class="popoverBtnSty" @click="addOrChangeInputDevice"
                  >新增接入设备</el-button
                >
                <el-button class="popoverBtnSty" @click="addOrChangeInputDevice"
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
              @row-click="ClickTableRow"
              :data="deviceList"
              stripe
              empty-text="暂无数据"
              tooltip-effect="light"
            >
              <el-table-column
                label
                width="33"
                align="center"
                :resizable="false"
              >
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
              ></el-table-column>
              <el-table-column
                align="center"
                label="设备名称"
                prop="deviceName"
              ></el-table-column>
              <el-table-column
                align="center"
                label="设备编号"
                prop="deivceNo"
              ></el-table-column>
              <el-table-column
                align="center"
                label="经度"
                prop="lon"
              ></el-table-column>
              <el-table-column
                align="center"
                label="纬度"
                prop="lat"
              ></el-table-column>
              <el-table-column align="center" label="启用">
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
              ></el-table-column>
              <el-table-column
                align="center"
                label="在线状态"
                prop="onlineStatus"
              ></el-table-column>
              <el-table-column
                align="center"
                label="离线时间"
                prop="offlineTime"
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
    </div>
  </div>
</template>

<script>
// import { settingApi } from '@/api/setting'
// import { Notification } from 'element-ui'

export default {
  created () {},
  data () {
    return {
      backImg: require('../../../assets/images/Setting/setting-back.png'),

      deviceTypeSelected: '', // 设备类型
      deviceTypeList: ['设备类型1', '设备类型2'],
      onlineStatusSelected: '', // 在线状态
      onlineStatusList: ['全部', '在线', '离线'],
      useStatusSelected: '', // 启用状态
      useStatusList: ['全部', '未完善设备信息', '已完善设备信息'],
      deviceNameInput: '', // 设备名称
      deviceNoInput: '', // 设备编号
      qualityDateSelected: '', // 质保日期

      deviceList: [
        {
          deviceType: '无人机',
          deviceName: '设备名称',
          deivceNo: '0000000000',
          lon: '000.00',
          lat: '00.000',
          useStatus: false,
          deptName: '乌托邦',
          onlineStatus: '离线',
          offlineTime: '0000-00-00 00:00'
        },
        {
          deviceType: '无人机',
          deviceName: '设备名称',
          deivceNo: '0000000000',
          lon: '000.00',
          lat: '00.000',
          useStatus: false,
          deptName: '乌托邦',
          onlineStatus: '离线',
          offlineTime: '0000-00-00 00:00'
        }
      ],
      radio: '',

      pageTotal: 0,
      currentPage: 1,
      currentPageSize: 10
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    },

    refreshClick () {
      console.log('refreshClick')
    },

    searchClick () {
      console.log('searchClick')
    },

    addOrChangeInputDevice () {
      console.log('deleteInputDevice')
    },

    deleteInputDevice () {
      console.log('deleteInputDevice')
    },

    // 点击表格行
    ClickTableRow (row) {
      this.radio = this.deviceList.indexOf(row)
    },

    // 分页页数改变
    currentPageChange () {

    },

    // 激活
    async activeChange (index, row) {
      console.log(index)
      console.log(row.useStatus)
    }
  }
}
</script>

<style lang="scss" scoped>
.back {
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
}
.container {
  width: 1242px;
  height: 756px;
  margin: 55px auto 0 auto;
}
.container1 {
  width: 1039px;
  height: 680px;
  margin: 32px auto 0 auto;
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
    .tableBox {
      // background: #39a4dd;
      // height: 216px;
      margin-top: 27px;
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
</style>
