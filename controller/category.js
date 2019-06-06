/*
 * @Description: 文章分类
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-05-12 15:32:33
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-06-05 16:13:44
 */

const categoryModel = require('../models/category');

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
				categorydesc,
				// cdate
			})
			.then(() => {
				ctx.body = {
					code: 1,
					error: 0,
					msg: '添加分类成功',
				};
			});
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '添加分类失败',
			err,
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
								date: '$cdate',
							},
						},
						_id: 0,
					},
				},
			])
			.skip(page)
			.limit(pageSize)
			.sort({
				id: -1, //降序排列
			});
		let total = await categoryModel.count({});
		ctx.body = {
			error: 0,
			catgData,
			total,
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '获取分类失败',
			err,
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
					_id: id,
				},
				{
					$set: {
						categoryname,
						categorydesc,
					},
				}
			)
			.then(() => {
				ctx.body = {
					code: 1,
					error: 0,
					msg: '编辑分类成功',
				};
			});
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '编辑分类失败',
			err,
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
				_id: id,
			})
			.then(() => {
				ctx.body = {
					code: 1,
					error: 0,
					msg: '删除分类成功',
				};
			});
	} catch (err) {
		cctx.body = {
			error: 1,
			msg: '删除分类失败',
			err,
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
				__v: 0,
			}
		);
		ctx.body = {
			code: 1,
			error: 0,
			msg: '获取所有分类成功',
			result,
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '获取所有分类失败',
			err,
		};
	}
}

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
				__v: 0,
			}
		);
		ctx.body = {
			code: 1,
			error: 0,
			msg: '获取所有分类成功',
			result,
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '获取所有分类失败',
			err,
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
};
