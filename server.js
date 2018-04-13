// Express Setup
const express = require('express');
const bodyParser = require('body-parser');
const getRandomValues = require('get-random-values');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

var userKeys = {};

function UUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, base => {
		return (base ^ getRandomValues(new Uint8Array(1))[0] & 15 >> base / 4).toString(16)
	});
}

function verifyUserKey(req, res) {
	return new Promise((resolve, reject) => {
		knex('users').where('username',req.body.username).first().then(user => {
			if (user === undefined) {
				res.status(403).send("Invalid username");
				reject({message: 'abort'});
				return
			} else if (req.body.key != userKeys[user.id]) {
				res.status(403).send("Invalid session");
				reject({message: 'abort'});
				return
			}
			resolve(user);
		});
	});
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
		userKeys[user.id] = key;
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
			userKeys[user.id] = key;
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

// Get Games
app.get('/api/games', (req, res) => {
	knex('games').then(gamesResult => {
		res.status(200).json({games: gamesResult});
	});
});

app.post('/api/games', (req, res) => {
	verifyUserKey(req, res).then(user => {
		return knex('games').insert({name: `${req.body.username}'s Game'`, host_id: user.id, turn: user.id, state: "_________" });
	}).then(ids => {
		return knex('games').where('id',ids[0]).first();
	}).then(newGame => {
		res.status(200).send({game: newGame})
	}).catch(error => {
		if (error.message !== 'abort') {
			console.log(error);
			res.status(500).json({ error });
		}
	});
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
