import { api } from '@/api/videoSystem/realVideo'
const videoMixin = {
  data () {
    return {
      idStart: 0,
      showLeft: true, // 是否展开左侧部分
      showRight: true, // 是否展开右侧部分
      index: 0, // 默认展示已选 0已选 1全部
      selectedIndex: '9', // 激活已选择
      filterDevice: '', // 设备名称
      treeData: [], // 设备tree数据
      onlineArray: [], // 在线设备列表
      ninePalace: require('../../../assets/images/9.png'),
      fourPalace: require('../../../assets/images/4.png'),
      onePalace: require('../../../assets/images/1.png'),
      nineSelectedPalace: require('../../../assets/images/9_selected.png'),
      fourSelectedPalace: require('../../../assets/images/4_selected.png'),
      oneSelectedPalace: require('../../../assets/images/1_selected.png'),
      playAll: require('../../../assets/images/play-all.png'),
      closeAll: require('../../../assets/images/close-all.png'),
      fullScreen: require('../../../assets/images/full-screen.png'),
      fullScreenSelected: require('../../../assets/images/full-screen-selected.png'),
      map: require('../../../assets/images/map.png'),
      mapSelected: require('../../../assets/images/map_selected.png'),
      photo: require('../../../assets/images/photo.png'),
      photoSelected: require('../../../assets/images/photo_selected.png')
    }
  },

  watch: {
    filterDevice (val) {
      this.$refs.tree.$refs.tree.filter(val)
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
        // 如果children为null 将children置为[]
        if (data[i].deviceList && !data[i].children) { data[i].children = [] }
        if (data[i].deviceList.length > 0) {
          data[i].deviceList.forEach(d => {
            data[i].children.push(d)
            this.onlineArray.push(d)
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
        // Reflect.set(tree[i], 'id', this.idStart)
        // 添加onlineStatus和deviceTypeCode属性
        if (!Object.prototype.hasOwnProperty.call(tree[i], 'onlineStatus')) {
          if (Object.prototype.hasOwnProperty.call(tree[i], 'deviceCountOnline')) {
            var online = tree[i].deviceCountOnline > 0 ? 'online' : 'offline'
            Reflect.set(tree[i], 'onlineStatus', online)
          }
        } else {
          if (tree[i].children) {
            tree[i].children.forEach(c => {
              Reflect.set(c, 'onlineStatus', tree[i].onlineStatus)
              Reflect.set(c, 'deviceTypeCode', tree[i].deviceTypeCode)
            })
          }
        }
        this.idStart += 1
        this.setDeviceTreeNodeID(tree[i].children, this.idStart)
      }
    },

    /**
       * 获取所有设备
       */
    getAllDeptDevices () {
      this.onlineArray = []
      this.treeData = []
      this.$axios.get(api.getDeptsAndDevicesAxios).then(res => {
        if (res && res.data && res.data.code === 0) {
          var data = res.data.data
          // 修改属性名称
          data = JSON.parse(JSON.stringify(data).replace(/deviceTypeName|deptName|deviceName|streamName/g, 'label'))
          data = JSON.parse(JSON.stringify(data).replace(/streamList|subDept/g, 'children'))
          data = JSON.parse(JSON.stringify(data).replace(/deptCode|deviceCode|streamCode/g, 'id'))
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

          // console.log(this.onlineArray)
        }
      })
    }
  }
}
export default videoMixin
