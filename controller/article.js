/*
 * @Description: 文章接口
 * @Author: MoonCheung
 * @Date: 2019-04-15 10:21:15
 * @Github: https://github.com/MoonCheung
 */

const article = require('../models/article');
const { baiduSeoPush, baiduSeoUpdate, baiduSeoDel } = require('../utils/baiduseo');

/**
 * 添加文章接口 API
 * @param {Object} ctx
 */
async function insertArticle(ctx) {
  try {
    const { title, desc, banner, tag, content, catg, origin } = ctx.request.body;
    await article
      .create({
        title,
        desc,
        banner,
        tag,
        content,
        catg,
        origin
      })
      .then(res => {
        baiduSeoPush(res.id);
        ctx.body = {
          code: 1,
          error: 0,
          msg: '添加文章成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '添加文章失败',
      err
    };
  }
}

/**
 * 获取文章列表接口 API
 * @param {Object} ctx
 */
async function articleList(ctx) {
  try {
    const data = ctx.request.body;
    const page = parseInt((data.curPage - 1) * data.limit);
    const pageSize = parseInt(data.limit);
    const artData = await article
      .aggregate([
        {
          $sort: {
            id: -1 //降序排列
          }
        },
        {
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
                date: '$cdate'
              }
            },
            status: '$status'
          }
        }
      ])
      .skip(page)
      .limit(pageSize);
    let total = await article.count({});
    ctx.body = {
      code: 1,
      error: 0,
      artData,
      total
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章列表失败',
      err
    };
  }
}

/**
 * 编辑文章接口API
 * @param {Object} ctx
 */
async function editArticle(ctx) {
  try {
    const { id, title, desc, banner, tag, content, catg, origin } = ctx.request.body;
    await article.findOneAndUpdate(
      {
        id: id
      },
      {
        $set: {
          title,
          desc,
          banner,
          tag,
          content,
          catg,
          origin
        }
      },
      {},
      function(err, res) {
        baiduSeoUpdate(res.id);
        ctx.body = {
          code: 1,
          error: 0,
          msg: '编辑文章成功'
        };
      }
    );
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '编辑文章失败',
      err
    };
  }
}

/**
 * 获取文章详情接口API
 * @param {Object} ctx
 */
async function getArtDetl(ctx) {
  try {
    const { id } = ctx.request.body;
    let ArtDetlData = await article.findOne(
      {
        id: id
      },
      {
        __v: 0,
        status: 0
      }
    );
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取文章详情成功',
      ArtDetlData
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章详情失败',
      err
    };
  }
}

/**
 * 删除文章接口API
 * @param {Object} ctx
 */
async function delArticle(ctx) {
  try {
    const { id } = ctx.request.body;
    await article.findOne({ id }, { id: 1 }, function(err, res) {
      baiduSeoDel(res.id);
    });
    await article.deleteOne({ id: id });
    ctx.body = {
      code: 1,
      error: 0,
      msg: '删除文章成功'
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '删除文章失败',
      err
    };
  }
}

/**
 * 改变文章状态接口API
 * @param {Object} ctx
 */
async function chgArtStatus(ctx) {
  try {
    const { id, status } = ctx.request.body;
    await article
      .updateOne(
        {
          id: id
        },
        {
          $set: {
            status
          }
        }
      )
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '改变文章状态成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '改变文章状态失败',
      err
    };
  }
}

/**
 * 指定状态文章列表接口API
 * @param {Object} ctx
 */
async function artAllList(ctx) {
  try {
    let artListData = await article.aggregate([
      {
        $match: {
          status: 1
        }
      },
      {
        $project: {
          id: '$_id',
          uid: '$id',
          title: '$title',
          cdate: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M:%S',
              date: '$cdate'
            }
          },
          _id: 0
        }
      },
      {
        $sort: {
          id: -1
        }
      }
    ]);
    let artTotalData = await article.countDocuments({
      status: '1'
    });
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
      err
    };
  }
}

/**
 * 获取浏览量接口API
 * @param {Object} ctx
 */
async function getPvTotal(ctx) {
  try {
    let result = await article.aggregate([
      {
        $match: {
          status: 1
        }
      },
      {
        $group: {
          _id: null,
          pv_count: {
            $sum: '$pv'
          }
        }
      }
    ]);
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取页面浏览量成功',
      result
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取页面浏览量失败',
      err
    };
  }
}

/*******************************小程序相关API*******************************/

/**
 * 指定状态和limit文章列表接口API
 * @param {Object} ctx
 */
