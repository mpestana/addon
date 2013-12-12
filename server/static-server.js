var connect = require('connect');
console.log(__dirname);
connect.createServer(
	connect.static(__dirname+'/static')
).listen(8998);
