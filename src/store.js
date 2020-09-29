import Swal from 'sweetalert2';

const state = {
  storeCounter: 0,
  user: null,
  channels: {},
  users: {},
};

const mutations = {
  setUser(state, data) {
    state.user = data;
  },
  addMessage(state, {message_id, 'from': user, chat, date, text}) {
    if (!state.channels[chat.id]) {
      state.channels[chat.id] = chat;
      state.channels[chat.id].messages = [];
    }
    if (!state.users[user.id]) {
      state.users[user.id] = user;
    }
    state.channels[chat.id].messages.push({message_id, date, text});
    console.log(state.channels[chat.id]);
  },
};

const actions = {
  notice(store, data) {
    Swal.fire(data);
  }
};

export const store = {
  state,
  mutations,
  actions,
};