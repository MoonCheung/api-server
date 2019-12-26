/*
 * @Description: 文章评论
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-12-12 22:16:32
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-12-26 22:50:01
 */

const commentModel = require('../models/comment');
const gravatar = require('gravatar');
const CONFIG = require('../config');
const md = require('markdown-it')();
const md5 = require('md5');

/**
 * 添加评论列表 API
 * @param {*} ctx
 */
async function fetchAddComment(ctx) {
  try {
    const { id, name, email, site, content } = ctx.request.body;
    let avatar = md5(email).toLowerCase();
    let getAvatar = gravatar.url(avatar, {
        s: CONFIG.AVATAR.size,
        r: CONFIG.AVATAR.r,
        d: CONFIG.AVATAR.d
      },
      true);
    await commentModel.create({
      artId: id,
      from_user: name,
      from_email: email,
      from_webSite: site,
      from_avatar: getAvatar,
      from_content: content
    }).then(res => {
      let result = {
        id: res.id,
        from_user: res.from_user,
        from_email: res.from_email,
        from_avatar: res.from_avatar,
        from_content: res.from_content,
        like: res.like,
        from_date: res.from_date
      }
      ctx.body = {
        code: 1,
        error: 0,
        result,
        msg: "添加评论成功",
      }
    })
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: "添加评论失败",
      err
    }
  }
}

async function fetchComment(ctx) {
  try {
    const { id } = ctx.request.body;
    let result = await commentModel.find({
      artId: id
    }, {
      _id: 0,
      id: 1,
      from_user: 1,
      from_email: 1,
      from_webSite: 1,
      from_avatar: 1,
      from_content: 1,
      like: 1,
      from_date: 1
    }, {
      sort: {
        id: -1
      }
    })
    ctx.body = {
      code: 1,
      error: 0,
      result,
      msg: "获取评论列表成功",
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: "获取评论列表失败",
      err
    }
  }
}

module.exports = {
  fetchComment,
  fetchAddComment
};