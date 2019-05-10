const UserModel = require('../models/user')
const md5 = require('./md5')

async function login(ctx, next) {
  try {
    let req = ctx.request.body;
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

async function info(ctx) {
  try {
    let req = ctx.request.query;
    let name = req.token; //打印: admin
    let getUser = await UserModel.find({
      username: name
    })
    if (getUser.length === 0) {
      ctx.body = {
        error: 1,
        msg: '请求服务器无法获取对应信息'
      }
    } else {
      let [userInfo] = getUser
      ctx.body = {
        name: userInfo.username,
        roles: userInfo.roles,
        avatar: userInfo.avatar,
        introduction: userInfo.introduction,
        success: 1,
        msg: '响应服务器得到返回信息'
      }
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: err.message
    }
  }
}

async function logout(ctx, next) {
  try {
    // TODO: 暂时处理bug,从浏览器Network里面报错error: 1
    let req = ctx.request.body;
    let name = req; // 打印: { admin: '' }
    await UserModel.update({
      username: name
    })
    ctx.body = {
      error: 0,
      msg: 'delete token!!!'
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: err.message
    }
  }
}

module.exports = {
  login,
  info,
  logout
};