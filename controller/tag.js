/*
 * @Description: 文章标签
 * @Author: MoonCheung
 * @Date: 2019-05-12 15:33:34
 * @Github: https://github.com/MoonCheung
 */

const tagModel = require('../models/tag');
const article = require('../models/article');

/**
 * 添加标签API
 * @param {Object} ctx
 */
async function addTag(ctx) {
  try {
    let { tagname, tagdesc } = ctx.request.body;
    // let cdate = new Date().getTime();
    await tagModel
      .create({
        tagname,
        tagdesc
        // cdate
      })
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '添加分类成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '添加标签失败',
      err
    };
  }
}

/**
 * 获取标签列表API
 * @param {Object} ctx
 */
async function getTag(ctx) {
  try {
    let data = ctx.request.body; //curPage: 1, limit: 10
    let page = parseInt((data.curPage - 1) * data.limit);
    let pageSize = parseInt(data.limit);
    let tagsData = await tagModel
      .aggregate([
        {
          $project: {
            id: '$_id', //将_id映射成id
            tagname: '$tagname',
            tagdesc: '$tagdesc',
            cdate: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: '$cdate'
              }
            },
            _id: 0
          }
        }
      ])
      .skip(page)
      .limit(pageSize)
      .sort({
        id: -1
      });
    let total = await tagModel.count({});
    ctx.body = {
      error: 0,
      tagsData,
      total
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取标签失败',
      err
    };
  }
}

/**
 * 编辑标签API
 * @param {Object} ctx
 */
async function editTag(ctx) {
  try {
    let { id, tagname, tagdesc } = ctx.request.body;
    await tagModel
      .updateOne(
        {
          _id: id
        },
        {
          $set: {
            tagname,
            tagdesc
          }
        }
      )
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '编辑标签成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '编辑标签失败',
      err
    };
  }
}

/**
 * 删除标签 API
 * @param {Object} ctx
 */
async function delTag(ctx) {
  try {
    let { id } = ctx.request.body;
    await tagModel
      .deleteOne({
        _id: id
      })
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '删除标签成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '删除标签失败',
      err
    };
  }
}

/**
 * 获取所有标签 API (排除标签描述)
 * @param {Object} ctx
 */
async function getAllTag(ctx) {
  try {
    let result = await tagModel.find(
      {},
      {
        tagdesc: 0,
        __v: 0
      }
    );
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取所有标签成功',
      result
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取所有标签失败',
      err
    };
  }
}

/**
 * 获取所有标签数量 API
 * @param {Object} ctx
 */
async function getTagTotal(ctx) {
  try {
    let tagTotalData = await tagModel.countDocuments({
      status: '1'
    });
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取所有标签成功',
      tagTotalData
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取所有标签失败',
      err
    };
  }
}

/*******************************Nuxt博客相关API*******************************/
/**
 *  获取所有标签对应数量 API
 * @param {*} ctx
 */
async function fetchAllTag(ctx) {
  try {
    let result = await tagModel.aggregate([
      {
        $match: {
          status: 1
        }
      },
      {
        $project: {
          id: '$id',
          tagname: '$tagname',
          _id: 0
        }
      },
      {
        $lookup: {
          from: 'articles',
          let: { leftTag: '$tagname' },
          pipeline: [
            {
              $match: {
                status: 1,
                $expr: { $in: ['$$leftTag', '$tag'] }
              }
            },
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1
                }
              }
            }
          ],
          as: 'tagNum'
        }
      },
      {
        //$unwind将操作数视为单个元素数组，其中数组的由对象字段的值替换。
        $unwind: {
          path: '$tagNum',
          preserveNullAndEmptyArrays: true // 空的数组也拆分
        }
      }
    ]);
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取所有标签成功',
      result
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取所有标签失败',
      err
    };
  }
}

/**
 * 获取指定标签文章接口
 * @param {*} ctx
 */
async function fetchApptTag(ctx) {
  try {
    const data = ctx.request.body;
    const page = parseInt(data.page * 5);
    await article
      .find(
        {
          tag: data.tag
        },
        {
          _id: 0,
          id: 1,
          title: 1,
          desc: 1,
          banner: 1,
          catg: 1,
          pv: 1,
          like: 1,
          origin: 1,
          comments: 1,
          cmt_count: 1,
          cdate: 1
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
          msg: '获取指定标签文章成功',
          result
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取指定标签文章失败',
      err
    };
  }
}

module.exports = {
  addTag,
  getTag,
  editTag,
  delTag,
  getAllTag,
  getTagTotal,
  fetchAllTag,
  fetchApptTag
};
