<template class="container">
	<b-container fluid class="bv-row">
		<b-row>
			<b-col cols="0" sm="0" md="2" lg="3" xl="3"></b-col>
			<b-col cols="12" sm="12" md="8" lg="6" xl="6">
				<div class="spacer"></div>
				<div class="left">
					<button v-on:click="newGame();">New Game</button>
				</div>
				<br />
				<div class="left">
					<h3>Your Games</h3>
					<ul>
						<li v-for='game in yourGamesYourTurn'>
							<span class="green">{{game.name}} (Your turn)</span> <button class="floatRight actionButton" v-on:click="continueGame(game.id)">CONTINUE</button>
						</li>
						<li v-for='game in yourGamesNotYourTurn'>
							<span>{{game.name}}</span> <button class="floatRight actionButton" v-on:click="continueGame(game.id)">CONTINUE</button>
						</li>
					</ul>
				</div>

				<div class="left">
					<h3>Available Games</h3>
					<ul>
						<li v-for='game in availableGames'>
							<span>{{game.name}}</span> <button class="floatRight actionButton" v-on:click="joinGame(game.id)">JOIN</button>
						</li>
					</ul>
				</div>

				<div class="left">
					<h3>Active Games</h3>
					<ul>
						<li v-for='game in activeGames'>
							<span>{{game.name}}</span> <button class="floatRight actionButton" v-on:click="viewGame(game.id)">VIEW</button>
						</li>
					</ul>
				</div>

				<div class="left">
					<h3>Your Past Games</h3>
					<ul>
						<li v-for='game in yourPastGames'>
							<span>{{game.name}}</span> <button class="floatRight actionButton" v-on:click="viewGame(game.id)">VIEW</button>
						</li>
					</ul>
				</div>
			</b-col>
			<b-col cols="0" sm="0" md="2" lg="3" xl="3"></b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: 'Games',
	data () {
		return {
		}
	},
	created: function() {
		if (!this.$store.getters.loggedInUser) {
			this.$router.push('/');
			return;
		}
		this.$store.dispatch('getGames');
	},
	computed: {
		yourCreatedGames() {
			return this.$store.getters.games.filter(game => {
				return (game.host_id == this.$store.getters.loggedInUser.id);
			})
		},
		yourGamesYourTurn() {
			return this.$store.getters.games.filter(game => {
				return !game.winner && game.state.includes('_')
							&& (game.host_id == this.$store.getters.loggedInUser.id
							|| game.guest_id == this.$store.getters.loggedInUser.id)
							&& game.turn == this.$store.getters.loggedInUser.id
							&& game.guest_id;
			})
		},
		yourGamesNotYourTurn() {
			return this.$store.getters.games.filter(game => {
				return !game.winner && game.state.includes('_')
							&& (game.host_id == this.$store.getters.loggedInUser.id
							|| game.guest_id == this.$store.getters.loggedInUser.id)
							&& (game.turn != this.$store.getters.loggedInUser.id || !game.guest_id);
			})
		},
		availableGames() {
			return this.$store.getters.games.filter(game => {
				return game.host_id != this.$store.getters.loggedInUser.id
							&& game.guest_id === null;
			})
		},
		activeGames() {
			return this.$store.getters.games.filter(game => {
				return game.host_id != this.$store.getters.loggedInUser.id
							&& game.guest_id !== null && game.guest_id != this.$store.getters.loggedInUser.id;
			})
		},
		yourPastGames() {
			return this.$store.getters.games.filter(game => {
				return (game.winner || !game.state.includes('_')) && (game.host_id == this.$store.getters.loggedInUser.id
							|| game.guest_id == this.$store.getters.loggedInUser.id);
			})
		},
	},
	watch: {
		yourCreatedGames (newGames, oldGames) {
			for (let game of newGames) {
				if (!oldGames.map(g => {return g.id}).includes(game.id)) {
					this.$router.push(`/play/${game.id}`);
					return;
				}
			}
		},
	},
	methods: {
		newGame: function() {
			this.$store.dispatch('createGame', {
				user: this.$store.getters.loggedInUser,
				key: this.$store.getters.sessionKey,
			});
		},
		continueGame: function(gameID) {
			this.$router.push(`/play/${gameID}`);
		},
		joinGame: function(gameID) {
			this.$store.dispatch('joinGame', {
				user: this.$store.getters.loggedInUser,
				game: {id: gameID},
				key: this.$store.getters.sessionKey,
			});
			this.$router.push(`/play/${gameID}`);
		},
		viewGame: function(gameID) {
			this.$router.push(`/play/${gameID}`);
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spacer {
	height: 40px;
}
.right {
	text-align: right;
}
.floatRight {
	float: right;
}
.actionButton {
	padding-top: 0px;
	margin-right: 10px;
	width: 100px;
	cursor: pointer;
}
h3 {
	width: 100%;
	padding: 5px 5px;
	color: lightgray;
	font-size: 16pt;
	font-weight: 300;
	border-bottom: 2px solid lightgray;
}
ul {
	list-style: none;
}
li {
	margin-bottom: 10px;
	padding-left: 10px;
	font-size: 14pt;
	font-weight: 600;
	height: 40px;
	padding-top: 4px;
}
.green {
	color: #32FF3F;
}
li:hover {
	background-color: rgba(255,255,255,0.05);
	border-radius: 10px;
}
</style>
