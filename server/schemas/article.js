const Joi = require('joi')

const create = Joi.object().keys({
  title: Joi.string()
    .required()
    .error(new Error('主题不能为空')), // required => default child "username" fails because ["username" is required]
  category: Joi.string()
    .required()
    .error(new Error('分类不能为空')),
  tagList: Joi.array()
    .required()
    .error(new Error('标签不能为空')),
  desc: Joi.string(),
  content: Joi.string()
    .required()
    .error(new Error('内容不能为空')),
  isDeleted: Joi.boolean().default(false),
  author: Joi.string()
    .required()
    .error(new Error('参数错误'))
})

const update = create.append({
  _id: Joi.string()
    .required()
    .error(new Error('参数传递错误'))
})

const queryList = Joi.object().keys({
  status: Joi.number().default(0),
  title: Joi.string().allow(''),
  category: Joi.string().allow(''),
  tag: Joi.string().allow(''),
  pageSize: Joi.number()
    .required()
    .error(new Error('分页条数不能为空')),
  pageNum: Joi.number()
    .required()
    .error(new Error('分页页码不能为空'))
})
module.exports = {
  create,
  update,
  queryList
}
