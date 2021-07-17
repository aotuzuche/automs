const inquirer = require('inquirer')
const ConvertCase = require('../libs/convertCase')

const askCreateQuestions = async () => {
  const res = await inquirer.prompt([
    {
      type: 'input',
      name: 'page',
      message: '请输入创建的页面名称 (驼峰)',
      default: 'demo',
      validate: input => {
        if (!/^[a-zA-Z0-9]+$/.test(input)) {
          return `${input} 不符合规范，请重新输入`
        }
        return true
      },
    },
    {
      type: 'input',
      name: 'path',
      message: '在src/pages下的子目录名 (1.驼峰 2.不需要的话留空)',
      validate: input => {
        if (input === '') {
          return true
        }
        if (!/^[a-zA-Z0-9]+$/.test(input)) {
          return `${input} 不符合规范，请重新输入`
        }
        return true
      },
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
      name: 'namespace',
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

  res.pascalPage = ConvertCase.pascalize(res.path ? `${res.path}_${res.page}` : res.page)
  res.className = 'page-'
  res.className += res.path ? `${ConvertCase.dashfy(res.path)}-` : ''
  res.className += ConvertCase.dashfy(res.page)

  return res
}

module.exports = askCreateQuestions
