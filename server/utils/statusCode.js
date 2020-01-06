const statusCode = {
  /**
   * @param {请求成功}
   * @returns {Response}
   */
  Success_200: (msg = '请求成功', data) => {
    // 请求成功
    return {
      code: 200,
      msg,
      data
    }
  },
  /**
   * @param {未授权}
   * @returns {Response}
   */
  Error_400: (msg = '参数错误') => {
    // 未授权
    return {
      code: 400,
      msg
    }
  },
  /**
   * @param {token过期}
   * @returns {Response}
   */
  Error_401: (msg = '身份已过期，请重新登录') => {
    // token 过期
    return {
      code: 401,
      msg
    }
  },
  /**
   * @param {禁止请求}
   * @returns {Response}
   */
  Error_403: (msg = '资源禁止请求') => {
    // 禁止请求
    return {
      code: 403,
      msg
    }
  },
  /**
   * @param {未找到}
   * @returns {Response}
   */
  Error_404: (msg = '资源未找到') => {
    // 未找到
    return {
      code: 404,
      msg
    }
  },
  /**
   * @param {内部错误}
   * @returns {Response}
   */
  Error_500: (msg = '服务器内部错误，请重试') => {
    // 服务器内部错误
    return {
      code: 500,
      msg
    }
  }
}
module.exports = statusCode
