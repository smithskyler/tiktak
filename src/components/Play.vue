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
							<input value="SlimeBaron's Game" disabled></input>
						</b-col>
						<b-col cols="12" sm="12" md="12" lg="12" xl="12"></b-col>
					</b-row>
				</b-container>
				<br />
				<div>
					<h3>Turn/Winner: SlimeBaron</h3>
				</div>
				<!---------------->
				<!-- Game Board -->
				<!---------------->
				<b-container id="GameBoard" class="bv-row">
					<b-row class="gameBoardRow">
						<b-col id="space-1" class="gameBoardCol" value="x"></b-col>
						<b-col id="space-2" class="gameBoardCol middleCol" value="x"></b-col>
						<b-col id="space-3" class="gameBoardCol" value="o"></b-col>
					</b-row>
					<b-row class="gameBoardRow middleRow">
						<b-col id="space-4" class="gameBoardCol" value="x"></b-col>
						<b-col id="space-5" class="gameBoardCol middleCol" value="x"></b-col>
						<b-col id="space-6" class="gameBoardCol" value="o"></b-col>
					</b-row>
					<b-row class="gameBoardRow">
						<b-col id="space-7" class="gameBoardCol" value="o"></b-col>
						<b-col id="space-8" class="gameBoardCol middleCol" value="o"></b-col>
						<b-col id="space-9" class="gameBoardCol seletable" value="o"></b-col>
					</b-row>
				</b-container>
			</b-col>
			<b-col cols="0" sm="0" md="2" lg="3" xl="3"></b-col>
		</b-row>
		<b-row class="spacer"></b-row>
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
		}
	},
	computed: {
		gameID: function() {
			return this.$route.params.gameID;
		},
	},
	methods: {
		goBack: function() {
			this.$router.push('/games');
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
	border-top: 4px solid #563000;
	border-bottom: 4px solid #563000;
}
.middleCol {
	border-left: 4px solid #563000;
	border-right: 4px solid #563000;
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

.gameBoardCol.seletable:hover {
	background-color: rgba(255,255,255,0.01);
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
</style>
