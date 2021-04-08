<template>
  <div class="tableBox" :class="className">
    <!-- 显示表格 -->
    <el-table
      class="manageTable listScroll"
      ref="table"
      :data="data"
      style="width: 100%"
      :height="tableHeight"
      :row-style="changeRowStyle"
      :cell-style="changeCellStyle"
      @selection-change="selectionChange"
      @row-click="getClickRowInfo"
    >
      <el-table-column
        v-if="checkBox"
        :key="'selection'"
        type="selection"
        width="55"
      />
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        :prop="item.value"
        :label="item.label"
        align="center"
        :width="item.width"
        :min-width="item.minWidth || '100px'"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <template v-if="item.formatter">
            <span> {{ item.formatter(scope.row) }}</span>
          </template>
          <template v-else>
            <el-switch
              v-if="item.type === 'switch'"
              :active-value="item.active"
              :inactive-value="item.inactive"
              v-model="scope.row[item.value]"
              @change="switchClick($event, scope.row)"
            ></el-switch>
            <!-- 图片 -->
            <div
              v-else-if="item.type === 'dictIcon' && scope.row[item.value]"
              class="picBox"
            >
              <img :src="serverUrl + scope.row[item.value]" />
            </div>
            <div
              v-else-if="item.type === 'fireImage' && scope.row[item.value]"
              class="picBox"
            >
              <img
                v-for="(pic_item, pic_index) in picList"
                :key="pic_index"
                :src="pic_item.picPath"
                @click.stop="imgClick(scope.row)"
              />
            </div>
            <!-- 处置 -->
            <span
              v-else-if="item.type === 'handelStatus' && scope.row[item.value]"
              class="handelBtn"
              :class="{
                inActiveColor: scope.row[item.value] == '未处置',
                activedColor: scope.row[item.value] == '已处置',
                activingColor: scope.row[item.value] == '处置中'
              }"
              @click.stop="disposeClick(scope.$index, scope.row)"
              >{{ scope.row[item.value] }}</span
            >
            <span v-else>
              {{ scope.row[item.value] }}
            </span>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="handle"
        :key="'handle'"
        :fixed="handle.fixed"
        align="center"
        :label="handle.label"
        :width="handle.width"
      >
        <template v-slot="scope">
          <div class="handerBox">
            <template v-for="(item, index) in handle.btList">
              <!-- 操作按钮 -->
              <span
                class="btn"
                :key="index"
                @click="handleClick(item.event, scope.row)"
                >{{ item.label }}</span
              >
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <template v-if="pager">
      <el-pagination
        style="text-align: center"
        class="tablePagination"
        popper-class="pageSelect"
        :current-page.sync="listInfo.query.currentPage"
        :page-sizes="listInfo.pageSizes"
        :page-size="listInfo.query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listInfo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
  </div>
</template>

<script>
import globalApi from '@/utils/globalApi'
import { timeFormat } from '@/utils/date'

