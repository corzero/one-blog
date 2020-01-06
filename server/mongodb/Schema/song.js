const mongoose = require('../index')
const Schema = mongoose.Schema

const SongSchema = new Schema(
  {
    name: { type: String },
    singer: { type: String }, // 演唱
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Singer'
    },
    duration: { type: String }, // 时长
    lyric: { type: String }, // 歌词
    album: {
      type: Schema.Types.ObjectId,
      ref: 'Album'
    },
    playUrl: {
      high: { type: String },
      normal: { type: String },
      low: { type: String }
    },
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
) // 去掉版本控制

SongSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
const Song = mongoose.model('Song', SongSchema)

module.exports = Song
