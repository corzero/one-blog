const Joi = require('joi')

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .error(new Error('名称不能为空')), // required => default child "username" fails because ["username" is required]
  category: Joi.string()
    .required()
    .error(new Error('所属分类id不能为空'))
})

const update = create.append({
  id: Joi.string()
    .required()
    .error(new Error('参数传递错误'))
})

module.exports = {
  create,
  update
}
