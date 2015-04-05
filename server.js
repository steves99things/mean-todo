// setup
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();

// config
mongoose.connect('mongodb://localhost/test'); //connect to local mongodb

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application.vnd.api+json' }));
app.use(methodOverride());

// model
var Todo = mongoose.model('Todo', {
	text : String
});

// routes
	// api
	// get all todos
		app.get('/api/todos', function(req, res) {
			Todo.find(function(err, todos) {
				if (err) 
					res.send(err);
				res.json(todos); // return all todos in JSON format 
			});
		});


	// create todo and update list of all todos
	app.post('/api/todos', function(req, res) {
		Todo.create({
			text: req.body.text,
			done: false
		}, function(err, todo) {
			if (err)
				res.send(err);

			Todo.find(function(err, todos) {
				if (err) 
					res.send(err);
				res.json(todos); // return all todos in JSON format
			});
		});
	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id: req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			Todo.find(function(err, todos) {
				if (err) 
					res.send(err);
				res.json(todos); // return all todos in JSON format
			});
		});
	});

	// application
	app.get('*', function(req, res) {
		// send the file to angular for it to handle on the front-end
		res.sendfile('./public/index.html'); 
	});

// start an app with node server.js
app.listen(8080);
console.log('listening on 8080');