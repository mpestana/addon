//create server and start listening
var uuid = require('./Math.uuid')
var WebSocketServer = require('ws').Server
    , server = new WebSocketServer({port: 8999});

//client connections: uuid -> connection object
conns = {}; 

//database file
DB = {
    clients: {}
};

console.log('server started');
//handle events
server.on('connection', function(conn) {
  console.log('started client connection');
  var uuid = Math.uuid(15); 

  //create a new connection
  if (!(uuid in conns) && uuid !== 'null' && uuid != null){
      conns[uuid] = conn;    
      msg = {'type':'connection_established','data':uuid, 'date':Date.now()};
      conn.send(JSON.stringify(msg));
  }
  else{
      msg = {'type':'connection_rejected','msg':'a connection already exists for this uuid or the uuid is invalid: '+uuid,'data':uuid, 'date':Date.now()};
      conn.close(JSON.stringify(msg));
      return;
  }

  conn.on('message',function(data) {
    console.log(data);
    
    var retMsg = null; 

    var obj = {};
    try{
	obj = JSON.parse(data);
    } catch(e){
        console.log(e);
    }

    //all messages must be sent from a valid uuid, userid
    if ('uuid' in obj && 
        obj.uuid in conns && 
        'userid' in obj && 
        obj.userid != '' &&
	obj.userid != 'null' &&
	obj.userid != null
    ){
        //if the user id has not been seen before init database
        if (!(obj.userid in DB.clients)) 
            DB.clients[obj.userid] = {'username':'','favs':{},'searches':{},'visits':{},'friends':[],'user':{},'location':{}};

	//check for and set the username
	if ('username' in obj && DB.clients[obj.userid].username == '')
		DB.clients[obj.userid].username = obj.username;
	

        //route the message to the correct handler 
        retMsg = messageRouter(obj);
    }

    //return error to client
    else
        retMsg = {'type':'error', 'msg':'you sent a message without a valid uuid and/or userid property or you have invalid JSON','target':undefined,'orig_msg':obj,'JSON':data}; 

    //if there is a return message send it
    if (retMsg){
	console.log('return message: '+JSON.stringify(retMsg));
        //if it is a broadcast message then send it to everyone
        if (retMsg.target === 'BROADCAST')
            server.broadcast(JSON.stringify(retMsg), obj.uuid);
            
        //otherwise, send back to client
        else{
            try{
                conn.send(JSON.stringify(retMsg)); 
            }catch(e){
		console.log(e);
            }
	}
    }
  });

  conn.on('close', function() {
      console.log('stopping client connection');
  });
});

//route message tyeps
function messageRouter(data){
    switch (data.type){
        //the client wants to update their location 
        case 'set_location':
            return set_location(data);
            break;
        //the client wants to get someone's location 
        case 'get_location':
            return get_location(data);
            break;
        //the client wants to add a favourite page
        case 'add_fav':
            return add_fav(data);
            break;
        //the client wants to delete a favourite page
        case 'del_fav':
            return del_fav(data);
            break;
        //the client wants to get all favorites from all users
        case 'get_all_favs':
            return get_all_favs(data);
            break;
        //the client wants to add a visit
        case 'add_visit':
            return add_visit(data);
            break;
        //the client wants to get their own visits
        case 'get_my_visits':
            return get_my_visits(data);
            break;
        //the client wants to get all visits
        case 'get_all_visits':
            return get_all_visits(data);
            break;
        //the client wants to like or dislike a page
        case 'set_vote':
            return set_vote(data);
            break;
        //the client wants a list of votes for the url 
        case 'get_votes':
            return get_votes(data);
            break;
        case 'get_db':
            return get_db(data);
            break;
        case 'get_username':
            return get_username(data);
            break;
        case 'get_fav_users':
            return get_fav_users(data);
            break;
        case 'is_fav':
            return is_fav(data);
            break;
	//searches
	case 'add_search':
	    return add_search(data);
 	    break;
	case 'get_all_searches':
	    return get_all_searches(data);
 	    break;
        default:
            console.log('unknown type');
            return {'type':'error', 'msg':'you sent an unknown message type: '+data.type, 'target':data.userid}; 
    }
}

