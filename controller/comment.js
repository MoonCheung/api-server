/*
 * @Description: 文章评论
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-12-12 22:16:32
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-12-13 00:59:42
 */

const commentModel = require('../models/comment');
const gravatar = require('gravatar');
const md = require('markdown-it')();

/**
 * 添加评论 API
 * @param {*} ctx
 */
async function addComment(ctx) {
  try {
    let data = await commentModel.find()
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: "添加评论失败",
      err
    }
  }
}

module.exports = {
  addComment
};