<template class="container">
	<b-container fluid id="appArea" class="bv-row">
		<b-row class="header">
			<b-col>
				<img src="./assets/TikTakLogo.png" width="40">
				<h2 class="cornerDisplay">&ensp;Tik Tak</h2>
			</b-col>
			<b-col id="loggedInUser">
				<p v-if="loggedInUser">Logged in as <span>{{loggedInUser.username}}</span> <span id="logoutButton" v-on:click="logout()">(Logout)</span></p>
			</b-col>
		</b-row>
		<router-view></router-view>
		<footer><a href="https://github.com/smithskyler/tiktak">GitHub</a></footer>
	</b-container>
</template>

<script>
export default {
	name: 'App',
	data () {
		return {
			timer: '',
		}
	},
	created: function() {
		this.timer = setInterval(this.pollGames, 1000);
		if (!this.$store.getters.loggedInUser) {
			this.$router.push('/');
		}
	},
	computed: {
		loggedInUser () {
			return this.$store.getters.loggedInUser;
		},
	},
	watch: {
		loggedInUser (newUser, oldUser) {
			if (!newUser) {
				this.$router.push('/');
			}
		},
	},
	methods: {
		logout: function() {
			this.$store.dispatch('logout', {
				user: this.$store.getters.loggedInUser,
				key: this.$store.getters.sessionKey,
			});
		},
		pollGames: function() {
			if (this.$store.getters.loggedInUser) {
				this.$store.dispatch('getGames');
			}
		},
	}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Indie+Flower');

#appArea {
	font-family: 'Indie Flower', 'Chalkboard', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	margin: 0px 5px;
	color: lightgray;
}
.header {
	padding-top: 10px;
}

.cornerDisplay {
	margin: 0px;
	padding: 0px;
	display: inline;
}

#logoutButton {
	color: white;
	font-weight: bold;
	cursor: pointer;
}

#logoutButton:hover {
	text-decoration: underline;
}
</style>
