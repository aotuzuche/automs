const fs = require('fs-extra')
const paths = require('../libs/paths')
const logger = require('../libs/logger')
const walk = require('../libs/walk')
const OSS = require('ali-oss')

const reginTest = 'auto-static-test'
const reginPro = 'auto-static-pro'
const endpoint = 'http://oss-cn-hangzhou.aliyuncs.com'

let isProd = false
let successCount = 0
let failCount = 0
let totalCount = 0

// 将build目录下的静态资源上传至OSS
const main = async args => {
  const mode = args[0]
  const publicUrl = process.env.PUBLIC_URL
  const accessKeyId = process.env.ACCESS_KEY_ID
  const accessKeySecret = process.env.ACCESS_KEY_SECRET
  const clearOssFolderBeforeUpload = process.env.CLEAR_OSS_FOLDER_BEFORE_UPLOAD === 'true'

  if (
    (mode !== 'prod' && mode !== 'test') ||
    !fs.existsSync(paths.appBuild) ||
    !accessKeyId ||
    !accessKeySecret ||
    !publicUrl.startsWith('http')
  ) {
    return
  }

  isProd = mode === 'prod'

  const client = getOssClient()
  const prefix = publicUrl.replace(/\/$/, '').split('atzuche.com/')[1]

  // prefix不能为空，格式必须是 xxx/xxx 的形式
  if (!prefix || !/^[^/]+\/[^/]+$/.test(prefix) || publicUrl.indexOf('atzuche.com/') === -1) {
    logger.error('uploadOss: PUBLIC_URL 格式不正确，不能上传至cdn服务器')
    return
  }

  // 删除原有文件
  if (clearOssFolderBeforeUpload) {
    await clearOssFolder(prefix)
  }

  walk(paths.appBuild).then(files => {
    for (let f of files) {
      // 不上传html模板、map文件与assets.json文件
      if (f.endsWith('index.html') || f.endsWith('.map') || f.endsWith('asset-manifest.json')) {
        continue
      }

      // 删除sourcemap引用
      deleteSourcemapImport(f)

      // 开始上传
      const name = prefix + f.replace(paths.appBuild, '')
      totalCount++
      client
        .put(name, f)
        .then(res => ossPutResult(res, name))
        .catch(() => ossPutError(name))
    }
  })
}

// 获取oss句柄
const getOssClient = () => {
  const accessKeyId = process.env.ACCESS_KEY_ID
  const accessKeySecret = process.env.ACCESS_KEY_SECRET

  return new OSS({
    region: isProd ? reginPro : reginTest,
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    endpoint: endpoint,
    bucket: isProd ? reginPro : reginTest,
  })
}

// 上传结果
const ossPutResult = (res, name) => {
  if (res && res.res && res.res.status === 200) {
    successCount++
    logger.succeed('[OSS] SUCCESS upload to ' + (isProd ? reginPro : reginTest) + ': ' + name)
  } else {
    failCount++
    logger.error('[OSS] FAIL upload to ' + (isProd ? reginPro : reginTest) + ': ' + name)
  }

  // 上传完成
  if (totalCount === successCount + failCount) {
    logger.succeed('[OSS] 上传成功: ' + successCount + '个资源，失败: ' + failCount + '个资源')
  }
}

// 上传错误
const ossPutError = name => {
  failCount++
  logger.error('[OSS] FAIL upload to ' + (isProd ? reginPro : reginTest) + ': ' + name)
}

// 清空oss原有目录内容
const clearOssFolder = async prefix => {
  const client = getOssClient()

  const del = async name => {
    try {
      await client.delete(name)
    } catch (error) {
      error.failObjectName = name
      return error
    }
  }

  const list = await client.list({ prefix })
  if (list.res.status === 200 && list.objects && list.objects.length) {
    return await Promise.all(list.objects.map(v => del(v.name)))
  }
}

// 删除sourcemap引用
const deleteSourcemapImport = url => {
  if (!url.endsWith('.js') && !url.endsWith('.css')) {
    return
  }

  const file = String(fs.readFileSync(url))
  let nfile = file
  if (url.endsWith('.css')) {
    // .../*# sourceMappingURL=vendor.0513ee71.chunk.css.map */
    nfile = file.replace(/\/\*\#\s{1,}sourceMappingURL=.*?\*\/$/, '')
  } else if (url.endsWith('.js')) {
    // ...//# sourceMappingURL=main.c258905b.chunk.js.map
    nfile = file.replace(/\/\/\#\s{1,}sourceMappingURL=.*?\.map$/, '')
  }

  if (file !== nfile) {
    fs.writeFileSync(url, nfile)
  }
}

module.exports = main(process.argv.slice(2))
