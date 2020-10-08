<template>
	<ul class="navChannels">
		<li
			v-for="channel in channels"
			@click="select(channel)"
			:key="channel.id"
			class="navChannels-item"
			:class="{ 'navChannels-item_active': value && value.id === channel.id }"
		>
			{{ channel.title ? channel.title : channel.first_name }}
		</li>
	</ul>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data: () => {},
	computed: {
		...mapState(['channels', 'users']),
	},
	props: ['value'],
	methods: {
		select(channel) {
			this.$emit('update:value', channel);
			console.log(channel);
		},
	},
};
</script>
