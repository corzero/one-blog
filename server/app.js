const path = require('path')
const Koa = require('koa')
const http = require('http')
const socket = require('socket.io')
const jwtKoa = require('koa-jwt')
const koaBody = require('koa-body')
const router = require('./routers')
const socketHandler = require('./middleware/socket')
const { errorHandle } = require('./middleware')
const config = require('./config')
const logger = require('./utils/logger')
const app = new Koa()
/* 当token验证异常时候的处理，如token过期、token错误 */
app.use(errorHandle())

/* 路由权限控制 */
app.use(
  jwtKoa({ secret: config.token.secret }).unless({
    // 设置login、register接口，可以不需要认证访问
    path: [
      /^\//,
      /^\/login/,
      /^\/register/
      // /^\*$/ // 设置除了私有接口外的其它资源，可以不需要认证访问
    ]
  })
)

app.use(require('koa-static')(path.join(__dirname, 'public')))
app.use(require('koa-static')(path.join(__dirname, 'dist')))
app.use(koaBody({ strict: false, multipart: true }))
// app.use(
//   koaBody({
//     multipart: true,
//     formidable: {
//       hash: 'sha1',
//       multipart: true,
//       uploadDir: path.join(__dirname, './public'),
//       keepExtensions: true,
//       maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
//       onFileBegin: (name, file) => {
//         logger.info(`Files: ${name},Data: ${JSON.stringify(file)}`)
//         file.path = filePathHandler(file.path)
//       }
//     }
//   })
// )
app.use(router.routes()).use(router.allowedMethods())

const server = http.createServer(app.callback())
const io = socket(server)
// 监听socket连接
io.on('connection', client => socketHandler(client))
server.listen(3000, () => {
  logger.info('[ok] Server starts at http://127.0.0.1:3000')
})
