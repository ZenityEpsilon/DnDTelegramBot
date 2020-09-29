const WebSocketServer = require('websocket').server;
const http = require('http');
const TG = require('telegram-bot-api');
const config = require('./bot.config.js');
const bot = new TG(config);

// Define your message provider
const mp = new TG.GetUpdateMessageProvider();

// Set message provider and start API
bot.setMessageProvider(mp);
bot.start()
	.then(() => {
		console.log('API is started');
	})
	.catch(console.err);

// Receive messages via event callback
bot.on('update', (update) => {
	console.log(update.message);
	api.sendResult([{ name: 'addMessage', data: update.message }]);
	/*console.log(update);
	bot.sendMessage({chat_id, text: "Hello world!"}).catch((error) => console.error(error));
	bot.getUserProfilePhotos({user_id: chat_id}).then((result) => {
		bot.sendPhoto({chat_id, photo: result.photos[0][0].photos_id});
		console.log(result);
	}).catch((error) => console.error(error));*/
});

let server = http.createServer(function (request, response) {
	console.log(new Date() + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});

server.listen(10500, function () {
	console.log(new Date() + ' Server is listening on port 10500');
});

let wsServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false,
});

function originIsAllowed() {
	return true;
}

let connections = new Set();
wsServer.on('connect', function (connection) {
	connections.add(connection);
});
wsServer.on('close', function (connection) {
	connections.delete(connection);
});

const Api = require('./bot/api.js');
const api = new Api(bot, connections);

wsServer.on('request', function (request) {
	if (!originIsAllowed(request.origin)) {
		request.reject();
		console.log(new Date() + ' Connection from origin ' + request.origin + ' rejected.');
		return;
	}

	let connection = request.accept('echo-protocol', request.origin);
	console.log(new Date() + ' Connection accepted.');
	connection.on('message', function (message) {
		if (message.type === 'utf8') {
			console.log('Received Message: ' + message.utf8Data);
			let request = JSON.parse(message.utf8Data);
			request.forEach((action) => api[action.method](action.params));
			//connection.sendUTF(message.utf8Data);
		} else if (message.type === 'binary') {
			console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
			//connection.sendBytes(message.binaryData);
		}
	});
	connection.on('close', function (/*reasonCode, description*/) {
		console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.');
	});
});
