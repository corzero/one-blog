const mongoose = require('../index')

const Schema = mongoose.Schema

const UsersSchema = new Schema({
  username: { type: String },
  password: { type: String },
  sex: { type: Boolean },
  age: { type: Number, min: 1, max: 100 },
  email: { type: String },
  title: { type: String, default: '这个人很懒他什么也没留下' },
  avatar: { type: String },
  delivery: { type: Boolean, default: true }, // 是否发现主页
  region: { type: Array },
  baseFolder: { type: String },
  role: { type: String, default: 'user' },
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
}) // 去掉版本控制

const User = mongoose.model('User', UsersSchema)

module.exports = User
