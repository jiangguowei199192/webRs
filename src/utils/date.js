export function getTime () {
  const date = new Date()// 调取当前时间
  const year = date.getFullYear()// 调取年;
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1// 调取月;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()// 调取日
  let weekday = date.getDay()// 调取周几;
  // 转换星期数值
  switch (weekday) {
    case 0: weekday = '日'
      break
    case 1: weekday = '一'
      break
    case 2: weekday = '二'
      break
    case 3: weekday = '三'
      break
    case 4: weekday = '四'
      break
    case 5: weekday = '五'
      break
    case 6: weekday = '六'
      break
  }
  // setInterval(getTime, 1000)
  // 返回时间拼接 年月日 星期
  return { year: year, month: month, day: day, weekday: '星期' + weekday }
}

/**
     * 将秒数转换为时分秒格式
     * @param {Integer}} value 秒
     */
export function formatSeconds (value) {
  var sTime = parseInt(value) // 秒
  var mTime = 0 // 分
  var hTime = 0 //

  if (sTime >= 60) {
    // 获取分钟，除以60取整数，得到整数分钟
    mTime = parseInt(sTime / 60)
    // 获取秒数，秒数取佘，得到整数秒数
    sTime = parseInt(sTime % 60)
    // 如果分钟大于60，将分钟转换成小时
    if (mTime >= 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hTime = parseInt(mTime / 60)
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      mTime = parseInt(mTime % 60)
    }
  }
  var result =
    formatMinutes(hTime) +
    ':' +
    formatMinutes(mTime) +
    ':' +
    formatMinutes(sTime)
  return result
}

/**
     * 格式化时间
     * @param {Integer}} minutes 时间
     */
export function formatMinutes (minutes) {
  if (minutes < 10) return '0' + minutes.toString()
  else return minutes.toString()
}

// 将时间戳转化成年月日时分秒
export function timeFormat (timestamp) {
  // timestamp是整数，否则要parseInt转换,不会出现少个0的情况
  const add0 = function (m) { return m < 10 ? '0' + m : m }
  var time = new Date(timestamp)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var date = time.getDate()
  var hours = time.getHours()
  var minutes = time.getMinutes()
  var seconds = time.getSeconds()
  return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds)
}

// 将时间戳转化成月日时分秒
export function timeFormat2 (timestamp) {
  const time = timeFormat(timestamp)
  return time.substr(5)
}
