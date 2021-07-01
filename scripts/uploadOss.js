const fs = require('fs-extra')
const paths = require('../libs/paths')
const OSS = require('ali-oss')

const reginTest = 'auto-static-test'
const reginPro = 'auto-static-pro'
const endpoint = 'http://oss-cn-hangzhou.aliyuncs.com'

let isProd = false
let successCount = 0
let failCount = 0
let totalCount = 0

// 将build目录下的静态资源上传至OSS
const main = args => {
  const mode = args[0]
  const publicUrl = process.env.PUBLIC_URL
  const accessKeyId = process.env.ACCESS_KEY_ID
  const accessKeySecret = process.env.ACCESS_KEY_SECRET

  if (
    (mode !== 'prod' && mode !== 'test') ||
    !fs.existsSync(paths.appBuild) ||
    !accessKeyId ||
    !accessKeySecret ||
    !publicUrl.startsWith('http') ||
    publicUrl.indexOf('atzuche.com/') === -1
  ) {
    return
  }

  isProd = mode === 'prod'

  const client = new OSS({
    region: isProd ? reginPro : reginTest,
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    endpoint: endpoint,
    bucket: isProd ? reginPro : reginTest,
  })

  const prefix = publicUrl.split('atzuche.com/')[1]

  console.log('oss: ', prefix)
}

// 上传结果
const ossPutResult = (res, name) => {
  if (res && res.res && res.res.status === 200) {
    successCount++
    console.log('[OSS] SUCCESS upload to ' + (isProd ? reginPro : reginTest) + ': ' + name)
  } else {
    failCount++
    console.log('[OSS] FAIL upload to ' + (isProd ? reginPro : reginTest) + ': ' + name)
  }

  // 上传完成
  if (totalCount === successCount + failCount) {
    console.log('[OSS] 上传成功: ' + successCount + '个资源，失败: ' + failCount + '个资源')
  }
}

// 上传错误
const ossPutError = name => {
  failCount++
  console.log('[OSS] FAIL upload to ' + (isProd ? reginPro : reginTest) + ': ' + name)
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
