/*
 * @Description: 文章评论
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-12-12 22:16:32
 * @LastEditors: MoonCheung
 * @LastEditTime: 2020-02-04 14:13:38
 */

const commentModel = require('../models/comment');
const articleModel = require('../models/article');
const replyModel = require('../models/reply');
const queryIpInfo = require("../utils/geoip");
const gravatar = require('gravatar');
const CONFIG = require('../config');
const geoip = require('geoip-lite');
const md5 = require('md5');

// 生成头像函数
function getAvatars(param) {
  let avatar = md5(param).toLowerCase();
  return gravatar.url(avatar, {
    s: CONFIG.AVATAR.size,
    r: CONFIG.AVATAR.r,
    d: CONFIG.AVATAR.d
  }, true);
}

/**
 * 添加评论列表 API
 * @param {*} ctx
 */
async function fetchAddComment(ctx) {
  try {
    const ua = ctx.userAgent.source
    const ip = ctx.request.headers['x-real-ip'] || '127.0.0.1';
    const { id, name, email, site, content } = ctx.request.body;
    const getGeoip = await queryIpInfo(ip);
    let ip_location = null;
    if (getGeoip !== []) {
      ip_location = {
        city: getGeoip.city,
        country: getGeoip.country
      }
    } else {
      ip_location = geoip.lookup(ip);
    }

    await commentModel.create({
      artId: id,
      from_user: name,
      from_email: email,
      from_webSite: site,
      from_avatar: getAvatars(email),
      from_content: content,
      from_ip: ip,
      from_locate: ip_location,
      from_ua: ua
    }).then(cmtData => {
      articleModel.findOneAndUpdate({
        id
      }, {
        $inc: {
          cmt_count: 1
        },
        $addToSet: {
          comments: { $each: [cmtData._id] }
        }
      }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }).then(res => {
        return res;
      });
      let result = {
        id: cmtData.id,
        from_user: cmtData.from_user,
        from_avatar: cmtData.from_avatar,
        from_content: cmtData.from_content,
        like: cmtData.like,
        from_locate: cmtData.from_locate,
        from_ua: cmtData.from_ua,
        replys: cmtData.replys,
        reply_count: cmtData.reply_count,
        from_date: cmtData.from_date
      }
      ctx.body = {
        code: 1,
        error: 0,
        result,
        msg: "添加评论成功"
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
 * 添加回复评论API
 * @param {*} ctx
 */
async function addReplyComment(ctx) {
  try {
    const { replyId, name, email, site, content } = ctx.request.body;
    const ua = ctx.userAgent.source
    const ip = ctx.request.headers['x-real-ip'] || '127.0.0.1';
    const getGeoip = await queryIpInfo(ip);
    let ip_location = null
    if (getGeoip !== []) {
      ip_location = {
        city: getGeoip.city,
        country: getGeoip.country
      }
    } else {
      ip_location = geoip.lookup(ip);
    }

    let cmtData = await commentModel.findOne({
      id: replyId
    }, {
      _id: 0,
      id: 1
    });
    let commentId = cmtData.id.toString();
    if (Object.is(commentId, replyId)) {
      await replyModel.create({
        comment_id: replyId,
        from_user: name,
        from_email: email,
        from_webSite: site,
        from_avatar: getAvatars(email),
        from_content: content,
        from_locate: ip_location,
        from_ua: ua
      }).then(replyData => {
        commentModel.findOneAndUpdate({
          id: replyId
        }, {
          $inc: {
            reply_count: 1
          },
          $addToSet: {
            replys: { $each: [replyData._id] }
          }
        }, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }).then(res => {
          return res;
        })
        let result = {
          parentId: replyData.comment_id,
          id: replyData.id,
          from_user: replyData.from_user,
          from_webSite: replyData.from_webSite,
          from_avatar: replyData.from_avatar,
          from_content: replyData.from_content,
          like: replyData.like,
          from_locate: replyData.from_locate,
          from_ua: replyData.from_ua,
          from_date: replyData.from_date
        }
        ctx.body = {
          code: 1,
          error: 0,
          result,
          msg: "添加回复评论成功"
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
    const ip = ctx.request.headers['x-real-ip'] || '127.0.0.1';
    const getGeoip = await queryIpInfo(ip);
    let ip_location = null
    if (getGeoip !== []) {
      ip_location = {
        city: getGeoip.city,
        country: getGeoip.country
      }
    } else {
      ip_location = geoip.lookup(ip);
    }

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
        from_avatar: getAvatars(email),
        from_content: content,
        from_locate: ip_location,
        from_ua: ua,
        to_id: subReplyId,
        to_user: findData.from_user,
        to_email: findData.from_email
      }).then(replyData => {
        commentModel.findOneAndUpdate({
          id: replyId
        }, {
          $inc: {
            reply_count: 1
          },
          $addToSet: {
            replys: { $each: [replyData._id] }
          }
        }, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }).then(res => {
          return res;
        })
        let result = {
          parentId: replyData.comment_id,
          id: replyData.id,
          from_user: replyData.from_user,
          from_webSite: replyData.from_webSite,
          from_avatar: replyData.from_avatar,
          from_content: replyData.from_content,
          like: replyData.like,
          from_locate: replyData.from_locate,
          from_ua: replyData.from_ua,
          from_date: replyData.from_date,
          to_id: replyData.to_id,
          to_user: replyData.to_user
        }
        ctx.body = {
          code: 1,
          error: 0,
          result,
          msg: "添加子回复评论成功"
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

/**
 * 点赞评论API
 * @param {*} ctx
 */
async function updLikeComment(ctx) {
  try {
    const { id, type } = ctx.params;
    switch (type) {
      case 'comment':
        await commentModel.findOneAndUpdate({
          id
        }, {
          // $inc运算符按指定值递增
          $inc: {
            like: 1
          }
        }, {
          projection: {
            _id: 0,
            replys: 0,
            id: 1,
            like: 1
          },
          new: true
        }).then(result => {
          ctx.body = {
            code: 1,
            error: 0,
            result,
            msg: "点赞评论成功"
          }
        })
        break;
      case 'reply':
        await replyModel.findOneAndUpdate({
          id
        }, {
          // $inc运算符按指定值递增
          $inc: {
            like: 1
          }
        }, {
          projection: {
            _id: 0,
            id: 1,
            like: 1,
            comment_id: 1
          },
          new: true
        }).then(result => {
          ctx.body = {
            code: 1,
            error: 0,
            result,
            msg: "点赞评论成功"
          }
        })
        break;
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: "点赞评论失败",
      err
    }
  }
}

module.exports = {
  fetchAddComment,
  addReplyComment,
  addSubReplyComment,
  updLikeComment
};