import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		loggedInUser: undefined,
		sessionKey: "",
		loginRegisterError: "",
		games: [],
		players: {},
	},
	getters: {
		loggedInUser: state => state.loggedInUser,
		sessionKey: state => state.sessionKey,
		loginRegisterError: state => state.loginRegisterError,
		games: state => state.games,
		players: state => state.players,
	},
	mutations: {
		setLoggedInUser(state, user) {
			state.loggedInUser = user;
		},
		setSessionKey(state, key) {
			state.sessionKey = key;
		},
		setLoginRegisterError(state, error) {
			state.loginRegisterError = error;
		},
		setGames(state, games) {
			state.games = games;
		},
		// updateGame(state, updatedGame) {
		// 	for (let i in state.games) {
		// 		if (state.games[i].id == updatedGame.id) {
		// 			Vue.set(state.games, i, updatedGame);
		// 			break;
		// 		}
		// 	}
		// },
		setPlayers(state, info) {
			Vue.set(state.players, info.gameID, info.players);
		}
	},
	actions: {
		login(context, info) {
			context.commit('setLoginRegisterError', "");
			axios.post('/api/login', info).then(response => {
				console.log(response);
				context.commit('setSessionKey', response.data.key);
				context.commit('setLoggedInUser', response.data.user);
			}).catch(err => {
				context.commit('setLoginRegisterError', err.response.data);
			});
		},
		logout(context, info) {
			context.commit('setLoginRegisterError', "");
			axios.post('/api/logout', info).then(response => {
				console.log(response);
				context.commit('setLoggedInUser', undefined);
				context.commit('setSessionKey', response.data.key);
			}).catch(err => {
				context.commit('setLoginRegisterError', err.response.data);
			});
		},
		register(context, info) {
			context.commit('setLoginRegisterError', "");
			axios.post('/api/users', info).then(response => {
				context.commit('setSessionKey', response.data.key);
				context.commit('setLoggedInUser', response.data.user);
			}).catch(err => {
				context.commit('setLoginRegisterError', err.response.data);
			});
		},
		getGames(context) {
			axios.get('/api/games').then(response => {
				context.commit('setGames', response.data.games);
			}).catch(err => {
				context.commit('setGames', []);
			});
		},
		getGame(context, id) {
			axios.get(`/api/games/${id}`).then(response => {
				console.log(response.data.game);
				// context.commit('updateGame', response.data.game)

				console.log({host: response.data.game.hostName, guest: response.data.game.guestName});
				context.commit('setPlayers', {
					gameID: response.data.game.id,
					players: {host: response.data.game.hostName, guest: response.data.game.guestName}
				})
			}).catch(err => {
				console.log(err);
			});
		},
		createGame(context, info) {
			axios.post('/api/games', {
				user: info.user,
				key: info.key,
			}).then(response => {
				context.commit('setGames', response.data.games);
			}).catch(err => {
				console.log(err.response.data);
			});
		},
		joinGame(context, info) {
			axios.post('/api/join_game', {
				user: info.user,
				game: info.game,
				key: info.key,
			}).then(response => {
				context.commit('setGames', response.data.games);
			}).catch(err => {
				console.log(err.response.data);
			});
		},
		play(context, info) {
			axios.post('/api/games/play', info).then(response => {
				context.commit('setGames', response.data.games);
			}).catch(err => {
				console.log(err.response.data);
			});
		},
		renameGame(context, info) {
			axios.patch(`/api/games/${info.game.id}`, info).then(response => {
				context.commit('setGames', response.data.games);
			}).catch(err => {
				console.log(err.response.data);
			})
		}
	},
	plugins: [
		createPersistedState({
			getState: (key) => Cookies.getJSON(key),
			setState: (key, state) => Cookies.set(key, state, { expires: 3 }),
		}),
	],
});
