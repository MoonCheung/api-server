/*
 * @Description: 文章评论
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-12-12 22:16:32
 * @LastEditors: MoonCheung
 * @LastEditTime: 2020-01-04 21:52:09
 */

const commentModel = require('../models/comment');
const replyModel = require('../models/reply');
const gravatar = require('gravatar');
const CONFIG = require('../config');
const md = require('markdown-it')();
const geoip = require('geoip-lite');
const md5 = require('md5');

/**
 * 添加评论列表 API
 * @param {*} ctx
 */
async function fetchAddComment(ctx) {
  try {
    const ua = ctx.userAgent.source
    const ip = ctx.request.headers['x-real-ip'] || '120.206.210.25';
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
      from_content: content,
      from_ip: ip,
      from_locate: geoip.lookup(ip),
      from_ua: ua
    }).then(res => {
      let result = {
        id: res.id,
        from_user: res.from_user,
        from_email: res.from_email,
        from_avatar: res.from_avatar,
        from_content: res.from_content,
        like: res.like,
        from_locate: res.from_locate,
        from_ua: res.from_ua,
        reply: res.reply,
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

/**
 * 获取评论列表API
 * @param {*} ctx
 */
async function fetchComment(ctx) {
  try {
    const data = ctx.request.body;
    const id = parseInt(data.id);
    const result = await commentModel.aggregate([{
        $match: {
          artId: id
        }
      },
      {
        $project: {
          id: 1,
          artId: 1,
          from_user: 1,
          from_email: 1,
          from_webSite: 1,
          from_avatar: 1,
          from_content: 1,
          like: 1,
          from_locate: 1,
          from_ua: 1,
          from_date: 1,
          _id: 0
        }
      },
      {
        $lookup: {
          from: "replies",
          let: { commentId: "$id" },
          pipeline: [{
            $match: {
              $expr: {
                $eq: ["$comment_id", "$$commentId"]
              }
            }
          }, {
            $project: { _id: 0, __v: 0 }
          }],
          as: "reply"
        }
      },
      {
        $sort: {
          id: -1 //降序排列
        }
      }
    ])
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

/**
 * 添加回复评论API
 * @param {*} ctx
 */
async function addReplyComment(ctx) {
  try {
    const { replyId, name, email, site, content } = ctx.request.body;
    const ua = ctx.userAgent.source
    const ip = ctx.request.headers['x-real-ip'] || '120.206.210.25';
    let avatar = md5(email).toLowerCase();
    let getAvatar = gravatar.url(avatar, {
        s: CONFIG.AVATAR.size,
        r: CONFIG.AVATAR.r,
        d: CONFIG.AVATAR.d
      },
      true);
    const cmtData = await commentModel.findOne({
      id: replyId
    }, {
      _id: 0,
      id: 1,
    });
    const commentId = cmtData.id.toString();
    if (Object.is(commentId, replyId)) {
      await replyModel.create({
        comment_id: replyId,
        from_user: name,
        from_email: email,
        from_webSite: site,
        from_avatar: getAvatar,
        from_content: content,
        from_locate: geoip.lookup(ip),
        from_ua: ua
      }).then(res => {
        let result = {
          parentId: res.comment_id,
          id: res.id,
          from_user: res.from_user,
          from_email: res.from_email,
          from_webSite: res.from_webSite,
          from_avatar: res.from_avatar,
          from_content: res.from_content,
          like: res.like,
          from_locate: res.from_locate,
          from_ua: res.from_ua,
          from_date: res.from_date
        }
        ctx.body = {
          code: 1,
          error: 0,
          result,
          msg: "添加回复评论成功",
        }
      })
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: "添加回复评论失败",
      err
    }
  }
}

/**
 * 添加子回复评论API
 * @param {*} ctx
 */
async function addSubReplyComment(ctx) {
  try {
    const { replyId, subReplyId, name, email, site, content } = ctx.request.body;
    const ua = ctx.userAgent.source
    const ip = ctx.request.headers['x-real-ip'] || '120.206.210.25';
    let avatar = md5(email).toLowerCase();
    let getAvatar = gravatar.url(avatar, {
        s: CONFIG.AVATAR.size,
        r: CONFIG.AVATAR.r,
        d: CONFIG.AVATAR.d
      },
      true);
    let findData = await replyModel.findOne({
      id: subReplyId
    }, {
      _id: 0,
      id: 1,
      from_user: 1,
      from_email: 1,
    })
    const getReplyId = findData.id.toString();
    if (Object.is(getReplyId, subReplyId)) {
      await replyModel.create({
        comment_id: replyId,
        from_user: name,
        from_email: email,
        from_webSite: site,
        from_avatar: getAvatar,
        from_content: content,
        from_locate: geoip.lookup(ip),
        from_ua: ua,
        to_id: subReplyId,
        to_user: findData.from_user,
        to_email: findData.from_email
      }).then(res => {
        let result = {
          parentId: res.comment_id,
          id: res.id,
          from_user: res.from_user,
          from_email: res.from_email,
          from_webSite: res.from_webSite,
          from_avatar: res.from_avatar,
          from_content: res.from_content,
          like: res.like,
          from_locate: res.from_locate,
          from_ua: res.from_ua,
          from_date: res.from_date,
          to_id: res.to_id,
          to_user: res.to_user
        }
        ctx.body = {
          code: 1,
          error: 0,
          result,
          msg: "添加子回复评论成功",
        }
      })
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: "添加子回复评论失败",
      err
    }
  }
}

module.exports = {
  fetchComment,
  fetchAddComment,
  addReplyComment,
  addSubReplyComment
};