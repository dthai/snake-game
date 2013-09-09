/**
 * Logic of the chat server
 *
 * @author: ltvcuong
 */

var wsio = require('websocket.io');

var noOfUser = 0;
var users = [];
var rooms = [];
/**
 * Constructor to create a chat user
 */
function ChatUser(id, username, socket) {
	this.id = id;
	this.username = username;
	this.socket = socket;
}

/**
  * Constants
  */
var SERVER_MSG_TYPE = (function() {
	var maps = {
		'IDENTITY' : '<<id>>',
		'CHAT' : '<<chat>>',
		'USER_JOIN_ROOM' : '<<ujr>>',
		'USER_LEAVE_ROOM' : '<<ulr>>',
		'ALL':'<<server>>'
	};
	return {
		get: function(key) { return maps[key]; }
	};
})();

/**
 * Module exports.
 */

module.exports = exports;

exports.listen = function listen(server) {
	server.on('connection', function(socket) {
		var user = createUser(socket);
		joinRoom(user);		
		sendIdentity(user);

		socket.on('message', function(message) {
			sendMessage(user, message);

		});

		socket.on('close', function() {
			
		});
	});
}

/**
 * Called when a user joins the room
 */
function joinRoom(user) {
	console.log(user.username + ' has joined the room');
	sendNotification(user);
}

/**
 * Creates a chat user
 */
function createUser(socket) {
	var username = "user" + noOfUser;
	var user = new ChatUser(noOfUser, username, socket);
	users.push(user);

	noOfUser++;
	return user;
}

function sendNotification(u) {
	for (var i = 0; i < users.length; i++) {
		console.log('Inform user ' + users[i].username);
		users[i].socket.send(SERVER_MSG_TYPE.get('USER_JOIN_ROOM') + "<<" + u.username + ">>");
	};
}

function sendIdentity(user) {
	console.log('Send id to user ' + user.username);
	user.socket.send(SERVER_MSG_TYPE.get('IDENTITY') + "<<" + user.id + ">>");
}
function sendMessage(ignoreUser, message) {
	console.log('Send message to all users: ' + message);
	for (var i = 0; i < users.length; i++) {		
		if(users[i].socket != ignoreUser.socket) {
			if(message.indexOf("@sall") == 0) {
				users[i].socket.send(SERVER_MSG_TYPE.get('ALL') + "[ALL]" +  ignoreUser.username + " " + message.substring(message.indexOf(":")+1,message.length));
			} else{
				users[i].socket.send(SERVER_MSG_TYPE.get('CHAT') + "<<" + ignoreUser.username + ">>" + message);
			}
		}
	};
}