<template>
	<div v-if="connected">
		<div class="chat">
			<div class="chat-item" v-for="channel in channels" :key="channel.id">
				<p v-for="msg in channel.messages" :key="msg.id">{{ msg.text }} - {{ dateFormat(msg.date) }}</p>
			</div>
		</div>
		<select v-model="chat_id" class="from-select">
			<option v-for="user in users" :value="user.id" :key="user.id">{{ user.username }}</option>
		</select>
		<select v-model="chat_id" class="from-select">
			<option v-for="channel in channels" :value="channel.id" :key="channel.id">{{ channel.title }}</option>
		</select>
		<input type="text" v-model="message" class="from-control" />
		<button @click="sendMessage" class="btn btn-primary" type="button">Отправить</button>
		<pre>{{ user }}</pre>
		<pre>{{ users }}</pre>
		<pre>{{ channels }}</pre>
	</div>
	<template v-else>Идёт подключени...</template>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import websocket from '../websocket.js';

export default {
	data: () => ({
		ws: null,
		connected: false,
		message: '',
		chat_id: null,
	}),
	name: 'Page1',
	methods: {
		...mapMutations(['incrementCounter']),
		sendMessage() {
			this.ws.send('sendMessage', { chat_id: this.chat_id, text: this.message }).then(() => {
				return (this.message = '');
			});
			console.log(this.channels);
		},
		connect() {
			this.api
				.start()
				.then((res) => {
					console.log('API is started', res);
					this.connected = true;
				})
				.catch(console.err);
		},
		dateFormat(timestamp) {
			let date = new Date();
			date.setTime(timestamp * 1000);
			return date.getHours() + ':' + date.getMinutes();
		},
	},
	computed: {
		...mapState(['user', 'channels', 'users']),
	},
	created() {
		this.ws = websocket.connect(this.$store, () => {
			this.ws.send('getMe').then(() => (this.connected = true));
		});
		/* this.ws = new WebSocket('ws://localhost:10500', 'echo-protocol');
    this.ws.onopen = () => {
      this.connected = true;
      this.ws.send(JSON.stringify([{method: 'getMe'}]));
    };
    this.ws.onmessage = (response) => {
      let json = JSON.parse(response.data);
      console.log(json);
      json.forEach(item => {
        if (item.error) {
          console.log(item.error);
          errorDisplay(Swal, 'Error', item.error);
        }
        if (item.result) {
          if (item.result.mutations) {
            item.result.mutations.forEach(mutation => {
              this.$store.commit(mutation.name, mutation.data);
              console.log('mutation', mutation);
            });
          }
          if (item.result.actions) {
            item.result.actions.forEach(action => {
              this.$store.dispatch(action.name, action.data);
              console.log('action', action);
            });
          }
        }
      });
    }*/
	},
	beforeDestroy() {
		this.ws.close();
	},
};
</script>

<style lang="scss"></style>
