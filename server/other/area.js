const data = require('./region.json')
const fs = require('fs')
const path = require('path')
let area = null
const global = { code: '86', name: '中国' }

function setChild(parent) {
  const childCache = data[parent.code] // 获取下属内容
  const children = []
  Object.keys(childCache).forEach(e => {
    // 子项改造
    let childItem = {
      code: e, // 子项代码
      parent: parent.code,
      name: childCache[e] // 名称
    }
    if (data[e]) {
      // 判断子项下面是否还有孙项
      childItem = setChild(childItem)
    }
    children.push(childItem)
  })
  parent.children = children
  return parent
}
area = setChild(global)
area = area.children
fs.writeFile(
  path.resolve(__dirname, './area.json'),
  JSON.stringify(area),
  function(err, data) {
    if (err) {
      console.error(err)
    }
    console.log('----------新增成功-------------')
  }
)
