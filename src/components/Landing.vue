<template>
  <div>
    <form class="right" v-on:submit.prevent="login">
      <p class="inline">Username</p>
      <input class="narrow inline" v-model="username" placeholder="User Name">
      <br />
      <p class="inline">Password</p>
      <input class="narrow inline" type="password" v-model="password" placeholder="Password">
      <br />
      <button class="alternate" type="submit" v-on:click="login();">Login</button>
    </form>
    <div class="spacer"></div>
    <h2>Register</h2>
    <form v-on:submit.prevent="register">
      <p>Username</p>
      <input class="narrow" v-model="username" placeholder="User Name">
      <p>Password</p>
      <input class="narrow" type="password" v-model="password" placeholder="Password">
      <br /><br />
      <button class="alternate" type="submit">Register</button>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</template>

<script>
 export default {
   name: 'Landing',
   data () {
     return {
       username: '',
       password: '',
     }
   },
   computed: {
     registerError: function() {
       return "error"//this.$store.getters.registerError;
     },
   },
   methods: {
     login: function() {
       this.$router.push('/games');
     },
     register: function() {
       this.$store.dispatch('register',{
         username: this.username,
         password: this.password,
       });
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
</style>
