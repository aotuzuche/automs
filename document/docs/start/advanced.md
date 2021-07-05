---
title: 进阶
order: 2
toc: menu
---

## mock 数据

mock 数据放在`src/mock`目录下，mock 数据使用`json`或`js`格式，一个标准的 mock 文件如下：

**json 格式**

```json
{
  "GET:/appserver/h5/member/info": {
    "resCode": "000000",
    "resMsg": "成功",
    "data": {
      "username": "eason"
    }
  },
  "POST:/appserver/h5/user/login": {
    "resCode": "000000",
    "resMsg": "成功"
  }
}
```

**js 格式**

大体上与`json`格式相差无几

```js
export default {
  'GET:/appserver/h5/member/info': {
    resCode: '000000',
    resMsg: '成功',
    data: {
      username: 'eason',
    },
  },
};
```

默认返回`status`为200，若要改变，可如下方式修改

```js
export default {
  'GET@200:/appserver/h5/member/info': {
    resCode: '000000',
    resMsg: '成功',
    data: {
      username: 'eason',
    },
  },
};
```

## env 文件的各项配置

项目根目录下有个`.env`文件，用于配置各项项目配置

### 飞行前检测

默认情况下，项目会在开发、打包前进行检查，若要跳过，可将`SKIP_PREFLIGHT_CHECK`设置为`true`，**建议不要改动**

```bash
SKIP_PREFLIGHT_CHECK=false
```

<Alert type="info">
  老项目中均设置为true，建议手动删除或改为false
</Alert>

### 关闭mock功能

mock功能默认开启，若要手动关闭可如下操作

```bash
DISABLED_MOCK=true
```

### 静态资源

即cdn地址配置

```bash
PUBLIC_URL=https://cdn.atzuche.com/m/demo
```

### 打包目录

打包出口地址，**建议不要动**

```bash
BUILD_PATH=build
```

#### OSS 配置

当`PUBLIC_URL`设置为我们的 cdn 服务器后，打完包后的静态资源会自动上传至 cdn 服务器，所以需要配置相关的 OSS 配置

```bash
ACCESS_KEY_ID=xxxxxx
ACCESS_KEY_SECRET=xxxxxx
```

```bash
PORT
HOST
GENERATE_SOURCEMAP
IMAGE_INLINE_SIZE_LIMIT
CLEAR_OSS_FOLDER_BEFORE_UPLOAD
```
