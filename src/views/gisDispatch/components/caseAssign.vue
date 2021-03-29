<template>
  <el-dialog :visible="isShow" class="caseAssign browserScroll">
    <div>
      <div class="title">案件分派</div>
      <div class="btns">
        <span @click.stop="cancel()">取消</span>
        <span @click.stop="submit()">确定</span>
      </div>
      <div class="content">
        <div class="left">
          <div class="radius">
            <span class="lTxt">范围：</span>
            <el-input v-model="radius" @change="radiusChange"></el-input>
            <span>km</span>
            <div class="rTxt">
              <span>共</span>
              <span class="lTxt">{{members.length}}</span>
              <span>条</span>
            </div>
          </div>
          <el-input
            @change="getUserList()"
            v-model="search"
            class="search"
            placeholder="请输入姓名/身份证号进行搜索"
          >
            <i slot="suffix"></i
          ></el-input>
          <div class="list listScroll">
            <template v-for="(item, index) in members">
              <div :key="index">
                <span
                  :class="{ check: item.isCheck }"
                  class="checkBox"
                  @click.stop="selectPeople(item)"
                ></span>
                <img src="../../../assets/images/gisDispatch/user.png" />
                <EllipsisTooltip
                  :contentText="item.employeeName + ' ' + item.deptName"
                  class="name"
                ></EllipsisTooltip>
              </div>
            </template>
          </div>
        </div>
        <div class="right">
          <gMap
            ref="gduMap"
            handleType="devMap"
            :bShowAllTools="false"
            :bShowLonLat="false"
            :baseMapIndex="2"
            :bAutoLocate="false"
            class="map"
          ></gMap>
          <div class="select listScroll">
            <template v-for="(item, index) in selectList">
              <div :key="index">
                <img src="../../../assets/images/gisDispatch/user.png" />
                <EllipsisTooltip
                  :contentText="item.employeeName"
                  class="name"
                ></EllipsisTooltip>
                <span class="close" @click.stop="deleteSelect(item)"></span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import EllipsisTooltip from '../../../components/ellipsisTooltip'
