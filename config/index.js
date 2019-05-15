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
    renew: false,
  },
  mongodb: 'mongodb://127.0.0.1:27017/Blogs',
  // 七牛配置
  QINIU: {
    Bucket: 'blogs',
    AccessKey: '3mY5Q8NhEo8ZHKg6z8crZdAPkimD3cxG3y4wwvif',
    SecretKey: 'qytWalGJgnjQGyyFr80mD80uKCpMIugI4qK3zR2B'
  }
}