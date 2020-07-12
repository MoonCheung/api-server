/*
 * @Description: 文章分类
 * @Author: MoonCheung
 * @Date: 2019-05-12 15:32:33
 * @Github: https://github.com/MoonCheung
 */

const categoryModel = require('../models/category');
const article = require('../models/article');

/**
 * 添加分类 API
 * @param {Object} ctx
 */
async function addCategory(ctx) {
  try {
    let { categoryname, categorydesc } = ctx.request.body;
    // let cdate = new Date().getTime();
    await categoryModel
      .create({
        categoryname,
        categorydesc
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
      msg: '添加分类失败',
      err
    };
  }
}

/**
 * 获取分类列表 API
 * @param {Object} ctx
 */
async function getCategory(ctx) {
  try {
    let data = ctx.request.body; // curPage: 1, limit: 10
    let page = parseInt((data.curPage - 1) * data.limit);
    let pageSize = parseInt(data.limit);
    let catgData = await categoryModel
      .aggregate([
        {
          $project: {
            id: '$_id', //将_id映射成id
            categoryname: '$categoryname',
            categorydesc: '$categorydesc',
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
        id: -1 //降序排列
      });
    let total = await categoryModel.count({});
    ctx.body = {
      error: 0,
      catgData,
      total
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取分类失败',
      err
    };
  }
}

/**
 * 编辑分类 API
 * @param {Object} ctx
 */
async function editCategory(ctx) {
  try {
    let { id, categoryname, categorydesc } = ctx.request.body;
    await categoryModel
      .updateOne(
        {
          _id: id
        },
        {
          $set: {
            categoryname,
            categorydesc
          }
        }
      )
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '编辑分类成功'
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '编辑分类失败',
      err
    };
  }
}

/**
 * 删除分类 API
 * @param {Object} ctx
 */
async function delCategory(ctx) {
  try {
    let { id } = ctx.request.body;
    await categoryModel
      .deleteOne({
        _id: id
      })
      .then(() => {
        ctx.body = {
          code: 1,
          error: 0,
          msg: '删除分类成功'
        };
      });
  } catch (err) {
    cctx.body = {
      error: 1,
      msg: '删除分类失败',
      err
    };
  }
}

/**
 * 获取所有分类 API (排除分类描述)
 * @param {Object} ctx
 */
async function getAllCatg(ctx) {
  try {
    let result = await categoryModel.find(
      {},
      {
        categorydesc: 0,
        __v: 0
      }
    );
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取所有分类成功',
      result
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取所有分类失败',
      err
    };
  }
}

/*******************************小程序相关API*******************************/

/**
 * 获取所有分类 API (排除分类描述)
 * @param {Object} ctx
 */
async function getAllCatgApplet(ctx) {
  try {
    let result = await categoryModel.find(
      {},
      {
        _id: 0,
        categorydesc: 0,
        __v: 0
      }
    );
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取所有分类成功',
      result
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取所有分类失败',
      err
    };
  }
}

/*******************************Nuxt博客相关API*******************************/

/**
 * 获取所有分类对应数量 API (排除其他字段，包括另个集合里字段)
 * @param {*} ctx
 */
async function fetchAllCatg(ctx) {
  try {
    let result = await categoryModel.aggregate([
      {
        $project: {
          id: '$id',
          categoryname: '$categoryname',
          name: '',
          link: '',
          _id: 0
        }
      },
      {
        $lookup: {
          from: 'articles',
          let: { leftCatg: '$categoryname' },
          pipeline: [
            {
              $match: {
                status: 1,
                $expr: {
                  $eq: ['$catg', '$$leftCatg']
                }
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
          as: 'catgNum'
        }
      },
      {
        //$unwind将操作数视为单个元素数组，其中数组的由对象字段的值替换。
        $unwind: {
          path: '$catgNum',
          preserveNullAndEmptyArrays: true // 空的数组也拆分
        }
      }
    ]);
    ctx.body = {
      code: 1,
      error: 0,
      msg: '获取所有分类成功',
      result
    };
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取所有分类失败',
      err
    };
  }
}

/**
 * 获取指定分类文章接口
 * @param {*} ctx
 */
async function fetchApptCatg(ctx) {
  try {
    const data = ctx.request.body;
    const page = parseInt(data.page * 5);
    await article
      .find(
        {
          catg: data.catg
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
          msg: '获取指定分类文章成功',
          result
        };
      });
  } catch (err) {
    ctx.body = {
      error: 1,
      msg: '获取指定分类文章失败',
      err
    };
  }
}

module.exports = {
  addCategory,
  getCategory,
  editCategory,
  delCategory,
  getAllCatg,
  getAllCatgApplet,
  fetchAllCatg,
  fetchApptCatg
};
