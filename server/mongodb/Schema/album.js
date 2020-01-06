const mongoose = require('../index')
const Schema = mongoose.Schema

const AlbumSchema = new Schema(
  {
    name: { type: String }, // 专辑名称
    desc: { type: String }, // 简介
    songList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Song'
      }
    ],
    singer: {
      type: Schema.Types.ObjectId,
      ref: 'Singer'
    },
    picUrl: { type: String },
    pubTime: { type: String },
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
AlbumSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
const Album = mongoose.model('Album', AlbumSchema)

module.exports = Album
