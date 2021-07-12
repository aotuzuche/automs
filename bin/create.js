const inquirer = require('inquirer')

const main = async args => {
  const res = await inquirer.prompt([
    {
      type: 'input',
      name: 'createName',
      message: '请输入创建的页面名称 (驼峰)',
      default: 'demo',
    },
    {
      type: 'input',
      name: 'route',
      message: '请输入页面路由',
      default: '/demo',
    },
    {
      type: 'confirm',
      name: 'auth',
      message: '是否需要用户登录',
    },
    {
      type: 'confirm',
      name: 'model',
      message: '是否需要model (dva)',
    },
    {
      type: 'input',
      name: 'spacename',
      when: answers => answers.model,
      message: '请输入model的namespace',
      validate: input => {
        if (input === '') {
          return '请输入model的namespace'
        }
        return true
      },
    },
  ])

  console.log(res)
}

module.exports = main(process.argv.slice(2))
