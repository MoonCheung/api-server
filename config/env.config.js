/*
 * @Description: 环境配置
 * @Author: MoonCheung
 * @Date: 2020-02-03 11:21:46
 * @Github: https://github.com/MoonCheung
 */

const CONFIG = require('./index');
const environment = process.env.NODE_ENV;
const isDevMode = Object.is(environment, 'development');
const isProMode = Object.is(environment, 'production');

const envMap = {
  // 数据库mongoose环境
  development: {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  },
  production: {
    // 此选项表示设置为 authenticationDatabase to admin
    auth: { authSource: CONFIG.mongodb.auth },
    user: CONFIG.mongodb.user,
    pass: CONFIG.mongodb.pass,
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
};

module.exports = envMap[environment];
