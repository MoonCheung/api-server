/*
 * @Description: app 配置
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-04-12 16:50:52
 * @LastEditors: MoonCheung
 * @LastEditTime: 2020-02-03 11:40:39
 */

const bash = require('../bash.js');
// NOTE: bash.js文件主要密钥，密码用来解析，而且需要你自己拥有这些才可以
const argv = require('yargs').config(bash).argv;

module.exports = {
  // process.env属性返回一个包含用户环境信息的对象 See environ(7).
  port: process.env.PORT || 3030,
  session: {
    key: "blogs",
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
    url: "mongodb://127.0.0.1:27017/Blogs",
    auth: argv.mongo_auth,
    user: argv.mongo_user,
    pass: argv.mongo_pass
  },
  // 七牛配置
  QINIU: {
    Bucket: "blogs",
    AccessKey: argv.qn_AccessKey || 'your access key',
    SecretKey: argv.qn_SecretKey || 'your secret key'
  },
  // jwtToken
  jwtToken: {
    PrivateKey: "blogs_token"
  },
  // 百度推送
  BAIDU: {
    url: "http://data.zz.baidu.com",
    site: "www.ikmoons.com",
    token: "**************"
  },
  // IP归属地配置
  GEOIP: {
    SecretID: argv.ip_secretId || 'your secret id',
    SecretKey: argv.ip_secretKey || 'your secret key'
  },
  // node服务器信息
  INFO: {
    status: "success",
    msg: "数据请求成功!",
    result: {
      name: "node-server",
      version: "1.0.0",
      author: {
        name: "MoonCheung",
        email: "salvador23@163.com"
      },
      github: "https://github.com/MoonCheung",
      powered: ["Vue", "Nuxt.js", "mpvue", "Node.js", "Koa", "MongoDB", "Mongoose", "Nginx"]
    }
  },
  // gravatar 配置
  AVATAR: {
    size: '80',
    r: 'x',
    d: 'retro'
  }
};