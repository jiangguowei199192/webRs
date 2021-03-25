<template>
  <div>
    <ResDialog
      :title="title"
      :drawType="1"
      :isShow.sync="isShow"
      @mapResAddOrModify="mapResAddOrModify"
      @submitResForm="submitResForm"
      ref="resDlg"
      :isRead="disabled"
    >
      <div slot="content" class="lineContent mapResForm">
        <div class="pTitle">
          <span></span>
          <span>线资源信息</span>
        </div>
        <el-form
          :model="resForm"
          :inline="true"
          :rules="formRules"
          ref="lineForm"
        >
          <el-form-item label="资源名称 :" prop="resourcesName">
            <EllipsisTooltip
              v-show="disabled"
              :contentText="resForm.resourcesName"
              :outerShellWidth="377"
            ></EllipsisTooltip>
            <el-input
              v-show="!disabled"
              v-model="resForm.resourcesName"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              class="lineName"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源类型 :" prop="resourcesType">
            <el-select
              v-show="!disabled"
              v-model="resForm.resourcesType"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
            >
              <el-option
                v-for="item in resTypes"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              ></el-option>
            </el-select>
            <EllipsisTooltip
              v-show="disabled"
              :contentText="resourcesTypeName"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="联系电话 :" prop="contactTel">
            <el-input
              v-model="resForm.contactTel"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属机构 :" prop="belongOrg">
            <el-cascader
              v-show="!disabled"
              v-model="resForm.belongOrg"
              :placeholder="placeholder2"
              :options="organs"
              :props="organsProps"
              :show-all-levels="false"
              :class="{ active: !disabled }"
            ></el-cascader>
            <EllipsisTooltip
              v-show="disabled"
              :contentText="deptName"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="所属辖区 :" prop="belongArea">
            <el-select
              v-show="!disabled"
              v-model="resForm.belongArea"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
            >
              <el-option
                v-for="item in areas"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              ></el-option>
            </el-select>
            <EllipsisTooltip
              v-show="disabled"
              :contentText="belongAreaName"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="起点 :">
            <el-input
              v-show="!disabled"
              v-model="resForm.lineOrigin"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              maxlength="20"
            ></el-input>
            <EllipsisTooltip
              v-show="disabled"
              :contentText="resForm.lineOrigin"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="终点 :">
            <el-input
              v-show="!disabled"
              v-model="resForm.lineDestination"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              maxlength="20"
            ></el-input>
            <EllipsisTooltip
              v-show="disabled"
              :contentText="resForm.lineDestination"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="总长度 :" prop="totalLength">
            <el-input
              v-model="resForm.totalLength"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              class="length"
            ></el-input>
            <span class="unit">千米</span>
          </el-form-item>
          <el-form-item label="排序 :" prop="resourcesSort">
            <el-input
              v-model="resForm.resourcesSort"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="线段颜色 :" prop="lineColor">
            <el-color-picker
              v-model="resForm.lineColor"
              show-alpha
              :disabled="disabled"
              @change="lineStyleChange()"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="线宽 :" prop="lineWidth">
            <el-input-number
              v-show="!disabled"
              v-model="resForm.lineWidth"
              :min="1"
              :max="10"
              :step="1"
              step-strictly
              @change="lineStyleChange()"
            ></el-input-number>
            <el-input
              v-show="disabled"
              v-model="resForm.lineWidth"
              :placeholder="placeholder"
              :disabled="true"
              class="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注 :" class="note">
            <el-input
              v-model="resForm.resourcesRemark"
              :placeholder="placeholder"
              type="textarea"
              resize="none"
              :disabled="disabled"
              :class="{ active: !disabled }"
              maxlength="500"
            ></el-input>
          </el-form-item>
        </el-form>
        <div>
          <PointMarkerForm
            ref="markerForm"
            :areas="areas"
            :organs="organs"
            :icons="icons"
            @removeFeature="removeMarker"
            @updatePointStyle="updatePointStyle"
            :disabled="disabled"
          ></PointMarkerForm>
        </div>
      </div>
    </ResDialog>
  </div>
</template>

