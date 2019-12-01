
const { copyFile } = require('./copy-file')
const EventEmitter = require('events')

// https://jaketrent.com/post/select-directory-in-electron/
// Vue 
new Vue({
	el: '#main',

	data: () => ({
		stack: [],
		item: {
			filename: '',
			from: '',
			to: '',
			progress: 0
		}
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

      console.log(this.item)

			this.stack.push(this.item)
		},

		startTransfering() {
			if (this.stack.length === 0) {
				alert('Tasks is empty')
				return
			}

			const eventEmitter = new EventEmitter();
			eventEmitter.on('progress', (percentage) => {
				console.log(percentage);
			});
			
			// making waterfall
			const reducer = (accumulator, currentValue, index) => {
				return accumulator.then(() => copyFile({ index, ...currentValue, eventEmitter}))  
			}
			
			this.stack.reduce(reducer, Promise.resolve())
				.then(() => {
					console.log('ALL done \n')
			})
		}

	},

})

