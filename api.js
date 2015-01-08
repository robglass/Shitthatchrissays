var mysql = require('mysql');
var io = require('socket.io').listen(3001);
var db = mysql.createConnection({
	host: 'localhost',
	user: 'stcs',
	password: 'c0f2458a-9e99-4a63-b826-97ec7bdc10b9',
	database: 'shitthatchrissayscom'
})
var randomstring = require('randomstring');
var POLL_INTERVAL = 3000;
var currentConnections = [];
var quotes = [];

db.connect(function(err){
	if (err) {
		console.log(err);
	}
})

io.sockets.on('connection', function(socket){
	console.log('Connections: '+ currentConnections.length);
	socket.broadcast.emit('user connected');

	if( ! currentConnections.length){
		poll();
	}
	socket.on('add quote', function(data){
		if (typeof data === 'object'){
			try{
        var img = decodeBase64Image(data.img);
        imgName = '/images/'+randomstring(7)+'.jpg'
        fs.writeFile(/image/randomstring(7)+'.jpg', imageBuffer.data, function(err) {
          throw err;
        });
				if (data.text && data.subject && data.date && imgName){
					data = {quote_text: data.text, quote_subject: data.subject, quote_date: data.date, img: imgName};
					db.query('INSERT INTO quotes SET ?', data, function(err, result){
						if (err){
							console.log(err);
						} else{
							console.log(result);
						}
					});
				}
			} catch(err) {
				socket.emit('error', err);
				console.log(err);
			}
		}
	})


	socket.on('disconnect', function(){
		var socketIndex = currentConnections.indexOf(socket);
		console.log('Connection: '+ socketIndex +' disconnected.')
		if (socketIndex >= 0) {
			currentConnections.splice(socketIndex, 1)
		}
	})
	console.log('New connenction.');
	currentConnections.push(socket);
})
var updatedFlag = false;
var poll = function(){
	db.query('SELECT * from quotes;')
	        .on('error', function(err){
             	console.log(err);
             })
	        .on('result', function(data){
	        	// onlt add to array if the object is not already in it.
	        	if ( quotes.length < data.id){
	        		quotes.push( data );
	        		updatedFlag = true;
	        	}
	        })
	        .on('end', function(){
	        	if(currentConnections.length){
	        		setTimeout(poll, POLL_INTERVAL);
	        		if (updatedFlag){
	        			updateClients(quotes);
	        			console.log('sending '+ quotes.length+" qoutes.");
	        			updatedFlag = false;
	        		}
	        	}
	        })
}
var updateClients = function(data){
	currentConnections.forEach(function(socket){
		socket.emit('quotes', data);
	})
}

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

