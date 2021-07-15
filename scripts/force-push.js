const spawn = require('cross-spawn')

const main = () => {
  console.log('git push')
  const res = spawn.sync('git', ['push'], {
    stdio: 'inherit',
  })
  if (res.status === 128) {
    main()
  }
}

module.exports = main()