//set the location for the user
function set_location(data){
    if ("lon" in data && "lat" in data){
        DB.clients[data.userid].location = {"lat":data.lat, "lon":data.lon};
	var username = DB.clients[data.userid].username;
    	return {'type':'set_location_complete', 'msg': 'Location set to '+JSON.stringify(DB.clients[data.userid].location) , 'target': data.userid, 'orig_msg':data, 'username':username}; 
    }
    else{
        return {'type':'error', 'msg':'The message does not contain a lat or lon value.','target':data.userid,'orig_msg':data}; 
    }
}

function get_location(data){
    console.log('getting location for user'+data.lookup_userid);
    console.log(DB.clients[data.lookup_userid]);
    if (data.lookup_userid in DB.clients){
	var luser = DB.clients[data.lookup_userid];
    	return {'type':'user_location','location':luser.location,'msg': luser.username+ ' is at '+JSON.stringify(luser.location),'username':luser.username, 'target': data.userid, 'orig_msg':data}; 
    }
    else{
        return {'type':'error', 'msg':'We cannot get a location for that person ('+data.lookup_userid+').','target':data.userid,'orig_msg':data}; 
    }
}

//add a favorite for this client
function add_fav(data){
    if (!(data.url in DB.clients[data.userid].favs))
    {
        data.votes = {};
        DB.clients[data.userid].favs[data.url] = data;
    }
    var username = DB.clients[data.userid].username;
     
    return {'type':'added_fav','userid':data.userid,'username':username,'url':data.url,'title':data.title, 'msg': username+' added a favorite for '+data.title, 'target': 'BROADCAST', 'orig_msg':data}; 
}

//delete fav
function del_fav(data){
    var username = DB.clients[data.userid].username;
    delete DB.clients[data.userid].favs[data.url];

    return {'type':'deleted_fav', 'msg': username+' removed '+data.title+' from the favourites list.' , 'target': 'BROADCAST', 'orig_msg':data}; 
}

//add a favorite for this client
function set_vote(data){
    var set_flag = false;
    for (var userid in DB.clients){
        if (data.url in DB.clients[userid].favs){
	    var voter = DB.clients[data.userid].username;
            DB.clients[userid].favs[data.url].votes[data.userid] = {'vote':data.vote,'username':voter};
            set_flag = true;
        }
    }

    if (set_flag){
	var username = DB.clients[data.userid].username;
        return {'type':'vote_set', 'msg': username+' voted ('+data.vote+') for '+data.title+' from the favourites list.' , 'target': 'BROADCAST', 'orig_msg':data}; 
    }
    else{
        return {'type':'error', 'msg':'cannot vote for the given url','target':data.userid,'orig_msg':data}; 
    }
}

//get a votes for a  particular  url
function get_votes(data){
    var votes = null

    for (var userid in DB.clients){
        if (data.url in DB.clients[userid].favs){
            votes = DB.clients[userid].favs[data.url].votes;
            break;  //all votes should be already synced across all users
        }
    }

    if (votes != null){
        return {'type':'all_votes', 'data': votes, 'target': data.userid, 'orig_msg':data, 'url':data.url}; 
    }
    else{
        return {'type':'error', 'msg':'cannot find votes for the given url','target':data.userid,'orig_msg':obj}; 
    }
}

function is_fav(data){
	var found = false;
	if ('lookup_userid' in data && data.lookup_userid in DB.clients){
		if (data.url in DB.clients[data.lookup_userid].favs)
			found = true;

		return {'type':'is_fav_result', 'target': data.userid,'data':found, 'orig_msg':data}; 
	}
	else
		return {'type':'error', 'target': data.userid,'msg':'cannot find the favs for the given lookup_userid', 'orig_msg':data}; 
}


//get all favourites for a given url
function get_fav_users(data){
    var favs = {};
    for (var client in DB.clients){
        var tempFavs = DB.clients[client].favs;
	if (data.url in tempFavs){
            if (!(data.url in favs))
                favs[data.url] = []; 

            var obj ={'userid':client,'username':DB.clients[client].username,'url':data.url, 'title':tempFavs[data.url].title};

	    //if there is a location use it
	    if ('location' in tempFavs[data.url])
		obj.location = tempFavs[data.url].location;

	    //if there is a location use it
	    if ('address' in tempFavs[data.url])
		obj.address = tempFavs[data.url].address;

            favs[data.url].push(obj);
	}
    } 

    var msg = {'type':'fav_users', 'msg': 'Users who added the url as a fave.', 'target': data.userid,'data':favs, 'orig_msg':data}; 

    return msg; 
}

