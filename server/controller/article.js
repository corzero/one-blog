const joi = require('joi')
const articleSchema = require('../schemas/article')
const articleService = require('../service/article')
const statusCode = require('../utils/statusCode')

class ArticleController {
  /**
   * 获取文章列表
   * @param ctx
   * @returns {Promise<boolean>}
   */
  static async getlist (ctx) {
    const query = ctx.query
    const validate = joi.validate(query, articleSchema.queryList)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await articleService.queryList(validate.value)
      if (!res) {
        return (ctx.body = statusCode.Error_500('获取失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('获取成功', res))
      }
    }
  }

  static async getOneById (ctx) {
    const { aid } = ctx.params
    const res = await articleService.getOne(aid)
    if (!res) {
      return (ctx.body = statusCode.Error_500('获取失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('获取成功', res))
    }
  }

  /**
   * 创建文章
   * @param ctx username、password、sex、title、
   * @returns {Promise<boolean>}
   */
  static async create (ctx) {
    const article = ctx.request.body
    article.author = ctx.user._id
    const validate = joi.validate(article, articleSchema.create)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await articleService.create(validate.value)
      if (!res) {
        return (ctx.body = statusCode.Error_500('文章创建失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('文章创建成功'))
      }
    }
  }

  /**
   * 编辑文章
   * @param ctx id,title,subtitle,content
   * @returns {Promise<boolean>}
   */
  static async update (ctx) {
    const article = ctx.request.body
    article.author = ctx.user._id
    const validate = joi.validate(article, articleSchema.update)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await articleService.update(validate.value)
      if (!res) {
        return (ctx.body = statusCode.Error_500('更新失败，请重试。'))
      } else {
        return (ctx.body = statusCode.Success_200('更新成功'))
      }
    }
  }

  /**
   * 删除文章
   * @param ctx id
   * @returns {Promise<boolean>}
   */
  static async delete (ctx) {
    const { ids } = ctx.request.body
    const res = await articleService.delete(ids)
    if (!res) {
      return (ctx.body = statusCode.Success_500('删除失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('删除成功'))
    }
  }

  /**
   * 获取用户信息
   * @param ctx title,sex,email
   * @returns {Promise<boolean>}
   */
  static async recover (ctx) {
    const { ids } = ctx.request.body
    const res = await articleService.recover(ids)
    if (!res) {
      return (ctx.body = statusCode.Success_500('恢复失败'))
    } else {
      return (ctx.body = statusCode.Success_200('恢复成功'))
    }
  }
}

module.exports = router => {
  router.get('/article', ArticleController.getlist)
  router.get('/article/:aid', ArticleController.getOneById)
  router.post('/article', ArticleController.create)
  router.put('/article', ArticleController.update)
  router.delete('article', ArticleController.delete)
  router.post('/recover', ArticleController.recover)
}
