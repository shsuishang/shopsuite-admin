/**
 * @description 计算工具类
 */

export function renderTime(date) {
  const dateee = new Date(date).toJSON()
  return new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '')
}

export function sub(arg1, arg2, num) {
  //num为保留位数,不传时不四舍五入
  arg1 = Number(arg1)
  arg2 = Number(arg2)
  let r1 = 0,
    r2 = 0;

  try {
    r1 = arg1.toString().split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    r2 = arg2.toString().split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  const m = Math.pow(10, Math.max(r1, r2))
  if (num || num === 0) {
    return ((arg1 * m - arg2 * m) / m).toFixed(num) //注意：fixed四舍五入大于5会进1 5并不会进1
  }
  return (arg1 * m - arg2 * m) / m
}

export function add(arg1, arg2, num) {
  //num为保留位数,不传时不四舍五入
  arg1 = Number(arg1)
  arg2 = Number(arg2)
  let r1 = 0,
    r2 = 0
  try {
    r1 = arg1.toString().split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    r2 = arg2.toString().split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  const m = Math.pow(10, Math.max(r1, r2))
  if (num || num === 0) {
    return ((arg1 * m + arg2 * m) / m).toFixed(num) //注意：fixed四舍五入大于5会进1 5并不会进1
  }
  return (arg1 * m + arg2 * m) / m
}

export function mul(arg1, arg2, num) {
  //num为保留位数,不传时不四舍五入
  let m = 0
   const s1 = arg1.toString(),
    s2 = arg2.toString() //获取两个相乘数据的小数点后面的数据的长度，即获取小数的位数，因为最终相乘计算的结果：结果小数的位数=第一个数的小数位数+第二个数的小数位数
  try {
    m += s1.split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {} //将两个小数去掉小数点，强制转换整个值（即进行数值放开小数点位数的倍数），然后进行相乘的操作，相乘的结果除去10的m次方
  if (num || num === 0) {
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
      Math.pow(10, m)
    ).toFixed(num) //注意：fixed四舍五入大于5会进1 5并不会进1
  }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}

export function accDiv(arg1, arg2, num) {
  //num为保留位数,不传时不四舍五入
  let t1 = 0,
    t2 = 0
  if (arg2 == 0) {
    return Number(arg2).toFixed(num)
  }
  try {
    t1 = arg1.toString().split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  const r1 = Number(arg1.toString().replace('.', ''))
  const r2 = Number(arg2.toString().replace('.', ''))
  if (num || num === 0) {
    return ((r1 / r2) * Math.pow(10, t2 - t1)).toFixed(num)
  }
  return (r1 / r2) * Math.pow(10, t2 - t1)
}
