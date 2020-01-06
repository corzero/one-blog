const Joi = require('joi')

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .error(new Error('名称不能为空')), // required => default child "username" fails because ["username" is required]
  tagList: Joi.array().default([])
})

const update = create.append({
  _id: Joi.string()
    .required()
    .error(new Error('参数传递错误')),
  tagList: Joi.array()
    .required()
    .error(new Error('标签id不能为空'))
})

module.exports = {
  create,
  update
}
