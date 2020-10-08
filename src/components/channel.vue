<template>
	<div class="chat-container" ref="container">
		<div class="chat-item" v-if="messages">
			<div
				v-for="msg in messages"
				:key="msg.id"
				class="chat-message"
				:class="{ 'chat-message_self': msg.user_id === user.id }"
			>
				<div class="chat-messageItem" v-if="msg.text">
					<div class="chat-title">
						{{ msg.user.first_name }}
						<div class="chat-date">
							{{ dateFormat(msg.date) }}
						</div>
					</div>
					{{ msg.text }}
				</div>
			</div>
		</div>
		<template v-else>Нет сообщений</template>
	</div>
	<input type="text" v-model="message" class="from-control" @keyup.enter="sendMessage" />
	<button @click="sendMessage" class="btn btn-primary" type="button">Отправить</button>
</template>

<script>
import { mapState } from 'vuex';
export default {
	props: ['value'],
	emits: ['sendMessage'],
	data: () => ({
		message: '',
	}),
	methods: {
		sendMessage() {
			this.$emit('sendMessage', this.message);
		},
		dateFormat(timestamp) {
			let date = new Date();
			date.setTime(timestamp * 1000);
			let minutes = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes();
			let hours = date.getHours() > 10 ? date.getHours() : '0' + date.getHours();
			return hours + ':' + minutes;
		},
		updateScroll() {
			this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
		},
	},
	computed: {
		...mapState(['users', 'user']),
		messages() {
			let messages = this.value.messages ? this.value.messages : [];
			return messages.map((i) => ({ ...i, user: this.users.find((u) => u.id === i.user_id) }));
		},
	},
	mounted() {
		this.updateScroll();
	},
	updated() {
		this.updateScroll();
	},
};
</script>
