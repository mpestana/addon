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
  if (!(uuid in conns)){
      conns[uuid] = conn;    
      msg = {'type':'connection_established','data':uuid, 'date':Date.now()};
      conn.send(JSON.stringify(msg));
  }
  else{
      msg = {'type':'connection_rejected','msg':'a connection already exists for this uuid','data':uuid, 'date':Date.now()};
      conn.close(JSON.stringify(msg));
      return;
  }

  conn.on('message',function(data) {
    console.log(data);
    
    var retMsg = null; 
    var obj = JSON.parse(data);

    //all messages must be sent from a valid uuid, userid
    if ('uuid' in obj && 
        obj.uuid in conns && 
        'userid' in obj && 
        obj.userid != ''
    ){
        //if the user id has not been seen before init database
        if (!(obj.userid in DB.clients)) 
            DB.clients[obj.userid] = {'favs':{},'visits':{}};

        //route the message to the correct handler 
        retMsg = messageRouter(obj);
    }

    //return error to client
    else
        retMsg = {'type':'error', 'msg':'you sent a message without a valid uuid and/or userid property','target':undefined,'orig_msg':obj}; 

    //if there is a return message send it
    if (retMsg){
        //if it is a broadcast message then send it to everyone
        if (retMsg.target === 'BROADCAST')
            server.broadcast(JSON.stringify(retMsg), obj.uuid);
            
        //otherwise, send back to client
        else
            conn.send(JSON.stringify(retMsg)); 
    }
  });

  conn.on('close', function() {
      console.log('stopping client connection');
  });
});

//route message tyeps
function messageRouter(data){
    switch (data.type){
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
        //the client wants to like or dislike a page
        case 'set_vote':
            return set_vote(data);
            break;
        //the client wants a list of votes for the url 
        case 'get_votes':
            return get_votes(data);
            break;
        //the client wants to get all visits
        /*case 'get_all_visits':
            return get_all_visits(data);
            break;*/

        default:
            console.log('unknown type');
            return {'type':'error', 'msg':'you sent an unknown message type: '+data.type, 'target':data.userid}; 
    }
}

//add a favorite for this client
function add_fav(data){
    if (!(data.url in DB.clients[data.userid].favs))
    {
        data.votes = {};
        DB.clients[data.userid].favs[data.url] = data;
    }
     
    return {'type':'added_fav', 'msg': data.userid+' added a favorite for <a href="'+data.url+'">'+data.title+'</a>.' , 'target': 'BROADCAST', 'orig_msg':data}; 
}

//delete fav
function del_fav(data){
    delete DB.clients[data.userid].favs[data.url];

    return {'type':'deleted_fav', 'msg': data.userid+' removed <a href="'+data.url+'">'+data.title+'</a> from the favourites list.' , 'target': 'BROADCAST', 'orig_msg':data}; 
}

//add a favorite for this client
function set_vote(data){
    var set_flag = false;
    for (var userid in DB.clients){
        if (data.url in DB.clients[userid].favs){
            DB.clients[userid].favs[data.url].votes[data.userid] = data.vote;
            set_flag = true;
        }
    }

    if (set_flag){
        return {'type':'set_vote', 'msg': data.userid+' voted ('+data.vote+') for <a href="'+data.url+'">'+data.title+'</a> from the favourites list.' , 'target': 'BROADCAST', 'orig_msg':data}; 
    }
    else{
        return {'type':'error', 'msg':'cannot vote for the given url','target':data.userid,'orig_msg':obj}; 
    }
}

//add a favorite for this client
function get_votes(data){
    var votes = null

    for (var userid in DB.clients){
        if (data.url in DB.clients[userid].favs){
            votes = DB.clients[userid].favs[data.url].votes;
            break;
        }
    }

    if (votes != null){
        return {'type':'set_vote', 'data': votes , 'target': 'BROADCAST', 'orig_msg':data}; 
    }
    else{
        return {'type':'error', 'msg':'cannot find votes for the given url','target':data.userid,'orig_msg':obj}; 
    }
}

//get all favourites from all users
function get_all_favs(data){
    var favs = {};
    for (var client in DB.clients){
        tempFavs = DB.clients[client].favs;
        for (var url in tempFavs){
            if (!(url in favs))
                favs[url] = []; 
            favs[url].push(tempFavs[url]);
        }
    } 

    var msg = {'type':'all_favs', 'msg': 'All favs.', 'target': data.userid,'data':favs, 'orig_msg':data}; 
    console.log(JSON.stringify(msg));

    return msg; 
}

//add a visit for this client
function add_visit(data){
    if (!(data.url in DB.clients[data.userid].visits))    
        DB.clients[data.userid].visits[data.url] = data;
     
    return {'type':'added_visit', 'msg': data.userid+' added a visit for <a href="'+data.url+'">'+data.title+'</a>.' , 'target': 'BROADCAST', 'orig_msg':data}; 
}

//add a visit for this client
function get_my_visits(data){
    return {'type':'my_visits', 'msg': 'All visits for '+data.userid, 'data': DB.clients[data.userid].visits, 'target': data.userid, 'orig_msg':data}; 
}

/**
 * broadcast -- send to all users except the sender of the broadcast
 */
server.broadcast = function(msg,sender_uuid){
    console.log("broadcasting from: "+sender_uuid+" message: "+msg);
    for (var uuid in conns){
        if (uuid !== sender_uuid)
            conns[uuid].send(msg);
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
