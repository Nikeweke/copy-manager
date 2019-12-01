const inquirer = require('inquirer');

module.exports = {
  generalQuestions,
  specifyPathes,
}

function generalQuestions() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'general',
      message: 'Choose action',
      choices: [
        { name: 'Create new task',         value: 'a1' },
        { name: 'Show tasks',                  value: 'a3' },
        { name: 'Clear tasks',                 value: 'a2' },
        { name: 'Launch tasks (sequnatially) \n', value: 'a4' },
      ],
    },
  ])
}

function specifyPathes() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'from',
      message: 'FROM path: ',
    },
    {
      type: 'input',
      name: 'to',
      message: 'TO path:',
    },
    
  ])
}
