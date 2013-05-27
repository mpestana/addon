const USERID = 'scott';
const SERVER = 'ws://hci.csit.upei.ca:8999';
const IS_MOBILE = false;
//const SERVER = 'ws://localhost:8999';
uuid = '';

//sdk includes
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var Request = require("sdk/request").Request;
var tabs = require("sdk/tabs");
var notifications = require("sdk/notifications");
var pageWorkers = require("sdk/page-worker");

//Globals for establising websocket connection
WebSocket = null;
ws = null;

var app = {};	//to write to the console consistently on mobile or desktop
//access to service for writing to console
if (!IS_MOBILE){
	const {Cc,Ci} = require("chrome");
	app = Cc["@mozilla.org/fuel/application;1"].getService(Ci.fuelIApplication);
}
else{
	app.console = console; 
}
//create a hidden frame that gives access to WebSocket object
var hiddenFrames = require("sdk/frame/hidden-frame");
var hiddenFrame = hiddenFrames.add(hiddenFrames.HiddenFrame({
    'onReady': function() {
         //load a basic html file to get access to a WebSocket object
         this.element.contentWindow.location.href = require("self").data.url("WebSocketCreator.html");
         //this.element.contentWindow.location = "http://www.mozilla.org/";
         var self = this;
         this.element.addEventListener("DOMContentLoaded", function() {
             app.console.log("Initializing WebSocket for '" + self.element.contentWindow.location + "'");
             WebSocket = self.element.contentWindow.MozWebSocket || self.element.contentWindow.WebSocket; 

             //start the connection once it is loaded
             try{
                 ws = new WebSocket(SERVER);
                 ws.onopen = function(evt){app.console.log('Connected to socket server');};
                 ws.onclose = function(evt){app.console.log('Disconnected from socket server');};
                 ws.onmessage = onMessage; 
                 ws.onerror = function(evt){app.console.log('Error '+ evt.data);};
             }catch(err){
                 dump(err);
                 app.console.log(err);
             }
         }, true, true);
    }   
}));

function onMessage(evt){
    if (evt.data != ''){
        var obj = JSON.parse(evt.data);

        if (obj.type === 'connection_established'){
            uuid = obj.data; 
            app.console.log(evt.data);
        }

        else if(obj.type == 'all_favs'){
            tabs.open({
                url: self.data.url("favs.html"),
                inNewWindow: false,
                onReady: function() {
                    worker = tabs.activeTab.attach({
                        contentScriptFile: self.data.url("favs.js")
                    });
                    worker.port.emit("disp", obj.data);
                }
            });
        }

        //display any message except heartbeats
        if (obj.type !== 'heartbeat'){
            app.console.log(evt.data);
        }
    }
};

pageMod.PageMod({
	include: ["*"],
 	contentScriptFile: [self.data.url("script.js"), self.data.url("request.js")],
	onAttach: function (worker) {    	    	

        var msg = {
            'userid':USERID, 
            'uuid':uuid, 
            'type': 'add_visit', 
            'url': worker.tab.url, 
            'title': worker.tab.title,
            'date': Date.now()
        };
        ws.send(JSON.stringify(msg));
    
        var flag = 0;
        var sr = 0;
		worker.port.emit("init", flag);
		worker.port.on("add", function add(flag) {
            var msg = {
                'userid':USERID, 
                'uuid':uuid, 
                'type': 'add_fav', 
                'url': worker.tab.url, 
                'title': worker.tab.title,
                'date': Date.now()
            };
            ws.send(JSON.stringify(msg));
    	});

    	/*** List of Favourites ***/
        worker.port.on("favsTab", function favsTab(flag) {
                    var msg = {
                        'userid':USERID, 
                        'uuid':uuid, 
                        'type': 'get_all_favs', 
                        'date': Date.now()
                    };
                    ws.send(JSON.stringify(msg));
                });
                               
		 /*** Test for communicating ***/    
        worker.port.on("test", function test(sr) {              
                        notifications.notify({
                                title: "Test",
                                text: "'Other person on this page",
                                data: "Thats a notification",
                                onClick: function (data) {
                                console.log(data);
                                        tabs.open({
                                                url: self.data.url("favs.html"),
                                                onReady: function() {
                                    worker = tabs.activeTab.attach({
                                        contentScriptFile: self.data.url("favs.js")
                                    });
                                    //code
                                                }
                                        });
                                }
                        });
                });              
                 
        /**** Testing for Maps ****/
        worker.port.on("maps", function maps(sr) {
        	tabs.open({
        		url: self.data.url("maps.html"),
                onReady: function() {
                //code
            	}
        	});         
        });
        
    }
});
