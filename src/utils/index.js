/**
 * Created by Cortejo on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime (time, cFormat) {
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
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
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
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
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
 * @param {string} type
 * @returns {number}
 */
export function encodeUploadType (type = '') {
  if (/folder/gi.test(type)) {
    return 'folder'
  } else if (/video/gi.test(type)) {
    return 'movie'
  } else if (/audio/gi.test(type)) {
    return 'mp3'
  } else if (/image/gi.test(type)) {
    return 'image'
  } else if (/pdf/gi.test(type)) {
    return 'pdf'
  } else if (/excel|xls|xlsx/gi.test(type)) {
    return 'excel'
  } else if (/word/gi.test(type)) {
    return 'word'
  } else if (/powerpoint/gi.test(type)) {
    return 'ppt'
  } else if (/plain/gi.test(type)) {
    return 'txt'
  } else if (/htm|html|css|javascript|json/gi.test(type)) {
    return 'code'
  } else if (/msdownload/gi.test(type)) {
    return 'exe'
  } else if (/zip|rar|gzip|tgz/gi.test(type)) {
    return 'zip'
  } else {
    return 'other'
  }
}
/**
 * @param {number} type
 * @returns {string}
 */
export function decodeUploadType (type = 0) {
  switch (type) {
    case 0:
      type = 'folder'
      break
    case 1:
      type = 'movie'
      break
    case 2:
      type = 'music'
      break
    case 3:
      type = 'image'
      break
    case 4:
      type = 'pdf'
      break
    case 5:
      type = 'excel'
      break
    case 6:
      type = 'word'
      break
    case 7:
      type = 'ppt'
      break
    case 8:
      type = 'txt'
      break
    case 9:
      type = 'code'
      break
    case 10:
      type = 'exe'
      break
    default:
      type = 'other'
      break
  }
  return type
}
/**
 * @param {fn} type
 * @returns {null}
 */
export class TaskQueue {
  constructor (arr) {
    this.queueList = arr instanceof Array ? arr : []
    this.queuePasue = false
    this.endFn = null
  }
  push (fn) {
    if (fn instanceof Function || fn instanceof Array) {
      this.queueList.push(...fn)
      return this
    } else {
      console.error('expect a function or array of function')
    }
  }
  clear () {
    this.queueList = []
    this.queuePasue = false
  }
  pause () {
    this.queuePasue = true
  }
  next () {
    this.queuePasue = false
    this.run()
  }
  end (fn) {
    if (fn instanceof Function) {
      this.endFn = fn
    }
    return this
  }
  async run () {
    this.queueList.length === 0 && this.endFn()
    while (this.queueList.length && !this.queuePasue) {
      const fn = this.queueList.shift()
      await fn()
      await this.run()
    }
  }
}