//get the username for the given userid
function get_username(data){
    var msg = '';
    if (data.lookup_userid in DB.clients){
    	msg = {'type':'username', 'msg': 'The username for the given userid.', 'target': data.userid,'data':DB.clients[data.lookup_userid].username, 'orig_msg':data}; 
    }
    else{
        msg = {'type':'error', 'msg':'We cannot get a username for that userid ('+data.lookup_userid+').','target':data.userid,'orig_msg':data}; 
    }

    return msg;
}

//get all favourites from all users
function get_all_favs(data){
    var favs = {};
    for (var client in DB.clients){
        tempFavs = DB.clients[client].favs;
        for (var url in tempFavs){
            if (!(url in favs))
                favs[url] = []; 
            favs[url].push(client);
        }
    } 

    var msg = {'type':'all_favs', 'msg': 'All favs.', 'target': data.userid,'data':favs, 'orig_msg':data}; 
    console.log(JSON.stringify(msg));

    return msg; 
}

//return the entire DB
function get_db(data){
    return msg = {'type': 'DB', 'data':DB, 'orig_msg': data, 'target': data.userid}; 
}

//add a visit for this client
function add_visit(data){
    if (!(data.url in DB.clients[data.userid].visits))    
        DB.clients[data.userid].visits[data.url] = []; 

    DB.clients[data.userid].visits[data.url].push(data);

    var username = DB.clients[data.userid].username;
     
    return {'type':'added_visit','userid':data.userid,'username':username, 'title':data.title,'url':data.url, 'msg': username+' added a visit for '+data.title+'.' , 'target': 'BROADCAST', 'orig_msg':data}; 
}

//add a visit for this client
function get_my_visits(data){
    var username = DB.clients[data.userid].username;
    return {'type':'my_visits', 'username':username,'msg': 'All visits for '+username, 'data': DB.clients[data.userid].visits, 'target': data.userid, 'orig_msg':data}; 
}

//get all visits from all users
function get_all_visits(data){
    var visits = {};

    for (var client in DB.clients){
        tempVisits = DB.clients[client].visits;

        for (var url in tempVisits){
            if (!(url in visits))
                visits[url] ={}; 
            visits[url][client] = tempVisits[url];
        }
    } 
    var msg = {'type':'all_visits', 'msg': 'All visits.', 'target': data.userid,'data':visits, 'orig_msg':data}; 
    console.log(JSON.stringify(msg));

    return msg; 
}

//add a search for this client
function add_search(data){
    if (!(data.text in DB.clients[data.userid].searches))    
        DB.clients[data.userid].searches[data.text] = []; 

    data.date = new Date();
    DB.clients[data.userid].searches[data.text].push(data);

    var username = DB.clients[data.userid].username;
     
    return {'type':'added_search','userid':data.userid,'username':username,'text':data.text, 'msg': username+' searched for '+data.search+'.' , 'target': 'BROADCAST', 'orig_msg':data}; 
}

//get all searches from all users
function get_all_searches(data){
    var searches = {};

    for (var client in DB.clients){
        var tempSearches = DB.clients[client].searches;

        for (var text in tempSearches){
            if (!(text in searches))
                searches[text] ={}; 
            searches[text][client] = tempSearches[text];
        }
    } 
    var msg = {'type':'all_searches', 'msg': 'All searches.', 'target': data.userid,'data':searches, 'orig_msg':data}; 

    console.log(JSON.stringify(msg));

    return msg; 
}

/**
 * broadcast -- send to all users except the sender of the broadcast
 */
server.broadcast = function(msg,sender_uuid){
    console.log("broadcasting from: "+sender_uuid+" message: "+msg);
    for (var uuid in conns){
        if (uuid !== sender_uuid)
            try{
               conns[uuid].send(msg);
            }catch(e){
               console.log(e);
	    }
    }
}

//do a heartbeat to send to clients regularly to clean-up dead connections
setInterval(function(){
    for (uuid in conns){
        try{
            conns[uuid].send(JSON.stringify({'type':'heartbeat'}));        
        }catch(err){
            console.log('conn for '+uuid+' is dead. Cleaning up.');
            delete conns[uuid];
        }
    }
},100);
