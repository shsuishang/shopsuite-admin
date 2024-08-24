/**
 * @description 格式化时间
 * @param path
 * @returns {boolean}
 */
export function formatDefault(row:any, column:any, fmt:string) {
  const data:any = row[column.property]
  if(data == null || data == 0) {
    return null
  }
  const date = new Date(data);
  const o:any = {
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "h+" : date.getHours(),                   //小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S"  : date.getMilliseconds()             //毫秒
  };

  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }

  for(const k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt ;
}

/**
 * @description 格式化时间
 * @param path
 * @returns {boolean}
 */
export function formatDateTime(row:any, column:any) {
  const fmt = "yyyy-MM-dd hh:mm:ss";

  return formatDefault(row, column, fmt)
}


/**
 * @description 格式化时间
 * @param path
 * @returns {boolean}
 */
export function formatDate(row:any, column:any) {
  const fmt = "yyyy-MM-dd";

  return formatDefault(row, column, fmt)
}


/**
 * @description 格式化时间
 * @param path
 * @returns {boolean}
 */
export function formatTime(row:any, column:any) {
  const fmt = "hh:mm:ss";

  return formatDefault(row, column, fmt)
}

/**
 * 2020-07-12T11:39:35.000+00:00 =》 2020-07-12 12:24:18
 * @returns {string}
 * @param date
 */
export function renderTime(date:any) {
  if (!date) return ''
  const dateee = new Date(date).toJSON()
  return new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '')
}


/**
 * 2020-07-12T11:39:35.000+00:00 =》 2020-07-12 12:24:18
 * @returns {string}
 * @param date
 */
export function renderDate(date:any) {
  if (!date) return ''
  const fmt = "yyyy-MM-dd";
  return renderDefault(date, fmt)
}

export function renderDateTime(date:any) {
  if (!date) return ''

  const fmt = "yyyy-MM-dd hh:mm:ss";
  return renderDefault(date, fmt)
}


export function renderDefault(data:any, fmt:string) {
  if(data == null) {
    return null
  }

  const date = new Date(data);
  const o:any = {
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "h+" : date.getHours(),                   //小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S"  : date.getMilliseconds()             //毫秒
  };

  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }

  for(const k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt ;
}

/**
 * // 时间戳转日期(包含年月日时分秒)
 * @param timestamp
 * @returns {string}
 */
export function timestampToTime(timestamp:any) {
  if (timestamp) {
    const date = new Date(parseInt(timestamp))
    const Y = date.getFullYear() + '-'
    const M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-'
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const h =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    const m =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':'
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + ' ' + h + m + s
  } else {
    return ''
  }
}


function moneyFormat(number: number | string, decimals: number, dec_point: string, thousands_sep: string): string {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  const n = !isFinite(+number) ? 0 : +number;
  const prec = !isFinite(+decimals) ? 2 : Math.abs(decimals);
  const sep = typeof thousands_sep === 'undefined' ? '' : thousands_sep;
  const dec = typeof dec_point === 'undefined' ? '.' : dec_point;
  let s: string[] = [];

  const toFixedFix = function (n: number, prec: number): string {
    const k = Math.pow(10, prec);
    return '' + (Math.round(n * k) / k).toFixed(prec);
  };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }

  return s.join(dec) as string;
}

export function mf(number: number, decimals: number, dec_point: string, thousands_sep: string): string {
  return moneyFormat(number, decimals, dec_point, thousands_sep);
}


import moment from 'dayjs'

/**
 * 当天时间
 */
export function today() {
  // @ts-ignore
  const start = new Date(moment(moment().format("YYYY-MM-DD")));

  return start;
}

/**
 * 昨天
 */
export function yestoday() {
  // @ts-ignore
  const start = new Date(moment(moment().subtract(1, "days").format("YYYY-MM-DD")));

  // @ts-ignore
  const end = new Date(moment(moment().format("YYYY-MM-DD")).subtract(1, 'millisecond'));

  return [start, end];
}

/**
 * 最近三天
 */
export function last3days() {
  // @ts-ignore
  const start = new Date(moment(moment().subtract(2, "days").format("YYYY-MM-DD")));
  const end = new Date();
  return [start, end];
}


/**
 * 最近七天
 */
export function lastweek() {
  // @ts-ignore
  const start = new Date(moment(moment().subtract(6, "days").format("YYYY-MM-DD")));
  const end = new Date();
  return [start, end];
}

/**
 * 最近一个月
 */
export function lastmonth() {
  // @ts-ignore
  const start = new Date(moment(moment().subtract(1, "month").add(1, 'day').format("YYYY-MM-DD")));
  const end = new Date();
  return [start, end];
}

/**
 * 最近三个月
 */
export function last3months() {
  // @ts-ignore
  const start = new Date(moment(moment().subtract(3, "months").add(1, 'day').format("YYYY-MM-DD")));
  const end = new Date();
  return [start, end];
}

/**
 * 本月
 */
export function month() {
  // @ts-ignore
  const start = new Date(moment(moment().startOf("month").format("YYYY-MM-DD")));
  const end = new Date();
  return [start, end];
}

/**
 * 本年
 */
export function year() {
  // @ts-ignore
  const start = new Date(moment(moment().startOf("year").format("YYYY-MM-DD")));
  const end = new Date();
  return [start, end];
}

// 自定义函数，将一个Date对象格式化为时间字符串
export function formatDateOneTime(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 自定义函数，将一个Date对象格式化为时间字符串
export function formatDateOne(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDate(timestamp: any) {
  return new Date(timestamp)
}


