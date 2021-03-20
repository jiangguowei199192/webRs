<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-05 14:05:55
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-20 16:56:54
-->
<template>
  <div class="fireBox">
    <div class="mainBox">
      <div class="toolBox">
        <!-- <span class="tool-title">处置状态:</span> -->
        <el-select
          placeholder="案件所属"
          v-model="search.belong"
          class="belongSel"
          clearable
        >
          <el-option
            v-for="(item, index) in deptTree"
            :key="index"
            :label="item.typeName"
            :value="item.typeCode"
          ></el-option>
        </el-select>
        <el-input
          class="search"
          v-model="queryParams.searchStr"
          placeholder="请输入案件名称/地址/描述进行搜索"
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
        @disposeClick="disposeClick"
        @getClickRowInfo="getClickRowInfo"
      ></PageTable>
    </div>
  </div>
</template>

<script>
import PageTable from '@/components/pageTable.vue'

export default {
  name: 'casePage',

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
          reportAddr: ''
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
      searchIcon: require('../../../assets/images/caseCenter/search.svg'),
      resetIcon: require('../../../assets/images/caseCenter/select.svg'),
      checkedList: [],
      queryParams: { dateRange: [], searchStr: '' },
      deptTree: [
        { typeCode: 'YASZDWLX', typeName: '预案设置单位类型' },
        { typeCode: 'dept_type', typeName: '组织类型' }
      ],
      search: {
        belong: '',
        date: '',
        other: ''
      }
    }
  },

  mounted () {},

  methods: {
    //  获取列表
    getList () {
      this.tableInfo.refresh = Math.random()
    },

    //  清空选中
    clearSelection () {
      this.$refs.pageTable.clearSelection()
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
      this.query.reportAddr = this.queryParams.searchStr
      this.getList()
    },

    // 重置搜索
    resetSearchParams () {
      this.dateRange = []
      this.queryParams.searchStr = ''
      this.query.timeBegin = this.query.timeEnd = this.query.reportAddr = ''
      this.getList()
    },

    // 单击处置按钮
    disposeClick (index, data) {
      this.$emit('handelDisposeClick', index, data)
    },

    // 单击表格行
    getClickRowInfo (data) {
      this.$emit('handelClickRowInfo', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.mainBox {
  padding: 0;
  .toolBox {
    margin: 18px 0 10px 0;
    font-size: 16px;
    .tool-title {
      margin: 0 8px 0 5px;
    }
    .belongSel,
    .search {
      margin-right: 15px;
      /deep/.el-input__inner {
        color: #c5f3ff;
        border: solid 1px #1eb0fc;
        border-radius: 0;
        background-color: transparent;
        font-size: 15px;
      }
    }
    .btn {
      margin-left: 212px;
      img {
        width: 20px;
        height: 25px;
        margin-right: 8px;
      }
    }
    .resetBtn {
      margin-left: 25px;
      img {
        width: 12px;
        height: 10px;
        margin-right: 10px;
      }
    }
    span {
      font-size: 16px;
    }
  }
}
</style>
