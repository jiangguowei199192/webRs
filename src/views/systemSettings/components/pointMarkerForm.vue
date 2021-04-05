<template>
  <div class="listForm">
    <div class="pTitle" v-show="list.length > 0">
      <span></span>
      <span>标识点信息 </span>
    </div>
    <template v-for="(item, index) in list">
      <div :key="index">
        <span
          class="del"
          @click.stop="deleteMarker(item)"
          v-show="!disabled"
        ></span>
        <el-form
          :model="item"
          :inline="true"
          :rules="formRules"
          ref="markerForm"
        >
          <el-form-item label="名称 :" prop="pointName">
            <el-input
              v-show="!disabled"
              v-model="item.pointName"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              maxlength="20"
            ></el-input>
            <EllipsisTooltip
              class="nameTooltip"
              v-show="disabled"
              :contentText="item.pointName"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="地址 :">
            <el-input
              v-show="!disabled"
              v-model="item.pointAddr"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              maxlength="50"
            ></el-input>
            <EllipsisTooltip
              class="nameTooltip"
              v-show="disabled"
              :contentText="item.pointAddr"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="所属机构 :" prop="belongOrg">
            <el-cascader
              v-show="!disabled"
              v-model="item.belongOrg"
              :placeholder="placeholder2"
              :options="organs"
              :props="organsProps"
              :show-all-levels="false"
              :class="{ active: !disabled }"
            ></el-cascader>
            <EllipsisTooltip
              class="nameTooltip"
              v-show="disabled"
              :contentText="item.deptName"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="所属辖区 :">
            <el-select
              v-show="!disabled"
              v-model="item.belongArea"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
              :disabled="disabled"
            >
              <el-option
                v-for="item in areas"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              ></el-option>
            </el-select>
            <EllipsisTooltip
              class="nameTooltip"
              v-show="disabled"
              :contentText="item.belongAreaName"
            ></EllipsisTooltip>
          </el-form-item>
          <el-form-item label="经度 :" prop="longitude">
            <el-input
              v-model="item.longitude"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              @change="lanChange(item, index)"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度 :" prop="latitude">
            <el-input
              v-model="item.latitude"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              @change="lanChange(item, index)"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标 :" class="iconItem" prop="iconUrl">
            <div class="iconTool">
              <img :src="item.iconPath || defIcon" class="icon" />
              <el-popover
                placement="top"
                trigger="click"
                popper-class="iconPopover"
                v-model="item.showPopover"
                v-if="!disabled"
              >
                <div class="iconBox webFsScroll">
                  <span
                    @click.stop="selectIcon(item, icon, index)"
                    class="icon"
                    v-for="(icon, index2) in icons"
                    :key="index2"
                    :style="{
                      background:
                        'url(' + serverUrl + icon.iconPath + ') no-repeat',
                    }"
                  ></span>
                </div>
                <div class="chooseBox" slot="reference">
                  <el-image class="btn" :src="chooseIcon"></el-image>
                  <span>选择图标</span>
                </div>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item label="排序 :" prop="pointSort">
            <el-input
              v-model="item.pointSort"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注 :">
            <el-input
              v-model="item.pointRemark"
              :placeholder="placeholder"
              type="textarea"
              resize="none"
              :disabled="disabled"
              :class="{ active: !disabled }"
              maxlength="500"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </div>
</template>

