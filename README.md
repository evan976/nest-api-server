# nest-api-server

RESTful API server application with NestJS & TypeORM

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## 说明

NestJS 服务端博客项目，为博客系统提供 API 接口服务

v2.x 全新升级，采用 NestJS + TypeScript 重构，数据库由 MongoDB 迁移到 MySQL

新增 API：评论模块、邮件服务、管理员

接口文档：[docs](https://api.evanone.site/docs/)

原项目地址：[express-api-server](https://github.com/wujihua118/express-api-server)

## API 说明

基本说明

- 接口根地址：http://localhost:8000/v2
- 服务端已开启 CORS 跨域支持
- 需要授权的 API ，必须在请求头（headers）中使用 Authorization 字段提供 token 令牌
- 数据返回格式统一使用 JSON

HTTP 状态码

- 200 成功
- 400 请求错误（参数、请求体错误）
- 401 未授权（token 不存在、错误或过期）
- 403 无权限（非管理员用户）
- 404 资源不存在（请求路径错误）
- 500 服务器内部错误

请求方法

- GET 获取（一项或多项）
- POST 创建
- PUT 更新
- PATCH 更新
- DELETE 删除

接口数据返回

- 成功

```json
{
  "code": 0,
  "message": "success",
  "data": "Hello World!"
}
```

- 失败

```json
{
  "code": 404,
  "message": "Cannot GET /",
  "timestamp": "2022-03-19T07:39:45.718Z",
  "path": "/",
  "success": false,
  "data": null
}
```

## 构建

请确保本地安装 MySQL

根目录创建 `.env` 文件，配置参考 [.env.production](https://github.com/wujihua118/Nestpress/blob/master/.env.production)

克隆项目到本地，安装依赖，启动开发服务

```bash
$ pnpm install

$ pnpm run start:dev
```

## 最后

祝折腾愉快～

欢迎 Star、 Issue
