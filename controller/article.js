/*
 * @Description: 文章接口
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-04-15 10:21:15
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-05-26 00:09:16
 */

const article = require('../models/article');

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
        catg,
      })
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '添加文章成功',
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '添加文章失败',
      err,
    };
  }
}

/**
 * 获取文章列表接口 API
 * @param {Object} ctx
 */
async function articleList(ctx) {
  try {
    let data = ctx.request.body;
    let page = parseInt((data.curPage - 1) * data.limit);
    let pageSize = parseInt(data.limit);
    let artData = await article.aggregate([{
        $project: {
          id: '$id',
          title: '$title',
          desc: '$desc',
          banner: '$banner',
          tag: '$tag',
          content: '$content',
          catg: '$catg',
          cdate: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M:%S',
              date: '$cdate',
            },
          },
          status: '$status',
        },
      }, ])
      .skip(page)
      .limit(pageSize)
      .sort({
        id: -1, //降序排列
      });
    let total = await article.count({});
    ctx.body = {
      code: 1,
      error: 0,
      artData,
      total,
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章列表失败',
      err,
    };
  }
}

/**
 * 编辑文章接口API
 * @param {Object} ctx
 */
async function editArticle(ctx) {
  try {
    let {
      id,
      title,
      desc,
      banner,
      tag,
      content,
      catg
    } = ctx.request.body;
    await article.updateOne({
        id: id,
      }, {
        $set: {
          title,
          desc,
          banner,
          tag,
          content,
          catg,
        },
      })
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '编辑文章成功',
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '编辑文章失败',
      err,
    };
  }
}

/**
 * 获取文章详情接口API
 * @param {Object} ctx
 */
async function getArtDetl(ctx) {
  try {
    let {
      id
    } = ctx.request.body;
    let ArtDetlData = await article.findOne({
      id: id,
    }, {
      __v: 0,
      status: 0,
    });
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取文章详情成功',
      ArtDetlData,
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章详情失败',
      err,
    };
  }
}

/**
 * 删除文章接口API
 * @param {Object} ctx
 */
async function delArticle(ctx) {
  try {
    let {
      id
    } = ctx.request.body;
    await article.deleteOne({
        id: id,
      })
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '删除文章成功',
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '删除文章失败',
      err,
    };
  }
}

/**
 * 改变文章状态接口API
 * @param {Object} ctx
 */
async function chgArtStatus(ctx) {
  try {
    let {
      id,
      status
    } = ctx.request.body;
    await article.updateOne({
        id: id,
      }, {
        $set: {
          status,
        },
      })
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '改变文章状态成功',
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '改变文章状态失败',
      err,
    };
  }
}

async function artAllList(ctx) {
  try {
    // await article.find({
    //   status: '1'
    // }, {
    //   __v: 0,
    //   tag: 0,
    //   desc: 0,
    //   banner: 0,
    //   content: 0,
    //   catg: 0,
    // }).sort({
    //   _id: -1
    // })

    let artListData = await article.aggregate([{
      $match: {
        status: 1
      }
    }, {
      $project: {
        id: "$_id",
        uid: "$id",
        title: "$title",
        cdate: {
          $dateToString: {
            format: '%Y-%m-%d %H:%M:%S',
            date: '$cdate',
          },
        },
      }
    }, {
      $sort: {
        id: -1
      }
    }])
    let artTotalData = await article.countDocuments({
      status: '1'
    })
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取文章列表成功',
      artListData,
      artTotalData
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章列表失败',
      err,
    };
  }
}

module.exports = {
  insertArticle,
  articleList,
  editArticle,
  getArtDetl,
  delArticle,
  chgArtStatus,
  artAllList
};