import { caseApi } from '@/api/case'
import assignMixin from '../mixins/assignMixin'
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    caseInfo: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  mixins: [assignMixin],
  components: {
    EllipsisTooltip
  },
  data () {
    return {
      msg: '',
      userId: '',
      username: '',
      radius: '',
      members: []
    }
  },
  watch: {
    isShow (val) {
      if (val) {
        this.radius = ''
        this.selectList = []
        setTimeout(() => {
          if (!this.$refs.gduMap) return
          this.$refs.gduMap.map2D._map.updateSize()
          this.$refs.gduMap.map2D.gisDispatchManager.removeAll()
          this.$refs.gduMap.map2D.gisDispatchManager.addDatas([this.caseInfo])
          this.$refs.gduMap.mapMoveTo(
            this.caseInfo.longitude,
            this.caseInfo.latitude
          )
          this.$refs.gduMap.map2D.setZoom(12)
          if (this.radius) {
            this.$refs.gduMap.map2D.gisDispatchManager.addOrUpdateFence(
              this.caseInfo,
              this.radius * 1000
            )
          }
        }, 200)
        this.getUserList()
      }
    }
  },
  beforeDestroy () {
    if (this.$refs.gduMap) {
      this.$refs.gduMap.map2D.gisDispatchManager.removeAll()
    }
    window.onresize = null
  },
  mounted () {},
  methods: {
    /**
     * 取消
     */
    cancel () {
      this.$emit('update:isShow', false)
    },
    /**
     * 分派
     */
    submit () {
      if (this.selectList.length === 0) {
        this.$notify.closeAll()
        this.$notify.info({ title: '提示', message: '请选择分派人员' })
        return
      }
      const ids = []
      this.selectList.forEach((item) => {
        ids.push(item.id)
      })
      this.$axios
        .post(
          caseApi.caseAssign,
          {
            caseId: this.caseInfo.id,
            userIds: ids
          },
          {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.$emit('update:isShow', false)
          }
        })
        .catch((err) => {
          console.log('caseApi.caseAssign Err : ' + err)
        })
    },
    /**
     * 刷新地图尺寸
     */
    mapUpdateSize () {
      if (this.$refs.gduMap) {
        this.$refs.gduMap.map2D._map.updateSize()
      }
    },
    /**
     * 获取组织人员完毕回调
     */
    getMembersDone () {
      if (!this.$refs.gduMap) return
      if (this.radius && !isNaN(this.radius)) {
        this.$refs.gduMap.map2D.gisDispatchManager.addDatasInRadius(
          this.peoples,
          this.caseInfo,
          this.radius * 1000
        )
        this.members = []
        this.peoples.forEach((l) => {
          if (l.inRadius) {
            this.members.push(l)
          }
        })
      } else this.members = this.peoples
    },
    /**
     * 范围改变
     */
    radiusChange () {
      if (!this.$refs.gduMap) return

      let valid = true
      if (!isNaN(this.radius)) {
        if (this.radius < 0 || this.radius > 10) valid = false
      } else valid = false

      if (!valid) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '提示',
          message: '周边范围请输入0-10有效数字'
        })
      } else {
        this.$refs.gduMap.map2D.gisDispatchManager.addOrUpdateFence(
          this.caseInfo,
          this.radius * 1000
        )
        this.getMembersDone()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.caseAssign {
  pointer-events: auto;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  /deep/.el-dialog {
    width: 857px;
    overflow: hidden;
    background: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      height: 562px;
      padding: 21px 0px 0px 0px;
      border: 1px solid #00a7e8;
      box-sizing: border-box;
      background-color: rgba($color: #004157, $alpha: 0.85);
    }
    .title {
      margin-left: 21px;
      width: 218px;
      height: 30px;
      background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
      font-size: 18px;
      color: #fefefe;
      padding-left: 17px;
      line-height: 30px;
      margin-bottom: 9px;
    }
    .btns {
      position: absolute;
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      border-top: 1px solid #00d2ff;
      bottom: 0px;
      right: 0px;
      text-align: right;
      padding-top: 14px;
      padding-right: 21px;
      span {
        cursor: pointer;
        box-sizing: border-box;
        display: inline-block;
        width: 87px;
        height: 32px;
        border: 1px solid #1eb0fc;
        border-radius: 2px;
        line-height: 32px;
        text-align: center;
        background: transparent;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #1eb0fc;
      }
      span:active {
        opacity: 0.8;
        color: #1eb0fc;
      }
      span:nth-child(2) {
        margin-left: 20px;
        background: #1eb0fc;
        color: #fff;
      }
    }
    .content {
      display: flex;
      box-sizing: border-box;
      margin-top: 19px;
      height: 430px;
      .left {
        box-sizing: border-box;
        width: 322px;
        border-right: 1px solid #00d2ff;
        padding-left: 39px;
        .radius {
          display: flex;
          color: #fff;
          position: relative;
          margin-right: 19px;
          .lTxt {
            color: #00d2ff;
          }
          .rTxt {
            position: absolute;
            right: 0px;
          }
          .el-input {
            width: 50px;
            margin-left: 3px;
            .el-input__inner {
              background-color: transparent;
              border-radius: 0px;
              border: none;
              border-bottom: 1px solid #fff;
              box-sizing: border-box;
              height: 20px;
              color: #fff;
              padding: 0px 5px;
              text-align: center;
            }
          }
        }
        .search {
          margin-top: 13px;
          box-sizing: border-box;
          width: 264px;
          .el-input__suffix {
            width: 16px;
            height: 21px;
            background: url("../../../assets/images/gisDispatch/search.svg");
            background-size: 100% 100%;
            top: 4px;
            right: 14px;
          }
          .el-input__inner {
            color: #fff;
            height: 30px;
            line-height: 30px;
            border: 1px solid #00a7e8;
            border-radius: 0px;
            background: transparent;
          }
        }
        .list {
          box-sizing: border-box;
          margin-top: 6px;
          height: 338px;
          overflow-y: auto;
          > div {
            display: flex;
            box-sizing: border-box;
            margin-top: 8px;
            height: 20px;
            align-items: center;
            .name {
              font-size: 14px;
              color: #fff;
              width: 210px;
              height: 20px;
            }
            img {
              width: 12px;
              height: 18px;
              margin-right: 12px;
            }
            .checkBox {
              display: inline-block;
              width: 14px;
              height: 14px;
              cursor: pointer;
              background: url(../../../assets/images/gisDispatch/uncheck.svg)
                no-repeat;
              background-size: 100% 100%;
              margin-right: 14px;
            }
            .checkBox.check {
              background: url(../../../assets/images/gisDispatch/check.svg)
                no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
      .right {
        width: 500px;
        box-sizing: border-box;
        margin-left: 13px;
        .map {
          height: 320px;
        }
        .select {
          box-sizing: border-box;
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          overflow-y: auto;
          height: 96px;
          > div {
            box-sizing: border-box;
            width: 108px;
            height: 38px;
            background: #00d2ff;
            border-radius: 2px;
            position: relative;
            margin-right: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
          }
          img {
            margin-left: 14px;
            margin-right: 12px;
            width: 12px;
            height: 18px;
          }
          .name {
            font-size: 14px;
            color: #fff;
            width: 60px;
            height: 20px;
          }
          .close {
            display: inline-block;
            height: 10px;
            width: 10px;
            background: url(../../../assets/images/gisDispatch/x.svg) no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 2px;
            right: 2px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
