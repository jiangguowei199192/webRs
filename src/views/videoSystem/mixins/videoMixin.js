import { api } from '@/api/videoSystem/realVideo'
import { EventBus } from '@/utils/eventBus.js'
const videoMixin = {
  data () {
    return {
      showLeft: true, // 是否展开左侧部分
      showRight: true, // 是否展开右侧部分
      isOnline: true, // 默认展示在线设备 true在线 false全部
      selectedIndex: 200, // 激活在线设备
      filterDevice: '', // 设备名称
      treeData: [], // 设备tree数据
      onlineArray: [], // 在线设备列表
      cameraDevArray: [], // 所有摄像头设备列表
      droneDevArray: [], // 所有无人机设备列表
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

  created () {
    if (this.bShowMarkersInMap) {
      // 监控设备获取完毕事件
      EventBus.$on('GetAllDeptDevices_Done', bFlag => {
        this.initMapDevices()
      })
      // 监控设备状态更新事件
      EventBus.$on('UpdateDeviceOnlineStatus', info => {
        this.updateDeviceStatus(info)
      })
    }

    // 获取摄像头、无人机设备
    this.getAllDeptDevices()
  },

  beforeDestroy () {
    EventBus.$off('streamStart')
    EventBus.$off('streamEnd')
    if (this.bShowMarkersInMap) {
      EventBus.$off('GetAllDeptDevices_Done')
      EventBus.$off('UpdateDeviceOnlineStatus')
    }
  },

  mounted () {
    // 设备上线
    EventBus.$on('streamStart', info => {
      this.deviceOnlineOrOffline(true, info)
      this.updateOnlineArray(true, info)
    })

    // 设备下线
    EventBus.$on('streamEnd', info => {
      this.deviceOnlineOrOffline(false, info)
      this.updateOnlineArray(false, info)
    })
  },

  methods: {
    closeLeftNav (type) {
      this.showLeft = type !== 1
    },
    closeRightInfo (type) {
      this.showRight = type !== 1
    },

    /**
     * 刷新在线设备列表
     * @param {Bool} isOnline 上线/下线
     * @param {Object} info 设备信息
     */
    updateOnlineArray (isOnline, info) {
      delete info.deptCode
      info = this.formatData(info)
      EventBus.$emit('UpdateDeviceOnlineStatus', info)
      var device = this.onlineArray.find(c => c.id === info.id)

      if (info.children && info.children.length > 0) {
        info.children.forEach(item => {
          Reflect.set(item, 'deviceTypeCode', info.deviceTypeCode)
          Reflect.set(item, 'onlineStatus', info.onlineStatus)
        })
      }
      // 设备已存在
      if (device !== undefined) {
        var index = this.onlineArray.indexOf(device)
        if (isOnline) { this.onlineArray[index] = info } else this.onlineArray.splice(index, 1)
      } else if (isOnline) {
        // 设备不存在，新设备上线
        this.onlineArray.push(info)
      }
    },

    /**
     * 设置树节点是否禁用
     * @param {Bool} isDisable 是否禁用
     */
    setTreeNodeDisabled (isDisable, id) {
      const node = document.querySelector('#liveVideo' + id)
      if (node == null) return
      const span = node.parentElement
      if (isDisable) {
        span.setAttribute('class', 'disabled')
        span.parentElement.parentElement.style.pointerEvents = 'none'
        span.parentElement.parentElement.style.cursor = 'not-allowed'
        span.parentElement.parentElement.style.opacity = '0.5'
        span.parentElement.parentElement.style.color = '#007291'
        span.parentElement.parentElement.parentElement.classList.remove('is-current')
      } else {
        span.setAttribute('class', '')
        span.parentElement.parentElement.style.pointerEvents = ''
        span.parentElement.parentElement.style.cursor = ''
        span.parentElement.parentElement.style.opacity = ''
        span.parentElement.parentElement.style.color = ''
      }
    },

    /**
     * 根据id，找出所有父节点
     * @param {object} tree 树data
     * @param {String} id 节点id
     * @param {Array} findNodes 父节点数组
     */
    findParentNodes (tree, id, findNodes = []) {
      if (!tree) return []
      for (var i = 0; i < tree.length; i++) {
        var item = tree[i]
        findNodes.push(item)
        if (item.id === id) {
          findNodes.pop()
          return findNodes
        }
        if (item.children) {
          const findChildren = this.findParentNodes(item.children, id, findNodes)
          if (findChildren.length) {
            return findChildren
          }
        }
        findNodes.pop()
      }

      return []
    },

    /**
     * 设备离线
     * @param {device} device 设备信息
     */
    deviceOffline (device) {

    },

    /**
     * 设备上下线
     * @param {Bool} isOnline 上线/下线
     * @param {Object} info 设备信息
     */
    deviceOnlineOrOffline (isOnline, info) {
      if (this.treeData.length === 0) return
      var deptCode = info.deptCode
      delete info.deptCode
      info = this.formatData(info)

      var node = this.treeData.find(c => c.deviceTypeCode === info.deviceTypeCode)
      if (node === undefined) return
      // 先找设备所在组织
      var dept = this.findTreeNodeByID(node.children, deptCode)
      // 组织存在
      if (dept) {
        var device = dept.children.find(c => c.id === info.id)
        if (device !== undefined) {
          var count = isOnline === true ? 1 : -1
          count += dept.deviceCountOnline
          this.$set(dept, 'deviceCountOnline', count)
          // 设备已存在
          for (var a in info) {
            // 拷贝属性
            if (a !== 'children' && Object.prototype.hasOwnProperty.call(device, a)) {
              device[a] = info[a]
            }
          }
          // 拷贝children数组的属性
          if (info.children && info.children.length > 0) {
            info.children.forEach(item => {
              Reflect.set(item, 'deviceTypeCode', info.deviceTypeCode)
              Reflect.set(item, 'onlineStatus', info.onlineStatus)
              var child = device.children.find(i => i.id === item.id)
              if (child !== undefined) {
                // 拷贝属性
                for (var b in item) {
                  // 拷贝属性
                  if (Object.prototype.hasOwnProperty.call(child, b)) {
                    child[b] = item[b]
                  }
                }
                this.setTreeNodeDisabled(!isOnline, child.id)
              } else device.children.push(item)
            })
          }
          if (!isOnline) { this.deviceOffline(device) }
        } else if (isOnline) {
          // 设备不存在，新设备上线
          dept.children.push(info)
          dept.deviceCountTotal += 1
          dept.deviceCountOnline += 1
          if (info.deviceTypeCode === 'WRJ') {
            this.droneDevArray.push(info)
          } else if (info.deviceTypeCode === 'GDJK') {
            this.cameraDevArray.push(info)
          }
        }
        // 找出所有父节点,然后计算deviceCountTotal和deviceCountOnline
        const nodeList = []
        this.findParentNodes(node.children, dept.id, nodeList)
        if (nodeList.length > 0) { nodeList.splice(0, 0, node) }
        for (var i = nodeList.length - 1; i >= 0; i--) {
          const item = nodeList[i]
          if (item.children) {
            var total = 0
            var online = 0
            item.children.forEach(c => {
              total += c.deviceCountTotal
              online += c.deviceCountOnline
            })
            item.deviceCountTotal = total
            item.deviceCountOnline = online
          }
        }
      }
    },

    /**
     * 根据id查找树节点
     * @param {String} id 节点id
     */
    findTreeNodeByID (tree, id) {
      var findResult = ''
      if (tree === null) return findResult
      for (var i = 0; i < tree.length; i++) {
        var node = tree[i]
        if (id === node.id) {
          findResult = node
          return findResult
        }
        if (node.children) {
          findResult = this.findTreeNodeByID(node.children, id)
          if (findResult) {
            return findResult
          }
        }
      }
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
            d._bIsDevice = true
            data[i].children.push(d)
            if (d.onlineStatus === 'online' && d.children.length > 0) {
              this.onlineArray.push(d)
            } else {
              d.onlineStatus = 'offline'
            }
            const tmpData = JSON.parse(JSON.stringify(d))
            if (tmpData.deviceTypeCode === 'WRJ') {
              this.droneDevArray.push(tmpData)
            } else if (tmpData.deviceTypeCode === 'GDJK') {
              this.cameraDevArray.push(tmpData)
            }
          })
        }
        delete data[i].deviceList
      }
      return data
    },

    /**
     * 修改属性名称
     */
    formatData (data) {
      data = JSON.parse(JSON.stringify(data).replace(/deviceTypeName|deptName|deviceName|streamName/g, 'label'))
      data = JSON.parse(JSON.stringify(data).replace(/streamList|subDept/g, 'children'))
      data = JSON.parse(JSON.stringify(data).replace(/deptCode|deviceCode|streamCode/g, 'id'))
      return data
    },

    /**
     * 设置设备树节点的ID
     */
    setDeviceTreeNodeID (tree) {
      if (tree == null) return
      for (var i = 0; i < tree.length; i++) {
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
        this.setDeviceTreeNodeID(tree[i].children)
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
          data.forEach(item => {
            if (item.deviceTypeCode === 'GDJK') {
              item.class = 'highdevice'
            } else {
              item.class = 'unmanned'
            }
          })
          // 修改属性名称
          data = this.formatData(data)
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
          // console.log(this.cameraDevArray)
          // console.log(this.droneDevArray)
          EventBus.$emit('GetAllDeptDevices_Done', true)
        }
      })
    },
    // 加载显示高点设备、无人机位置标记
    initMapDevices () {
      if (
        this.$refs.gduMap !== undefined &&
        this.$refs.gduMap.map2D !== undefined
      ) {
        this.$refs.gduMap.map2D.devCameraLayerManager.clear()
        this.$refs.gduMap.map2D.devCameraLayerManager.addDevices(
          this.cameraDevArray
        )
        this.$refs.gduMap.map2D.devDroneLayerManager.clear()
        this.$refs.gduMap.map2D.devDroneLayerManager.addDevices(
          this.droneDevArray
        )
      }
    },
    // 高点设备、无人机状态更新(地图标记)
    updateDeviceStatus (info) {
      if (
        this.$refs.gduMap !== undefined &&
        this.$refs.gduMap.map2D !== undefined
      ) {
        if (info.deviceTypeCode === 'GDJK') {
          this.$refs.gduMap.map2D.devCameraLayerManager.addOrUpdateDevice(info)
        } else if (info.deviceTypeCode === 'WRJ') {
          this.$refs.gduMap.map2D.devDroneLayerManager.addOrUpdateDevice(info)
        }
      }
    },
    // 跳转到设备详情
    gotoDeviceDetail (item) {
      this.cameraDevArray.forEach(dev => {
        if (dev.id === item.deviceCode) {
          this.showDeviceDetailInfo(dev)
          return null
        }
      })
      this.droneDevArray.forEach(dev => {
        if (dev.id === item.deviceCode) {
          this.showDeviceDetailInfo(dev)
          return null
        }
      })
    }
  }
}
export default videoMixin
