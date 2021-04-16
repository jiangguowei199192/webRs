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
      :row-class-name="tableRowClassName"
      @row-click="onRowClick"
      @selection-change="selectionChange"
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
            <!-- 事件配置/实时检测 -->
            <div
              v-else-if="
                (item.type == 'eventConfig'
                  ? item.type == 'eventConfig'
                  : item.type == 'realDetect') && scope.row[item.value]
              "
              :class="{
                eventBox: item.type == 'eventConfig',
                detectBox: item.type == 'realDetect'
              }"
            >
              <div v-show="scope.row[item.value].split(',').length < 2">
                <EllipsisTooltip
                  class="tool-span"
                  :contentText="scope.row[item.value]"
                ></EllipsisTooltip>
              </div>
              <div
                class="toolBox"
                v-show="scope.row[item.value].split(',').length >= 2"
              >
                <EllipsisTooltip
                  class="tool-span"
                  :contentText="scope.row[item.value].split(',')[0]"
                ></EllipsisTooltip>
                <EllipsisTooltip
                  class="tool-span"
                  :contentText="scope.row[item.value].split(',')[1]"
                ></EllipsisTooltip>
                <span class="tool-span" :title="scope.row[item.value]">
                  <EllipsisTooltip :contentText="'...'"></EllipsisTooltip>
                </span>
              </div>
            </div>
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
          <div class="handleBox">
            <template v-for="(item, index) in handle.btList">
              <!-- 操作按钮 -->
              <span
                class="handle-btn"
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
import EllipsisTooltip from '@/components/ellipsisTooltip'
// import { EventBus } from '@/utils/eventBus.js'

export default {
  name: 'PageTable',
  components: {
    EllipsisTooltip
  },
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
        pageSizes: [15, 30, 50, 100], // 分页数量列表
        query: {
          // 查询条件
          currentPage: 1, // 当前页
          pageSize: 15 // 每页条数
        }
      },
      serverUrl: globalApi.headImg,
      picList: '',
      tagBtns: [],
      selectDevice: ''
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

  mounted () {
    setTimeout(() => {
      var btns = document.querySelectorAll('.handle-btn')
      var result = []
      btns.forEach(t => {
        if (t.innerText === '实时检测' || t.innerText === '事件配置') {
          result.push(t)
        }
      })
      for (let i = 0; i < result.length; i += 2) {
        this.tagBtns.push(result.slice(i, i + 2))
      }
      this.tagBtns.map((item, index) => {
        return Object.assign(item, { t_index: index })
      })
      // console.log(this.tagBtns)
    }, 300)
  },

  methods: {
    /**
     *  给row添加索引
     */
    tableRowClassName ({ row, rowIndex }) {
      row.row_index = rowIndex
    },
    /**
     *  row点击
     */
    onRowClick (row) {
      this.$emit('onRowClick', row)
    },
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
      // console.log(data)
      if (data.column.label === '状态') {
        if (data.row.alarmStatus === '误报') return 'color: #ee2618'
        else return 'color: #18ee58'
      } else if (data.column.label === '操作') {
        // console.log("操作");
      } else return ''

      this.tagBtns.forEach(t => {
        // 无人机/下线/空设备
        if (
          (data.row.deviceTypeCode === 'WRJ' && t.t_index === data.rowIndex) ||
          (data.row.deviceTypeCode === 'GDJK' &&
            (data.row.onlineStatus === 'offline' ||
              data.row.onlineStatus === 'empty') &&
            t.t_index === data.rowIndex)
        ) {
          t.map(r => {
            r.style.display = 'none'
            return r.style
          })
        }
        if (
          data.row.deviceTypeCode === 'GDJK' &&
          data.row.onlineStatus === 'online' &&
          t.t_index === data.rowIndex
        ) {
          t.map(r => {
            r.style.display = ''
            return r.style
          })
        }
        // 高点在线设备
        if (
          data.row.deviceTypeCode === 'GDJK' &&
          data.row.deviceStatus === false &&
          t.t_index === data.rowIndex
        ) {
          t.map(r => {
            r.style.background = '#ff0000'
            r.style.opacity = '0.75'
            r.style.cursor = 'not-allowed'
            r.style.pointerEvents = 'none'
            return r.style
          })
        }
        if (
          data.row.deviceTypeCode === 'GDJK' &&
          data.row.deviceStatus === true &&
          t.t_index === data.rowIndex
        ) {
          t.map(r => {
            r.style.background = ''
            r.style.opacity = ''
            r.style.cursor = ''
            r.style.pointerEvents = ''
            return r.style
          })
        }
      })
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
  .handleBox {
    .handle-btn {
      display: inline-block;
      // width: 40px;
      padding: 0 5px;
      height: 26px;
      background: #0b779e;
      cursor: pointer;
      font-size: 14px;
      color: #fefefe;
      line-height: 26px;
    }
    .handle-btn:not(:last-child) {
      margin-right: 15px;
    }
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
  .eventBox,
  .detectBox {
    .tool-span {
      display: inline-block;
      width: 80px;
      height: 26px;
      line-height: 26px;
      color: #fff;
      background-color: #00b7ff;
      font-size: 14px;
      margin-right: 5px;
    }
    .toolBox > .tool-span:nth-child(3) {
      width: 40px;
      font-size: 20px;
      cursor: progress;
    }
  }
  .detectBox {
    .tool-span {
      color: #c5f3ff;
      background-color: transparent;
      border: 1px solid #0b779e;
      border-radius: 4px;
    }
  }
}

/deep/::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
</style>
