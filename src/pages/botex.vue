<template>
	<div v-if="connected">
		<div class="chat">
			<div class="row d-flex">
				<div class="col"><nav-channels v-model:value="channel"></nav-channels></div>
				<div class="col-9 flex-grow-1">
					<v-channel ref="channel" @sendMessage="sendMessage" :value="channel" v-if="channel"></v-channel>
				</div>
			</div>
		</div>
		<pre>{{ user }}</pre>
		<pre>{{ [channel] }}</pre>
	</div>
	<template v-else>Идёт подключени...</template>
</template>

<script>
import { mapState } from 'vuex';
import websocket from '../websocket.js';
import navChannels from '../components/navChannels.vue';
import vChannel from '../components/channel.vue';

export default {
	data: () => ({
		ws: null,
		connected: false,
		channel: null,
	}),
	name: 'Page1',
	components: {
		navChannels,
		vChannel,
	},
	methods: {
		sendMessage(msg) {
			return this.ws.send('sendMessage', { chat_id: this.channel.id, text: msg }).then(() => {
				this.$refs.channel.message = '';
			});
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
		dbg(msg) {
			console.log(msg);
		},
	},
	computed: {
		...mapState(['user', 'channels', 'users']),
	},
	created() {
		this.ws = websocket.connect(this.$store, () => {
			this.ws.send('getMe').then(() => (this.connected = true));
		});
	},
	beforeUnmount() {
		this.ws.send('sendMessage', { chat_id: '-1001265432724', text: 'Я ушёл, идите нахуй' });
		this.ws.close();
	},
};
</script>

<style lang="scss"></style>
