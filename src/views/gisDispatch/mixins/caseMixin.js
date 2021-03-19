import { caseApi } from '@/api/case'
import { resApi } from '@/api/res'
import { EventBus } from '@/utils/eventBus.js'
import globalApi from '@/utils/globalApi'
const caseMixin = {
  data () {
    return {
      members: [],
      organs: [],
      drones: [],
      points: [],
      lines: [],
      areas: [],
      resInfos: [
        {
          name: '组织机构',
          img: require('../../../assets/images/gisDispatch/institution.svg'),
          imgS: require('../../../assets/images/gisDispatch/institution-select.svg'),
          num: 8,
          color: '#20F2F5',
          view: true,
          width: 0
        },
        {
          name: '组织人员',
          img: require('../../../assets/images/gisDispatch/people.svg'),
          imgS: require('../../../assets/images/gisDispatch/people-select.svg'),
          num: 12,
          color: '#CCFF00',
          view: true,
          width: 0
        },
        {
          name: '无人机',
          img: require('../../../assets/images/gisDispatch/drone.svg'),
          imgS: require('../../../assets/images/gisDispatch/drone-select.svg'),
          num: 4,
          color: '#EF4E22',
          view: true,
          width: 0
        },
        {
          name: '高点监控',
          img: require('../../../assets/images/gisDispatch/camera.svg'),
          imgS: require('../../../assets/images/gisDispatch/camera-select.svg'),
          num: 15,
          color: '#49EF22',
          view: true,
          width: 0
        },
        {
          name: '重点区域',
          img: require('../../../assets/images/gisDispatch/area.svg'),
          imgS: require('../../../assets/images/gisDispatch/area-select.svg'),
          num: 3,
          color: '#E92D2D',
          view: true,
          width: 0
        },
        {
          name: '重要路线',
          img: require('../../../assets/images/gisDispatch/route.svg'),
          imgS: require('../../../assets/images/gisDispatch/route-select.svg'),
          num: 7,
          color: '#CCFF00',
          view: true,
          width: 0
        },
        {
          name: '关注点位',
          img: require('../../../assets/images/gisDispatch/point.svg'),
          imgS: require('../../../assets/images/gisDispatch/point-select.svg'),
          num: 7,
          color: '#82F3FA',
          view: true,
          width: 0
        }
      ]
    }
  },

  mounted () {
    this.getUserList()
    this.getDeptList()
    this.getPointList()
    this.getLineList()
    this.getAreaList()
    EventBus.$on('droneRealtimeInfo', obj => {
      const d = this.drones.find(c => c.id === obj.snCode)
      if (d === undefined) return
      // 更新飞机经纬度和方向角
      this.$refs.caseMain.updateDroneMarker(
        obj.snCode,
        obj.latitude,
        obj.longitude,
        obj.directionAngle
      )
    })
  },
  beforeDestroy () {
    EventBus.$off('droneRealtimeInfo')
  },
  methods: {
    /**
     * 获取点资源列表
     */
    getPointList () {
      this.$axios
        .post(
          resApi.selectListPoint,
          {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            let list = res.data.data
            list = JSON.parse(
              JSON.stringify(list).replace(/resourcesLongitude/g, 'longitude')
            )
            list = JSON.parse(
              JSON.stringify(list).replace(/resourcesLatitude/g, 'latitude')
            )
            list.forEach((c) => {
              c.type = 'RP_Point'
              if (c.resourcesIcon) { c.resourcesIcon = globalApi.headImg + c.resourcesIcon }
            })
            this.points = list
            this.getPointsDone()
          }
        })
        .catch((err) => {
          console.log('resApi.selectListPoint Err : ' + err)
        })
    },
    /**
     * 获取线资源列表
     */
    getLineList () {
      this.$axios
        .post(
          resApi.selectListLine,
          {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            const list = res.data.data
            list.forEach((c) => {
              c.type = 'RP_Route'
              // eslint-disable-next-line no-eval
              c.longitudeLatitudeArray = eval(c.longitudeLatitudeArray)
              c.strokeStyle = {
                color: c.lineColor ? c.lineColor : 'rgba(0, 204, 255, 1)',
                width: c.lineWidth ? c.lineWidth : 2
              }
            })
            this.lines = list
            this.getLinesDone()
          }
        })
        .catch((err) => {
          console.log('resApi.selectListLine Err : ' + err)
        })
    },
    /**
     * 获取面资源列表
     */
    getAreaList () {
      this.$axios
        .post(
          resApi.selectListArea,
          {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            const list = res.data.data
            list.forEach((c) => {
              c.type = 'RP_Area'
              // eslint-disable-next-line no-eval
              c.longitudeLatitudeArray = eval(c.longitudeLatitudeArray)
              c.strokeStyle = {
                color: c.lineColor ? c.lineColor : 'rgba(0, 204, 255, 1)',
                width: c.lineWidth ? c.lineWidth : 2
              }
              c.fillStyle = {
                color: c.fillColor ? c.fillColor : 'rgba(0, 204, 255, 0.4)'
              }
            })
            this.areas = list
            this.getAreasDone()
          }
        })
        .catch((err) => {
          console.log('resApi.selectListArea Err : ' + err)
        })
    },
    /**
     * 获取组织人员
     */
    getUserList () {
      this.$axios
        .post(
          caseApi.selectUsers,
          { content: '' },
          {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            let list = res.data.data
            list = JSON.parse(
              JSON.stringify(list).replace(/userLongitude/g, 'longitude')
            )
            list = JSON.parse(
              JSON.stringify(list).replace(/userLatitude/g, 'latitude')
            )
            list = JSON.parse(
              JSON.stringify(list).replace(/employeeId/g, 'id')
            )
            list.forEach((c) => {
              c.type = 'RP_Member'
            })
            this.members = list
            this.getMembersDone()
          }
        })
        .catch((err) => {
          console.log('caseApi.selectUsers Err : ' + err)
        })
    },
    /**
     * 获取组织机构
     */
    getDeptList () {
      this.$axios
        .post(caseApi.selectDepts, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            let list = res.data.data
            list = JSON.parse(
              JSON.stringify(list).replace(/deptLongitude/g, 'longitude')
            )
            list = JSON.parse(
              JSON.stringify(list).replace(/deptLatitude/g, 'latitude')
            )
            list.forEach((c) => {
              c.type = 'RP_Institution'
            })
            this.organs = list
            this.getDeptsDone()
          }
        })
        .catch((err) => {
          console.log('caseApi.selectDepts Err : ' + err)
        })
    }
  }
}
export default caseMixin
