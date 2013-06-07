self.port.on("init", function init(flag) {
	if (window.frameElement) return;

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '253368234806475', // App ID
			channelUrl : require("self").data.url('channel.html'), // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});

		FB.Event.subscribe('auth.authResponseChange', function(response) {
			if (response.status === 'connected') {
				testAPI();
			} else if (response.status === 'not_authorized') {
				FB.login();
			} else {
				FB.login();
			}
		});
	};

	(function(d){
		var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {return;}
			js = d.createElement('script'); js.id = id; js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			ref.parentNode.insertBefore(js, ref);
	}(document));

	function testAPI() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me', function(response) {
			window.alert('Good to see you, ' + response.name + '.');
		});
	}
	
	var first_div = document.createElement("div");
	first_div.setAttribute("id", "first_div");
	first_div.className = "first_div";
	first_div.style.width = "100%";
	first_div.style.height = "50px"; 
	//first_div.style.background = "blue"; 
	first_div.style.position = "fixed";  
	first_div.style.bottom = "0"; 
	first_div.style.left = "0";  

	var second_div = document.createElement("div");
	second_div.setAttribute("id", "second_div");
	second_div.className = "second_div";
	second_div.style.height = "300px";
	second_div.style.overflow = "scroll";

	var fb_div = document.createElement("div");
	fb_div.setAttribute("id", "fb-root");
	document.body.appendChild(fb_div);

	var checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.name = "name";
	checkbox.value = 1;
	checkbox.id = "check";
	checkbox.onclick = function() {
		self.port.emit("add", 1);
	};
	
	var status = document.createElement('h3');
	
	var favBtn = document.createElement('button');
	favBtn.type = "button";
	favBtn.name = "favs";
	favBtn.value = "favs";
	favBtn.onclick = function() {
		self.port.emit("favsTab", 1);
	};
	var text=document.createTextNode("Favs");
	favBtn.appendChild(text);

	/*** DB Button ***/
	var dbBtn = document.createElement('button');
	dbBtn.type = "button";
	dbBtn.name = "favs";
	dbBtn.value = "favs";
	dbBtn.onclick = function() {
		self.port.emit("get_db");
	};
	var text=document.createTextNode("DB");
	dbBtn.appendChild(text);

	/*** Maps Button ***/
	var MapsBtn = document.createElement('button');
	MapsBtn.type = "button";
	MapsBtn.name = "maps";
	MapsBtn.value = "maps";
	MapsBtn.onclick = function() {


		$().toastmessage('showNoticeToast', 'some message here');

		//self.port.emit("maps", 1);
	};
	var text=document.createTextNode("Map");
	MapsBtn.appendChild(text);
	/*** End of Maps Button ***/
	
	var FaceBook = document.createElement('a');
	FaceBook.href = "https://www.facebook.com/dialog/oauth?client_id=253368234806475&redirect_uri=https://whispering-shore-6287.herokuapp.com/";
	var fb_text=document.createTextNode("Login");
	FaceBook.appendChild(fb_text);

	if(flag==1){
		status.innerHTML = "You have already visited this page!!!";
		status.appendChild(checkbox);
		status.appendChild(favBtn);
		status.appendChild(MapsBtn);
		status.appendChild(dbBtn);
		status.appendChild(FaceBook);
		second_div.appendChild(status);
		first_div.appendChild(second_div);
		document.body.appendChild(first_div);
	}
	else if(flag==0){
		status.innerHTML = "First time here!!!";
		status.appendChild(checkbox);
		status.appendChild(favBtn);
		status.appendChild(MapsBtn);
		status.appendChild(dbBtn);
		status.appendChild(FaceBook);
		second_div.appendChild(status); 
		first_div.appendChild(second_div);
		document.body.appendChild(first_div); 
	}
	
});


