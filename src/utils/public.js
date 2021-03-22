// 防抖
export function debounce (fn, delay = 200) {
  let timer
  return function () {
    const th = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null
      fn.apply(th, args)
    }, delay)
  }
}
// 节流
export function throttle (fn, interval = 200) {
  let last
  let timer
  return function () {
    const th = this
    const args = arguments
    const now = +new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(th, args)
      }, interval)
    } else {
      last = now
      fn.apply(th, args)
    }
  }
}

// 生成guid，可以指定长度和基数
// 8 character ID (base=2)
// uuid(8, 2)  //  "01001010"
// 8 character ID (base=10)
// uuid(8, 10) // "47473046"
// 8 character ID (base=16)
// uuid(8, 16) // "098F4D35"
export function uuid (len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    ''
  )
  var uuid = []
  var i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

/**
 *  拷贝数据
 * @param {Object} src
 * @param {Object} dst
 */
export function copyData (src, dst) {
  for (var b in dst) {
    // 拷贝属性
    if (Object.prototype.hasOwnProperty.call(src, b)) {
      dst[b] = src[b]
    }
  }
}

/**
 * 根据内外网替换StreamUrl
 */
export function replaceStreamUrl (streamUrl, baseUrl) {
  if (streamUrl) {
    const startI = baseUrl.indexOf('//')
    const endI = baseUrl.lastIndexOf(':')
    const url = baseUrl.slice(startI + 2, endI)
    const s = streamUrl.slice(streamUrl.lastIndexOf(':') + 1).indexOf('/')
    const stream = streamUrl.slice(streamUrl.lastIndexOf(':') + 1).slice(s + 1)

    // return 'ws://' + url + ':50010/' + stream // 消防10楼视频端口
    return 'ws://' + url + ':40021/' + stream // 消防测试环境视频端口
    // return 'ws://' + url + ':40007/' + stream // 长江大保护视频端口
  }
}

/**
 *  二维数组转字符串
 */
export function arrToStr (objarr) {
  var arrLen = objarr.length
  var row = '['
  for (var i = 0; i < arrLen; i++) {
    row += '['
    for (var j = 0; j < objarr[i].length; j++) {
      row += objarr[i][j]
      if (j < objarr[i].length - 1) {
        row += ','
      }
    }
    row += ']'
    if (i < arrLen - 1) {
      row += ','
    }
  }
  row += ']'
  return row
}
