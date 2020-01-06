const joi = require('joi')
const categorySchema = require('../schemas/category')
const categoryService = require('../service/category')
const statusCode = require('../utils/statusCode')

class CategoryController {
  /**
   * 获取分类列表
   * @param ctx
   * @returns {Promise<boolean>}
   */
  static async getlist (ctx) {
    const res = await categoryService.getList()
    if (!res) {
      return (ctx.body = statusCode.Error_500('获取失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('获取成功', res))
    }
  }

  /**
   * 获取分类列表及其tag
   * @param ctx
   * @returns {Promise<boolean>}
   */
  static async getAllWidthTag (ctx) {
    const res = await categoryService.getAllWidthTag()
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
    const category = ctx.request.body
    const validate = joi.validate(category, categorySchema.create)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await categoryService.create(validate.value)
      if (!res) {
        return (ctx.body = statusCode.Error_500('文章创建失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('文章创建成功'))
      }
    }
  }

  /**
   * 编辑分类
   * @param ctx id,title,subtitle,content
   * @returns {Promise<boolean>}
   */
  static async update (ctx) {
    const category = ctx.request.body
    const validate = joi.validate(category, categorySchema.update)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await categoryService.update(validate.value)
      if (!res) {
        return (ctx.body = statusCode.Error_500('更新失败，请重试。'))
      } else {
        return (ctx.body = statusCode.Success_200('更新成功'))
      }
    }
  }

  /**
   * 删除分类
   * @param ctx id
   * @returns {Promise<boolean>}
   */
  static async delete (ctx) {
    const { ids } = ctx.request.body
    const res = await categoryService.delete(ids)
    if (!res) {
      return (ctx.body = statusCode.Success_500('删除失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('删除成功'))
    }
  }
}

module.exports = router => {
  router.get('/categoryTag', CategoryController.getAllWidthTag)
  router.get('/category', CategoryController.getlist)
  router.post('/category', CategoryController.create)
  router.put('/category', CategoryController.update)
  router.delete('/category', CategoryController.delete)
}
