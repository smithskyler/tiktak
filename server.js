// Express Setup
const express = require('express');
const bodyParser = require('body-parser');
const getRandomValues = require('get-random-values');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('dist'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

var sessionKeys = {};

function UUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, base => {
		return (base ^ getRandomValues(new Uint8Array(1))[0] & 15 >> base / 4).toString(16)
	});
}

function verifyUserSession(req, res) {
	return new Promise((resolve, reject) => {
		knex('users').where('id',req.body.user.id).first().then(user => {
			if (user === undefined) {
				res.status(403).send("Invalid user");
				reject({message: 'abort'});
				return
			} else if (!sessionKeys[user.id] || req.body.key !== sessionKeys[user.id]) {
				res.status(403).send("Invalid session");
				reject({message: 'abort'});
				return
			}
			resolve(user);
		});
	});
}

String.prototype.replaceAt = function(index, newValue) {
    return this.substr(0, index) + newValue + this.substr(index + newValue.length);
}

// Registration
app.post('/api/users', (req, res) => {
	if (!req.body.username || !req.body.password)
		return res.status(400).send();
	knex('users').where('username',req.body.username).first().then(user => {
		if (user !== undefined) {
			res.status(403).send("Username is already taken");
			throw new Error('abort');
		}
		return bcrypt.hash(req.body.password, saltRounds);
	}).then(hash => {
		return knex('users').insert({username: req.body.username, hash: hash});
	}).then(ids => {
		return knex('users').where('id',ids[0]).first().select('username','id');
	}).then(user => {
		let key = UUID();
		sessionKeys[user.id] = key;
		res.status(200).json({user:user, key: key});
		return;
	}).catch(error => {
		if (error.message !== 'abort') {
			console.log(error);
			res.status(500).json({ error });
		}
	});
});

// Login
app.post('/api/login', (req, res) => {
	if (!req.body.username || !req.body.password)
		return res.status(400).send();
	knex('users').where('username',req.body.username).first().then(user => {
		if (user === undefined) {
			res.status(403).send("Invalid credentials");
			throw new Error('abort');
		}
		return [bcrypt.compare(req.body.password, user.hash),user];
	}).spread((result,user) => {
		if (result) {
			let key = UUID();
			sessionKeys[user.id] = key;
			res.status(200).json({user:{username:user.username,id:user.id}, key: key});
		} else {
			res.status(403).send("Invalid credentials");
		}
		return;
	}).catch(error => {
		if (error.message !== 'abort') {
			console.log(error);
			res.status(500).json({ error });
		}
	});
});

// User info
app.get('/api/users/:id', (req, res) => {
	knex('users').where('id', req.params.id).first().then(user => {
		res.status(200).json({user: user});
	});
});

// Logout
app.post('/api/logout', (req, res) => {
	verifyUserSession(req, res).then(user => {
		delete sessionKeys[user.id];
		res.status(200).send({user:{username:user.username,id:user.id}, key: ''});
	}).catch(error => {
		if (error.message !== 'abort') {
			console.log(error);
			res.status(500).json({ error });
		}
	});
});

// Get Games
app.get('/api/games', (req, res) => {
	knex('games').then(gamesResult => {
		res.status(200).json({games: gamesResult});
	});
});

app.get('/api/games/:id', (req, res) => {
	knex('games').where('id', req.params.id).first().then(async game => {
		let gameClone = Object.assign({}, game);
		let host = await knex('users').where('id', game.host_id).first();
		let guest = await knex('users').where('id', game.guest_id).first();
		gameClone['hostName'] = host && host.username;
		gameClone['guestName'] = guest && guest.username;
		res.status(200).json({game: gameClone});
	});
});

app.post('/api/games', (req, res) => {
	verifyUserSession(req, res).then(user => {
		return knex('games').insert({name: `${user.username}'s Game`, host_id: user.id, turn: user.id, state: "_________" });
	}).then(ids => {
		return knex('games');
	}).then(games => {
		res.status(200).send({games: games})
	}).catch(error => {
		if (error.message !== 'abort') {
			console.log(error);
			res.status(500).json({ error });
		}
	});
});

app.post('/api/join_game', (req, res) => {
	verifyUserSession(req, res).then(user => {
		return knex('games').where('id', req.body.game.id).first();
	}).then(game => {
		let nextTurn = game.turn || req.body.user.id;
		return knex('games').whereNull('guest_id')
					.andWhere('id', '=', req.body.game.id)
					.update({guest_id: req.body.user.id, turn: nextTurn});
	}).then(result => {
		return knex('games');
	}).then(games => {
		return res.status(200).send({games: games});
	}).catch(error => {
		if (error.message !== 'abort') {
			console.log(error);
			res.status(500).json({ error });
		}
	});
});

app.post('/api/games/play', (req, res) => {
	verifyUserSession(req, res).then(user => {
		return knex('games').where('id', req.body.game.id).first();
	}).then(game => {
		let space = req.body.space;
		if (game.winner || game.turn != req.body.user.id || space < 0 || space > 8 || game.state.charAt(space) != '_') {
			res.status(403).send("Invalid placement.");
			throw new Error('abort');
		}
		let c = (game.host_id == req.body.user.id ? 'x' : 'o');
		let s = game.state.replaceAt(space, c);
		// Check for a win
		let playerWins = ((s.charAt(0) == c && s.charAt(1) == c && s.charAt(2) == c)
			|| (s.charAt(3) == c && s.charAt(4) == c && s.charAt(5) == c)
			|| (s.charAt(6) == c && s.charAt(7) == c && s.charAt(8) == c)
			|| (s.charAt(0) == c && s.charAt(3) == c && s.charAt(6) == c)
			|| (s.charAt(1) == c && s.charAt(4) == c && s.charAt(7) == c)
			|| (s.charAt(2) == c && s.charAt(5) == c && s.charAt(8) == c)
			|| (s.charAt(0) == c && s.charAt(4) == c && s.charAt(8) == c)
			|| (s.charAt(2) == c && s.charAt(4) == c && s.charAt(6) == c));
		let winner = playerWins ? req.body.user.id : undefined;
		let nextTurn = (game.turn == game.host_id) ? game.guest_id : game.host_id;
		return knex('games').where('id', req.body.game.id)
					.update({state: s, winner: winner, turn: nextTurn});
	}).then(result => {
		return knex('games');
	}).then(games => {
		return res.status(200).send({games: games});
	}).catch(error => {
		if (error.message !== 'abort') {
			console.log(error);
			res.status(500).json({ error });
		}
	});
});

app.patch('/api/games/:id', (req, res) => {
	verifyUserSession(req, res).then(user => {
		return knex('games').where('id', req.params.id).first();
	}).then(game => {
		if (game.host_id != req.body.user.id) {
			res.status(403).send("Invalid Name change.");
			throw new Error('abort');
		}
		return knex('games').where('id', req.body.game.id)
					.update({name: req.body.game.name});
	}).then(result => {
		return knex('games');
	}).then(games => {
		return res.status(200).send({games: games});
	}).catch(error => {
		if (error.message !== 'abort') {
			console.log(error);
			res.status(500).json({ error });
		}
	});
});
app.listen(3000, () => console.log('Server listening on port 3000!'));
