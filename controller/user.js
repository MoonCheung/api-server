/*
 * @Description: 用户信息
 * @Author: MoonCheung
 * @Date: 2019-04-12 22:01:54
 * @Github: https://github.com/MoonCheung
 */

const UserModel = require('../models/user');
const CONFIG = require('../config');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

async function login(ctx) {
  try {
    let { username, password } = ctx.request.body;
    let result = await UserModel.find({
      username
    });
    if (result.length === 0) {
      ctx.body = {
        error: 1,
        msg: '用户错误'
      };
    } else {
      let [userInfo] = result;
      //TODO:md5(md5(密码))
      if (Object.is(userInfo.password, md5(password))) {
        let name = (ctx.session.username = userInfo.username);
        const token = jwt.sign(
          {
            data: {
              name: name,
              _id: userInfo._id
            }
          },
          CONFIG.jwtToken.PrivateKey,
          {
            expiresIn: '2h' //2个小时到期
          }
        );
        // console.log(token); //打印出token
        ctx.body = {
          code: 1,
          error: 0,
          username: ctx.session.username,
          token: token,
          msg: '登录成功'
        };
      } else {
        ctx.body = {
          error: 2,
          msg: '未经授权的密码'
        };
      }
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '登陆失败,未经过token验证成功',
      err
    };
  }
}

async function info(ctx) {
  try {
    let infoData = ctx.state.user;
    let getUser = await UserModel.find({
      username: infoData.data.name
    });
    if (getUser.length === 0) {
      ctx.body = {
        error: 1,
        msg: '请求服务器无法获取对应信息'
      };
    } else {
      let [userInfo] = getUser;
      ctx.body = {
        code: 1,
        error: 0,
        msg: '响应服务器得到返回信息',
        id: userInfo._id,
        name: userInfo.username,
        roles: userInfo.roles,
        avatar: userInfo.avatar,
        intro: userInfo.intro
      };
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: err.message
    };
  }
}

async function logout(ctx) {
  try {
    let data = ctx.state.user;
    await UserModel.findOne({
      _id: data._id,
      username: data.name
    });
    ctx.body = {
      error: 0,
      msg: '退出登录成功'
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: err.message
    };
  }
}

async function updateInfo(ctx) {
  try {
    let data = ctx.request.body;
    let userInfo = await UserModel.findById({
      _id: data.id
    });
    if (Object.is(userInfo.password, md5(data.oldPwd))) {
      let result = await UserModel.findOneAndUpdate(
        {
          _id: data.id
        },
        {
          $set: {
            name: data.nickname,
            password: md5(data.newPwd), //TODO:md5(md5(密码))
            intro: data.intro,
            email: data.email,
            avatar: data.avatar
          }
        },
        {
          projection: {
            __v: 0,
            _id: 0,
            password: 0,
            intro: 0,
            email: 0
          },
          new: true,
          upsert: true
        }
      );
      ctx.body = {
        code: 1,
        error: 0,
        msg: '更新用户信息成功',
        result
      };
    } else {
      ctx.body = {
        error: 1,
        msg: '输入密码不对，更新出错',
        result: ''
      };
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '更新用户信息失败',
      err
    };
  }
}

module.exports = {
  login,
  info,
  logout,
  updateInfo
};
