const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const paths = require('../libs/paths')
const walk = require('../libs/walk')
const routeSort = require('../libs/routeSort')

const generateCreateApp = async () => {
  const p = path.resolve(paths.appNodeModules, 'automs', 'createApp.js')

  // 如果文件存在，先删除
  if (fs.existsSync(p)) {
    fs.unlinkSync(p)
  }

  const data = await getPageData()
  const routes = routeSort(Object.keys(data))

  let jsContent = getDefaultImport()
  jsContent += createImportModel(data)
  jsContent += createImportPage(data)
  jsContent += createRouter(data, routes)
  if (process.env.REPORT_ANALYTICS !== 'false') {
    jsContent += createReport(routes)
  }
  jsContent += createExportFunc(data)
  fs.writeFileSync(p, jsContent)
}

// 遍历pages目录下的所有文件
const getPageData = async () => {
  const pagesPath = path.resolve(paths.appSrc, 'pages')
  if (!fs.existsSync(pagesPath)) {
    return {}
  }

  const pages = {}
  const files = await walk(pagesPath)

  files.forEach(f => {
    // 过滤不是.page结尾的文件
    if (!/\.page$/.test(f)) {
      return
    }

    // 找到.page文件后，还要确保该文件有path属性和相应的index.ts或index.tsx文件
    const pps = getPagePathSync(f)
    if (!pps.length) {
      return
    }

    let index = paths.find(path.join(f, '..', 'index'), ['ts', 'js', 'tsx', 'jsx'])
    let model = paths.find(path.join(f, '..', 'model'), ['ts', 'js', 'tsx', 'jsx'])
    const name = path
      .join(f, '..')
      .replace(pagesPath, '')
      .replace(/(\/|\\)/g, '_')

    // index必须要有
    if (!index) {
      return
    }

    index = index.replace(pagesPath, '').replace(/\\+/g, '/')
    model = model ? model.replace(pagesPath, '').replace(/\\+/g, '/') : ''

    pps.forEach(p => {
      pages[p] = {
        index,
        model,
        name,
      }
    })
  })

  return pages
}

// 得到所有.page文件里的path属性
const getPagePathSync = dir => {
  if (!fs.existsSync(dir)) {
    return []
  }
  const list = []
  String(fs.readFileSync(dir))
    .split('\n')
    .map(i => i.trim())
    .filter(i => !!i)
    .forEach(i => {
      if (i.indexOf('path=') === 0) {
        const path = i.replace(/^path=/, '')
        if (path && path.indexOf('/') === 0) {
          list.push(path)
        }
      }
    })

  return list
}

const getDefaultImport = () => {
  return `
  import { Redirect, Route, Router, Switch } from 'dva/router'
  import * as React from 'react'
  import * as history from 'history'
  import 'auto-libs/build/scripts/flexible.js'
  import 'auto-libs/build/styles/reset.css'
  import dva from 'dva'
  import atb from 'at-js-bridge'
  import { getLCP } from 'web-vitals'
  import { setToken, clearToken, Search } from 'auto-libs'
  `
}

// 导入model
const createImportModel = data => {
  const models = {}
  Object.keys(data).forEach(key => {
    if (data[key].model) {
      models[data[key].name] = data[key].model
    }
  })

  let importStr = ''
  Object.keys(models).forEach(key => {
    importStr += `import ${key}Model from '../../src/pages${models[key]}'` + os.EOL
  })

  return importStr + os.EOL
}

// 导入页面
const createImportPage = data => {
  const pages = {}
  Object.keys(data).forEach(key => {
    if (data[key].index) {
      pages[data[key].name] = data[key].index
    }
  })

  let importStr = ''
  Object.keys(pages).forEach(key => {
    importStr += `const p${key} = React.lazy(() => import('../../src/pages${pages[key]}'))` + os.EOL
  })

  return importStr + os.EOL
}

// 创建router
const createRouter = (data, sort) => {
  const dataList = []
  sort.forEach(k => {
    dataList.push(data[k])
  })

  let str = ''
  for (let s of sort) {
    str += `
        React.createElement(Route, {
          exact: true,
          path: '${s}',
          component: p${data[s].name},
        }),`
  }

  return `const router = (history, defaultRoute) => {

  const MyRedirect = props => {
    if (window.Raven && props && props.location && props.location.pathname) {
      const path = props.location.pathname + props.location.search
      window.Raven.captureException('路由redirect, 源路由: ' + path + ', 跳转至: ' + props.to, {
        level: 'warning',
      })
    }
    return React.createElement(Redirect, props)
  }

  return React.createElement(
    Router,
    { history: history },
    React.createElement(
      React.Suspense,
      {
        fallback: function fallback() {
          return React.createElement('div', null)
        },
      },
      React.createElement(
        Switch,
        null,${str}
        React.createElement(MyRedirect, {
          from: '*',
          to: defaultRoute || '/',
        }),
      ),
    ),
  )
}
`
}

