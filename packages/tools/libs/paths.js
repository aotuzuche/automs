const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = p => path.resolve(appDirectory, p)

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
]

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

const ensureSlash = (inputPath = '', needsSlash) => {
  const hasSlash = inputPath.endsWith('/')
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1)
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`
  } else {
    return inputPath
  }
}

const paths = {
  dotenv: resolveApp('.env'),
  dotenvDev: resolveApp('.env.dev'),
  dotenvTest: resolveApp('.env.test'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(process.env.BUILD_PATH || 'build'),
  appPublishUrl: ensureSlash(process.env.PUBLIC_URL, true),
  appPublic: resolveApp('src/public'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  template: resolveApp('node_modules/automs/packages/template'),
}

module.exports = paths
