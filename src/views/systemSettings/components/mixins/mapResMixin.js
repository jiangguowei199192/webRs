
import { settingApi } from '@/api/setting'
import { backApi } from '@/api/back'
import { iconLibaryApi } from '@/api/iconLibary'
const mapResMixin = {
  data () {
    return {
      areas: [], // 辖区类型
      resTypes: [], // 资源类型
      organs: [], // 所属机构
      icons: [], // 图标
      modelList: [], // 设备类型
      organsProps: {
        expandTrigger: 'hover',
        children: 'children',
        label: 'deptName',
        value: 'deptCode',
        emitPath: false
      }
    }
  },
  methods: {
    /**
     *  获取图标库
     */
    getIconList () {
      const params = {
        pageSize: 1000,
        isQuote: '',
        currentPage: 1
      }
      this.$axios
        .post(iconLibaryApi.getAllPic, params, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.icons = res.data.data.records
          }
        })
        .catch((err) => {
          console.log('iconLibaryApi.getAllPic Err : ' + err)
        })
    },
    /**
     * 获取资源修改信息
     */
    getUpdateInfo (data) {
      const info = {
        createTime: data.createTime,
        createUser: data.createUserName,
        updateTime: data.updateTime,
        updateUser: data.updateUserName
      }
      return info
    },
    /**
     * 获取资源类型(statusEnable:是否需要字点有效)
     */
    getResources (typeCode, statusEnable = true) {
      this.$axios
        .get(settingApi.queryByTypeCode, {
          params: { typeCode: typeCode }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            if (statusEnable) { this.resTypes = res.data.data.filter(s => s.status === 0) } else this.resTypes = res.data.data
          }
        })
        .catch((err) => {
          console.log('settingApi.queryByTypeCode Err : ' + err)
        })
    },
    /**
     * 获取机构树
     */
    getOrgans () {
      this.$axios
        .post(backApi.getDeptTree)
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.organs = this.handleDeptTree(res.data.data)
          }
        })
        .catch((err) => {
          console.log('backApi.getDeptTree Err : ' + err)
        })
    },
    // children为" "时置为null
    handleDeptTree (tree) {
      tree.forEach((item) => {
        if (item.children) {
          if (item.children.length <= 0) {
            item.children = null
          } else {
            this.handleDeptTree(item.children)
          }
        }
      })
      return tree
    },
    /**
     * 获取辖区资源类型
     */
    getAreaResources () {
      this.$axios
        .get(settingApi.queryByTypeCode, {
          params: { typeCode: 'xq' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.areas = res.data.data
          }
        })
        .catch((err) => {
          console.log('settingApi.queryByTypeCode Err : ' + err)
        })
    },
    /**
     * 获取设备型号
     */
    getDeviceModels () {
      this.$axios
        .get(settingApi.queryByTypeCode, {
          params: { typeCode: 'DEV_MODEL' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.modelList = res.data.data
          }
        })
        .catch((err) => {
          console.log('settingApi.queryByTypeCode Err : ' + err)
        })
    }
  }
}

export default mapResMixin
