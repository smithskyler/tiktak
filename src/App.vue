<template class="container">
  <b-container fluid id="app" class="bv-row">
    <b-row class="header">
      <b-col>
        <img src="./assets/TikTakLogo.png" width="40">
        <h2 class="cornerDisplay">&ensp;Tik Tak</h2>
      </b-col>
      <b-col id="loggedInUser">
        <p>Logged in as <span>SlimeBaron</span> <span id="logoutButton" v-on:click="logout()">(Logout)</span></p>
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
    }
  },
  computed: {
  },
  methods: {
    logout: function() {
      this.$router.push('/');
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato');
@import url('https://fonts.googleapis.com/css?family=Dosis');
@import url('https://fonts.googleapis.com/css?family=Indie+Flower');

body {
  background-color: #161616;
}

#app {
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
.left {
  text-align: left;
  margin: 0px;
}
.right {
  text-align: right;
  margin: 0px;
  height: 0px;
  padding-top: 10px;
}

.cornerDisplay {
  margin: 0px;
  padding: 0px;
  display: inline;
}

input {
  margin-bottom: 0.5em;
  padding: 6px 10px;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-family: 'Lato', sans-serif;
  font-size: 10pt;
}

button {
    font-family: 'Chalkboard', sans-serif;
    font-size: 12pt;
    font-weight: bold;
    color: lightgray;
    border-radius: 12px;
    border-color: lightgray;
    border-width: 1.5px;
    background-color: #161616;
}

button:hover {
  background-color: lightgray;
  color: #161616;
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