async function getallAtrApplet(ctx) {
  try {
    let data = ctx.request.body;
    let page = parseInt(data.allPage * 5);
    let artList = await article.aggregate([
      {
        $match: {
          status: 1
        }
      },
      {
        $project: {
          id: '$id',
          title: '$title',
          desc: '$desc',
          catg: '$catg',
          pv: '$pv',
          cdate: {
            $dateToString: {
              format: '%Y年%m月%d日',
              date: '$cdate'
            }
          },
          _id: 0
        }
      },
      {
        $lookup: {
          from: 'users',
          pipeline: [
            { $match: { name: 'MoonCheung' } },
            {
              $project: {
                _id: 0,
                introduction: 0,
                username: 0,
                password: 0,
                roles: 0
              }
            }
          ],
          as: 'myAuthor'
        }
      },
      //$unwind将操作数视为单个元素数组，其中数组的由对象字段的值替换。
      { $unwind: '$myAuthor' },
      { $skip: page },
      {
        $limit: 5
      },
      {
        $sort: {
          id: -1 //降序排列
        }
      }
    ]);
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取所有文章列表成功',
      artList
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取所有文章列表失败',
      err
    };
  }
}

/**
 * 指定ID文章详情接口API
 * @param {Object} ctx
 */
async function getArtDeilApplet(ctx) {
  try {
    let data = ctx.request.query;
    let ArtDeilData = await article.findOneAndUpdate(
      {
        id: data.id
      },
      {
        //$inc运算符按指定值递增
        $inc: { pv: 1 }
      },
      {
        projection: {
          __v: 0,
          _id: 0,
          desc: 0,
          banner: 0,
          status: 0
        },
        new: true,
        upsert: true
      }
    );
    ctx.body = {
      code: 1,
      error: 0,
      ArtDeilData,
      msg: '获取文章详情成功'
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章详情失败',
      err
    };
  }
}

/**
 * 指定分类文章接口API
 * @param {Object} ctx
 */
async function getApptCatgApplet(ctx) {
  try {
    let data = ctx.request.body;
    let page = parseInt(data.curPage * 5);
    let apptArtList = await article.aggregate([
      {
        $match: {
          status: 1,
          catg: data.catg
        }
      },
      {
        $project: {
          id: '$id',
          title: '$title',
          desc: '$desc',
          catg: '$catg',
          pv: '$pv',
          cdate: {
            $dateToString: {
              format: '%Y年%m月%d日',
              date: '$cdate'
            }
          },
          _id: 0
        }
      },
      {
        $lookup: {
          from: 'users',
          pipeline: [
            { $match: { name: 'MoonCheung' } },
            {
              $project: {
                _id: 0,
                introduction: 0,
                username: 0,
                password: 0,
                roles: 0
              }
            }
          ],
          as: 'apptAuthor'
        }
      },
      //$unwind将操作数视为单个元素数组，其中数组的由对象字段的值替换。
      { $unwind: '$apptAuthor' },
      { $skip: page },
      {
        $limit: 5
      },
      {
        $sort: {
          id: -1 //降序排列
        }
      }
    ]);
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取指定分类文章成功',
      apptArtList
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取指定分类文章失败',
      err
    };
  }
}

/**
 * 改变指定分类文章点赞状态接口API
 * @param {Object} ctx
 */
async function chgLikeArtApplet(ctx) {
  try {
    let data = ctx.request.body;
    let result = await article.findOneAndUpdate(
      {
        id: data.id
      },
      {
        $set: { like: data.like }
      },
      {
        projection: {
          __v: 0,
          _id: 0,
          pv: 0,
          tag: 0,
          title: 0,
          catg: 0,
          desc: 0,
          content: 0,
          banner: 0,
          cdate: 0,
          status: 0
        },
        new: true,
        upsert: true
      }
    );
    ctx.body = {
      code: 1,
      error: 0,
      msg: '改变指定文章点赞成功',
      result
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '改变指定文章点赞失败',
      err
    };
  }
}

/*******************************Nuxt博客相关API*******************************/
/**
 * 获取文章列表API
 * @param {*} ctx
 */
async function fetchAllArt(ctx) {
  try {
    const data = ctx.request.body;
    const page = parseInt(data.page * 5);
    const result = await article.aggregate([
      {
        $match: {
          status: 1
        }
      },
      {
        $sort: {
          id: -1 //降序排列
        }
      },
      {
        $project: {
          id: '$id',
          title: '$title',
          desc: '$desc',
          banner: '$banner',
          catg: '$catg',
          pv: '$pv',
          like: '$like',
          origin: {
            $switch: {
              branches: [
                { case: { $eq: ['$origin', 0] }, then: '原创' },
                { case: { $eq: ['$origin', 1] }, then: '转载' },
                { case: { $eq: ['$origin', 2] }, then: '混合' }
              ]
            }
          },
          cmt_count: '$cmt_count',
          cdate: {
            $dateToString: {
              format: '%Y年%m月%d日',
              date: '$cdate'
            }
          },
          _id: 0
        }
      },
      {
        $lookup: {
          from: 'comments',
          let: { parentArtId: '$id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$artId', '$$parentArtId']
                }
              }
            },
            {
              $project: {
                reply_count: 1,
                id: 1,
                _id: 0
              }
            }
          ],
          as: 'comments'
        }
      },
      { $skip: page },
      {
        $limit: 5
      }
    ]);
    ctx.body = {
      code: 1,
      error: 0,
      result,
      msg: '获取文章成功'
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章失败',
      err
    };
  }
}

