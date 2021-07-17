const inquirer = require('inquirer')
const ConvertCase = require('../libs/convertCase')

const askInitQuestions = async () => {
  const res = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: '请输入项目名称 (驼峰)',
    validate: input => {
      if (input.trim() === '') {
        return '请输入项目名称'
      }
      if (!/^[a-zA-Z]+$/.test(input)) {
        return `${input} 不符合规范，请重新输入`
      }
      return true
    },
  })

  res.dashedName = ConvertCase.dashfy(res.name)

  return res
}

module.exports = askInitQuestions