// 创建上报pv/uv/lcp的方法
const createReport = sort => {
  const join = `'${', '}'`
  return `// 全部路由
window._all_routers_ =  ${sort.length > 0 ? `['${sort.join(join)}']` : '[]'}.reverse()

// 生成全局uuid
let uuid = localStorage.getItem('_app_uuid_')
if (!uuid) {
  uuid = String(new Date().valueOf()) + Math.round(Math.random() * 9999)
  localStorage.setItem('_app_uuid_', uuid)
}

// 上报数据
const report = (type, data) => {
  // 本地开发时不上报
  if (process.env.NODE_ENV === 'development') {
    return
  }
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/apigateway/webAnalytics/public/' + type, JSON.stringify(data))
  } else if (window.fetch) {
    window.fetch('/apigateway/webAnalytics/public/' + type, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(() => {})
  }
}

// 计算路由匹配度
const findRouter = name => {
  if (!window._all_routers_ || !window._basename_) {
    return
  }
  const routers = window._all_routers_.map(r => window._basename_ + r.replace(/\:[a-zA-Z]+/g, '.*'))
  for (let i = 0; i < routers.length; i++) {
    if (routers[i] === name || new RegExp(routers[i]).test(name)) {
      return window._all_routers_[i]
    }
  }
  return ''
}

// 统计lcp
if (getLCP) {
  getLCP(d => {
    d && d.value && d.value > 2 && report('slow_page/m', {
      uu: uuid,
      s: d.value,
      u: window.location.origin + window.location.pathname,
      r: findRouter(window.location.pathname),
      g: window._basename_,
    })
  })
}

// url切换时的统计
const urlChangeAnalytics = () => {
  if (!window._basename_) {
    return
  }
  const key = '__atec_url__'
  const url = window.location.origin + window.location.pathname
  if (window[key] === url) {
    return
  }
  window[key] = url
  report('page/m', {
    uu: uuid,
    u: url,
    r: findRouter(window.location.pathname),
    g: window._basename_,
  })
}

setInterval(urlChangeAnalytics, 1000)
`
}

// 创建返回方法
const createExportFunc = data => {
  const models = []
  Object.keys(data).forEach(key => {
    if (data[key].model) {
      const n = `${data[key].name}Model`
      if (models.indexOf(n) === -1) {
        models.push(n)
      }
    }
  })

  let modelStr = ''
  for (let m of models) {
    modelStr += `app.model(${m})\n  `
  }

  return `
window.addEventListener('resize', e => {
  if (
    document.activeElement.tagName === 'INPUT' ||
    document.activeElement.tagName === 'TEXTAREA'
  ) {
    window.setTimeout(() => {
      if (document && document.activeElement && document.activeElement.scrollIntoViewIfNeeded) {
        document.activeElement.scrollIntoViewIfNeeded()
      }
    }, 10)
  }
})

document.body.addEventListener('click', e => {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    const focus = document.querySelector('input:focus')
    focus && focus.blur()
  }
})

window.addEventListener('focusout', () => {
  window.scrollTo(0, 0)
})

// 是否为小程序，默认值为false
window.isMiniProgram = false

const createApp = opts => {
  if (!opts) {
    throw new Error('配置不能为空')
  }

  if (!opts.basename) {
    throw new Error('basename不能为空')
  }

  const browserHistory = history.createBrowserHistory({
    basename: opts.basename,
  })

  window._basename_ = opts.basename

  ${process.env.REPORT_ANALYTICS !== 'false' ? 'urlChangeAnalytics && urlChangeAnalytics()' : ''}

  const app = dva({
    history: browserHistory,
    onError() {}, // 不能缺少，不然错误时会抛出异常
  })

  ${modelStr}
  app.router(r => router(r.history, opts.defaultRoute))

  if (opts.complete) {
    if (window.isApp) {
      atb.user.getToken().then(token => {
        if (token) {
          setToken(token)
        } else {
          clearToken(token)
        }
        if (window.isiOS) {
          window.platform = 'IOS'
        } else {
          window.platform = 'ANDROID'
        }
        opts.complete(app)
      })
    } else {
      if (Search.exist('atMiniProgram')) {
        const token = Search.getDefault('token', '');
        if (token) {
          setToken(token)
        } else {
          clearToken(token)
        }
        window.sessionStorage.setItem('__atMiniProgram__', 'True')
        window.sessionStorage.setItem('__atMiniProgramET__', Search.getDefault('atMiniProgramET', ''))
        window.isMiniProgram = true
      }

      if (window.sessionStorage.getItem('__atMiniProgram__') === 'True') {
        window.isMiniProgram = true
      }

      if (window.isMiniProgram) {
        if (window.isAlipay) {
          window.platform = 'MINIPROGRAM-ALIPAY'
        } else if (window.isWX) {
          window.platform = 'MINIPROGRAM-WECHAT'
        } else if (window.isJD) {
          window.platform = 'MINIPROGRAM-JD'
        }
      } else {
        if (window.isAlipay) {
          window.platform = 'ALIPAY'
        } else if (window.isWXWork) {
          window.platform = 'WECHAT-WORK'
        } else if (window.isWX) {
          window.platform = 'WECHAT'
        } else if (window.isJD) {
          window.platform = 'JD'
        } else {
          window.platform = 'WEB'
        }
      }

      opts.complete(app)
    }
  }
}

export default createApp
`
}

module.exports = generateCreateApp
