// 经度验证
export function lonValidate () {
  const rules = []
  rules.push({
    validator: (rule, value, callback) => {
      // eslint-disable-next-line
      const lonreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,14})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,14}|180)$/
      if (lonreg.test(value)) { callback() } else callback(new Error('请输入正确的经度'))
    },
    message: '',
    trigger: 'blur'
  })
  return rules
}

// 纬度验证
export function latValidate () {
  const rules = []
  rules.push({
    validator: (rule, value, callback) => {
      // eslint-disable-next-line
      const latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,14}|90\.0{0,14}|[0-8]?\d{1}|90)$/
      if (latreg.test(value)) { callback() } else callback(new Error('请输入正确的纬度'))
    },
    message: '',
    trigger: 'blur'
  })
  return rules
}

// 数字验证（是否是数字）
export function numberValidate (msg) {
  const rules = []
  rules.push({
    validator: (rule, value, callback) => {
      if (!value) callback()
      else if (!isNaN(value)) { callback() } else { callback(new Error(msg)) }
    },
    message: '',
    trigger: 'blur'
  })
  return rules
}

// 最大数值验证
export function maxNumValidate (msg, max) {
  const rules = []
  rules.push({
    validator: (rule, value, callback) => {
      if (!value) callback()
      else if (parseFloat(value) < max) { callback() } else { callback(new Error(msg)) }
    },
    message: '',
    trigger: 'blur'
  })
  return rules
}

// 字符串不能为空
export function isNotNull (msg) {
  const rules = []
  rules.push({ required: true, message: msg, trigger: 'blur' })
  return rules
}

// 校验手机号，用法见addPeopleDialog
export function checkPhone () {
  const checkPhone = (rule, value, callback) => {
    if (value) {
      const reg = /^1[345789]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  return { type: 'number', validator: checkPhone, message: '请输入11位有效手机号', trigger: 'blur' }
}

// 校验身份证号码，用法见addPeopleDialog
export function checkIdcard () {
  return { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入有效身份证号' }
}

// 限制数字或字母长度
export function limitIntOrCharMaxLength (str, maxLength, obj, propertyName) {
  if (obj && propertyName) {
    obj[propertyName] = str.replace(/[^A-Za-z0-9]/g, '')
    if (obj[propertyName].length > maxLength) {
      obj[propertyName] = obj[propertyName].slice(0, maxLength)
    }
  }
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
export function formatLimitedFloat (str, intLen, decimalsLen, obj, propertyName, bCanNegative = false) {
  if (obj && propertyName) {
    if (bCanNegative) {
      obj[propertyName] = str.replace(/[^-.0-9]/g, '')
    } else {
      obj[propertyName] = str.replace(/[^.0-9]/g, '')
    }
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
    obj[propertyName] = obj[propertyName].replace(/[-]/g, function (a, b, c) { // 仅保留字串开头减号
      if (b === 0) {
        return '-'
      } else return ''
    })
    let bIsNegative = false
    if (obj[propertyName].indexOf('-') === 0) {
      bIsNegative = true
      obj[propertyName] = obj[propertyName].replace('-', '')
    }
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
    if (bIsNegative) {
      obj[propertyName] = '-' + obj[propertyName]
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

// 验证输入名称
export function validateName (msg) {
  const rules = []
  rules.push({
    validator: (rule, value, callback) => {
      if (!value) callback()
      else if (!(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/ig).test(value)) { callback(new Error(msg)) } else { callback() }
    },
    message: '',
    trigger: 'blur'
  })
  return rules
}