/**
 * 获取指定ID文章详情接口API
 * @param {*} ctx
 */
async function fetchArtDeil(ctx) {
  try {
    const { id } = ctx.request.body;
    await article
      .findOneAndUpdate(
        {
          id
        },
        {
          //$inc运算符按指定值递增
          $inc: { pv: 1 }
        },
        {
          projection: {
            __v: 0,
            _id: 0,
            status: 0
          },
          new: true,
          upsert: true
        }
      )
      .then(res => {
        const data = { ...res };
        const mapOrigin = new Map([
          [0, '原创'],
          [1, '转载'],
          [2, '混合']
        ]);
        const getOrigin = mapOrigin.get(res.origin);
        const result = Object.assign(data._doc, { origin: getOrigin });
        ctx.body = {
          code: 1,
          error: 0,
          result,
          msg: '获取文章详情成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章详情失败',
      err
    };
  }
}

/**
 * 获取热门文章接口API
 * @param {*} ctx
 */
async function fetchHotArt(ctx) {
  try {
    let result = await article.aggregate([
      {
        $match: {
          status: 1,
          pv: {
            // TODO: 暂时等会改
            $gte: 20
          }
        }
      },
      {
        $project: {
          id: '$id',
          title: '$title',
          _id: 0
        }
      },
      {
        $limit: 10
      },
      {
        $sort: {
          id: -1 //降序排列
        }
      }
    ]);
    ctx.body = {
      code: 1,
      error: 0,
      result,
      msg: '获取热门文章成功'
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取热门文章失败',
      err
    };
  }
}

/**
 * 获取文章归档接口API
 * @param {*} ctx
 */
async function fetchArtArch(ctx) {
  try {
    const result = await article.aggregate([
      {
        $match: {
          status: 1
        }
      },
      {
        $group: {
          _id: {
            year: {
              $year: '$cdate'
            },
            month: {
              $month: '$cdate'
            }
          },
          firstDate: {
            $push: {
              id: '$id',
              title: '$title',
              origin: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$origin', 0] }, then: '原创' },
                    { case: { $eq: ['$origin', 1] }, then: '转载' },
                    { case: { $eq: ['$origin', 2] }, then: '混合' }
                  ]
                }
              },
              date: {
                $dateToString: {
                  format: '%m月%d日',
                  date: '$cdate'
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: {
            year: '$_id.year'
          },
          secondDate: { $push: { month: '$_id.month', items: '$firstDate' } }
        }
      },
      {
        $sort: {
          _id: -1 //降序排列
        }
      }
    ]);
    const count = await article
      .find()
      .where({ status: 1 })
      .countDocuments();
    ctx.body = {
      code: 1,
      error: 0,
      result,
      count,
      msg: '获取文章归档成功'
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取文章归档失败',
      err
    };
  }
}

/**
 * 点赞文章详情接口API
 * @param {*} ctx
 */
async function updLikeAtrPage(ctx) {
  try {
    const { id } = ctx.params;
    await article
      .where({
        status: 1
      })
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
            __v: 0,
            _id: 0,
            tag: 0,
            pv: 0,
            status: 0,
            comments: 0,
            cmt_count: 0,
            title: 0,
            desc: 0,
            banner: 0,
            content: 0,
            catg: 0,
            cdate: 0
          },
          new: true
        }
      )
      .then(result => {
        ctx.body = {
          code: 1,
          error: 0,
          result,
          msg: '点赞文章详情成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '点赞文章详情失败',
      err
    };
  }
}

/**
 * 搜索关键词接口API
 * @param {*} ctx
 */
async function fetchArtKeyWord(ctx) {
  try {
    const data = ctx.request.body;
    const page = parseInt(data.page * 5);
    await article
      .find(
        {
          // $regex 为正则匹配实现模糊查询，$options为不区分大小写
          title: { $regex: data.keyword, $options: 'i' }
        },
        {
          __v: 0,
          _id: 0,
          tag: 0,
          status: 0,
          content: 0
        },
        {
          skip: page,
          limit: 5,
          sort: {
            id: -1 //降序排列
          }
        }
      )
      .where({
        status: 1
      })
      .then(result => {
        const mapOrigin = new Map([
          [0, '原创'],
          [1, '转载'],
          [2, '混合']
        ]);
        result.forEach(elem => {
          const getOrigin = mapOrigin.get(elem.origin);
          Object.assign(elem._doc, { origin: getOrigin });
        });
        ctx.body = {
          code: 1,
          error: 0,
          result,
          msg: '搜索关键字成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '搜索关键字失败',
      err
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
  artAllList,
  getPvTotal,
  getallAtrApplet,
  getArtDeilApplet,
  getApptCatgApplet,
  chgLikeArtApplet,
  fetchAllArt,
  fetchArtDeil,
  fetchHotArt,
  fetchArtArch,
  updLikeAtrPage,
  fetchArtKeyWord
};
