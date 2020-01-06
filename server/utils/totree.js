const toTree = (data) => {
  // 删除所有children, 以防止多次调用
  data.forEach(function (item) {
    delete item.children
  })

  // 将数据存储为以id为KEY的map索引数据列
  let map = {}
  data.forEach(function (item) {
    let type = item.type
    if (type === 'folder') {
      map[item.id] = item
    }
  })
  // console.log(map)
  let val = []
  data.forEach(function (item) {
    // 以当前遍历项的parentId, 去map对象中找到索引的id
    let parent = map[item.parentId]
    // 如果找到索引，那么说明此项不在顶级当中, 那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      // 如果没有在map中找到对应的索引ID, 那么直接把当前的item添加到val结果集中，作为顶级
      if (item.parentId !== -2) {
        val.push(item)
      }
    }
  })
  return val
}
module.exports = { toTree }
