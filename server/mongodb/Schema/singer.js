const mongoose = require('../index')
const Schema = mongoose.Schema

const SingerSchema = new Schema(
  {
    name: { type: String },
    desc: { type: String },
    albumList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Album'
      }
    ],
    picUrl: { type: String },
    random: {
      type: Number,
      default: Math.random()
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
SingerSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
const Singer = mongoose.model('Singer', SingerSchema)

module.exports = Singer
