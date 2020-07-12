/*
 * @Description: app 配置
 * @Author: MoonCheung
 * @Date: 2019-04-12 16:50:52
 * @Github: https://github.com/MoonCheung
 */

const bash = require('../bash.js');
// NOTE: bash.js文件主要密钥，密码用来解析，而且需要你自己拥有这些才可以
const argv = require('yargs').config(bash).argv;

module.exports = {
  // process.env属性返回一个包含用户环境信息的对象 See environ(7).
  port: process.env.PORT || 3030,
  session: {
    key: 'blogs',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
  },
  // mongodb数据库集合文档
  mongodb: {
    url: 'mongodb://127.0.0.1:27017/Blogs',
    auth: argv.mongo_auth,
    user: argv.mongo_user,
    pass: argv.mongo_pass
  },
  // 七牛配置
  QINIU: {
    Bucket: 'blogs',
    AccessKey: argv.qn_AccessKey || 'your access key',
    SecretKey: argv.qn_SecretKey || 'your secret key'
  },
  // jwtToken
  jwtToken: {
    PrivateKey: 'blogs_token'
  },
  // 百度推送
  BAIDU: {
    site: argv.baidu_site || 'your baidu seo',
    token: argv.baidu_token || 'your baidu token'
  },
  // IP归属地配置
  GEOIP: {
    SecretID: argv.ip_secretId || 'your secret id',
    SecretKey: argv.ip_secretKey || 'your secret key'
  },
  // SMTP邮件配置
  EMAIL: {
    host: 'smtp.163.com',
    port: 465,
    user: argv.mail_user || 'your mail user',
    pass: argv.mail_pass || 'your mail pass'
  },
  // node服务器信息
  INFO: {
    status: 'success',
    msg: '数据请求成功!',
    result: {
      name: 'node-server',
      version: '1.3.0',
      author: {
        name: 'MoonCheung',
        email: 'salvador23@163.com',
        website: 'https://ikmoons.com'
      },
      github: 'https://github.com/MoonCheung',
      powered: ['Vue', 'Nuxt.js', 'mpvue', 'Node.js', 'Koa', 'MongoDB', 'Mongoose', 'Nginx']
    }
  },
  // gravatar 配置
  AVATAR: {
    size: '80',
    r: 'x',
    d: 'retro'
  }
};
