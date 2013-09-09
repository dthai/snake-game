function sendMessage() {
	var msg = document.getElementById('msgId').getAttribute('value');
	socket.send(msg);
}