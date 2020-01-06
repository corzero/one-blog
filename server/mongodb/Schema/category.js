const mongoose = require('../index')
const Schema = mongoose.Schema

const CategorySchema = new Schema(
  {
    name: { type: String, unique: true },
    tagList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
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
CategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
const Category = mongoose.model('Category', CategorySchema)

module.exports = Category
