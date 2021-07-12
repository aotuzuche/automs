const inquirer = require('inquirer')

const main = async args => {
  const res = await inquirer.prompt({
    type: 'confirm',
    name: 'reslut',
    message: '确定吗？',
  })

  console.log(res)
}

module.exports = main(process.argv.slice(2))
