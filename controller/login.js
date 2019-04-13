const UserModel = require('../models/user')
const md5 = require('./md5')

async function login(ctx, next) {
  try {
    let req = ctx.request.body;
    let {
      username,
      password
    } = req;

  } catch (e) {}
}