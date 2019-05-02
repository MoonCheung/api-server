const frontArticle = require('../models/frontArticle')
const fs = require('fs');

/**
 * private API
 * 接收发布文章接口数据
 * @param {*} ctx
 */
async function insertArticle(ctx) {
  try {
    let req = ctx.request.body;
    let {
      title,
      desc,
      htmlContent,
      radio,
      date,
    } = req;
    const front = await frontArticle.update({
      title
    }, {
      $set: {
        title,
        desc,
        content: htmlContent,
        list: radio,
        time: date
      }
    }, {
      upsert: true //未找到任何文档，请插入新文档为true
    })
    ctx.body = {
      error: 0,
      success: front
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      info: e
    }
  }
}

module.exports = {
  insertArticle
}