const queue = []

function Promise() {
	setTimeout(() => {
		let prev
		let err
		queue.forEach(ele => {
			try {
				if (err && ele.catch) {
					ele.callback(err)
					err = null
				} else if (!err && !ele.catch) {
					prev = ele.callback(prev)
					err = null
				}
			} catch (error) {
				err = error
				prev = undefined
			}
		})
	})
}

Promise.prototype = { queue }

Promise.prototype.then = function(callback) {
	queue.push({ callback, catch: false })
	return this
}

Promise.prototype.catch = function(callback) {
	queue.push({ callback, catch: true })
	return this
}

let example = new Promise().then(shouldBeUndef => {
	console.log('0 this is a function in then', undefined === shouldBeUndef)
	return 6;
}).catch(err => {
	console.log('this should not fire', err)
}).then(res => {
	console.log(1, res, 'is the result should be 6')
	throw new Error('this is an error');
	return 5
}).then(params => {
	console.log('this should be be skipped', params)
	return 4
}).catch(err => {
	console.log('2 caught an error', err instanceof Error)
}).then(res => {
	console.log('res should be undefined', res)
})

//#nodeIsSingleThreaded
example = example.then(params => console.log('this should still fire afterward', params === undefined))
