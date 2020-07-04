import { api } from '@/api/videoSystem/realVideo'
const videoMixin = {
  data () {
    return {
      idStart: 0,
      showLeft: true, // 是否展开左侧部分
      showRight: true, // 是否展开右侧部分
      index: 0, // 默认展示已选 0已选 1全部
      selectedIndex: '9', // 激活已选择
      input: '', // 设备名称
      treeData: [], // 设备tree数据
      ninePalace: require('../../../assets/images/9.png'),
      fourPalace: require('../../../assets/images/4.png'),
      onePalace: require('../../../assets/images/1.png'),
      playAll: require('../../../assets/images/play-all.png'),
      fullScreen: require('../../../assets/images/full-screen.png')
    }
  },

  methods: {
    closeLeftNav (type) {
      this.showLeft = type !== 1
    },
    closeRightInfo (type) {
      this.showRight = type !== 1
    },
    // 点击按钮
    changeStatus (type, index) {
      if (type === 1) {
        this.listArray[index].visibleIsClick = true
      } else {
        this.listArray[index].infraredIsclick = true
      }
      this.selectedIndex = index
    },

    /**
     * 递归解析设备
     */
    parseDeviceList (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children) { this.parseDeviceList(data[i].children) }
        if (data[i].deviceList.length > 0) {
          if (!data[i].children) data[i].children = []
          data[i].deviceList.forEach(d => {
            data[i].children.push(d)
          })
        }
        delete data[i].deviceList
      }
      return data
    },

    /**
     * 设置设备树节点的ID
     */
    setDeviceTreeNodeID (tree) {
      if (tree == null) return
      for (var i = 0; i < tree.length; i++) {
        Reflect.set(tree[i], 'id', this.idStart)
        this.idStart += 1
        this.setDeviceTreeNodeID(tree[i].children, this.idStart)
      }
    },

    /**
     * 获取所有设备
     */
    getAllDeptDevices () {
      this.$axios.get(api.getDeptsAndDevicesAxios).then(res => {
        if (res && res.data && res.data.code === 0) {
          var data = res.data.data
          // 修改属性名称
          data = JSON.parse(JSON.stringify(data).replace(/deviceTypeName/g, 'label'))
          data = JSON.parse(JSON.stringify(data).replace(/deptName/g, 'label'))
          data = JSON.parse(JSON.stringify(data).replace(/deviceName/g, 'label'))
          data = JSON.parse(JSON.stringify(data).replace(/streamName/g, 'label'))
          data = JSON.parse(JSON.stringify(data).replace(/streamList/g, 'children'))
          data = JSON.parse(JSON.stringify(data).replace(/subDept/g, 'children'))
          data.forEach(p => {
            p = JSON.parse(JSON.stringify(p).replace('deviceList', 'children'))
            p.children = this.parseDeviceList(p.children)
            var total = 0
            var online = 0
            p.children.forEach(c => {
              total += c.deviceCountTotal
              online += c.deviceCountOnline
            })
            Reflect.set(p, 'deviceCountTotal', total)
            Reflect.set(p, 'deviceCountOnline', online)
            this.treeData.push(p)
          })
          this.setDeviceTreeNodeID(this.treeData)

          // console.log(this.treeData)
        }
      })
    }
  }
}
export default videoMixin
