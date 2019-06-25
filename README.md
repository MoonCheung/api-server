# Node-Server

[![GitHub stars](https://img.shields.io/github/stars/MoonCheung/node-server.svg?style=flat-square)](https://github.com/MoonCheung/node-server/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/MoonCheung/node-server.svg?style=flat-square)](https://github.com/MoonCheung/node-server/issues)
[![GitHub forks](https://img.shields.io/github/forks/MoonCheung/node-server.svg?style=flat-square)](https://github.com/MoonCheung/node-server/network)
[![GitHub license](https://img.shields.io/github/license/MoonCheung/node-server.svg?style=flat-square)](https://github.com/MoonCheung/node-server/blob/master/LICENSE)

The node server provides RESTful api for application services based on koa

- Maintained by [MoonCheung](salvador23@163.com)
- Blog backstage: [vue-backstage](https://github.com/MoonCheung/vue-backstage) is provided run by vue + elementUI
- Blog applet: [mpvue-applet](https://github.com/MoonCheung/mpvue-applet) is provided run by mpvue + Vant + ColorUI

## 程序结构

- 基础配置 ([config](https://github.com/MoonCheung/node-server/tree/master/config))

  - `index`: 含有端口,session 信息,七牛云 key,mongoDB 数据库,node 服务器信息等等

- 业务控制器 ([controller](https://github.com/MoonCheung/node-server/tree/master/controller))

  - 分类
  - 标签
  - 系统: `system`引入`os` node 模块,返回操作系统信息
  - 文章: `article`含有分别后台管理控制器,小程序控制器
  - 用户: `user`引入`jsonwebtoken`,`md5`npm 包,配置用户同步 token 令牌实现,而且密码进行 MD5 加密
  - qiniu: 上传图片七牛云配置需要两个凭证会获得返回七牛云 token 信息,然后可上传图片到七牛云查看

- 路由配置 ([routes](https://github.com/MoonCheung/node-server/tree/master/routes))

  - `index`: 引入各个命名控制器，实现提供 RESTful api 接口
  - `whitelist`: 白名单内已加入 api 接口,不经过 token 鉴权可直接公用访问

- 业务模块 ([models](https://github.com/MoonCheung/node-server/tree/master/models))
  - 文章
  - 分类
  - 标签
  - 用户
  - 配置

## 执行命令

```bash
# 进入目录
cd node-server

# 来进行安装node_modules
npm install

# 运行node-server
npm run dev
```
