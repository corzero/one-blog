const Joi = require('joi')

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .error(new Error('脚本名称不能为空')),
  remark: Joi.string()
    .required()
    .error(new Error('请填写备注信息')),
  argument: Joi.string()
    .required()
    .error(new Error('参数不能为空')),
  disabled: Joi.boolean().default(false)
})

const update = create.append({
  _id: Joi.string()
    .required()
    .error(new Error('缺少参数'))
})

module.exports = {
  create,
  update
}
