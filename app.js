const Koa = require('koa')
const app = new Koa()
const onerror = require('koa-onerror')
const cors = require('@koa/cors');
//导入config配置
const CONFIG = require('./config')
//导入api接口
const api = require('./routes/api')

onerror(app);

//CORS跨域请求配置
app.use(cors());
//router
app.use(api.routes(), api.allowedMethods());

if (!module.parent) {
  app.listen(CONFIG.port, console.log(`server is running at http://localhost:${CONFIG.port}`))
}