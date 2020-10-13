import { EventBus } from '@/utils/eventBus.js'
import globalApi from '@/utils/globalApi'
var mqttService;
(function () {
  var instance
  mqttService = function (name) {
    if (instance) {
      return instance
    }

    instance = this
    this.reconnecting = false
    this.reconnectTimeout = ''
    this.client = ''
    this.failTimes = 0
    this.isConnect = false

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
      // 订阅火情火点
      instance.client.subscribe('video/deviceIid/channleID/datalink/firewarning')
      // 订阅人员识别
      instance.client.subscribe('video/people/found')
      // 订阅人员识别数据
      instance.client.subscribe('video/people/real')
      // 订阅AR数据
      instance.client.subscribe('video/aRAiResult')
      // 飞机实时信息
      instance.client.subscribe('gdu/#')
      // 雷达实时信息
      instance.client.subscribe('radar/realTimeInfo')
    }

    // mqtt client失去连接后的callback
    var onConnectionLost = function (responseObject) {
      console.log('onConnectionLost')
      instance.isConnect = false
      mqttReconnect()
      if (responseObject.errorCode !== 0) {
        console.log('errorMessage:' + responseObject.errorMessage)
      }
    }

    // mqtt 消息到来的callback
    var onMessageArrived = function (message) {
      // console.log('onMessageArrived---------topic:' + message.topic + '----------' + message.payloadString)
      var object = JSON.parse(message.payloadString)
      EventBus.$emit(message.topic, object)
      if (message.topic.substr(0, 4) === 'gdu/') {
        EventBus.$emit('droneInfos', message)
      } else {
        // console.log('onMessageArrived---------topic:' + message.topic + '----------' + message.payloadString)
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
    var mqttConnect = (function () {
      clearReconnect()
      var clientID =
        'pc_' +
        new Date().getTime().toString()
      // eslint-disable-next-line no-undef
      instance.client = new Paho.Client(globalApi.mqttServer, globalApi.mqttPort, '/gduMqtt', clientID)
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
    }())

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
