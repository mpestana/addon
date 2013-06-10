self.port.on("init", function init(flag) {
	if (window.frameElement) return;

	var fb_root = document.createElement("div");
	fb_root.setAttribute("id", "fb-root");
	document.body.appendChild(fb_root); 	
	
    var e = document.createElement('script'); e.async = true;
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    document.getElementById('fb-root').appendChild(e);
	
	$("html").attr("xmlns:fb","https://www.facebook.com/2008/fbml");
	
	 var script = document.createElement('script');
	 script.type = "text/javascript";
	
	script.innerHTML = 'var button;' + 
	'var userInfo;' +
	"window.fbAsyncInit = function() {" + "\n" +
	"	FB.init({ appId: '253368234806475', " + "\n" +
	"			status: true, " + "\n" +
	"			cookie: true," + "\n" +
	"			xfbml: true," + "\n" +
	"			oauth: true});" + "\n" +
	"	showLoader(true);" + "\n" +
	"	function updateButton(response) {" + "\n" +
	"		button       =   document.getElementById('fb-auth');" + "\n" +
	"		userInfo     =   document.getElementById('user-info');" + "\n" +
	"		if (response.authResponse) {" + "\n" +
	"			FB.api('/me', function(info) {" + "\n" +
	"				login(response, info);" + "\n" +
	"			});" + "\n" +
	"			button.onclick = function() {" + "\n" +
	"				FB.logout(function(response) {" + "\n" +
	"					logout(response);" + "\n" +
	"				});" + "\n" +
	"			};" + "\n" +
	"		} else {" + "\n" +
	"			button.innerHTML = 'Login';" + "\n" +
	"			button.onclick = function() {" + "\n" +
	"				showLoader(true);" + "\n" +
	"				FB.login(function(response) {" + "\n" +
	"					if (response.authResponse) {" + "\n" +
	"						FB.api('/me', function(info) {" + "\n" +
	"							login(response, info);" + "\n" +
	"						});	   " + "\n" +
	"					} else {" + "\n" +
	"						showLoader(false);" + "\n" +
	"					}" + "\n" +
	"				}, {scope:'email,user_birthday,status_update,publish_stream,user_about_me'});  	" + "\n" +
	"			}" + "\n" +
	"		}" + "\n" +
	"	}" + "\n" +
	"	FB.getLoginStatus(updateButton);" + "\n" +
	"	FB.Event.subscribe('auth.statusChange', updateButton);	" + "\n" +
	"};" + "\n" +
    "function login(response, info){" + "\n" +
    "    if (response.authResponse) {" + "\n" +
    "        var accessToken                                 =   response.authResponse.accessToken;" + "\n" +
    "        button.innerHTML                               = 'Logout'; " + "\n" +
    "        showLoader(false);" + "\n" +
    "        document.getElementById('other').style.display = 'block';" + "\n" +
    "    }" + "\n" +
    "}" + "\n" +
    "function logout(response){" + "\n" +
    "    userInfo.innerHTML                             =   '';" + "\n" +
    "    document.getElementById('debug').innerHTML     =   '';" + "\n" +
    "    document.getElementById('other').style.display =   'none';" + "\n" +
    "    showLoader(false);" + "\n" +
    "}" + "\n" +
    "function streamPublish(name, description, hrefTitle, hrefLink, userPrompt){" + "\n" +
    "    showLoader(true);" + "\n" +
    "    FB.ui(" + "\n" +
    "    {" + "\n" +
    "        method: 'stream.publish'," + "\n" +
    "        message: ''," + "\n" +
    "        attachment: {" + "\n" +
    "            name: name," + "\n" +
    "            caption: ''," + "\n" +
    "            description: (description)," + "\n" +
    "            href: hrefLink" + "\n" +
    "        }," + "\n" +
    "        action_links: [" + "\n" +
    "            { text: hrefTitle, href: hrefLink }" + "\n" +
    "        ]," + "\n" +
    "        user_prompt_message: userPrompt" + "\n" +
    "    }," + "\n" +
    "    function(response) {" + "\n" +
    "        showLoader(false);" + "\n" +
    "    });" + "\n" +
    "}" + "\n" +
    "function showStream(){" + "\n" +
    "    FB.api('/me', function(response) {" + "\n" +
    "        //console.log(response.id);" + "\n" +
    "        streamPublish(response.name, 'I like the articles of Thinkdiff.net', 'hrefTitle', 'http://thinkdiff.net', 'Share thinkdiff.net');" + "\n" +
    "    });" + "\n" +
    "}" + "\n" +
    "function share(){" + "\n" +
    "    showLoader(true);" + "\n" +
    "    var share = {" + "\n" +
    "        method: 'stream.share'," + "\n" +
    "        u: 'http://thinkdiff.net/'" + "\n" +
    "    };" + "\n" +
    "    FB.ui(share, function(response) { " + "\n" +
    "        showLoader(false);" + "\n" +
    "        console.log(response); " + "\n" +
    "    });" + "\n" +
    "}" + "\n" +

    "function setStatus(){" + "\n" +
    "    showLoader(true);" + "\n" +
    "    status1 = document.getElementById('status').value;" + "\n" +
    "    FB.api(" + "\n" +
    "      {" + "\n" +
    "        method: 'status.set'," + "\n" +
    "        status: status1" + "\n" +
    "      }," + "\n" +
    "      function(response) {" + "\n" +
    "        if (response == 0){" + "\n" +
    "            alert('Your facebook status not updated. Give Status Update Permission.');" + "\n" +
    "        }" + "\n" +
    "        else{" + "\n" +
    "            alert('Your facebook status updated');" + "\n" +
    "        }" + "\n" +
    "        showLoader(false);" + "\n" +
    "      }" + "\n" +
    "    );" + "\n" +
    "}" + "\n" +
    "function showLoader(status){" + "\n" +
    "    if (status)" + "\n" +
    "        document.getElementById('loader').style.display = 'block';" + "\n" +
    "    else" + "\n" +
    "        document.getElementById('loader').style.display = 'none';" + "\n" +
    "}";
    
	document.head.appendChild(script);


	
    var first_div = document.createElement("div");
	first_div.setAttribute("id", "first_div");
	first_div.className = "first_div";
	first_div.style.width = "100%";
	first_div.style.height = "50px"; 
	//first_div.style.background = "blue"; 
	//first_div.style.position = "fixed";  
	//first_div.style.bottom = "0"; 
	//first_div.style.left = "0";  

	var second_div = document.createElement("div");
	second_div.setAttribute("id", "second_div");
	second_div.className = "second_div";
	second_div.style.height = "300px";
	second_div.style.overflow = "scroll";

	//var fb_div = document.createElement("div");
	//fb_div.setAttribute("id", "fb-root");
	//document.body.appendChild(fb_div);

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
	

	if(flag==1){
		status.innerHTML = "You have already visited this page!!!";
		status.appendChild(checkbox);
		status.appendChild(favBtn);
		status.appendChild(MapsBtn);
		status.appendChild(dbBtn);
		second_div.appendChild(status);
		first_div.appendChild(second_div);
		document.body.appendChild(first_div);
	}
	else if(flag==0){
		//status.innerHTML = "First time here!!!";
		//status.appendChild(checkbox);
		//status.appendChild(favBtn);
		//status.appendChild(MapsBtn);
		//status.appendChild(dbBtn);
		//second_div.appendChild(status); 
		//first_div.appendChild(second_div);
		
		first_div.innerHTML += "<button id='fb-auth'>Login</button>";
		first_div.innerHTML += "<div id='loader' style='display:none'>"
		first_div.innerHTML += "<img src='ajax-loader.gif' alt='loading' />"
		first_div.innerHTML += "</div>"
		first_div.innerHTML += "<br />"
		first_div.innerHTML += "<div id='user-info'></div>"
		first_div.innerHTML += "<br />"
		first_div.innerHTML += "<div id='debug'></div>"
		first_div.innerHTML += "<div id='other' style='display:none'>";
		first_div.innerHTML += "<a href='#' onclick='showStream(); return false;'>Publish Wall Post</a> |";
		first_div.innerHTML += "<a href='#' onclick='share(); return false;'>Share With Your Friends</a> |";
		first_div.innerHTML += "<a href='#' onclick='graphStreamPublish(); return false;'>Publish Stream Using Graph API</a> |";
		first_div.innerHTML += "<a href='#' onclick='fqlQuery(); return false;'>FQL Query Example</a>";
		first_div.innerHTML += "<br />";
		first_div.innerHTML += "<textarea id='status' cols='50' rows='5'>Write your status here...</textarea>"; 
		first_div.innerHTML += "<br />";
		first_div.innerHTML += "<a href='#' onclick='setStatus(); return false;'>Status Set Using Legacy Api Call</a>";
		first_div.innerHTML += "</div>";
		document.body.appendChild(first_div); 
		
	}
	
});


