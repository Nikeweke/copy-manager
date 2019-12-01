const { copyFile } = require('../copy-file')
const { generalQuestions, specifyPathes } = require('./inquirer')

main()

function main() {
  generalQuestions().then((answers) => {
    switch(answers.general) {
     case 'a1': return addToCallStack()
     case 'a2': return clearCallStack()
     case 'a3': return showCallStack() 
     case 'a4': return startCallStack()
    } 
  })
}


// ======================================== Call stack
// holds stack of function calls [{fn: '', params: {}}, ...]
let callStack = []

function startCallStack() {
  if (callStack.length === 0) {
    console.log('Tasks is empty \n');
    return main()
  }
  
  // making waterfall
  const reducer = (accumulator, currentValue, index) => {
    return accumulator.then(() => copyFile({ index, ...currentValue}))  
  }

  callStack.reduce(reducer, Promise.resolve())
    .then(() => {
      console.log('ALL done \n')
      main()
  })
}

function addToCallStack() {
  console.log()
  specifyPathes().then(({from, to}) => {
    callStack.push({ from, to })
    main()
  })
}

function showCallStack() {
  console.log()
  console.log('=================> Tasks schedule')
  if (callStack.length === 0) {
    console.log('tasks is empty \n')
    return main()
  }
  for (let index in callStack) {
    let item = callStack[index]
    console.log('#'+ (Number(index)+1))
    console.log('from:', item.from)
    console.log('to:', item.to)
    console.log('------------------')
  }
  console.log()
  main()
}

function clearCallStack() {
  callStack = []  
  console.log('Tasks are cleaned \n')
  main()
}



