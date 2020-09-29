import Swal from 'sweetalert2';
let errorDisplay = ($swal, title, data) => {
	$swal.fire({
		icon: 'error',
		title: title,
		width: '50%',
		html: `<pre style="text-align: left;overflow: auto;font-family: monospace;font-size: 16px;">${JSON.stringify(
			data,
			null,
			2
		).replace(/\\n/g, '\n')}</pre>`,
	});
};

class websocket {
	constructor() {
		this.ws = new WebSocket('ws://localhost:10500', 'echo-protocol');
		this.$store = null;
		this.onOpen = null;
		this.queue = [];
		this.ws.onopen = () => {
			this.onOpen();
		};
		this.ws.onmessage = (response) => {
			let json = JSON.parse(response.data);
			json.forEach((item) => {
				if (item.error) {
					console.log(item.error);
					errorDisplay(Swal, 'Error', item.error);
				}
				if (item.result) {
					if (item.result.mutations) {
						item.result.mutations.forEach((mutation) => {
							this.$store.commit(mutation.name, mutation.data);
							console.log('mutation', mutation);
						});
					}
					if (item.result.actions) {
						item.result.actions.forEach((action) => {
							this.$store.dispatch(action.name, action.data);
							console.log('action', action);
						});
					}
				}
			});
			if (this.queue.length > 0) {
				let promise = this.queue.splice(0, 1)[0];
				promise.resolve(json);
			}
		};
	}
	connect($store, onOpen) {
		this.$store = $store;
		this.onOpen = onOpen;
		return this;
	}
	send(method, params) {
		this.ws.send(JSON.stringify([{ method, params }]));
		return new Promise((resolve, reject) => {
			this.queue.push({ resolve, reject });
		});
	}

	close() {
		this.ws.close();
	}
}

export default new websocket();
