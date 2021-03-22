<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_2.0
 * @Author: liangkaiLee
 * @Date: 2021-02-24 15:57:19
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-22 16:25:22
-->
<template>
  <div class="fireBox">
    <div class="mainBox">
      <div>{{ subTitle }}</div>
      <div class="toolBox">
        <span style=" margin: 0 8px 0 5px;">报警时间:</span>
        <el-date-picker
          class="datePickerStyle"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="dateRange"
          @change="dateSearchChange"
        ></el-date-picker>
        <el-input
          style="margin-left: 10px;"
          class="search"
          v-model="queryParams.searchStr"
          placeholder="请输入地址进行搜索"
          @keyup.enter.native="addressSearchChange"
        ></el-input>
        <div class="btn" @click.stop="addressSearchChange">
          <img :src="searchIcon" />
          <span>搜索</span>
        </div>
        <div class="btn resetBtn" @click.stop="resetSearchParams">
          <img :src="resetIcon" />
          <span>重置</span>
        </div>
      </div>
      <div class="tablTool">
        <!-- <div class="left">
          <span>已选</span>
          <span>{{ checkedList.length }}</span>
          <span>项</span>
          <span @click.stop="clearSelection">清空</span>
        </div>
        <div class="right">
          <span style="width:96px;" @click.stop="onExportExcel">导出</span>
        </div> -->
      </div>
      <PageTable
        ref="pageTable"
        id="pageTable"
        :checkBox="true"
        :refresh="tableInfo.refresh"
        :initCurpage="tableInfo.initCurpage"
        :fieldList="tableInfo.fieldList"
        :handle="tableInfo.handle"
        :data.sync="tableInfo.data"
        :tableHeight="610"
        :query="query"
        :api="api"
        :checkedList.sync="checkedList"
        @imgClick="imgClick"
      ></PageTable>
    </div>
  </div>
</template>

<script>
import PageTable from './pageTable.vue'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'

export default {
  name: 'firePage',

  components: { PageTable },

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
          timeBegin: '',
          timeEnd: '',
          alarmAddress: ''
        }
      }
    },
    tableInfo: {
      type: Object,
      default: () => {
        return {
          refresh: 1,
          initCurpage: 1,
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
      checkedList: [],
      dateRange: [],
      queryParams: { dateRange: [], searchStr: '' }
    }
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

    // 单击图片
    imgClick (info) {
      this.$emit('handelImgClick', info)
    },

    // 按日期搜索列表
    dateSearchChange () {
      if (this.queryParams.dateRange) {
        this.query.timeBegin = this.dateRange[0].getTime()
        this.query.timeEnd = this.dateRange[1].getTime()
        this.tableInfo.initCurpage = Math.random()
        this.getList()
      }
    },

    // 按地址搜索列表
    addressSearchChange () {
      if (this.queryParams.searchStr.length <= 0) {
        this.$notify.warning({
          title: '提示',
          message: '请输入地址后查询 !',
          duration: 3 * 1000
        })
        return
      }
      this.query.alarmAddress = this.queryParams.searchStr
      this.getList()
    },

    // 重置搜索
    resetSearchParams () {
      this.dateRange = []
      this.queryParams.searchStr = ''
      this.query.timeBegin = this.query.timeEnd = this.query.alarmAddress = ''
      this.getList()
    }

    // 导出excel
    // onExportExcel () {
    //   const xlsxParam = { raw: true }
    //   const wb = XLSX.utils.table_to_book(
    //     document.querySelector('#pageTable'),
    //     xlsxParam
    //   )
    //   const wbout = XLSX.write(wb, {
    //     bookType: 'xlsx',
    //     bookSST: true,
    //     type: 'array'
    //   })
    //   try {
    //     FileSaver.saveAs(
    //       new Blob([wbout], { type: 'application/octet-stream;charset=utf-8' }),
    //       'fileInfo.xlsx'
    //     )
    //   } catch (e) {
    //     if (typeof console !== 'undefined') console.log(e, wbout)
    //   }
    //   return wbout
    // }
  }
}
</script>

<style lang="scss" scoped>
.fireBox {
  .toolBox {
    margin: 18px 0 16px 0;
    .datePickerStyle {
      width: 360px;
      height: 34px;
      background-color: rgba(9, 84, 109, 0.3);
      border-color: #39a4dd;
      border-radius: 0px;
      border: 1px solid #1eb0fc;
      vertical-align: top;
      padding: 3px 5px;
    }
    /deep/.el-input__inner {
      color: #c5f3ff;
    }
    /deep/.el-date-editor .el-range-input {
      color: #c5f3ff;
      background: transparent;
      font-size: 14px;
    }
    /deep/.el-range-separator {
      color: white;
      font-size: 12px;
      line-height: 26px;
    }
    /deep/.el-input__prefix,
    /deep/.el-input__icon {
      line-height: 26px;
    }
    /deep/.el-cascader .el-input .el-input__inner {
      background-color: rgba(9, 84, 109, 0.3);
      border-color: #39a4dd;
      border-radius: 0px;
      width: 360px;
    }
  }
}
</style>
