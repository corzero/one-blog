const Joi = require('joi')

const regiester = Joi.object().keys({
  username: Joi.string()
    .required()
    .error(new Error('用户名不能为空')), // required => default child "username" fails because ["username" is required]
  password: Joi.string()
    .required()
    .error(new Error('密码不能为空'))
    .alphanum() // 字母数字混合
    .error(new Error('密码必须包含字母数字')),
  email: Joi.string()
    .required()
    .error(new Error('邮箱必填'))
    .email()
    .error(new Error('邮箱格式错误')),
  avatar: Joi.string(),
  delivery: Joi.boolean().default(true),
  region: Joi.array(),
  sex: Joi.boolean(),
  age: Joi.number(),
  title: Joi.string().default('这个人好懒，他什么都没留下~~')
})

const login = Joi.object().keys({
  username: Joi.string()
    .required()
    .error(new Error('用户名不能为空')),
  password: Joi.string()
    .required()
    .error(new Error('密码不能为空'))
    .alphanum() // 字母数字混合
    .error(new Error('密码必须包含字母数字'))
})

const updateUser = regiester.append({
  uid: Joi.string()
    .required()
    .error(new Error('参数传递错误'))
})

module.exports = {
  regiester,
  login,
  updateUser
}
