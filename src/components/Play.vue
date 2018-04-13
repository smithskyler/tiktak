<template class="container">
	<b-container fluid class="bv-row">
		<b-row>
			<b-col cols="0" sm="0" md="2" lg="3" xl="3"></b-col>
			<b-col cols="12" sm="12" md="8" lg="6" xl="6">
				<div class="spacer"></div>
				<b-container class="bv-row">
					<b-row>
						<b-col class="left" cols="12" sm="12" md="12" lg="12" xl="12">
							<button v-on:click="goBack();">GAMES</button>
						</b-col>
						<b-col cols="12" sm="12" md="12" lg="12" xl="12">
							<form v-on:submit.prevent="blurName">
								<span class="icon" v-if="playerIsHost">&#9998;</span>
								<input id="title" v-model:value="gameName" v-bind:disabled="!playerIsHost" v-on:blur="updateName"></input>
							</form>

							<h3>{{host}} <span v-if="guest">vs {{guest || "awaiting opponent"}}</span><span v-else> awaiting opponent</span></h3>
						</b-col>
						<b-col cols="12" sm="12" md="12" lg="12" xl="12"></b-col>
					</b-row>
				</b-container>
				<br />
				<div>
					<h3 v-if="tieGame">Tie Game!</h3>
					<h3 v-else-if="game.winner">Winner: {{winnerName}}</h3>
					<h3 v-else>{{this.nextTurn}}'s Turn</h3>
				</div>
				<!---------------->
				<!-- Game Board -->
				<!---------------->
				<b-container id="GameBoard" class="bv-row">
					<b-row class="gameBoardRow">
						<b-col class="gameBoardCol" v-bind:class="{ selectable: canPlay }" v-bind:value="game.state.charAt(0)" v-on:click="tapSpace(0)"></b-col>
						<b-col class="gameBoardCol middleCol" v-bind:class="{ selectable: canPlay }" v-bind:value="game.state.charAt(1)" v-on:click="tapSpace(1)"></b-col>
						<b-col class="gameBoardCol" v-bind:class="{ selectable: canPlay }" v-bind:value="game.state.charAt(2)" v-on:click="tapSpace(2)"></b-col>
					</b-row>
					<b-row class="gameBoardRow middleRow">
						<b-col class="gameBoardCol" v-bind:class="{ selectable: canPlay }" v-bind:value="game.state.charAt(3)" v-on:click="tapSpace(3)"></b-col>
						<b-col class="gameBoardCol middleCol" v-bind:class="{ selectable: canPlay }" v-bind:value="game.state.charAt(4)" v-on:click="tapSpace(4)"></b-col>
						<b-col class="gameBoardCol" v-bind:class="{ selectable: canPlay }" v-bind:value="game.state.charAt(5)" v-on:click="tapSpace(5)"></b-col>
					</b-row>
					<b-row class="gameBoardRow">
						<b-col class="gameBoardCol" v-bind:class="{ selectable: canPlay }" v-bind:value="game.state.charAt(6)" v-on:click="tapSpace(6)"></b-col>
						<b-col class="gameBoardCol middleCol" v-bind:class="{ selectable: canPlay }" v-bind:value="game.state.charAt(7)" v-on:click="tapSpace(7)"></b-col>
						<b-col class="gameBoardCol" v-bind:class="{ selectable: canPlay }" v-bind:value="game.state.charAt(8)" v-on:click="tapSpace(8)"></b-col>
					</b-row>
				</b-container>
			</b-col>
			<b-col cols="0" sm="0" md="2" lg="3" xl="3"></b-col>
		</b-row>
		<b-row class="spacer"></b-row>
	</b-container>
</template>

<script>
import axios from 'axios';

export default {
	name: 'Games',
	data () {
		return {
			gameName: "",
		}
	},
	created: function() {
		if (!this.$store.getters.loggedInUser) {
			this.$router.push('/');
		}
		this.$store.dispatch('getGame', this.game.id);
		this.gameName = this.game.name;
	},
	watch: {
		game (newGame, oldGame) {
			if (!this.playerIsHost) {
				this.gameName = newGame.name;
			}
			this.$store.dispatch('getGame', this.game.id);
		},
	},
	computed: {
		game() {
			return this.$store.getters.games.filter(game => { return game.id == this.$route.params.gameID })[0];
		},
		host() {
			let players = this.$store.getters.players[this.$route.params.gameID];
			return players && players.host;
		},
		guest() {
			let players = this.$store.getters.players[this.$route.params.gameID];
			return players && players.guest;
		},
		nextTurn() {
			return (this.game.turn == this.game.host_id ? this.host : this.guest);
		},
		canPlay() {
			return !this.game.winner && this.$store.getters.loggedInUser.id == this.game.turn;
		},
		winnerName() {
			if (!this.game.winner || this.game.winner == 'tie')
				return null;
			return this.game.winner == this.game.host_id ? this.host : this.guest;
		},
		tieGame() {
			return (!this.game.winner && !this.game.state.includes('_'));
		},
		playerIsHost() {
			return this.game.host_id == this.$store.getters.loggedInUser.id;
		}
	},
	methods: {
		goBack: function() {
			this.$router.push('/games');
		},
		tapSpace: function(space) {
			this.$store.dispatch('play', {
				user: this.$store.getters.loggedInUser,
				game: this.game,
				space: space,
				key: this.$store.getters.sessionKey,
			});
		},
		blurName: function(event) {
			document.getElementById('title').blur();
			this.updateName();
			// event.srcElement.blur();
		},
		updateName: function() {
			// console.log(this.gameName);
			this.$store.dispatch('renameGame', {
				user: this.$store.getters.loggedInUser,
				game: {
					id: this.game.id,
					name: this.gameName,
				},
				key: this.$store.getters.sessionKey,
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spacer {
	height: 40px;
}
#GameBoard {
	/* width: 100%; */
	height: 50vh;
	min-height: 200px;
}

.gameBoardRow {
	height: 33.33%;
}
.middleRow {
	border-top: 4px solid lightgray;
	border-bottom: 4px solid lightgray;
}
.middleCol {
	border-left: 4px solid lightgray;
	border-right: 4px solid lightgray;
}

.gameBoardCol {
	font-size: 80px;
}

@media only screen and (max-height: 600px) {
	.gameBoardCol {
		font-size: 60px;
	}
}

@media only screen and (max-height: 475px) {
	.gameBoardCol {
		font-size: 40px;
	}
}

.gameBoardCol.selectable[value='_']:hover {
	background-color: rgba(255,255,255,0.05);
	cursor: pointer;
}
.gameBoardCol[value='o'] {
	color: #C2FF9F;
}
.gameBoardCol[value='o']::after {
	content: "O";
}
.gameBoardCol[value='x'] {
	color: #F6A0FF;
}
.gameBoardCol[value='x']::after {
	content: "X";
}

input {
	font-family: 'Indie Flower', 'Chalkboard', Helvetica, Arial, sans-serif;
	font-size: 24pt;
	text-align: center;
	font-weight: bold;
	color: lightgray;
	background-color: #161616;
	border-bottom: 2px solid lightgray;
	border-style: none none solid none;
	border-radius: 0px;
	padding-bottom: 0px;
}
.icon {
	font-size: 20pt;
}
</style>
