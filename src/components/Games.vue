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
						<li>
							<span>Game 3</span> <button class="floatRight actionButton">CONTINUE</button>
						</li>
					</ul>
				</div>

				<div class="left">
					<h3>Available Games</h3>
					<ul>
						<li>
							<span>Game 1</span> <button class="floatRight actionButton">JOIN</button>
						</li>
						<li>
							<span>Game 2</span> <button class="floatRight actionButton">JOIN</button>
						</li>
					</ul>
				</div>

				<div class="left">
					<h3>Active Games</h3>
					<ul>
						<li>
							<span>Game 4</span> <button class="floatRight actionButton">VIEW</button>
						</li>
					</ul>
				</div>

				<div class="left">
					<h3>Past Games</h3>
					<ul>
						<li>
							<span>Game 0</span> <button class="floatRight actionButton">VIEW</button>
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
		games() {
			return this.$store.getters.games;
		},
	},
	methods: {
		newGame: function() {
			this.$store.dispatch('createGame', {
				username: this.$store.getters.loggedInUser,
				key: this.$store.getters.sessionKey,
			});
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
li:hover {
	background-color: rgba(255,255,255,0.01);
}
</style>
