import Swal from 'sweetalert2';
import _ from 'lodash';

let updateLocalStorage = (data) =>
	_.forEach(data, (item, key) => window.localStorage.setItem(key, JSON.stringify(item)));

const state = {
	storeCounter: 0,
	user: null,
	channels: [],
	users: [],
};

const mutations = {
	setUser(state, data) {
		state.user = data;
	},
	addMessage(state, { message_id, from: user, chat, date, text }) {
		if (!_.findKey(state.channels, (channel) => channel.id === chat.id)) {
			state.channels.push({ ...chat, messages: [] });
		}
		if (!_.findKey(state.users, (item) => item.id === user.id)) {
			state.users.push(user);
		}
		_.find(state.channels, (channel) => channel.id === chat.id).messages.push({
			message_id,
			date,
			text,
			user_id: user.id,
		});
		updateLocalStorage({ channels: state.channels, users: state.users });
	},
};

const actions = {
	notice(store, data) {
		Swal.fire(data);
	},
	load(store) {
		_.forEach(Object.keys(store.state), (key) => {
			let ls = window.localStorage.getItem(key);
			if (ls) {
				store.state[key] = JSON.parse(ls);
			}
		});
	},
};

export const store = {
	state,
	mutations,
	actions,
};
