const mongoose = require('../index')
const Schema = mongoose.Schema

const TagSchema = new Schema(
  {
    name: { type: String, unique: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
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
TagSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
const Tag = mongoose.model('Tag', TagSchema)

module.exports = Tag
