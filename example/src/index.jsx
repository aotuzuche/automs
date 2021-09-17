import createApp from 'automs/createApp'

createApp({
  basename: '/',
  defaultRoute: '',
  complete: app => app.start('#root'),
})
