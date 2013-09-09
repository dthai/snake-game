var ws = new WebSocket("ws://localhost:3000/");        

ws.onopen = function() {
	 document.getElementById('messages').innerHTML += "Connection established" + '\n';
};

ws.onmessage = function(message) {
	if(message.data.indexOf('<<ujr>>') == 0) {
		document.getElementById('messages').innerHTML += "Server: " + message.data + ' has joined the room\n';	
	}
	// document.getElementById('messages').innerHTML += "Server: " + message.data + '\n';
};

ws.onclose = function() {
	 document.getElementById('messages').innerHTML += "Connection closed" + '\n';
};

function sendMessage() {
	var msg = document.getElementById('msgId').value;
	document.getElementById('messages').innerHTML += "Me: " + msg + '\n';
	ws.send(msg);
}