const Koa = require("koa");
const onerror = require("koa-onerror");
const cors = require("@koa/cors");
const json = require("koa-json");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const session = require("koa-session");
const jwt = require("koa-jwt");

const app = new Koa();

// 导入白名单
const whitelist = require("./routes/whitelist");
// 导入config配置
const CONFIG = require("./config");
// 导入api接口
const router = require("./routes");

onerror(app);

// 导航路由中间件
app.use(async(ctx, next) => {
  let allowedOrigins = [
    'http://www.ikmoons.com',
    'http://api.ikmoons.com',
    'http://admin.ikmoons.com',
    'file://'
  ];
  let origin = ctx.request.origin
  if(allowedOrigins.includes(origin) || origin.includes('localhost')){
    ctx.set('Access-Control-Allow-Origin', origin)
    if (ctx.url.match(/^((?!\/api).)*$/)) {
      ctx.body = CONFIG.INFO;
    }
  }

  ctx.set({
		'Access-Control-Allow-Headers': 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With',
		'Access-Control-Allow-Methods': 'PUT,PATCH,POST,GET,DELETE,OPTIONS',
		'Access-Control-Max-Age': '1728000',
		'Content-Type': 'application/json;charset=utf-8',
  });

  //OPTIONS
	if (ctx.request.method == 'OPTIONS') { //默认输出'get'
		ctx.status = 200;
		return false;
  }

  await next();
});

// token错误处理
app.use((ctx, next) =>
  next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = "token已过期,请重新登陆";
    } else {
      throw err;
    }
  })
);

app.use(
  jwt({
    secret: CONFIG.jwtToken.PrivateKey
  }).unless({
    // 不需要认证JWT访问
    path: whitelist
  })
);

app.keys = ["some secret"];
app.use(
  session(
    {
      key: CONFIG.session.key,
      maxAge: CONFIG.session.maxAge
    },
    app
  )
);

app.use(logger());
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
    onerror: function(err, ctx) {
      ctx.throw("body解析错误:", err);
    }
  })
);
app.use(json());
// CORS跨域请求配置
app.use(cors());
// router
app.use(router.routes(), router.allowedMethods());

if (!module.parent) {
  app.listen(
    CONFIG.port,
    console.log(`server is running at http://localhost:${CONFIG.port}`)
  );
}
