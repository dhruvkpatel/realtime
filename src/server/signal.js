/**
 *	WebRTC Signaling Server.
 *	Loosely adapted from: https://www.tutorialspoint.com/webrtc
 * 
 *	Relays WebRTC configuration information between two clients.
 *	Clients use "webrtc-client.js" to communicate with this server
 *	and form their WebRTC connections. Currently this server can only
 *	connect two clients together at a time. Must run locally on computer
 *	attached to camera system.
 * 
 *	@author: Dhruv K Patel
 */

// For wscat testing
// wscat -c ws://localhost:9000
// {"type": "ready", "room": 999}
// {"type": "candidate", "candidate": "aaa"}
// {"type": "offer", "candidate": "bbb"}


const WebSocket = require('ws');
const rooms = {};
const clients = {};
let wss; 

exports.spin = function(port) {
	wss = new WebSocket.Server({port: port}); 

	// when a client connects to the server 
	wss.on('connection', function(connection) {

		// client's unique ID is the number of clients currently registered.
		let clientID = Object.keys(clients).length;
		let client = {
			'connection': connection,
			'room': undefined
		};
		clients[clientID] = client;

		// console.log(`User connected: ${clientID}`);
		
		// when server gets a message from a connected client
		connection.on('message', function(message) { 

		    let data; 
		    //accepting only JSON messages 
		    try {
		    	data = JSON.parse(message); 
		    } catch (e) { 
		    	console.error('Invalid JSON');
		    	data = {}; 
		    } 

		    // console.log(`Message from client ${clientID}: ${data.type}`);
		    switch (data.type) {

		    	// Client broadcasts that it is ready to enter a room
		    	case 'ready':
		    		let room = data.room
		    		client.room = room;
				   	if (!(room in rooms)) {
				   		rooms[room] = [];
				   	}
				   	rooms[room].push(clientID);

				   	if (rooms[room].length > 2) {
				   		console.error('Cannot have more than 2 users per room');
				   	}
				   	else if (rooms[room].length == 2) {
				   		// Notify clients that they are ready to exchange
				   		rooms[room].forEach(clientID => {
				   			sendTo(clients[clientID].connection, {
				   				type: 'ready'
				   			});
				   		});
				   	}
		    		break;

		    	// Client attempts a relay
		    	case 'candidate':
		    	case 'offer':
		    	case 'answer':
		    		// relay to other client in room
		    		if (client.room != undefined && rooms[client.room].length == 2) {
		    			let clientIDs = rooms[client.room];
		    			let otherClientID = clientIDs[0] + clientIDs[1] - clientID;
		    			if (data[data.type]) {
		    				clients[otherClientID].connection.send(message);
		    			}
		    			else {
		    				console.error(`Ill-formed ${data.type} request: ${message}`);
		    			}
		    		}
		    		// else {
		    		// 	console.error(`${data.type} attempt when both candidates are not ready`);
		    		// }
		    		break;

		    	default:
		    		console.error(`Invalid message from Client: ${message}`);
		    		break;
		    }
		});  

		// when a client connection is closed (e.g. browser exited)
		connection.on("close", function() { 
			
			if (client.room != null) {
				rooms[client.room] = rooms[client.room].filter(id => id != clientID);
				if (rooms[client.room].length == 0) {
					delete rooms[client.room];
				}
			}
			
			// set client to undefined. To make sure each new clientID is unique, 
			// we don't completely remove client from array.
			clients[clientID] = undefined;
		});  
		
		// for debugging purposes
	   	sendTo(connection, {
	   		type: 'connection',
	   		clientID: clientID,
	   		message: 'hello'
	   	}); 
	});  
}

function sendTo(connection, message) { 
   connection.send(JSON.stringify(message)); 
}