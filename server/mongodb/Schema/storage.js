const mongoose = require('../index')
const Schema = mongoose.Schema

const StorageSchema = new Schema(
  {
    parentId: { type: String, default: '' },
    isFolder: { type: Boolean, default: true },
    fName: { type: String, default: '新建文件夹' }, // 上传时的名称
    hash: { type: String, default: '' },
    path: { type: String, default: '' },
    type: { type: String, default: 'folder' }, // 类型
    size: { type: Number, default: 0 },
    share: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    meta: {
      createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date,
        default: Date.now()
      }
    }
  },
  { VersionKey: false }
) // 去掉版本控制

StorageSchema.pre('save', function (next) {
  if (this.isNew) {
    if (this.isFolder) {
      this.path += `/${this.id}`
    }
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Storage = mongoose.model('Storage', StorageSchema)

module.exports = Storage