<script>
import {
  isNotNull,
  lonValidate,
  latValidate,
  numberValidate
} from '@/utils/formRules'
import { copyData } from '@/utils/public'
import globalApi from '@/utils/globalApi'
import EllipsisTooltip from '../../../components/ellipsisTooltip'
export default {
  props: {
    // 是否禁止编辑
    disabled: {
      type: Boolean,
      default: false
    },
    // 所属辖区
    areas: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 所属机构
    organs: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 图标库
    icons: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    EllipsisTooltip
  },
  data () {
    return {
      defIcon: require('../../../assets/images/backgroundManagement/nopicture.png'),
      ptStyles: [],
      serverUrl: globalApi.headImg,
      placeholder: '请输入',
      placeholder2: '请选择',
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      point: {
        id: '',
        pointName: '',
        pointAddr: '',
        belongOrg: '',
        belongArea: '',
        pointRemark: '',
        pointSort: '',
        longitude: '',
        latitude: '',
        iconUrl: '',
        showPopover: false
      },
      list: [],
      organsProps: {
        expandTrigger: 'hover',
        children: 'children',
        label: 'deptName',
        value: 'deptCode',
        emitPath: false,
        checkStrictly: true
      },
      formRules: {
        pointName: [{ required: true, message: '请输入资源名称' }],
        belongOrg: [{ required: true, message: '请选择所属机构' }],
        iconUrl: [{ required: true, message: '请选择图标' }],
        longitude: isNotNull('请输入经度').concat(lonValidate()),
        latitude: isNotNull('请输入纬度').concat(latValidate()),
        pointSort: numberValidate('请输入数字')
      }
    }
  },
  watch: {
    disabled (val) {
      this.placeholder = val ? '' : '请输入'
      this.placeholder2 = val ? '' : '请选择'
    }
  },
  methods: {
    /**
     *  标记点添加或修改
     */
    addOrModifyPoint (data) {
      const a = this.list.find((c) => c.id === data.drawId)
      const lon = data.coordinates[0].toFixed(7)
      const lat = data.coordinates[1].toFixed(7)
      if (a !== undefined) {
        a.lon = lon
        a.lat = lat
        return
      }
      var point = JSON.parse(JSON.stringify(this.point))
      point.id = data.drawId
      point.longitude = lon
      point.latitude = lat
      this.list.push(point)
    },
    lanChange (item, index) {
      let latV = true
      let lonV = true
      this.$refs.markerForm[index].validateField('latitude', (valid) => {
        if (valid) latV = false
      })
      this.$refs.markerForm[index].validateField('longitude', (valid) => {
        if (valid) lonV = false
      })
      if (latV && lonV) {
        const data = {
          drawId: item.id,
          drawType: 0,
          coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)]
        }
        this.$emit('updatePointStyle', data)
      }
    },
    /**
     *  选择图标
     */
    selectIcon (item, icon, index) {
      item.showPopover = false
      item.iconUrl = icon.iconPath
      item.iconPath = this.serverUrl + icon.iconPath
      this.$refs.markerForm[index].validateField('iconUrl', (valid) => {})
      const data = {
        drawId: item.id,
        drawType: 0,
        pointStyle: {
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: item.iconPath // 图片url
        }
      }
      this.$emit('updatePointStyle', data)
    },
    /**
     *  添加标记点
     */
    addPoints (addDTOS, isUpdate = false) {
      addDTOS.forEach((c) => {
        var pt = JSON.parse(JSON.stringify(this.point))
        copyData(c, pt)
        if (pt.iconUrl) {
          pt.iconPath = this.serverUrl + pt.iconUrl
        }
        if (!isUpdate) {
          pt.deptName = c.deptName
          pt.belongAreaName = c.belongAreaName
        } else {
          // 防止所属辖区、所属机构的字典项不存在
          if (!c.belongAreaName) pt.belongArea = ''
          if (!c.deptName) pt.belongOrg = ''
        }
        this.list.push(pt)
        const point = {
          drawId: c.id,
          drawType: 0,
          coordinates: [c.longitude, c.latitude],
          pointStyle: {
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: this.serverUrl + c.iconUrl // 图片url
          }
        }
        this.ptStyles.push(point)
      })
    },
    /**
     *  获取标记点样式
     */
    getStyleList () {
      return this.ptStyles
    },
    /**
     *  获取标记点列表
     */
    getList () {
      if (this.list.length > 0) {
        this.list.forEach((c) => {
          delete c.id
          delete c.iconPath
          delete c.showPopover
          c.longitude = parseFloat(c.longitude)
          c.latitude = parseFloat(c.latitude)
        })
      }
      return this.list
    },
    /**
     *  删除标记点
     */
    deleteMarker (item) {
      this.$confirm('确定要删除此标识点吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(() => {
          const index = this.list.indexOf(item)
          if (index !== -1) {
            this.$emit('removeFeature', item.id)
            this.list.splice(index, 1)
          }
        })
        .catch(() => {})
    },
    /**
     *  表单验证
     */
    formValid () {
      const vList = []
      let i = 0
      for (; i < this.list.length; i++) {
        this.$refs.markerForm[i].validate((valid) => {
          vList.push(valid)
        })
      }
      const result = vList.every((v) => v === true)
      return result
    },
    /**
     *  重置数据
     */
    resetData () {
      let i = 0
      for (; i < this.list.length; i++) {
        this.$refs.markerForm[i].resetFields()
      }
      this.list = []
      this.ptStyles = []
    }
  }
}
</script>

<style lang="scss" scoped>
.listForm {
  .iconItem {
    line-height: 40px;
    margin-bottom: 11px;
  }
  .iconTool {
    margin-bottom: 4px;
  }
}
</style>
