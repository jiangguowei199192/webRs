<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-05 14:05:55
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-04-09 14:19:05
-->
<template>
  <div class="fireBox">
    <div class="mainBox">
      <div class="toolBox">
        <!-- <span class="tool-title">处置状态:</span> -->
        <el-select
          placeholder="处置状态"
          v-model="query.caseStatus"
          class="belongSel"
          clearable
          @change="search"
        >
          <el-option
            v-for="(item, index) in caseStatus"
            :key="index"
            :label="item.typeName"
            :value="item.typeCode"
          ></el-option>
        </el-select>
        <el-input
          class="search"
          v-model="query.content"
          placeholder="请输入案件名称/地址/描述进行搜索"
          @keyup.enter.native="search"
        ></el-input>
        <div class="btn" @click.stop="search">
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
        :query="query"
        :api="getCaseList"
        :checkedList.sync="checkedList"
        @disposeClick="disposeClick"
        @getClickRowInfo="getClickRowInfo"
      ></PageTable>
    </div>
  </div>
</template>

<script>
import PageTable from '@/components/pageTable.vue'
import { caseApi } from '@/api/case'
export default {
  name: 'casePage',

  components: { PageTable },
  data () {
    return {
      searchIcon: require('../../../assets/images/caseCenter/search.svg'),
      resetIcon: require('../../../assets/images/backgroundManagement/reset.svg'),
      checkedList: [],
      caseStatus: [
        { typeCode: 0, typeName: '未处置' },
        { typeCode: 1, typeName: '已处置' },
        { typeCode: 2, typeName: '处置中' }
      ],
      // 查询条件
      query: {
        caseStatus: '',
        content: ''
      },
      // 表格项
      tableInfo: {
        refresh: 0,
        data: [],
        fieldList: [
          { label: '案件名称', value: 'caseName' },
          { label: '举报地点', value: 'reportAddr' },
          { label: '简要描述', value: 'caseDesc' },
          { label: '案发时间', value: 'caseStartTime' },
          { label: '接案时间', value: 'createTime' },
          { label: '处置状态', value: 'caseStatus', type: 'handelStatus' }
        ]
      }
    }
  },

  mounted () {
    this.getList()
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

    // 获取案件列表
    getCaseList (params) {
      return this.$axios.post(caseApi.selectPage, params, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      })
    },

    // 按地址搜索列表
    search () {
      if (this.query.content === '' && this.query.caseStatus === '') {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '提示',
          message: '请输入查询条件 !',
          duration: 3 * 1000
        })
        return
      }
      // 重置分页
      this.tableInfo.initCurpage = Math.random()
      this.getList()
    },

    // 重置搜索
    resetSearchParams () {
      // 重置分页
      this.tableInfo.initCurpage = Math.random()
      this.query.caseStatus = ''
      this.query.content = ''
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
      margin-left: 270px;
      img {
        width: 20px;
        height: 25px;
        margin-right: 8px;
      }
    }
    .resetBtn {
      margin-left: 25px;
      img {
        width: 20px;
        height: 18px;
        margin-right: 10px;
        vertical-align: text-bottom;
      }
    }
    span {
      font-size: 16px;
    }
  }
}
</style>
