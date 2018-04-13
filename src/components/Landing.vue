<template>
	<div>
		<form class="right" v-on:submit.prevent="login">
			<p class="inline">Username</p>
			<input class="narrow inline" v-model="usernameLogin" placeholder="User Name">
			<br />
			<p class="inline">Password</p>
			<input class="narrow inline" type="password" v-model="passwordLogin" placeholder="Password">
			<br />
			<button class="alternate" type="submit" v-on:click="login();">Login</button>
		</form>
		<div class="spacer"></div>
		<h2>Register</h2>
		<form v-on:submit.prevent="register">
			<p>Username</p>
			<input class="narrow" v-model="usernameRegister" placeholder="User Name">
			<p>Password</p>
			<input class="narrow" type="password" v-model="passwordRegister" placeholder="Password">
			<br /><br />
			<button class="alternate" type="submit">Register</button>
		</form>
		<p class="error">{{error}}</p>
	</div>
</template>

<script>
export default {
	name: 'Landing',
	data () {
		return {
			usernameLogin: '',
			passwordLogin: '',
			usernameRegister: '',
			passwordRegister: '',
		}
	},
	created: function() {
		if (this.$store.getters.loggedInUser) {
			this.$router.push('/games');
		}
	},
	computed: {
		error() {
			return this.$store.getters.loginRegisterError;
		},
		loggedInUser () {
			return this.$store.getters.loggedInUser;
		},
	},
	watch: {
		loggedInUser (newUser, oldUser) {
			if (newUser) {
				console.log("Logged in: " + newUser);
				this.$router.push('/games');
			}
			console.log("Logged out: " + oldUser);
		},
	},
	methods: {
		login: function() {
			this.$store.dispatch('login', {
				username: this.usernameLogin,
				password: this.passwordLogin,
			});
		},
		register: function() {
			this.$store.dispatch('register', {
				username: this.usernameRegister,
				password: this.passwordRegister,
			});
		}
	}
}
</script>

<style scoped>
.narrow {
	width: 170px;
}
.wide {
	width: 370px;
}
.inline {
	display: inline;
}
.right {
	text-align: right;
}
.spacer {
	height: 120px;
}
p {
	margin-top: 10px;
	margin-bottom: 0px;
}
h2 {
	margin-top: 30px;
	margin-bottom: 30px;
}
</style>
