const joi = require('joi')
const tagSchema = require('../schemas/tag')
const tagService = require('../service/tag')
const statusCode = require('../utils/statusCode')

class TagController {
  /**
   * 通过分类id查询所有tag
   * @param ctx
   * @returns {Promise<boolean>}
   */
  static async getlist (ctx) {
    const { cid } = ctx.params
    const res = await tagService.getList(cid)
    if (!res) {
      return (ctx.body = statusCode.Error_500('获取失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('获取成功', res))
    }
  }

  /**
   * 创建分类
   * @param ctx name
   * @returns {Promise<boolean>}
   */
  static async create (ctx) {
    const tag = ctx.request.body
    const validate = joi.validate(tag, tagSchema.create)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await tagService.create(validate.value)
      if (!res) {
        return (ctx.body = statusCode.Error_500('标签创建失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('标签创建成功'))
      }
    }
  }

  /**
   * 编辑文章
   * @param ctx id,title,subtitle,content
   * @returns {Promise<boolean>}
   */
  static async update (ctx) {
    const tag = ctx.request.body
    const validate = joi.validate(tag, tagSchema.update)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await tagService.update(validate.value)
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
    const { tid } = ctx.params
    const res = await tagService.delete(tid)
    if (!res) {
      return (ctx.body = statusCode.Success_500('删除失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('删除成功'))
    }
  }
}

module.exports = router => {
  router.get('/tag/:cid', TagController.getlist)
  router.post('/tag', TagController.create)
  router.put('/tag', TagController.update)
  router.delete('/tag', TagController.delete)
}
