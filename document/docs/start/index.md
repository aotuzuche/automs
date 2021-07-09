---
nav:
  title: 开始使用
title: 基础使用
order: 1
toc: menu
---

## 安装

```bash
$ npx automs init <my-project>
# or
$ yarn create automs init <my-project>
```

## 创建模板

在src/pages目录下创建页面，`newpage`为所要创建的页面名，若需要创建在src/pages下的二级目录中创建模板，`folder/newpage`即可，最多支持二级

输入该命令后会提示并配置路由地址、是否需要登录授权、是否使用redux(dva)

```bash
$ automs create <newpage>
```

## 本地开发

```bash
$ automs start
# or
$ yarn start
```

## 打包

打包代码

```bash
$ automs build
# or
$ yarn build
```

## 部署

部署与打包的区别在于，打包仅仅是把`src`中的代码打包至打包目录中，不上传静态资源至oss服务器，也不打tag，而部署会做完整的部署工作，打包只是部署的一部分工作

部署测试环境

```bash
$ automs deploy:test
# or
$ yarn deploy:test
# or (兼容老脚手架)
$ sh bin/test.sh
```

部署正式环境

```bash
$ automs deploy
# or
$ yarn deploy
# or (兼容老脚手架)
$ sh bin/prod.sh
```

## 检查当前项目

该命令用于检查项目中的主要依赖包的版本，eslint、stylelint配置

```bash
$ automs doctor
# or
$ yarn doctor
```

## 更新版本

该命令会将项目中的脚手架升级至最新版本，将所有依赖升级到模板项目的版本

```bash
$ automs upgrade
```
