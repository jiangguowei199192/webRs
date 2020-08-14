/* 处理ES7,ES6在IE的兼容问题文件 */

// 兼容es7 includes string Array
(function (types) {
  types.forEach(function (type) {
    if (!type.prototype.includes) {
      type.prototype.includes = function (search, start) {
        if (typeof start !== 'number') {
          start = 0
        }
        if (start + search.length > this.length) {
          return false
        } else {
          return this.indexOf(search, start) !== -1
        }
      }
    }
  })
})([String, Array])
