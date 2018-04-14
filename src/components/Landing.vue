<template>
	<div>
		<form class="right" v-on:submit.prevent="login">
			<input class="narrow" v-model="usernameLogin" placeholder="User Name">
			<br />
			<input class="narrow" type="password" v-model="passwordLogin" placeholder="Password">
			<br />
			<button class="alternate" type="submit" v-on:click="login();">Login</button>
		</form>
		<div class="spacer"></div>
		<h2>Register</h2>
		<form v-on:submit.prevent="register">
			<input class="narrow" v-model="usernameRegister" placeholder="User Name">
			<br />
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
				this.$router.push('/games');
			}
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
		},
	},
	beforeDestroy() {
		clearInterval(this.timer);
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
	margin-top: 10px !important;
	margin-bottom: 0px !important;
}
h2 {
	margin-top: 30px !important;
	margin-bottom: 30px !important;
}
input {
	font-family: 'Indie Flower', 'Chalkboard', Helvetica, Arial, sans-serif !important;
	font-size: 14pt !important;
	text-align: center !important;
	color: lightgray !important;
	background-color: #161616 !important;
	border-bottom: 2px solid lightgray !important;
	border-style: none none solid none !important;
	border-radius: 0px !important;
	padding-bottom: 0px !important;
}
</style>
