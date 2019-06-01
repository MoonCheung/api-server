/*
 * @Description: 用户信息
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-04-12 22:01:54
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-05-28 22:39:27
 */

const UserModel = require('../models/user');
const config = require('../config');
const jwt = require('jsonwebtoken');
const md5 = require('./md5');

async function login(ctx) {
	try {
		let { username, password } = ctx.request.body;
		let pwd = md5(md5(password).substr(3, 8) + md5(password));
		let result = await UserModel.find({
			username,
		});
		if (result.length === 0) {
			ctx.body = {
				error: 1,
				msg: '用户错误',
			};
		} else {
			let [userInfo] = result;
			let { _id, username, password } = userInfo;
			if (password === pwd) {
				let name = (ctx.session.username = username);
				const token = jwt.sign(
					{
						name: name,
						_id: _id,
					},
					config.jwtToken.PrivateKey,
					{
						expiresIn: '2h',
					}
				);
				console.log(token);
				ctx.body = {
					code: 1,
					error: 0,
					username: ctx.session.username,
					token: token,
					msg: '登录成功',
				};
			} else {
				ctx.body = {
					error: 2,
					msg: '未经授权的密码',
				};
			}
		}
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: '登陆失败,未经过token验证成功',
			err,
		};
	}
}

async function info(ctx) {
	try {
		let data = ctx.state.user;
		let getUser = await UserModel.find({
			username: data.name,
		});
		if (getUser.length === 0) {
			ctx.body = {
				error: 1,
				msg: '请求服务器无法获取对应信息',
			};
		} else {
			let [userInfo] = getUser;
			ctx.body = {
				code: 1,
				error: 0,
				msg: '响应服务器得到返回信息',
				name: userInfo.username,
				roles: userInfo.roles,
				avatar: userInfo.avatar,
				introduction: userInfo.introduction,
			};
		}
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: err.message,
		};
	}
}

async function logout(ctx) {
	try {
		let data = ctx.state.user;
		await UserModel.findOne({
			_id: data._id,
			username: data.name,
		});
		ctx.body = {
			error: 0,
			msg: '退出登录成功',
		};
	} catch (err) {
		ctx.body = {
			error: 1,
			msg: err.message,
		};
	}
}

module.exports = {
	login,
	info,
	logout,
};
