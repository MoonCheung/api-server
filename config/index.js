module.exports = {
  // process.env属性返回一个包含用户环境信息的对象 See environ(7).
  port: process.env.PORT || 3030,
  // session: {
  //   key: 'blog',
  //   maxAge: 86400000
  // },
  mongodb: 'mongodb://127.0.0.1:27017/MyBlog'
}