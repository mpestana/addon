var WebSocket = require('ws');
var ws = new WebSocket('ws://hci.csit.upei.ca:8999');

uuid = null;
userid = '100000476787509';//'54534534545';
username = 'Scott';

ws.on('open', function(out) {
    console.log(out);
});

ws.on('message', function(data, flags) {
    console.log(data);
    var msg = JSON.parse(data);
    if (msg.type == "connection_established"){
	 uuid = msg.data;
         send_location();
    }
    else if (msg.type == "set_location_complete"){
         add_fav();
    }
});

function send_location(){
    var msg = {   'type':'set_location',
                  "lat":"46.2562238","lon":"-63.1395938"
              };
    send_message(msg);
}
function add_fav(){
    var msg = {   'type':'add_fav',
		'url': 'adcf8549c9dae48a4261cd6c370a9592c9e33247',
		'title': 'MacKenzie Produce',
		'date': 'Mon Jul 15 15:48:27 ADT 2013',
		'votes': {}  
              };

    send_message(msg);

    msg = {
		"type":"get_fav_users",
		'url': 'adcf8549c9dae48a4261cd6c370a9592c9e33247'
    };

    send_message(msg);

    msg = {
    		"type":"is_fav",
		"lookup_userid":userid,
                "url":'adcf8549c9dae48a4261cd6c370a9592c9e33247'
    }
    send_message(msg);
}

function send_message(msg){
    msg.uuid = uuid;
    msg.username = username;
    msg.userid = userid;

    console.log("\n");
    console.log("sending: %s",JSON.stringify(msg));
    console.log("\n");

    ws.send(JSON.stringify(msg));
}

