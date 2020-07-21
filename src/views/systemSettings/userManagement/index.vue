<template>
  <div>
    <div class="container">
      <button type="button" class="back" @click="back">
        <img :src="backImg">
        用户管理
      </button>
      <div class="rightBox">
        <el-input v-model="searchInput" class="searchInput">
          <template slot="prepend">用户名：</template>
        </el-input>
        <button type="button" class="more" @click="more()">
          <img :src="moreImg">
        </button>
        <button type="button" class="more" @click="download()">
          <img :src="downloadImg">
        </button>
        <button type="button" class="more" @click="refresh()">
          <img :src="refreshImg">
        </button>
        <button type="button" class="more" @click="search()">
          <img :src="searchImg">
        </button>
        <div class="tableBox">
          <el-table @row-click="ClickTableRow" :data="tableData" stripe empty-text="no data" tooltip-effect="light">
            <el-table-column label width="33" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index">{{''}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户" prop="userName"></el-table-column>
            <el-table-column align="center" label="职位" prop="position"></el-table-column>
            <el-table-column align="center" label="手机号" prop="phoneNumber"></el-table-column>
            <el-table-column align="center" label="所属部门" prop="department"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  style="width: 80px;">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
          class="tablePagination"
          popper-class="pageSelect"
          :total="pageData.total"
          :page-size="pageData.pageSize"
          layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.pageData.total = this.tableData.length
  },
  data () {
    return {
      searchInput: '',
      backImg: require('../../../assets/images/Setting/setting-back.png'),
      moreImg: require('../../../assets/images/Setting/setting-more.png'),
      downloadImg: require('../../../assets/images/Setting/setting-download.png'),
      searchImg: require('../../../assets/images/Setting/setting-search.png'),
      refreshImg: require('../../../assets/images/Setting/setting-refresh.png'),
      pageData: {
        total: 0,
        pageSize: 4
      },
      radio: -1,
      tableData: [ // 测试数据
        {
          userName: '王小虎',
          position: '队长',
          phoneNumber: '88888888888',
          department: '炊事班',
          selected: true
        },
        {
          userName: '王小虎',
          position: '队长',
          phoneNumber: '88888888888',
          department: '炊事班',
          selected: true
        },
        {
          userName: '王小虎',
          position: '队长',
          phoneNumber: '88888888888',
          department: '炊事班',
          selected: true
        },
        {
          userName: '王小虎',
          position: '队长',
          phoneNumber: '88888888888',
          department: '炊事班',
          selected: true
        },
        {
          userName: '王小虎',
          position: '队长',
          phoneNumber: '88888888888',
          department: '炊事班',
          selected: true
        },
        {
          userName: '王小虎',
          position: '队长',
          phoneNumber: '88888888888',
          department: '炊事班',
          selected: true
        },
        {
          userName: '王小虎',
          position: '队长',
          phoneNumber: '88888888888',
          department: '炊事班',
          selected: true
        },
        {
          userName: '王小虎',
          position: '队长',
          phoneNumber: '88888888888',
          department: '炊事班',
          selected: true
        }
      ]
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    },
    /**
     * 点击表格行
     */
    ClickTableRow (row) {
      this.radio = this.tableData.indexOf(row)
    },
    search () {
      console.log('search')
    },
    refresh () {
      console.log('refresh')
    },
    download () {
      console.log('download')
    },
    more () {
      console.log('more')
    }
  }
}
</script>

<style lang="scss" scoped>
  .back {
    width: 170px;
    height: 40px;
    border: solid 1px #39a4dd;
    font-size: 18px;
    color: #ffffff;
    background-color: transparent;
    outline: none;
    display: block;
  }
  .container {
    width: 1242px;
    height: 756px;
    margin: 55px auto 0 auto;
  }
  .rightBox {
    width: 796px;
    height: 682px;
    border: solid 2px #39a4dd;
    border-radius: 10px;
    margin: 30px auto 0 auto;
    .searchInput {
      width: 253px;
      margin: 21px 0px 0px 20px;
      // background-color: transparent;
    }
    .more {
      width: 25px;
      height: 25px;
      background-color: transparent;
      outline: none;
      float: right;
      margin: 28px 20px 0px 0px;
      border: 0;
    }
    .tableBox {
      width: 760px;
      height: 598px;
      margin: 12px auto 20px auto;
    }
  }
  .el-input {
    /deep/ .el-input__inner {
      background-color: transparent;
      font-size: 12px;
      color: white;
      border-radius: 0;
      border: 0;
      border-bottom: solid 1px #368fbb;
    }
    /deep/ .el-input-group__prepend {
      background-color: transparent;
      font-size: 12px;
      color: white;
      border-radius: 0;
      border: 0;
      border-bottom: solid 1px #368fbb;
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
</style>
