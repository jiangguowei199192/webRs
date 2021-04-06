import { EventBus } from '@/utils/eventBus.js'
import globalApi from '@/utils/globalApi'
import { formatDate } from '@/utils/date'
var mqttService;
(function () {
  var instance
  mqttService = function (name) {
    if (instance) {
      instance.created = true
      return instance
    }

    instance = this
    this.created = false
    this.reconnecting = false
    this.reconnectTimeout = ''
    this.client = ''
    this.failTimes = 0
    this.isConnect = false
    this.needReconnect = true

    var clearReconnect = function () {
      console.log('clearReconnect')
      if (instance.reconnecting) {
        if (instance.reconnectTimeout) {
          clearTimeout(instance.reconnectTimeout)
          instance.reconnectTimeout = null
        }
        instance.reconnecting = false
      }
    }

    this.disconnect = function () {
      clearReconnect()
      if (instance.isConnect) { instance.client.disconnect() }
    }

    // mqtt client连接上后的callback
    var onConnect = function () {
      // Once a connection has been made, make a subscription and send a message.
      console.log('onConnect')
      if (instance.reconnecting) instance.reconnecting = false

      instance.isConnect = true
      instance.failTimes = 0

      // 订阅设备上下线和通道上下线主题
      instance.client.subscribe('video/realVideo/streamStart')
      instance.client.subscribe('video/realVideo/streamEnd')
      instance.client.subscribe('video/device/online')
      instance.client.subscribe('video/device/offline')
      // 订阅云台操作获取角度
      // instance.client.subscribe('video/webControlPztNotice')
      // 订阅AR数据
      // instance.client.subscribe('video/aRAiResult')
      // 飞机实时信息
      instance.client.subscribe('gdu/#')
      // 案件聊天信息
      instance.client.subscribe('web/river/caseHandling/#')
      // 案件处置流程改变
      instance.client.subscribe('fms-river-protection/notice')
      // 告警设备更新
      instance.client.subscribe('gdu/web/struct/alarms')
    }

    // mqtt client失去连接后的callback
    var onConnectionLost = function (responseObject) {
      console.log('onConnectionLost')
      instance.isConnect = false
      if (instance.needReconnect) mqttReconnect()
      if (responseObject.errorCode !== 0) {
        console.log('errorMessage:' + responseObject.errorMessage)
      }
    }

    // mqtt 消息到来的callback
    var onMessageArrived = function (message) {
      // console.log('onMessageArrived---------topic:' + message.topic + '----------' + message.payloadString)
      var object = JSON.parse(message.payloadString)
      EventBus.$emit(message.topic, object)
      if (message.topic === 'gdu/realVideo/streamHadNotData') {
        console.log(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss') + '  onMessageArrived---------topic:' + message.topic + '----------' + message.payloadString)
        EventBus.$emit('streamHadNotData', object)
      } else if (message.topic.substr(0, 4) === 'gdu/') {
        EventBus.$emit('droneInfos', message)
      } else if (message.topic.indexOf('web/river/caseHandling') !== -1) {
        EventBus.$emit('web/river/caseHandling', message)
      } else if (message.topic.indexOf('gdu/ai/output') !== -1) {
        EventBus.$emit('video/people/real', message)
      } else if (message.topic.indexOf('fms-river-protection/notice') !== -1) {
        EventBus.$emit('web/river/caseNotice', object)
      } else if (message.topic.indexOf('gdu/web/struct/alarms') !== -1) {
        EventBus.$emit('alarmsUpdate', message)
      } else {
        console.log(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss') + '  onMessageArrived---------topic:' + message.topic + '----------' + message.payloadString)
      }
    }

    // mqtt client连接失败callback
    var onFailure = function () {
      console.log('connect failed')
      instance.failTimes += 1
      if (instance.failTimes <= 5) {
        mqttReconnect()
      } else {
        instance.failTimes = 0
      }
    }

    /**
     * 重连超时回调
     */
    // eslint-disable-next-line no-unused-vars
    var reconnectTimeoutFunc = function () {
      console.log('start reconnect')
      instance.client.reconnect()
    }

    /**
     * mqtt重新连接
     */
    // eslint-disable-next-line no-unused-vars
    var mqttReconnect = function () {
      instance.reconnecting = true
      instance.reconnectTimeout = setTimeout(() => {
        reconnectTimeoutFunc()
      }, 10 * 1000)
    }

    // mqtt trace的callback
    // eslint-disable-next-line no-unused-vars
    var onTrace = function (message) {
      console.log(message.severity + ':' + message.message)
    }

    // eslint-disable-next-line no-unused-vars
    this.mqttConnect = function () {
      instance.needReconnect = true
      clearReconnect()
      var clientID =
        'pc_' +
        new Date().getTime().toString()
      // eslint-disable-next-line no-undef
      instance.client = new Paho.Client(globalApi.mqttServer || globalApi.mqttServer2, globalApi.mqttPort, '/gduMqtt', clientID)
      // instance.client.trace = onTrace
      instance.client.startTrace()
      // set callback handlers
      instance.client.onConnectionLost = onConnectionLost
      instance.client.onMessageArrived = onMessageArrived

      // connect the client
      console.log('start to connect')
      instance.client.connect({
        onSuccess: onConnect,
        onFailure: onFailure,
        timeout: 30,
        keepAliveInterval: 10,
        userName: 'admin',
        password: 'admin'
      })
    }
    instance.mqttConnect()

    /**
* Subscribe for messages, request receipt of a copy of messages sent to the destinations described by the filter.
* @param {string} filter describing the destinations to receive messages from.
* @param {object} subscribeOptions - used to control the subscription
*/
    this.subscribe = function (filter, subscribeOptions) {
      if (this.isConnect) {
        subscribeOptions = subscribeOptions || {}
        this.client.subscribe(filter, subscribeOptions)
      }
    }
  }
}())

export default mqttService
