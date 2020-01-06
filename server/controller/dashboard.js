const dashboardService = require('../service/dashboard')
const statusCode = require('../utils/statusCode')

class DashboardController {
  /**
   * 通过分类id查询所有dashboard
   * @param ctx
   * @returns {Promise<boolean>}
   */
  static async articleVisit (ctx) {
    const res = await dashboardService.getArticleVisit()
    if (!res) {
      return (ctx.body = statusCode.Error_500('查询失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('查询成功', res))
    }
  }

  /**
   * 创建分类
   * @param ctx name
   * @returns {Promise<boolean>}
   */
  static async articleFrequency (ctx) {
    const res = await dashboardService.getArticleFrequency()
    if (!res) {
      return (ctx.body = statusCode.Error_500('查询失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('查询成功', res))
    }
  }

  /**
   * 编辑文章
   * @param ctx id,title,subtitle,content
   * @returns {Promise<boolean>}
   */
  static async websitVisit (ctx) {
    const res = await dashboardService.getWebsitVisit()
    if (!res) {
      return (ctx.body = statusCode.Error_500('查询失败，请重试。'))
    } else {
      return (ctx.body = statusCode.Success_200('查询成功', res))
    }
  }

  /**
   * 删除标签
   * @param ctx id
   * @returns {Promise<boolean>}
   */
  static async articleTotal (ctx) {
    const res = await dashboardService.getArticleCount()
    if (!res) {
      return (ctx.body = statusCode.Success_500('查询失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('查询成功', res))
    }
  }

  /**
   * 文章类型
   * @param ctx id
   * @returns {Promise<boolean>}
   */
  static async articleType (ctx) {
    const res = await dashboardService.getArticleType()
    if (!res) {
      return (ctx.body = statusCode.Success_500('查询失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('查询成功', res))
    }
  }
}
module.exports = router => {
  router.get('/articleVisit', DashboardController.articleVisit)
  router.get('/articleFrequency', DashboardController.articleFrequency)
  router.get('/websitVisit', DashboardController.websitVisit)
  router.get('/articleTotal', DashboardController.articleTotal)
  router.get('/articleType', DashboardController.articleType)
}
