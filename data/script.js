self.port.on("init", function init(flag) {
	if (window.frameElement) return;

	$("html").attr("xmlns:fb","https://www.facebook.com/2008/fbml");

	var fb_root = document.createElement("div");
	fb_root.setAttribute("id", "fb-root");
	document.body.appendChild(fb_root); 
	
	var button;
	var userInfo;

	window.fbAsyncInit = function() {
		FB.init({ appId: '428771190554994', //change the appId to your appId
				status: true, 
				cookie: true,
				xfbml: true,
				oauth: true});
		showLoader(true);

		function updateButton(response) {
			button       =   document.getElementById('fb-auth');
			userInfo     =   document.getElementById('user-info');

			if (response.authResponse) {
				FB.api('/me', function(info) {
					login(response, info);
				});
				button.onclick = function() {
					FB.logout(function(response) {
						logout(response);
					});
				};
			} else {
				button.innerHTML = 'Login';
				button.onclick = function() {
					showLoader(true);
					FB.login(function(response) {
						if (response.authResponse) {
							FB.api('/me', function(info) {
								login(response, info);
							});	   
						} else {
							showLoader(false);
						}
					}, {scope:'email,user_birthday,status_update,publish_stream,user_about_me'});  	
				}
			}
		}

		FB.getLoginStatus(updateButton);
		FB.Event.subscribe('auth.statusChange', updateButton);	
	};
    (function() {
        var e = document.createElement('script'); e.async = true;
        e.src = document.location.protocol 
            + '//connect.facebook.net/en_US/all.js';
        document.getElementById('fb-root').appendChild(e);
    }());
    
    
    function login(response, info){
        if (response.authResponse) {
            var accessToken                                 =   response.authResponse.accessToken;
            
            userInfo.innerHTML                             = '<img src="https://graph.facebook.com/' + info.id + '/picture">' + info.name
                                                             + "<br /> Your Access Token: " + accessToken;
            button.innerHTML                               = 'Logout';
            showLoader(false);
            document.getElementById('other').style.display = "block";
        }
    }

    function logout(response){
        userInfo.innerHTML                             =   "";
        document.getElementById('debug').innerHTML     =   "";
        document.getElementById('other').style.display =   "none";
        showLoader(false);
    }

    //stream publish method
    function streamPublish(name, description, hrefTitle, hrefLink, userPrompt){
        showLoader(true);
        FB.ui(
        {
            method: 'stream.publish',
            message: '',
            attachment: {
                name: name,
                caption: '',
                description: (description),
                href: hrefLink
            },
            action_links: [
                { text: hrefTitle, href: hrefLink }
            ],
            user_prompt_message: userPrompt
        },
        function(response) {
            showLoader(false);
        });

    }
    function showStream(){
        FB.api('/me', function(response) {
            //console.log(response.id);
            streamPublish(response.name, 'I like the articles of Thinkdiff.net', 'hrefTitle', 'http://thinkdiff.net', "Share thinkdiff.net");
        });
    }

    function share(){
        showLoader(true);
        var share = {
            method: 'stream.share',
            u: 'http://thinkdiff.net/'
        };

        FB.ui(share, function(response) { 
            showLoader(false);
            console.log(response); 
        });
    }

    function graphStreamPublish(){
        showLoader(true);
        
        FB.api('/me/feed', 'post', 
            { 
                message     : "I love thinkdiff.net for facebook app development tutorials",
                link        : 'http://ithinkdiff.net',
                picture     : 'http://thinkdiff.net/iphone/lucky7_ios.jpg',
                name        : 'iOS Apps & Games',
                description : 'Checkout iOS apps and games from iThinkdiff.net. I found some of them are just awesome!'
                
        }, 
        function(response) {
            showLoader(false);
            
            if (!response || response.error) {
                alert('Error occured');
            } else {
                alert('Post ID: ' + response.id);
            }
        });
    }

    function fqlQuery(){
        showLoader(true);
        
        FB.api('/me', function(response) {
            showLoader(false);
            
            //http://developers.facebook.com/docs/reference/fql/user/
            var query       =  FB.Data.query('select name, profile_url, sex, pic_small from user where uid={0}', response.id);
            query.wait(function(rows) {
               document.getElementById('debug').innerHTML =  
                 'FQL Information: '+  "<br />" + 
                 'Your name: '      +  rows[0].name                                                            + "<br />" +
                 'Your Sex: '       +  (rows[0].sex!= undefined ? rows[0].sex : "")                            + "<br />" +
                 'Your Profile: '   +  "<a href='" + rows[0].profile_url + "'>" + rows[0].profile_url + "</a>" + "<br />" +
                 '<img src="'       +  rows[0].pic_small + '" alt="" />' + "<br />";
             });
        });
    }

    function setStatus(){
        showLoader(true);
        
        status1 = document.getElementById('status').value;
        FB.api(
          {
            method: 'status.set',
            status: status1
          },
          function(response) {
            if (response == 0){
                alert('Your facebook status not updated. Give Status Update Permission.');
            }
            else{
                alert('Your facebook status updated');
            }
            showLoader(false);
          }
        );
    }
    
    function showLoader(status){
        if (status)
            document.getElementById('loader').style.display = 'block';
        else
            document.getElementById('loader').style.display = 'none';
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


