import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		loggedInUser: "",
		sessionKey: "",
		loginRegisterError: "",
		games: [],
	},
	getters: {
		loggedInUser: state => state.loggedInUser,
		sessionKey: state => state.sessionKey,
		loginRegisterError: state => state.loginRegisterError,
	},
	mutations: {
		setLoggedInUser(state, username) {
			state.loggedInUser = username;
		},
		setSessionKey(state, key) {
			state.sessionKey = key;
		},
		setLoginRegisterError(state, error) {
			state.loginRegisterError = error;
		},
		setGames(state, games) {
			state.games = games;
		}
	},
	actions: {
		login(context, info) {
			context.commit('setLoginRegisterError', "");
			axios.post('/api/login', info).then(response => {
				console.log(response);
				context.commit('setSessionKey', response.data.key);
				context.commit('setLoggedInUser', response.data.user.username);
			}).catch(err => {
				context.commit('setLoginRegisterError', err.response.data);
			});
		},
		logout(context) {
			context.commit('setLoggedInUser', '');
		},
		register(context, info) {
			context.commit('setLoginRegisterError', "");
			axios.post('/api/users', info).then(response => {
				context.commit('setSessionKey', response.data.key);
				context.commit('setLoggedInUser', response.data.user.username);
			}).catch(err => {
				context.commit('setLoginRegisterError', err.response.data);
			});
		},
		getGames(context) {
			axios.get('/api/games').then(response => {
				context.commit('setGames', response.data.games);
			});
		},
		createGame(context, info) {
			console.log("Create Game");
			axios.post('/api/games', {
				username: info.username,
				key: info.key,
			}).then(response => {
				console.log(response.data);
			}).catch(err => {
				console.log(err.response.data);
			});
		},
	},
});
