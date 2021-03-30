import { api } from '@/api/videoSystem/realVideo'
const streamMixin = {
  data () {
    return {
      urls: [],
      streamUrl: '',
      online: false,
      param: ''
    }
  },
  props: {
    dataInfo: {
      default: () => {}
    }
  },
  mounted () {
    this.online = this.dataInfo.online !== 'offline'
    if (!this.online) return
    if (this.dataInfo.deviceTypeCode === 'GDJK') {
      // eslint-disable-next-line no-eval
      this.dataInfo.channelInfo = eval(this.dataInfo.channelInfo)
      if (!this.dataInfo.channelInfo || this.dataInfo.channelInfo.length === 0) return
      const list = []
      this.dataInfo.channelInfo.forEach(c => {
        list.push({
          deviceCode: this.dataInfo.id,
          channelId: c.channelId,
          deviceTypeCode: this.dataInfo.deviceTypeCode,
          accessType: this.dataInfo.accessType
        })
      })
      this.param = {
        deviceInfoListJsonStr: JSON.stringify(list)
      }
    } else {
      this.param = {
        deviceInfoListJsonStr: JSON.stringify([
          {
            deviceCode: this.dataInfo.id,
            deviceTypeCode: this.dataInfo.deviceTypeCode,
            accessType: this.dataInfo.accessType

          }
        ])
      }
    }
    this.getVideoStreamUrl(this.param)
  },
  beforeDestroy () {
    if (!this.online) return
    this.stopVideoStreamUrl(this.param)
  },
  methods: {
    /**
     * 获取视频流地址
     */
    getVideoStreamUrl (param) {
      this.$axios
        .post(
          api.getStreamUrl,
          param
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            const data = res.data.data
            data.forEach(list => {
              list.streamUrl = `ws://${list.ip}:${list.wsPort}/${list.app}/${list.stream}.flv`
              this.urls.push(list.streamUrl)
            })
            if (this.urls.length > 0) this.streamUrl = this.urls[0]
          }
        })
        .catch((err) => {
          console.log('api.getStreamUrl Err : ' + err)
        })
    },
    /**
     * 停止获取视频流
     */
    stopVideoStreamUrl (param) {
      this.$axios
        .post(
          api.stopStreamUrl,
          param
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
          }
        })
        .catch((err) => {
          console.log('caseApi.stopStreamUrl Err : ' + err)
        })
    }
  }
}
export default streamMixin
