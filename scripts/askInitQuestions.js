const inquirer = require('inquirer')

const askInitQuestions = async () => {
  const res = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: '请输入项目名称',
  })

  return res
}

module.exports = askInitQuestions
