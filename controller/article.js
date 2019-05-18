const article = require('../models/article')

/**
 * 添加文章接口 API
 * @param {Object} ctx
 */
async function insertArticle(ctx) {
  try {
    let {
      title,
      desc,
      banner,
      tag,
      content,
      catg
    } = ctx.request.body;
    await article.create({
      title,
      desc,
      banner,
      tag,
      content,
      catg
    }).then(() => {
      ctx.body = {
        code: 1,
        error: 0,
        msg: '添加文章成功'
      }
    })
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '添加文章失败',
      err
    }
  }
}

/**
 * 获取文章列表接口 API
 * @param {Object} ctx
 */
async function articleList(ctx) {
  try {
    let data = ctx.request.body;
    let page = parseInt((data.curPage - 1) * data.limit)
    let pageSize = parseInt(data.limit);
    let artData = await article.aggregate([{
      $project: {
        id: "$_id", //将_id映射成id
        title: "$title",
        desc: "$desc",
        banner: "$banner",
        tag: "$tag",
        content: "$content",
        catg: "$catg",
        cdate: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$cdate"
          }
        },
        status: "$status",
        _id: 0
      }
    }]).skip(page).limit(pageSize).sort({
      _id: -1
    })
    let total = await article.count({});
    ctx.body = {
      code: 1,
      error: 0,
      artData,
      total
    }
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章列表失败',
      err
    }
  }
}

/**
 * 编辑文章接口API
 * @param {Object} ctx
 */
async function editArticle(ctx) {
  try {
    let data = ctx.request.body;
    console.log(data);
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '编辑文章失败',
      err
    }
  }
}

/**
 * 获取文章详情接口API
 * @param {Object} ctx
 */
async function getArtDetl(ctx) {
  try {
    let data = ctx.request.body;
    console.log(data);
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章详情失败',
      err
    }
  }
}


module.exports = {
  insertArticle,
  articleList,
  editArticle,
  getArtDetl
}