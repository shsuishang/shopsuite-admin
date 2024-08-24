import moment from "dayjs";

/**
 * @description 格式化时间
 * @param time
 * @param cFormat
 * @returns {string|null}
 */
export function parseTime(time: string | number | Date, cFormat: string) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  return format.replace(
    /{([ymdhisa])+}/g,
    (result: string | any[], key: string) => {
      let value = formatObj[key]
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    }
  )
}

/**
 * @description 格式化时间
 * @param time
 * @param option
 * @returns {string}
 */
export function formatTime(time: any | number | Date, option: any) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d: any = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
export function paramObj(url: string) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @description 父子关系的数组转换成树形结构数据
 * @param data
 * @returns {*}
 */
export function translateDataToTree(data: any[]) {
  const parent = data.filter(
    (value: { parentId: string | null }) =>
      value.parentId === 'undefined' || value.parentId === null
  )
  const children = data.filter(
    (value: { parentId: string | null }) =>
      value.parentId !== 'undefined' && value.parentId !== null
  )
  const translator = (parent: any[], children: any[]) => {
    parent.forEach((parent: { id: any; children: any[] }) => {
      children.forEach((current: { parentId: any }, index: any) => {
        if (current.parentId === parent.id) {
          const temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined'
            ? parent.children.push(current)
            : (parent.children = [current])
        }
      })
    })
  }
  translator(parent, children)
  return parent
}

/**
 * @description 树形结构数据转换成父子关系的数组
 * @param data
 * @returns {[]}
 */
export function translateTreeToData(data: any[]) {
  const result: { id: any; name: any; parentId: any }[] = []
  data.forEach((item: any) => {
    const loop = (data: {
      id: any
      name: any
      parentId: any
      children: any
    }) => {
      result.push({
        id: data.id,
        name: data.name,
        parentId: data.parentId,
      })
      const child = data.children
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i])
        }
      }
    }
    loop(item)
  })
  return result
}

/**
 * @description 10位时间戳转换
 * @param time
 * @returns {string}
 */
export function tenBitTimestamp(time: number) {
  const date = new Date(time * 1000)
  const y = date.getFullYear()
  let m: any = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d: any = date.getDate()
  d = d < 10 ? '' + d : d
  let h: any = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute: any = date.getMinutes()
  let second: any = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second //组合
}

/**
 * @description 13位时间戳转换
 * @param time
 * @returns {string}
 */
export function thirteenBitTimestamp(time: number) {
  const date = new Date(time / 1)
  const y = date.getFullYear()
  let m: any = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d: any = date.getDate()
  d = d < 10 ? '' + d : d
  let h: any = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute: any = date.getMinutes()
  let second: any = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second //组合
}

/**
 * @description 获取随机id
 * @param length
 * @returns {string}
 */
export function uuid(length = 32) {
  const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}

/**
 * @description m到n的随机数
 * @param m
 * @param n
 * @returns {number}
 */
export function random(m: number, n: number) {
  return Math.floor(Math.random() * (m - n) + n)
}

/**
 * @description 数组打乱
 * @param array
 * @returns {*}
 */
export function shuffle(array: any[]) {
  let m = array.length,
    t,
    i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}

/**
 * @description 字符串转时间戳
 * @param string
 * @return int
 */
export function timestamp(startTime: Date) {
  return parseInt(String(startTime.getTime() / 1000))
}

/**
 * @description 统计数据整理
 * @param string
 * @return int
 */
export function formatTimeLine(data: any[], days:number) {

  //修正为空的数据
  let i = days-1;
  while ( i >= 0) {
    const tmp = moment().subtract(i, "days").format("MM-DD")

    if (data.length > 0) {
      // @ts-ignore
      // @ts-ignore
      const item = data.find(
        (item) => item.time === tmp
      )

      if (typeof item == "undefined") {
        data.push({time:tmp, num:0, i:i})
      } else {
        item["i"] = i
      }
    } else {
      data.push({time:tmp, num:0, i:i})
    }


    i--;
  }

  //从大到小排序
  data.sort(function (a, b) {
    return b.i - a.i;
  });

  return data
}

/**
 * @description 统计数据整理区间
 * @return int
 * @param data
 * @param startTimestamp
 * @param endTimestamp
 */
export function formatTimeLineRange(data: any[], days: number, endTimestamp: number) {
  let i = days - 1;
  while (i > 0) {
    const tmp = moment(endTimestamp).subtract(i, "days").format("MM-DD");
    const item = data.find((item) => item.time === tmp);
    if (typeof item == "undefined") {
      data.push({ time: tmp, num: 0, i: i });
    } else {
      item["i"] = i;
    }
    i--;
  }

  // 手动添加结束日期的数据
  const endDate = moment(endTimestamp).format("MM-DD");
  const endItem = data.find((item) => item.time === endDate);
  if (typeof endItem == "undefined") {
    data.push({ time: endDate, num: 0, i: 0 });
  } else {
    endItem["i"] = 0;
  }

  // 从大到小排序
  data.sort(function (a, b) {
    return b.i - a.i;
  });

  return data;
}





/**
 * 生成范围内的随机数
 * @param min 最小值
 * @param max 最大值
 * @param isFloat 是否包含小数点
 * @returns number
 */
export const randomExt = (min = 0, max = 100, isFloat = false) => {
  const array = new Uint32Array(1);
  const maxUint = 0xffffffff;
  const randomNumber = crypto.getRandomValues(array)[0] / maxUint;
  const randomRangeValue = (max - min + 1) * randomNumber + min;
  return isFloat ? randomRangeValue : Math.floor(randomRangeValue);
};

/**
 * 计算最大运行轨道
 * @param x 轨道坐标x
 * @param y 轨道坐标y
 * @returns 最大的运行轨道坐标
 */
export const maxOrbit = (x: number, y: number) => {
  const max = Math.max(x, y);
  const diameter = Math.round(Math.sqrt(max * max + max * max));
  return diameter / 2;
};
