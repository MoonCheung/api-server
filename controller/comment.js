/*
 * @Description: 文章评论
 * @Author: MoonCheung
 * @Date: 2019-12-12 22:16:32
 * @Github: https://github.com/MoonCheung
 */

const commentModel = require('../models/comment');
const articleModel = require('../models/article');
const replyModel = require('../models/reply');
const queryIpInfo = require('../utils/geoip');
const sendMails = require('../utils/email');
const parseMark = require('../utils/markdown');
const gravatar = require('gravatar');
const CONFIG = require('../config');
const geoip = require('geoip-lite');
const md5 = require('md5');

// 生成头像函数
function getAvatars(param) {
  let avatar = md5(param).toLowerCase();
  return gravatar.url(
    avatar,
    {
      s: CONFIG.AVATAR.size,
      r: CONFIG.AVATAR.r,
      d: CONFIG.AVATAR.d
    },
    true
  );
}

/**
 * 获取所有评论总数API
 * @return 返回所有评论总数
 */
async function getCommentTotal(ctx) {
  try {
    const Data = await articleModel
      .find(
        {},
        {
          tag: 0,
          catg: 0,
          pv: 0,
          like: 0,
          title: 0,
          desc: 0,
          banner: 0,
          content: 0,
          origin: 0,
          cdate: 0,
          __v: 0
        }
      )
      .where({
        status: 1
      });
    let count = 0;
    let subCount = 0;
    Data.forEach(elem => {
      count += elem.cmt_count;
      elem.comments.forEach(subElem => {
        subCount += subElem.reply_count;
      });
    });
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取所有评论成功',
      result: subCount + count
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取所有评论失败',
      err
    };
  }
}

/*******************************Nuxt博客相关API*******************************/

/**
 * 添加评论列表 API
 * @param {*} ctx
 */
