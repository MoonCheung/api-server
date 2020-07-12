const Koa = require('koa');
const onerror = require('koa-onerror');
const cors = require('@koa/cors');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-session');
const compress = require('koa-compress');
const userAgent = require('koa2-useragent');
const jwt = require('koa-jwt');

const feed = require('./utils/rss');
const siteMap = require('./utils/sitemap');
// 生成RSS
feed.getRSSData();
// 生成网站地图
siteMap.getSiteMapData();

const app = new Koa({ proxy: true });

// 导入白名单
const whitelist = require('./routes/whitelist');
// 导入config配置
const CONFIG = require('./config');
// 导入api接口
const router = require('./routes');

onerror(app);

// 用户代理解析器
app.use(userAgent());

// 导航路由状态
app.use(async (ctx, next) => {
  const regex = /^((?!\/api).)*$/;
  if (regex.test(ctx.url)) {
    ctx.body = CONFIG.INFO;
  }
  await next().catch(err => {
    if (err.message === 'Authentication Error') {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        msg: '身份验证错误且token已过期，请重新登陆'
      };
    } else {
      throw err;
    }
  });
});

app.use(
  jwt({
    secret: CONFIG.jwtToken.PrivateKey
  }).unless({
    // 不需要认证JWT访问
    path: whitelist
  })
);

app.keys = ['some secret'];
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
    enableTypes: ['json', 'form', 'text'],
    onerror: function(err, ctx) {
      ctx.throw('body解析错误:', err);
    }
  })
);
app.use(json());
// CORS跨域请求配置
app.use(cors());
// 压缩中间件
app.use(compress());
// router
app.use(router.routes(), router.allowedMethods());

if (!module.parent) {
  app.listen(CONFIG.port, console.log(`server is running at http://localhost:${CONFIG.port}`));
}
