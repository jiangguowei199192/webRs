<template>
  <div>
    <div class="container">
      <button type="button" class="back" @click="back">
        <img :src="backImg">
        火情报警
      </button>
      <div class="rightBox">
        <div class="dateBox">
          <el-date-picker
            v-model="date1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="datePickerStyle">
          </el-date-picker>
        </div>
        <div class="tableBox">
          <el-table @row-click="ClickTableRow" :data="tableData" stripe empty-text="no data" tooltip-effect="light">
            <el-table-column label width="33" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index">{{''}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center" label="报警时间" prop="policeTime"></el-table-column>
            <el-table-column align="center" label="报警地点" prop="address"></el-table-column>
            <el-table-column align="center" label="类型" prop="type"></el-table-column>
            <el-table-column align="center" label="报警图片" prop="image"></el-table-column>
            <el-table-column align="center" label="报警设备" prop="equipment"></el-table-column>
            <el-table-column align="center" label="状态" prop="status"></el-table-column>
            <el-table-column align="center" label="确认时间" prop="confirmTime"></el-table-column>
            <!-- <el-table-column align="center" label="激活">
              <template slot-scope="scope">
                <el-switch v-model="tableData[scope.$index].active"></el-switch>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
        <div class="pageStyle">
          <el-pagination
            class="tablePagination"
            popper-class="pageSelect"
            :total="pageData.total"
            :page-size="pageData.pageSize"
            layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      title="火情详情"
      :visible.sync="showFireDetail"
      width="30%"
      class="dialogStyle">
      <div class="fireDetailDialogContent">
        <div class="textDiv1">
          <div class="textDiv2">接警时间：</div>
          <div class="textDiv3">123</div>
        </div>
        <div class="textDiv1">
          <div class="textDiv2">类型：</div>
          <div class="textDiv3">123</div>
        </div>
        <div class="textDiv1">
          <div class="textDiv2">报警设备：</div>
          <div class="textDiv3">123</div>
        </div>
        <div>
          <div class="textDiv4">报警图片</div>
          <div class="textDiv5">
            <el-image fit="fill" :lazy="true" :src="fireDetailInfo.image1" style="width: 196px; height: 151px; margin-top: 3px; margin-left: 5px;"></el-image>
            <el-image fit="fill" :lazy="true" :src="fireDetailInfo.image2" style="width: 196px; height: 151px; margin-top: 3px; margin-left: 5px;"></el-image>
          </div>
        </div>
        <div>
          <div class="textDiv6">报警地点：XXXXXXXXXX</div>
          <div class="textDiv5">
            <div style="width: 395px; height: 147px; background-color: gray; margin:6px 8px 5px 7px;">
              <gMap
                ref="gduMap"
                handleType="devMap"
                :bShowSimpleSearchTools="false"
                :bShowBasic="false"
                :bShowMeasure="false"
              ></gMap>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmFireDetail(true)" class="trueBtn">确 认</el-button>
        <el-button @click="confirmFireDetail(false)" class="falseBtn">误 报</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  created () {
    this.pageData.total = this.tableData.length
  },
  data () {
    return {
      backImg: require('../../../assets/images/Setting/setting-back.png'),
      date1: '',
      radio: -1,
      tableData: [ // 测试数据
        {
          policeTime: '2020-6-3 09:09:09',
          address: '武汉市洪山区黄龙山南路6号',
          type: '火警',
          image: '',
          equipment: '高点1号',
          status: '确认',
          confirmTime: '2020-6-3 09:10:10'
        }
      ],
      pageData: {
        total: 0,
        pageSize: 4
      },
      showFireDetail: false,
      fireDetailInfo: {
        image1: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        image2: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    },
    // 点击表格行
    ClickTableRow (row) {
      this.radio = this.tableData.indexOf(row)
      this.showFireDetail = true
    },
    // 确认、误报
    confirmFireDetail (isTrue) {
      console.log(isTrue)
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
  }
  .dateBox {
    width: 760px;
    margin: 20px auto 0 auto;
    .datePickerStyle {
      background-color: transparent;
      border-color: #39a4dd;
    }
    /deep/.el-date-editor .el-range-input {
      color: white;
      background: transparent;
    }
    /deep/.el-range-separator {
      color: white;
    }
  }
  .tableBox {
    width: 760px;
    margin: 12px auto 20px auto;
  }
  .pageStyle {
    width: 760px;
    margin: 0 auto 0 auto;
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
      background-color: #39a4dd;
    }
    /deep/.el-dialog__title {
      color: white;
      font-size: 18px;
      font-weight: bold;
    }
    /deep/.el-dialog__body {
      background-color: #336984;
    }
    /deep/.el-dialog__footer {
      background-color: #336984;
    }
    /deep/.el-icon-close:before {
      color: white;
    }
    .trueBtn {
      background-color: #1eb0fc;
      font-size: 14px;
      color: white;
      width: 66px;
      height: 30px;
      padding: 0;
    }
    .falseBtn {
      background-color: transparent;
      font-size: 14px;
      color: #1eb0fc;
      width: 66px;
      height: 30px;
      padding: 0;
      border-color: #1eb0fc;
    }
    .fireDetailDialogContent {
      // background-color: burlywood;
      width: 410px;
      margin: 0 auto;
    }
    .textDiv1 {
      height: 47px;
      line-height: 47px;
      display: flex;
    }
    .textDiv2 {
      width: 70px;
      min-width: 70px;
      color: white;
      font-size: 14px;
      text-align: right;
    }
    .textDiv3 {
      height: 40px;
      width: 340px;
      border-bottom: solid 1px white;
      color: white;
      font-size: 14px;
    }
    .textDiv4 {
      width: 56px;
      color: white;
      font-size: 14px;
      margin-top: 10px;
    }
    .textDiv5 {
      height: 158px;
      margin-top: 7px;
      border: solid 1px #39a4dd;
      border-radius: 4px;
    }
    .textDiv6 {
      color: white;
      font-size: 14px;
      margin-top: 10px;
    }
  }
</style>