async function fetchAddComment(ctx) {
  try {
    const ua = ctx.userAgent.source;
    const ip = ctx.request.headers['x-real-ip'] || '127.0.0.1';
    const { id, name, email, site, content } = ctx.request.body;
    const getGeoip = await queryIpInfo(ip);
    let ip_location = null;
    if (getGeoip !== []) {
      ip_location = {
        city: getGeoip.city,
        country: getGeoip.country
      };
    } else {
      ip_location = geoip.lookup(ip);
    }

    await commentModel
      .create({
        artId: id,
        from_user: name,
        from_email: email,
        from_webSite: site,
        from_avatar: getAvatars(email),
        from_content: content,
        from_ip: ip,
        from_locate: ip_location,
        from_ua: ua
      })
      .then(cmtData => {
        articleModel
          .findOneAndUpdate(
            {
              id
            },
            {
              $inc: {
                cmt_count: 1
              },
              $addToSet: {
                comments: { $each: [cmtData._id] }
              }
            },
            {
              new: true,
              upsert: true,
              setDefaultsOnInsert: true
            }
          )
          .then(res => {
            // console.info('添加到评论数组成功', res);
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
        };
        ctx.body = {
          code: 1,
          error: 0,
          result,
          msg: '添加评论成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '添加评论失败',
      err
    };
  }
}

/**
 * 添加回复评论API
 * @param {*} ctx
 */
async function addReplyComment(ctx) {
  try {
    const { replyId, name, email, site, content } = ctx.request.body;
    const ua = ctx.userAgent.source;
    const ip = ctx.request.headers['x-real-ip'] || '127.0.0.1';
    const getGeoip = await queryIpInfo(ip);
    let ip_location = null;
    if (getGeoip !== []) {
      ip_location = {
        city: getGeoip.city,
        country: getGeoip.country
      };
    } else {
      ip_location = geoip.lookup(ip);
    }

    const cmtData = await commentModel.findOne(
      {
        id: replyId
      },
      {
        _id: 0,
        id: 1,
        artId: 1,
        from_user: 1,
        from_email: 1
      }
    );

    // 发送邮件配置
    const param = {
      id: cmtData.artId,
      name,
      email,
      to_name: cmtData.from_user,
      to_email: cmtData.from_email,
      content: parseMark.render(content)
    };
    const appEmail = CONFIG.INFO.result.author.email;
    if (appEmail.includes(email.trim())) {
      sendMails(param);
    }

    const commentId = cmtData.id.toString();
    if (Object.is(commentId, replyId)) {
      await replyModel
        .create({
          comment_id: replyId,
          from_user: name,
          from_email: email,
          from_webSite: site,
          from_avatar: getAvatars(email),
          from_content: content,
          from_locate: ip_location,
          from_ua: ua
        })
        .then(replyData => {
          commentModel
            .findOneAndUpdate(
              {
                id: replyId
              },
              {
                $inc: {
                  reply_count: 1
                },
                $addToSet: {
                  replys: { $each: [replyData._id] }
                }
              },
              {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
              }
            )
            .then(res => {
              // console.info('添加到回复数组成功', res);
            });
          const result = {
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
          };
          ctx.body = {
            code: 1,
            error: 0,
            result,
            msg: '添加回复评论成功'
          };
        });
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '添加回复评论失败',
      err
    };
  }
}

/**
 * 添加子回复评论API
 * @param {*} ctx
 */
async function addSubReplyComment(ctx) {
  try {
    const { replyId, subReplyId, name, email, site, content } = ctx.request.body;
    const ua = ctx.userAgent.source;
    const ip = ctx.request.headers['x-real-ip'] || '127.0.0.1';
    const getGeoip = await queryIpInfo(ip);
    let ip_location = null;
    if (getGeoip !== []) {
      ip_location = {
        city: getGeoip.city,
        country: getGeoip.country
      };
    } else {
      ip_location = geoip.lookup(ip);
    }

    const findData = await replyModel.findOne(
      {
        id: subReplyId
      },
      {
        _id: 0,
        id: 1,
        from_user: 1,
        from_email: 1
      }
    );
    const getReplyId = findData.id.toString();
    if (Object.is(getReplyId, subReplyId)) {
      await replyModel
        .create({
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
        })
        .then(replyData => {
          commentModel
            .findOneAndUpdate(
              {
                id: replyId
              },
              {
                $inc: {
                  reply_count: 1
                },
                $addToSet: {
                  replys: { $each: [replyData._id] }
                }
              },
              {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
              }
            )
            .then(res => {
              // 发送邮件配置
              const param = {
                id: res.artId,
                name,
                email,
                to_name: findData.from_user,
                to_email: findData.from_email,
                content: parseMark.render(content)
              };
              const appEmail = CONFIG.INFO.result.author.email;
              if (appEmail.includes(email.trim())) {
                sendMails(param);
              }
              // console.info('添加到回复数组成功', res);
            });
          const result = {
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
          };
          ctx.body = {
            code: 1,
            error: 0,
            result,
            msg: '添加子回复评论成功'
          };
        });
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '添加子回复评论失败',
      err
    };
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
        await commentModel
          .findOneAndUpdate(
            {
              id
            },
            {
              // $inc运算符按指定值递增
              $inc: {
                like: 1
              }
            },
            {
              projection: {
                _id: 0,
                replys: 0,
                id: 1,
                like: 1
              },
              new: true
            }
          )
          .then(result => {
            ctx.body = {
              code: 1,
              error: 0,
              result,
              msg: '点赞评论成功'
            };
          });
        break;
      case 'reply':
        await replyModel
          .findOneAndUpdate(
            {
              id
            },
            {
              // $inc运算符按指定值递增
              $inc: {
                like: 1
              }
            },
            {
              projection: {
                _id: 0,
                id: 1,
                like: 1,
                comment_id: 1
              },
              new: true
            }
          )
          .then(result => {
            ctx.body = {
              code: 1,
              error: 0,
              result,
              msg: '点赞评论成功'
            };
          });
        break;
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '点赞评论失败',
      err
    };
  }
}

module.exports = {
  getCommentTotal,
  fetchAddComment,
  addReplyComment,
  addSubReplyComment,
  updLikeComment
};
