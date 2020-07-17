<template>
  <div>
    <div class="container">
      <button type="button" class="back" @click="back">
        <img :src="backImg">
        组织管理
      </button>
      <div class="container1">
        <div class="leftBox"></div>
        <div class="rightBox">
          <button type="button" class="addUser" @click="addUser">添加用户</button>
          <div class="tableBox">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column label="用户" prop="userName">
                <!-- <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template> -->
              </el-table-column>
              <el-table-column label="职位" prop="position">
                <!-- <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>姓名: {{ scope.row.name }}</p>
                    <p>住址: {{ scope.row.address }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                  </el-popover>
                </template> -->
              </el-table-column>
              <el-table-column label="手机号" prop="phoneNumber"></el-table-column>
              <el-table-column label="所属部门" prop="department"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)" style="width: 55px;">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination class="tablePagination" popper-class="pageSelect"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      backImg: require('../../../assets/images/Setting/setting-back.png'),
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
        }
      ]
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    },
    addUser () {
      console.log('添加用户')
    }
  }
}
</script>

<style lang="scss" scoped>
  .back {
    width: 134px;
    height: 40px;
    border: solid 1px #39a4dd;
    font-size: 18px;
    color: #ffffff;
    background-color: rgba($color: #000000, $alpha: 0.1);
    outline: none;
    display: block;
  }
  .container {
    width: 1242px;
    height: 756px;
    margin: 55px auto 0 auto;
  }
  .container1 {
    width: 1048px;
    height: 685px;
    margin: 30px auto 0 auto;
  }
  .leftBox {
    width: 220px;
    height: 682px;
    border: solid 2px #39a4dd;
    border-radius: 10px;
    float: left;
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
      background-color: rgba($color: #000000, $alpha: 0.1);
      outline: none;
      display: block;
      float: right;
      margin: 21px 18px 0px 0px;
    }
    .tableBox {
      width: 760px;
      height: 598px;
      margin: 58px auto 20px auto;
      background-color: lightblue;
    }
  }
</style>
