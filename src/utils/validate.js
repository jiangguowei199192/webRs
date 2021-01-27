/* eslint-disable no-useless-escape */

// 合法uri
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

// 小写字母
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

// 大写字母
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

// 大小写字母
export function validateAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

// 允许输入的合法字符
export function isAccountValid (rule, value, callback) {
  const reg = /^[ A-Za-z0-9_.,-@()]*$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('输入不能包含非法字符'))
    } else {
      callback()
    }
  }
}

export function validateEmail (email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

// 输入验证器名称
export function selectValidator (name) {
  // eslint-disable-next-line no-eval
  const fn = eval(name)
  const rules = []
  rules.push({ validator: fn, message: '', trigger: 'blur' })
  return rules
}

// 验证用户名
export function validateUsername (rule, value, callback) {
  const reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('姓名只包含汉字/数字/字母/下划线且不能以下划线开头结尾'))
    } else {
      callback()
    }
  }
}

// 验证长度
export function limitLength (from, to) {
  const rules = []
  rules.push({ min: from, max: to, message: '长度应为' + from + ' 到' + to + '个字符', trigger: 'blur' })
  return rules
}

// 验证整数是否在指定范围内
export function limitIntegerRange (min, max) {
  const rules = []
  rules.push({
    validator: (rule, value, callback) => {
      const tmpMin = rule.intMin
      const tmpMax = rule.intMax

      const regPos = /^\d+$/ // 非负整数
      const regNeg = /^\-[1-9][0-9]*$/ // 负整数
      const resPos = regPos.test(value)
      const resNeg = regNeg.test(value)
      if (!resPos && !resNeg) {
        callback(new Error('请输入整数'))
      } else {
        const tmpV = parseInt(value)
        if (tmpV < tmpMin || tmpV > tmpMax) {
          callback(new Error('请输入' + tmpMin + '到' + tmpMax + '的整数'))
        } else {
          callback()
        }
      }
      return value
    },
    intMin: min,
    intMax: max,
    message: '',
    trigger: 'blur'
  })
  return rules
}

// 输入框长度限制
export function limitMaxLength (str, maxLength, obj, propertyName) {
  if (obj && propertyName) {
    if (str.length > maxLength) {
      obj[propertyName] = str.slice(0, maxLength)
    }
  }
}
// 限制整数数字长度
export function lengthLimitedNumber (str, maxLength, obj, propertyName) {
  if (obj && propertyName) {
    obj[propertyName] = str.replace(/[^0-9]/g, '')
    if (obj[propertyName].length > 1) {
      obj[propertyName] = obj[propertyName].replace(/\b(0+)/gi, '') // 去掉字符串前面的0
      if (obj[propertyName].length === 0) obj[propertyName] = 0
    }
    if (obj[propertyName].length > maxLength) {
      obj[propertyName] = obj[propertyName].slice(0, maxLength)
    }
  }
}
// 限制小数格式
export function formatLimitedFloat (str, intLen, decimalsLen, obj, propertyName) {
  if (obj && propertyName) {
    obj[propertyName] = str.replace(/[^.0-9]/g, '')
    let firstNonZeroIndex = 0
    obj[propertyName] = obj[propertyName].replace(/\./ig, function (a, b, c) { // 删除字符串前面的小数点
      if (b === firstNonZeroIndex) {
        firstNonZeroIndex += 1
        return ''
      } else {
        return '.'
      }
    })
    obj[propertyName] = obj[propertyName].replace(/\./ig, function (a, b, c) { // 仅保留第一个小数点
      return c.indexOf(a) === b ? '.' : ''
    })
    const tmpS = obj[propertyName].split('.')
    if (tmpS.length > 1) { // 限制整数位、小数位长度
      if (tmpS[0].length > intLen) {
        tmpS[0] = tmpS[0].slice(0, intLen)
      }
      if (tmpS[1].length > decimalsLen) {
        tmpS[1] = tmpS[1].slice(0, decimalsLen)
      }
      obj[propertyName] = tmpS[0] + '.' + tmpS[1]
    } else if (tmpS.length === 1) {
      if (tmpS[0].length > intLen) {
        tmpS[0] = tmpS[0].slice(0, intLen)
        obj[propertyName] = tmpS[0]
      }
    }
    // 删除字符串前多余的0
    if (obj[propertyName].indexOf('0') === 0 && obj[propertyName].length > 1) {
      let needDelNum = 0
      for (let i = 1; i < obj[propertyName].length; i++) {
        if (obj[propertyName][i] === '0') {
          needDelNum += 1
        } else if (i === 1 && obj[propertyName][i] !== '.') {
          needDelNum += 1
          break
        } else {
          break
        }
      }
      obj[propertyName] = obj[propertyName].slice(needDelNum, obj[propertyName].length)
    }
  }
}
export function floatFormat (str) {
  if (str.length > 0) {
    if (str.indexOf('.') === str.length - 1) {
      str = str.slice(0, str.length - 1)
    }
  }
  return str
}

// 字符串不能为空
export function isNotNull (msg) {
  const rules = []
  rules.push({ required: true, message: msg, trigger: 'blur' })
  return rules
}

// 是否固话
export function validateTelphone (rule, value, callback) {
  const reg = /[0]\d{2,3}[-]\d{7,8}$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确格式的固话（格式：区号+号码,如010-1234567）'))
    } else {
      callback()
    }
  }
}

// 是否手机号码
export function validatePhone (rule, value, callback) {
  const reg = /^[1][2,3,4,5,6,7,8][0-9]{9}$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('手机号需以1开头第二位不能为1、9的11位数字'))
    } else {
      callback()
    }
  }
}

// 是否身份证号码
export function validateIdNo (rule, value, callback) {
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if (!IdentityCodeValid(value)) {
      callback(new Error('请输入正确格式的身份证号码'))
    } else {
      callback()
    }
  }
}

function IdentityCodeValid (code) {
  var city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 ' }
  var pass = true

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    pass = false
  } else if (!city[code.substr(0, 2)]) {
    pass = false
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      code = code.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      var sum = 0
      var ai = 0
      var wi = 0
      for (var i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      // eslint-disable-next-line no-unused-vars
      var last = parity[sum % 11]
      if (parity[sum % 11] !== code[17]) {
        pass = false
      }
    }
  }
  return pass
}

// 是否邮箱
export function isEMail (rule, value, callback) {
  const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确格式的邮箱地址'))
    } else {
      callback()
    }
  }
}

// 合法url
export function isUrl (rule, value, callback) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确格式的url'))
    } else {
      callback()
    }
  }
}

// 判断字符串是否为空
export function stringIsNullOrEmpty (str) {
  if (typeof str === 'undefined' || str === null || str === '') {
    return true
  }

  return false
}
