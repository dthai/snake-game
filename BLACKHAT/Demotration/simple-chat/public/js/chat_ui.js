/**
  * Constants
  */
var MSG_TYPE = (function() {
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

function handleMessage(message) {
	if(typeof(message.data) == 'undefined') {
		return;
	}

	if(startsWith(message.data, MSG_TYPE.get('IDENTITY'))) {
		userId = message.data.substring(6);
	} else if(startsWith(message.data, MSG_TYPE.get('CHAT'))) {
		var data = message.data.substring(8);
		var username = data.substring(0, data.indexOf(">>") + 2);
		var msg = data.substring(data.indexOf(">>") + 2);
		document.getElementById('messages').innerHTML +=  username + ': ' + msg + '\n';
	} else if(startsWith(message.data, MSG_TYPE.get('USER_JOIN_ROOM'))) {
		var data = message.data.substring(7);
		var username = data.substring(0, data.indexOf(">>") + 2);
		document.getElementById('messages').innerHTML +=  username + ' has joined the room\n';
	} else if(startsWith(message.data, MSG_TYPE.get('USER_LEAVE_ROOM'))) {
		var data = message.data.substring(7);
		var username = data.substring(0, data.indexOf(">>") + 2);
		document.getElementById('messages').innerHTML +=  username + ' has left the room\n';
	} else if(startsWith(message.data, MSG_TYPE.get('ALL'))) {
		var data = message.data.substring(10);
		document.getElementById('messages').innerHTML += data + '\n';
	}
}

function sendMessage() {
	var msg = document.getElementById('msgId').value;
	document.getElementById('messages').innerHTML += "Me: " + msg + '\n';
	ws.send(msg);
	document.getElementById('msgId').value = "";
}	

function startsWith(message, prefix) {
	if(message.indexOf(prefix) == 0) {
		return true;
	}
	return false;
}

