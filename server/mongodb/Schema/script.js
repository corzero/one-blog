const mongoose = require('../index')
const Schema = mongoose.Schema

const ScriptSchema = new Schema(
  {
    name: { type: String, unique: true },
    remark: { type: String },
    argument: { type: String },
    disabled: {
      type: Boolean,
      default: false
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
ScriptSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
const Script = mongoose.model('Script', ScriptSchema)

module.exports = Script
