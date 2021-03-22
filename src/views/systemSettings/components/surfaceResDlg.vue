<template>
  <div>
    <ResDialog
      :title="title"
      :drawType="2"
      :isShow.sync="isShow"
      @mapResAddOrModify="mapResAddOrModify"
      @submitResForm="submitResForm"
      ref="resDlg"
      :isRead="disabled"
    >
      <div slot="content" class="lineContent mapResForm">
        <div class="pTitle">
          <span></span>
          <span>面资源信息</span>
        </div>
        <el-form
          :model="resForm"
          :inline="true"
          label-width="90px"
          style="margin-top: 17px"
          :rules="formRules"
          ref="areaForm"
        >
          <el-form-item label="资源名称 :" prop="resourcesName">
            <el-input
              v-show="!disabled"
              v-model="resForm.resourcesName"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              class="lineName"
              maxlength="20"
            ></el-input>
            <EllipsisTooltip
              v-show="disabled"
              :contentText="resForm.resourcesName"
              :outerShellWidth="377"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="资源类型 :" prop="resourcesType">
            <el-select
              v-show="!disabled"
              v-model="resForm.resourcesType"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
              :disabled="disabled"
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
              step-strictly
              @change="lineWidthChange()"
            ></el-input-number>
            <el-input
              v-show="disabled"
              v-model="resForm.lineWidth"
              :placeholder="placeholder"
              :disabled="true"
              class="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="填充颜色 :" prop="fillColor">
            <el-color-picker
              v-model="resForm.fillColor"
              show-alpha
              :disabled="disabled"
              @change="fillColorChange()"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="排序 :" prop="resourcesSort">
            <el-input
              v-model="resForm.resourcesSort"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
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
import { mapResApi } from '@/api/mapRes'
import mapResMixin from './mixins/mapResMixin'
import { copyData, arrToStr } from '@/utils/public'
import { numberValidate, checkPhone } from '@/utils/formRules'
export default {
  mixins: [mapResMixin],
  data () {
    return {
      disabled: false, // 是否禁止编辑
      placeholder: '请输入',
      placeholder2: '请选择',
      title: '新增面资源',
      isShow: false,
      areaID: '',
      formRules: {
        resourcesName: [{ required: true, message: '请输入资源名称' }],
        resourcesType: [{ required: true, message: '请选择资源类型' }],
        belongOrg: [{ required: true, message: '请选择所属机构' }],
        lineWidth: [{ required: true, message: '请输入线宽' }],
        lineColor: [{ required: true, message: '请选择线段颜色' }],
        contactTel: [checkPhone()],
        resourcesSort: numberValidate('请输入数字')
      },
      isUpdate: false,
      deptName: '',
      belongAreaName: '',
      resourcesTypeName: '',
      pointIds: [], // 标识点
      resForm: {
        resourcesName: '',
        resourcesType: '',
        contactTel: '',
        belongOrg: '',
        belongArea: '',
        resourcesSort: '',
        resourcesRemark: '',
        lineWidth: 2,
        lineColor: 'rgba(0, 204, 255, 1)',
        fillColor: 'rgba(0, 204, 255, 0.4)',
        longitudeLatitudeArray: ''
      }
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
      this.getResources('surface_resources')
      this.getAreaResources()
      this.getOrgans()
      this.getIconList()
    },
    /**
     *  重置数据
     */
    resetData () {
      this.$refs.areaForm.resetFields()
      this.$refs.markerForm.resetData()
      this.areaID = ''
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
      this.getResources('surface_resources')
      this.getAreaResources()
      this.getOrgans()
      this.getIconList()
      const addDTOS = data.resourcesPointAddDTOS
      this.$nextTick(() => {
        this.disabled = false
        this.resetData()
        // 设置面资源信息
        copyData(data, this.resForm)
        // 防止资源类型、所属机构、所属辖区的字典项不存在
        if (!data.belongAreaName) this.resForm.belongArea = ''
        if (!data.resourcesTypeName) this.resForm.resourcesType = ''
        if (!data.deptName) this.resForm.belongOrg = ''
        this.resForm.id = data.id
        this.areaID = data.id
        // 设置标记点信息
        if (addDTOS && addDTOS.length > 0) {
          addDTOS.forEach((c) => {
            this.pointIds.push(c.id)
          })
          this.$refs.markerForm.addPoints(addDTOS, true)
        }
      })
      // 在地图上添加面
      this.addAreaAndMarkersInMap(addDTOS)
    },
    /**
     *  面线段宽度改变
     */
    lineWidthChange () {
      if (!this.resForm.lineWidth) return
      this.resForm.lineWidth = Math.round(this.resForm.lineWidth)
      this.lineStyleChange()
    },
    /**
     *  面填充颜色改变
     */
    fillColorChange () {
      const data = {
        drawId: this.areaID,
        drawType: 2,
        fillStyle: { color: this.resForm.fillColor }
      }
      this.$refs.resDlg.addOrUpdateFeature(data)
    },
    /**
     *  面线段样式改变
     */
    lineStyleChange () {
      const data = {
        drawId: this.areaID,
        drawType: 2,
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
      if (data.drawType === 2) {
        this.areaID = data.drawId
        this.resForm.longitudeLatitudeArray = arrToStr(data.coordinates)
        // 重新画面资源的时候，需要设置样式
        if (data.bIsAdd) {
          const me = this
          setTimeout(() => {
            const d = {
              drawId: me.areaID,
              drawType: 2,
              strokeStyle: {
                color: me.resForm.lineColor,
                width: me.resForm.lineWidth
              },
              fillStyle: { color: me.resForm.fillColor }
            }
            me.$refs.resDlg.addOrUpdateFeature(d)
          }, 20)
        }
      } else if (data.drawType === 0) {
        this.$refs.markerForm.addOrModifyPoint(data)
      }
    },
    /**
     *  在地图上添加面和标记点
     */
    addAreaAndMarkersInMap (addDTOS) {
      setTimeout(() => {
        const d = {
          drawId: this.areaID,
          drawType: 2,
          // eslint-disable-next-line no-eval
          coordinates: eval(this.resForm.longitudeLatitudeArray),
          strokeStyle: {
            color: this.resForm.lineColor,
            width: this.resForm.lineWidth
          },
          fillStyle: { color: this.resForm.fillColor }
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
        // 设置面资源信息
        copyData(data, this.resForm)
        this.areaID = data.id
        this.belongAreaName = data.belongAreaName
        this.deptName = data.deptName
        this.resourcesTypeName = data.resourcesTypeName
        // 设置标记点信息
        if (addDTOS && addDTOS.length > 0) {
          this.$refs.markerForm.addPoints(addDTOS)
        }
      })
      // 在地图上添加面
      this.addAreaAndMarkersInMap(addDTOS)
    },
    /**
     *  更新面资源
     */
    updateAreaRes () {
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
     *  添加或修改面资源
     */
    addOrUpdate () {
      let url = mapResApi.areaResUpdate
      if (!this.isUpdate) {
        delete this.resForm.id
        url = mapResApi.areaResAdd
      }
      delete this.resForm.resourcesPointAddDTOS
      delete this.resForm.areaPointUpdateDTOS
      const pointList = this.$refs.markerForm.getList()
      if (pointList.length > 0) {
        if (this.isUpdate) {
          this.resForm.areaPointUpdateDTOS = pointList
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
     *  删除标识点
     */
    removeMarker (id) {
      this.$refs.resDlg.removeFeatureByID(id)
    },
    /**
     *  提交点资源数据
     */
    submitResForm () {
      const count = this.$refs.resDlg.getFeatureSize(2)
      if (count <= 0) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '提示',
          message: '图上未标注资源，请标注后进行保存'
        })
        return
      }
      let vSurface = ''
      this.$refs.areaForm.validate((valid) => {
        vSurface = valid
      })
      const vMarker = this.$refs.markerForm.formValid()
      if (vSurface && vMarker) {
        if (this.isUpdate) {
          this.updateAreaRes()
        } else this.addOrUpdate()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lineContent {
  .lineName {
    /deep/ .el-input__inner {
      width: 393px;
    }
  }
}
</style>
