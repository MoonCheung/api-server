/*
 * @Description: 配置
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-04-12 16:50:52
 * @LastEditors: MoonCheung
 * @LastEditTime: 2020-01-24 14:21:15
 */

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
  mongodb: "mongodb://127.0.0.1:27017/Blogs",
  // 七牛配置
  QINIU: {
    Bucket: "blogs",
    AccessKey: "3mY5Q8NhEo8ZHKg6z8crZdAPkimD3cxG3y4wwvif",
    SecretKey: "qytWalGJgnjQGyyFr80mD80uKCpMIugI4qK3zR2B"
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