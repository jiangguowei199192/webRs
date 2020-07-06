export function getTime () {
  const date = new Date()// 调取当前时间
  const year = date.getFullYear()// 调取年;
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1// 调取月;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()// 调取日
  let weekday = date.getDay()// 调取周几;
  // 转换星期数值
  switch (weekday) {
    case 0:weekday = '日'
      break
    case 1:weekday = '一'
      break
    case 2:weekday = '二'
      break
    case 3:weekday = '三'
      break
    case 4:weekday = '四'
      break
    case 5:weekday = '五'
      break
    case 6:weekday = '六'
      break
  }
  // setInterval(getTime, 1000)
  // 返回时间拼接 年月日 星期
  return { year: year, month: month, day: day, weekday: '星期' + weekday }
}
