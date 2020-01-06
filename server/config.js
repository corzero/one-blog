const config = {
  token: {
    secret: 'secret', // jwt密钥
    expires: '4h',
    maxAge: 604800000, // '7d'
    refrash: 10 * 60
  },
  MongoDB: {
    url: 'mongodb://localhost/super'
  },
  mysql: {
    host: 'localhost',
    user: 'root',
    // password: '1107', // linux system,
    password: 'cortejo', // win system
    port: 3306,
    database: 'super'
  },
  log: {
    filename: 'logs/super',
    pattern: '-yyyy-MM-dd.log',
    level: 'debug'
  },
  saltRounds: 10 // 生成的salt迭代次数
}
module.exports = config
