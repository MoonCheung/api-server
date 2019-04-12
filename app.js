import Koa from 'koa'
const app = new Koa()

app.use(async ctx => {
  ctx.body = 'Hello 运行koa应用程序成功啦！';
});


app.listen(3030, console.log("application is start at port 3030"))