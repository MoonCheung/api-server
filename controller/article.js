const frontArticle = require('../models/frontArticle')
const fs = require('fs');

/**
 * private API
 * 接收发布文章接口数据
 * @param {Object||null} ctx
 */
async function insertArticle(ctx) {
  try {
    let req = ctx.request.body;
    let {
      title,
      desc,
      htmlContent,
      list,
      date,
    } = req;
    const front = await frontArticle.update({
      title
    }, {
      $set: {
        title,
        desc,
        content: htmlContent,
        list,
        time: date
      }
    }, {
      //未找到任何文档，请插入新文档为true
      upsert: true
    })
    ctx.body = {
      error: 0,
      success: front
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: err.message
    }
  }
}

module.exports = {
  insertArticle
}