var mysql = require('mysql');
var io = require('socket.io').listen(3001);
var db = mysql.createConnection({
	host: 'localhost',
	user: 'stcs',
	password: 'c0f2458a-9e99-4a63-b826-97ec7bdc10b9',
	database: 'shitthatchrissayscom'
})
var POLL_INTERVAL = 3000;
var currentConnections = [];
var quotes = [];

db.connect(function(err){
	console.log(err);
})

io.sockets.on('connection', function(socket){
	console.log('Connections: '+ currentConnections.length);
	socket.broadcast.emit('user connected');

	if( ! currentConnections.length){
		poll();
	}
	socket.on('add quote', function(data){
		console.log(data);
	})


	socket.on('disconnect', function(){
		var socketIndex = currentConnections.indexOf(socket);
		console.log('Connection: '+ socket +' disconnected.')
		if (socketIndex >= 0) {
			currentConnections.splice(socketIndex, 1)
		}
	})
	console.log('New connenction.');
	currentConnections.push(socket);
})

var poll = function(){
	db.query('SELECT * from quotes;')
	        .on('error', function(err){
             	console.log(err);
                updateClients(err);
             })
	        .on('result', function(data){
	        	quotes.push(data);
	        })
	        .on('end', function(){
	        	if(currentConnections.length){
	        		setTimeout(poll, POLL_INTERVAL);
	        		updateClients(quotes);
	        	}
	        })
}

var updateClients = function(data){
	currentConnections.forEach(function(socket){
		socket.emit('new quote', data);
	})
}