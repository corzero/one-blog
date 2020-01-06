const mongoose = require('../index')
const Schema = mongoose.Schema

const ArticleSchema = new Schema(
  {
    title: { type: String }, // 主题
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }, // 分类
    tagList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ], // 标签
    desc: { type: String },
    content: { type: String }, // 内容
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    visited: {
      type: Number,
      default: 0
    },
    isDeleted: { type: Boolean, default: false },
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
)
ArticleSchema.pre('save', function(next) {
  if (!this.desc) {
    this.desc = this.content.slice(0, 50)
  }
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
ArticleSchema.pre('findOne', function(next) {
  this.visited++
  next()
})
const Article = mongoose.model('Article', ArticleSchema)

module.exports = Article