export default {
  name: 'PageTable',
  props: {
    // 自定义类名
    className: {
      type: String
    },
    // 刷新
    refresh: {
      type: Number,
      default: 0
    },
    // 表格高度
    tableHeight: {
      type: Number
    },
    // 获取数据的接口
    api: {
      type: Function
    },
    // 是否有选择框
    checkBox: {
      type: Boolean,
      default: false
    },
    // 选中列表
    checkedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格字段配置
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作栏配置
    handle: {
      type: Object
    },
    // 是否分页
    pager: {
      type: Boolean,
      default: true
    },
    // 重置当前页
    initCurpage: {
      type: Number
    },
    // 查询条件
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 列表数据
    data: {
      type: Array
    }
  },
  data () {
    return {
      // 列表相关
      listInfo: {
        tableHeight: 0, // 表格最大高度
        total: 0, // 总条数
        pageSizes: [15, 20, 50, 100], // 分页数量列表
        query: {
          // 查询条件
          currentPage: 1, // 当前页
          pageSize: 15 // 每页条数
        }
      },
      serverUrl: globalApi.headImg,
      picList: ''
    }
  },
  watch: {
    initCurpage () {
      this.listInfo.query.currentPage = 1
    },
    refresh () {
      if (!this.api) return
      this.getList(this.api)
    }
  },

  methods: {
    /**
     *  修改表格row样式
     */
    changeRowStyle (data) {
      // console.log(data)
      let style = {}
      if (data.row.alarmId || data.row.typeCode) {
        style = {
          height: '45px',
          fontSize: '15px'
        }
      }
      return style
    },
    /**
     *  修改表格cell样式
     */
    changeCellStyle (data) {
      if (data.column.label === '状态') {
        if (data.row.alarmStatus === '误报') return 'color: #ee2618'
        else return 'color: #18ee58'
      } else return ''
    },
    /**
     *  清空选中
     */
    clearSelection () {
      this.$refs.table.clearSelection()
    },
    /**
     *  派发按钮点击事件
     */
    handleClick (event, data) {
      this.$emit('handleClick', event, data)
    },
    /**
     * 开关控制点击
     */
    switchClick (event, data) {
      this.$emit('switchClick', event, data)
    },
    /**
     *  图标点击
     */
    imgClick (data) {
      this.$emit('imgClick', data)
    },
    /**
     *  处置按钮点击
     */
    disposeClick (index, data) {
      this.$emit('disposeClick', index, data)
    },
    /**
     *  表格行点击
     */
    getClickRowInfo (row) {
      this.$emit('getClickRowInfo', row)
    },
    /**
     *  处理参数
     */
    handleParams () {
      const obj = {}
      for (const key in this.query) {
        if (this.query[key] || this.query[key] === 0) {
          obj[key] = this.query[key]
        }
      }
      // 如果不需要分页，则无分页相关参数
      return this.pager ? { ...this.listInfo.query, ...obj } : obj
    },
    /**
     *  得到数据
     */
    getList (api) {
      // 每次调用接口时都自动绑定最新的数据
      api(this.handleParams())
        .then(res => {
          if (res.data.code === 0) {
            // 使外面可以访问到表格数据
            if (res.data.data.data) {
              const arr = res.data.data.data
              arr.forEach(d => {
                if (d.deviceStatus === 'enabled') {
                  d.deviceStatus = true
                } else if (d.deviceStatus === 'disabled') {
                  d.deviceStatus = false
                }
                if (d.alarmStatus === 'confirmed') {
                  d.alarmStatus = '确认'
                } else if (d.alarmStatus === 'mistaken') {
                  d.alarmStatus = '误报'
                }
                if (d.alarmTime) {
                  d.alarmTime = timeFormat(d.alarmTime)
                }
                if (d.updateTime) {
                  d.updateTime = timeFormat(d.updateTime)
                }
                if (d.alarmPicList) {
                  d.alarmPicList.forEach(
                    t => (t.picPath = this.serverUrl + t.picPath)
                  )
                  this.picList = d.alarmPicList
                }
              })
              const paginator = res.data.data.paginator
              this.$emit('update:data', arr)
              if (this.pager) {
                this.listInfo.total = paginator.totalCount
                this.listInfo.query.currentPage = paginator.page
                this.listInfo.query.pageSize = paginator.limit
              }
            } else if (res.data.data.records) {
              const arr = res.data.data.records
              const paginator = res.data.data
              this.$emit('update:data', arr)
              if (this.pager) {
                this.listInfo.total = paginator.total
                this.listInfo.query.currentPage = paginator.current
                this.listInfo.query.pageSize = paginator.size
              }
              arr.forEach(r => {
                if (r.caseStatus === '0') {
                  r.caseStatus = '未处置'
                } else if (r.caseStatus === '1') {
                  r.caseStatus = '已处置'
                } else if (r.caseStatus === '2') {
                  r.caseStatus = '处置中'
                }
              })
              // 默认选中首行
              this.getClickRowInfo(arr[0])
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     *  表格选中变化
     */
    selectionChange (val) {
      this.$emit('update:checkedList', val)
    },
    handleSizeChange (val) {
      const query = this.listInfo.query
      query.pageSize = val
      query.currentPage = 1 // 每页条数切换，重置当前页
      this.getList(this.api)
    },
    handleCurrentChange (val) {
      this.listInfo.query.currentPage = val
      this.getList(this.api)
    }
  }
}
</script>

<style lang="scss" scoped>
.tableBox {
  // background-color: rgba(0, 65, 87, 0.6);
  background: url(../assets/images/caseCenter/table_wrap.svg) no-repeat
    center/100% 100%;
  height: 839px;
  padding: 10px 10px 0 10px;
  .btn {
    display: inline-block;
    width: 46px;
    height: 26px;
    background: #0b779e;
    cursor: pointer;
    font-size: 14px;
    color: #fefefe;
    line-height: 26px;
  }
  .btn:not(:last-child) {
    margin-right: 18px;
  }
  .picBox {
    display: flex;
    justify-content: space-around;
    img {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }
  .handelBtn {
    display: inline-block;
    width: 74px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #fefefe;
    cursor: pointer;
  }
  .activedColor {
    background: #02b337;
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.7;
  }
  .inActiveColor {
    background: #af0e03;
  }
  .activingColor {
    background: #b35802;
  }
  .tablePagination {
    height: 35px;
    line-height: 35px;
    margin-top: 40px;
  }
  .manageTable.el-table {
    height: 740px;
  }
}
</style>
