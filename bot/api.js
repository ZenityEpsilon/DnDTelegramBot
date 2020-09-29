let resultResponse = (mutations = [], actions = []) => [{ result: { mutations, actions } }];
let errorResponse = (error) => [{ error }];
class api {
	constructor(tg, connections) {
		this.tg = tg;
		this.connections = connections;
	}
	send(data) {
		this.connections.forEach((connection) => connection.sendUTF(JSON.stringify(data)));
	}
	sendResult(mutations = [], actions = []) {
		this.send(resultResponse(mutations, actions));
	}
	sendError(error) {
		this.send(errorResponse(error));
	}
	execute(method, data, callback) {
		try {
			if (!this.tg[method]) throw 'Unknown method ' + method;
			return this.tg[method](data)
				.then(callback)
				.catch((error) => {
					console.error(error);
					this.sendError(error);
				});
		} catch (e) {
			return new Promise((resolve, reject) => {
				this.sendError(e);
				reject(e);
			});
		}
	}
	getMe() {
		this.execute('getMe', null, (user) => {
			this.sendResult([{ name: 'setUser', data: user }]);
		});
	}
	sendMessage(data) {
		this.execute('sendMessage', data, (user) => {
			this.sendResult(
				[],
				[
					{
						name: 'notice',
						data: {
							type: 'success',
							title: 'Отправлено',
							toast: true,
							position: 'top-end',
							showConfirmButton: false,
							timer: 2000,
						},
					},
				]
			);
		});
	}
}

module.exports = api;
