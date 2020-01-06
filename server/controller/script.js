const joi = require('joi')
const scriptSchema = require('../schemas/script')
const scriptService = require('../service/script')
const statusCode = require('../utils/statusCode')

class ScriptController {
  /**
   * 查询所有script
   * @param ctx
   * @returns {Promise<boolean>}
   */
  static async getlist (ctx) {
    const res = await scriptService.getList()
    if (!res) {
      return (ctx.body = statusCode.Error_500('获取失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('获取成功', res))
    }
  }

  /**
   * 创建脚本
   * @param ctx name
   * @returns {Promise<boolean>}
   */
  static async create (ctx) {
    const script = ctx.request.body
    const validate = joi.validate(script, scriptSchema.create)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await scriptService.create(validate.value)
      if (!res) {
        return (ctx.body = statusCode.Error_500('脚本创建失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('脚本创建成功'))
      }
    }
  }

  /**
   * 编辑文章
   * @param ctx id,title,subtitle,content
   * @returns {Promise<boolean>}
   */
  static async update (ctx) {
    const script = ctx.request.body
    const validate = joi.validate(script, scriptSchema.update)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await scriptService.update(validate.value)
      if (!res) {
        return (ctx.body = statusCode.Error_500('更新失败，请重试。'))
      } else {
        return (ctx.body = statusCode.Success_200('更新成功'))
      }
    }
  }

  /**
   * 删除标签
   * @param ctx id
   * @returns {Promise<boolean>}
   */
  static async delete (ctx) {
    const { ids } = ctx.request.body
    const res = await scriptService.delete(ids)
    if (!res) {
      return (ctx.body = statusCode.Success_500('删除失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('删除成功'))
    }
  }

  /**
   * 修改状态
   * @param ctx ids
   * @returns {Promise<boolean>}
   */
  static async changeStatus (ctx) {
    const { ids, status } = ctx.request.body
    const res = await scriptService.changeStatus(ids, status)
    if (!res) {
      return (ctx.body = statusCode.Success_500('删除失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('删除成功'))
    }
  }
}

module.exports = router => {
  router.get('/script', ScriptController.getlist)
  router.post('/script', ScriptController.create)
  router.put('/script', ScriptController.update)
  router.delete('/script', ScriptController.delete)
  router.put('/scriptStatus', ScriptController.changeStatus)
}
