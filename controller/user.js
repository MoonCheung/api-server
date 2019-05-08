const UserModel = require('../models/user')
const md5 = require('./md5')

async function login(ctx, next) {
  try {
    let req = ctx.request.body;
    console.log(req);
    let {
      username,
      password
    } = req;
    let pwd = md5(md5(password).substr(3, 8) + md5(password))
    let result = await UserModel.find({
      username
    })
    if (result.length === 0) {
      ctx.body = {
        error: 1,
        msg: '用户错误'
      }
    } else {
      let [userInfo] = result;
      let {
        username,
        password
      } = userInfo
      if (password === pwd) {
        ctx.session.username = username;
        ctx.body = {
          error: 0,
          success: 1,
          username: ctx.session.username,
          token: ctx.session.username
        }
      } else {
        ctx.body = {
          error: 2,
          msg: '未经授权的密码'
        }
      }
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: err.message
    }
  }
}

module.exports = {
  login
};