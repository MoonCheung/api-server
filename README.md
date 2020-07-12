# Node-Server

[![GitHub stars](https://img.shields.io/github/stars/MoonCheung/node-server.svg?style=flat-square)](https://github.com/MoonCheung/node-server/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/MoonCheung/node-server.svg?style=flat-square)](https://github.com/MoonCheung/node-server/issues)
[![GitHub forks](https://img.shields.io/github/forks/MoonCheung/node-server.svg?style=flat-square)](https://github.com/MoonCheung/node-server/network)
[![GitHub license](https://img.shields.io/github/license/MoonCheung/node-server.svg?style=flat-square)](https://github.com/MoonCheung/node-server/blob/master/LICENSE)

The node server provides RESTful api for application services based on koa

- Maintained by [MoonCheung](mailto://salvador23@163.com)
- Blog site: [iKmoons.com](https://github.com/MoonCheung/iKmoons.com) Construction and development based on nuxt.js framework
- Blog admin: [iKmoons-admin](https://github.com/MoonCheung/iKmooms-admin) Build and develop based on vue + elementUI
- Blog applet: [blog-applet](https://github.com/MoonCheung/blog-applet) Build and develop based on mpvue + Vant + ColorUI

## 程序结构

- 入口

  - `index.js`: 引入 koa2 模块,路由,一切配置,启动主程序

- 基础配置 ([config](https://github.com/MoonCheung/node-server/tree/master/config))

  - `index.js`: 含有端口,session 信息,七牛云 key,mongoDB 数据库,node 服务器信息等等

- 业务控制器 ([controller](https://github.com/MoonCheung/node-server/tree/master/controller))

  - 分类
  - 标签
  - 评论
  - 系统: `system`引入`os` node 模块,返回操作系统信息
  - 文章: `article`含有分别后台管理控制器,小程序控制器
  - 用户: `user`引入`jsonwebtoken`,`md5`npm 包,配置用户同步 token 令牌实现,而且密码进行 MD5 加密
  - qiniu: 上传图片七牛云配置需要两个凭证会获得返回七牛云 token 信息,然后可上传图片到七牛云查看

- 路由配置 ([routes](https://github.com/MoonCheung/node-server/tree/master/routes))

  - `index.js`: 引入各个命名控制器，实现提供 RESTful api 接口
  - `whitelist.js`: 白名单内已加入 api 接口,不经过 token 鉴权可直接公用访问

- 业务模块 ([models](https://github.com/MoonCheung/node-server/tree/master/models))

  - 文章
  - 评论
  - 回复
  - 分类
  - 标签
  - 用户
  - 配置

- 工具 ([utils](https://github.com/MoonCheung/node-server/tree/master/utils))

  - `email.js`: 发评论邮件
  - `geoip.js`: ip 地址查询
  - `markdown.js`: 解析 markdown
  - `baiduseo.js`: 百度 SEO 推送
  - `sitemap.js`: 网站地图
  - `rss.js`: RSS 订阅

## 执行命令

```bash
# 进入目录
cd node-server

# 来进行安装node_modules
yarn install

# 开发环境,运行node-server
yarn dev

# 通过prettier 格式化代码
yarn format

# 生产环境,从服务器部署
yarn start
```
