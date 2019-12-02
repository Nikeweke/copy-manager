const electronDialog = require('electron').remote.dialog;
const { copyFile } = require('./copy-file')
const EventEmitter = require('events')

require('./window') // window functionality


// https://jaketrent.com/post/select-directory-in-electron/
const eventEmitter = new EventEmitter();
const DEFAULT_ITEM = {
	filename: '',
	from: '',
	to: '',
	progress: 0
}

new Vue({
	el: '#main',

	data: () => ({
		stack: [],
		item: {...DEFAULT_ITEM},
		isTransfering: false,
	}),

	methods: {
		pickFile(side) {
			const dialogProp = side === 'from' ? 'openFile' : 'openDirectory' 

			electronDialog.showOpenDialog({
				properties: [dialogProp]
			})
			.then((path) => {
				if (side === 'from') {
					const exploadedPath = path.filePaths[0].split(`\\`)
					this.item.filename = exploadedPath[exploadedPath.length-1]
				} else {
					this.item[side] = path.filePaths[0] + `\\` + this.item.filename  
					return
				}

				this.item[side] = path.filePaths[0] 
			})
		},

		addToStack() {
			const {to, from} = this
			if (to === '' || from === '') {
				return
			}
			this.stack.push(this.item)
			this.item = {...DEFAULT_ITEM}
		},

		clearStack() {
			const result = confirm('Are you sure?');
			if (!result) return
			this.stack = []
		},

		stopTransfering() {
			this.isTransfering = false
			eventEmitter.emit('clear-stack')
		},

		startTransfering() {
			if (this.stack.length === 0) {
				alert('Tasks is empty')
				return
			}

			this.isTransfering = true

			eventEmitter.on('progress', ({index, percentage}) => {
				// console.log('task ' + index, percentage);
				this.stack[index].progress = percentage
			});
			
			// making waterfall
			const reducer = (accumulator, currentValue, index) => {
				return accumulator.then(() => copyFile({ index, ...currentValue, eventEmitter}))  
			}
			
			this.stack.reduce(reducer, Promise.resolve())
				.then(() => {
					alert('All files transfered \n')
			})
		}

	},

})

