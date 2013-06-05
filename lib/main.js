var USERID = 'default';
const SERVER = 'ws://hci.csit.upei.ca:8999';
const IS_MOBILE = true;
//const SERVER = 'ws://localhost:8999';
uuid = '';
//testt
//sdk includes
var pageMod = require("sdk/page-mod");
var pageModMap = require("sdk/page-mod");
var self = require("sdk/self");
var Request = require("sdk/request").Request;
var tabs = require("sdk/tabs");
var tabsFav  = require("sdk/tabs");
var notifications = require("sdk/notifications");
var pageWorkers = require("sdk/page-worker");

//Globals for establising websocket connection
WebSocket = null;
ws = null;

USERID = require("simple-prefs").prefs.USERID;

let sp = require('simple-prefs');

function onPrefChange(prefName) {
	USERID = sp.prefs[prefName];
}

sp.on("USERID", onPrefChange);

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
		var flag = 0;
		
		if (obj.type === 'connection_established'){
			uuid = obj.data; 
			app.console.log(evt.data);
		}
		else if(obj.type == 'all_favs'){
			
			var re = /^.*[fav.html]$/;
			
			if(!re.test(tabs.activeTab.url)){ 
				tabsFav.open({
					url: self.data.url("favs.html"),
					inNewWindow: false,
					onReady: function() {
						worker = tabsFav.activeTab.attach({
							contentStyleFile: self.data.url("jquery.toastmessage.css"),
							contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("jquery.toastmessage.js"), self.data.url("favs.js")],
						});
						app.console.log(obj.data);
						worker.port.emit("disp", obj.data, USERID, flag);
						worker.port.on("del", function (delUrl) {
							var msg2 = {
									'userid': USERID, 
									'uuid':uuid, 
									'type': 'set_vote', 
									'url': delUrl,
									'vote': (-1),
									'date': Date.now()
							};						
							var msg = {
								'userid': USERID, 
								'uuid':uuid, 
								'type': 'del_fav', 
								'url': delUrl,
								'date': Date.now()
							};
							ws.send(JSON.stringify(msg2));
							ws.send(JSON.stringify(msg));
							var msg3 = {
									'userid':USERID, 
									'uuid':uuid, 
									'type': 'get_all_favs', 
									'date': Date.now()
								};
							ws.send(JSON.stringify(msg3));
						});	
						worker.port.on("like", function like(url, Likes, Dislikes) {
							var msg = {
								'userid': USERID, 
								'uuid':uuid, 
								'type': 'set_vote', 
								'url': url,
								'vote': 1,
								'date': Date.now()
							};
							ws.send(JSON.stringify(msg));
							var msg3 = {
									'userid':USERID, 
									'uuid':uuid, 
									'type': 'get_all_favs', 
									'date': Date.now()
								};
							ws.send(JSON.stringify(msg3));
							
						});
						
						worker.port.on("dislike", function dislike(url, Likes, Dislikes) {
							var msg = {
								'userid': USERID, 
								'uuid':uuid, 
								'type': 'set_vote', 
								'url': url,
								'vote': (-1),
								'date': Date.now()
							};
							ws.send(JSON.stringify(msg));
							var msg3 = {
									'userid':USERID, 
									'uuid':uuid, 
									'type': 'get_all_favs', 
									'date': Date.now()
								};
							ws.send(JSON.stringify(msg3));
						});	
					}
				});
			}
			else{
				flag = 1;
				worker = tabsFav.activeTab.attach({
					contentStyleFile: self.data.url("jquery.toastmessage.css"),
					contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("jquery.toastmessage.js"), self.data.url("favs.js")],
				});
				worker.port.emit("disp", obj.data, USERID, flag);
				worker.port.on("del", function (delUrl) {
					var msg2 = {
							'userid': USERID, 
							'uuid':uuid, 
							'type': 'set_vote', 
							'url': delUrl,
							'vote': (-1),
							'date': Date.now()
					};						
					var msg = {
						'userid': USERID, 
						'uuid':uuid, 
						'type': 'del_fav', 
						'url': delUrl,
						'date': Date.now()
					};
					ws.send(JSON.stringify(msg2));
					ws.send(JSON.stringify(msg));
					//worker.port.emit("delReturn", delUrl);
					var msg3 = {
							'userid':USERID, 
							'uuid':uuid, 
							'type': 'get_all_favs', 
							'date': Date.now()
						};
					ws.send(JSON.stringify(msg3));
				});	
				worker.port.on("like", function like(url, Likes, Dislikes) {
					var msg = {
						'userid': USERID, 
						'uuid':uuid, 
						'type': 'set_vote', 
						'url': url,
						'vote': 1,
						'date': Date.now()
					};
					ws.send(JSON.stringify(msg));
					//worker.port.emit("likeReturn", url, (Likes+1), (Dislikes-1));
					var msg3 = {
							'userid':USERID, 
							'uuid':uuid, 
							'type': 'get_all_favs', 
							'date': Date.now()
						};
					ws.send(JSON.stringify(msg3));
					
				});
				
				worker.port.on("dislike", function dislike(url, Likes, Dislikes) {
					var msg = {
						'userid': USERID, 
						'uuid':uuid, 
						'type': 'set_vote', 
						'url': url,
						'vote': (-1),
						'date': Date.now()
					};
					ws.send(JSON.stringify(msg));
					var msg3 = {
							'userid':USERID, 
							'uuid':uuid, 
							'type': 'get_all_favs', 
							'date': Date.now()
						};
					ws.send(JSON.stringify(msg3));
					//worker.port.emit("dislikeReturn", url, (Likes-1), (Dislikes+1));
				});	
			}
		
		}
		
		else if(obj.type == 'added_visit'){
			worker = tabs.activeTab.attach({
				contentStyleFile: self.data.url("jquery.toastmessage.css"),
				contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("jquery.toastmessage.js"), self.data.url("toast.js")],
			});
			worker.port.emit("addT", obj.msg);
			
			orig = obj.orig_msg;
			var url1 = orig.url.split(/\/(.+)?/)[1];
			var url2 = tabs.activeTab.url.split(/\/(.+)?/)[1];
			app.console.log(url1 + " and " + url2);
			if(url1 === url2){ 
				msg = "You are at the same page as " + orig.userid;
				worker.port.emit("addT", msg);
			}
		}
		
		else if(obj.type == 'added_fav'){
			worker = tabs.activeTab.attach({
				contentStyleFile: self.data.url("jquery.toastmessage.css"),
				contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("jquery.toastmessage.js"), self.data.url("toast.js")],
			});
			worker.port.emit("addT", obj.msg);
		}
		
		else if(obj.type == 'vote_set'){
			worker = tabs.activeTab.attach({
				contentStyleFile: self.data.url("jquery.toastmessage.css"),
				contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("jquery.toastmessage.js"), self.data.url("toast.js")],
			});
			 
			 worker.port.emit("addT", obj.msg);
		}
		
		//display any message except heartbeats
		if (obj.type !== 'heartbeat'){
			app.console.log(evt.data);
		}
	}
};

pageMod.PageMod({
	include: ["*"],
	contentStyleFile: self.data.url("jquery.toastmessage.css"),
	contentScriptFile: [self.data.url("jquery-1.4.4.min.js"), self.data.url("jquery.toastmessage.js"), self.data.url("script.js"), self.data.url("favs.js"), self.data.url("gmap3.js")],
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
			var msg2 = {
					'userid': USERID, 
					'uuid':uuid, 
					'type': 'set_vote', 
					'url': worker.tab.title,
					'vote': (+1),
					'date': Date.now()
			};
			ws.send(JSON.stringify(msg));
			ws.send(JSON.stringify(msg2));
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
				
		/**** Testing for Maps ****/
		worker.port.on("maps", function maps(sr) {
			tabs.open({
				url: self.data.url("maps.html"),
				onReady: function() {
				//code
				}
			});
		});
		/**** Testing for DB *****/
		worker.port.on("get_db", function favsTab() {
			var msg = {
				'userid':USERID, 
				'uuid':uuid, 
				'type': 'get_db', 
				'date': Date.now()
			};
			ws.send(JSON.stringify(msg));
		});
			
	}
});

