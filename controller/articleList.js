const frontArticle = require('../models/frontArticle')

async function frontList(ctx) {
  try {
    let req = ctx.request.query
    console.log(req);
    // let frontCount = await frontArticle.find({}).count({})
    // ctx.body = {
    //   success: 1,
    //   count: frontCount
    // }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: err.message
    }
  }
}

module.exports = {
  frontList
}