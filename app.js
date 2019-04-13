const Koa = require('koa')
//导入config配置
const CONFIG = require('./config')

const app = new Koa()

app.use(async ctx => {
  ctx.body = 'Hello 运行koa应用程序成功啦！';
});

if (!module.parent) {
  app.listen(CONFIG.port, console.log(`server is running at http://localhost:${CONFIG.port}`))
}