<script>
import ResDialog from './resDialog.vue'
import EllipsisTooltip from './ellipsisTooltip.vue'
import PointMarkerForm from './pointMarkerForm.vue'
import { numberValidate, checkPhone, maxNumValidate } from '@/utils/formRules'
import mapResMixin from './mixins/mapResMixin'
import { copyData, arrToStr } from '@/utils/public'
import { mapResApi } from '@/api/mapRes'
export default {
  mixins: [mapResMixin],
  data () {
    return {
      disabled: false, // 是否禁止编辑
      placeholder: '请输入',
      placeholder2: '请选择',
      title: '新增线资源',
      isShow: false,
      formRules: {
        resourcesName: [{ required: true, message: '请输入资源名称' }],
        resourcesType: [{ required: true, message: '请选择资源类型' }],
        belongOrg: [{ required: true, message: '请选择所属机构' }],
        lineWidth: [{ required: true, message: '请输入线宽' }],
        lineColor: [{ required: true, message: '请选择线段颜色' }],
        totalLength: numberValidate('请输入正确的总长度').concat(
          maxNumValidate('总长度超出范围', 100000)
        ),
        contactTel: [checkPhone()],
        resourcesSort: numberValidate('请输入数字')
      },
      resForm: {
        resourcesName: '',
        resourcesType: '',
        contactTel: '',
        belongOrg: '',
        belongArea: '',
        lineOrigin: '',
        lineDestination: '',
        resourcesDataType: 1,
        totalLength: '',
        resourcesSort: '',
        resourcesRemark: '',
        lineWidth: 2,
        lineColor: 'rgba(0, 204, 255, 1)',
        longitudeLatitudeArray: ''
      },
      lineId: '',
      isUpdate: false,
      deptName: '',
      resourcesTypeName: '',
      belongAreaName: '',
      pointIds: [] // 标识点
    }
  },
  watch: {
    disabled (val) {
      this.placeholder = val ? '' : '请输入'
      this.placeholder2 = val ? '' : '请选择'
    }
  },
  components: {
    ResDialog,
    PointMarkerForm,
    EllipsisTooltip
  },
  methods: {
    /**
     *  添加资源
     */
    addRes () {
      this.isShow = true
      this.isUpdate = false
      this.$nextTick(() => {
        this.disabled = false
        this.resetData()
      })
      this.getResources('line_resources')
      this.getAreaResources()
      this.getOrgans()
      this.getIconList()
    },
    /**
     *  重置数据
     */
    resetData () {
      this.$refs.lineForm.resetFields()
      this.$refs.markerForm.resetData()
      this.lineId = ''
    },
    /**
     *  更新点样式
     */
    updatePointStyle (data) {
      this.$refs.resDlg.addOrUpdateFeature(data)
    },
    /**
     *  修改资源
     */
    updateRes (data) {
      this.isShow = true
      this.isUpdate = true
      this.pointIds = []
      this.getResources('line_resources')
      this.getAreaResources()
      this.getOrgans()
      this.getIconList()
      const addDTOS = data.resourcesPointAddDTOS
      this.$nextTick(() => {
        this.disabled = false
        this.resetData()
        // 设置线资源信息
        copyData(data, this.resForm)
        // 防止资源类型、所属机构、所属辖区的字典项不存在
        if (!data.belongAreaName) this.resForm.belongArea = ''
        if (!data.resourcesTypeName) this.resForm.resourcesType = ''
        if (!data.deptName) this.resForm.belongOrg = ''
        this.resForm.id = data.id
        this.lineId = data.id
        // 设置标记点信息
        if (addDTOS && addDTOS.length > 0) {
          addDTOS.forEach((c) => {
            this.pointIds.push(c.id)
          })
          this.$refs.markerForm.addPoints(addDTOS, true)
        }
      })
      // 在地图上添加线
      this.addLineAndMarkersInMap(addDTOS)
    },
    /**
     *  在地图上添加线和标记点
     */
    addLineAndMarkersInMap (addDTOS) {
      setTimeout(() => {
        const d = {
          drawId: this.lineId,
          drawType: 1,
          // eslint-disable-next-line no-eval
          coordinates: eval(this.resForm.longitudeLatitudeArray),
          strokeStyle: {
            color: this.resForm.lineColor,
            width: this.resForm.lineWidth
          }
        }
        this.$refs.resDlg.addOrUpdateFeature(d)
        const styles = this.$refs.markerForm.getStyleList()
        styles.forEach((c) => {
          this.$refs.resDlg.addOrUpdateFeature(c)
        })
      }, 100)
    },
    /**
     *  查看资源
     */
    lookRes (data) {
      this.isShow = true
      const info = this.getUpdateInfo(data)
      this.$refs.resDlg.showInfos(info)
      const addDTOS = data.resourcesPointAddDTOS
      this.$nextTick(() => {
        this.disabled = true
        this.resetData()
        // 设置线资源信息
        copyData(data, this.resForm)
        this.lineId = data.id
        this.belongAreaName = data.belongAreaName
        this.deptName = data.deptName
        this.resourcesTypeName = data.resourcesTypeName
        // 设置标记点信息
        if (addDTOS && addDTOS.length > 0) {
          this.$refs.markerForm.addPoints(addDTOS)
        }
      })
      // 在地图上添加线
      this.addLineAndMarkersInMap(addDTOS)
    },
    /**
     *  线段样式改变
     */
    lineStyleChange () {
      if (!this.resForm.lineWidth) return
      this.resForm.lineWidth = Math.round(this.resForm.lineWidth)
      const data = {
        drawId: this.lineId,
        drawType: 1,
        strokeStyle: {
          color: this.resForm.lineColor,
          width: this.resForm.lineWidth
        }
      }
      this.$refs.resDlg.addOrUpdateFeature(data)
    },
    /**
     *  地图资源添加或修改
     */
    mapResAddOrModify (data) {
      if (data.drawType === 0) {
        this.$refs.markerForm.addOrModifyPoint(data)
      } else if (data.drawType === 1) {
        this.lineId = data.drawId
        this.resForm.longitudeLatitudeArray = arrToStr(data.coordinates)
        this.resForm.totalLength = data.length.toFixed(2)
        this.$refs.lineForm.validateField('totalLength', (valid) => {})
        // 重新画线资源的时候，需要设置样式
        if (data.bIsAdd) {
          const me = this
          setTimeout(() => {
            const d = {
              drawId: me.lineId,
              drawType: 1,
              strokeStyle: {
                color: me.resForm.lineColor,
                width: me.resForm.lineWidth
              }
            }
            me.$refs.resDlg.addOrUpdateFeature(d)
          }, 20)
        }
      }
    },
    /**
     *  更新线资源
     */
    updateLineRes () {
      // 删除标记点
      if (this.pointIds.length > 0) {
        const param = { ids: this.pointIds }
        this.$axios
          .post(mapResApi.batchDelPoint, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then((res) => {
            if (res && res.data && res.data.code === 0) {
              this.addOrUpdate()
            }
          })
          .catch((err) => {
            console.log('mapResApi.batchDelPoint Err : ' + err)
          })
      } else this.addOrUpdate()
    },
    /**
     *  添加或修改线资源
     */
    addOrUpdate () {
      let url = mapResApi.lineResUpdate
      if (!this.isUpdate) {
        delete this.resForm.id
        url = mapResApi.lineResAdd
      }
      delete this.resForm.resourcesPointAddDTOS
      delete this.resForm.linePointUpdateDTOS
      const pointList = this.$refs.markerForm.getList()
      if (pointList.length > 0) {
        if (this.isUpdate) {
          this.resForm.linePointUpdateDTOS = pointList
        } else this.resForm.resourcesPointAddDTOS = pointList
      }
      this.$axios
        .post(url, this.resForm, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.isShow = false
            this.$emit('refreshTable')
          }
        })
        .catch((err) => {
          console.log(url + ' Err : ' + err)
        })
    },
    /**
     *  提交点资源数据
     */
    submitResForm () {
      const count = this.$refs.resDlg.getFeatureSize(1)
      if (count <= 0) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '提示',
          message: '图上未标注资源，请标注后进行保存'
        })
        return
      }
      let vLine = ''
      this.$refs.lineForm.validate((valid) => {
        vLine = valid
      })
      const vMarker = this.$refs.markerForm.formValid()
      if (vLine && vMarker) {
        if (this.isUpdate) {
          this.updateLineRes()
        } else this.addOrUpdate()
      }
    },
    /**
     *  删除标识点
     */
    removeMarker (id) {
      this.$refs.resDlg.removeFeatureByID(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.lineContent {
  width: 496px;
  height: 447px;
  /deep/.el-form {
    margin-top: 17px;
  }
  .lineName {
    /deep/ .el-input__inner {
      width: 393px;
    }
  }
  /deep/.length.el-input {
    width: auto;
    .el-input__inner {
      width: 120px;
    }
  }
  .unit {
    font-size: 12px;
    color: #fff;
    margin-left: 6px;
  }
}
</style>
