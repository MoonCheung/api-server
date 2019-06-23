const Koa = require('koa');
const onerror = require('koa-onerror');
const cors = require('@koa/cors');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-session');
const jwt = require('koa-jwt');

const app = new Koa();

// 导入白名单
const whitelist = require('./routes/whitelist');
// 导入config配置
const CONFIG = require('./config');
// 导入api接口
const router = require('./routes');

// 测试mongoose数据库插入是否成功
// const category = require('./models/category')

// console.log(new category({
//   categoryname: '生活日记',
//   categorydesc: '感想一些生活以及旅行',
//   cdate: 1557567614068,
// }))

onerror(app);

// token错误处理
app.use((ctx, next) =>
    next()['catch']((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = 'token已过期,请重新登陆';
        } else {
            throw err;
        }
    })
);

app.use(
    jwt({
        secret: 'blogs_token',
    }).unless({
        path: whitelist,
    })
);

app.keys = ['some secret'];
app.use(
    session(
        {
            key: CONFIG.session.key,
            maxAge: CONFIG.session.maxAge,
        },
        app
    )
);

app.use(logger());
app.use(
    bodyparser({
        enableTypes: ['json', 'form', 'text'],
        onerror: function (err, ctx) {
            ctx['throw']('body解析错误:', err);
        },
    })
);
app.use(json());
// CORS跨域请求配置
app.use(cors());
// router
app.use(router.routes(), router.allowedMethods());

if (!module.parent) {
    app.listen(CONFIG.port, console.log(`server is running at http://localhost:${CONFIG.port}`));
}
