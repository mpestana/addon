self.port.on("init", function init(flag) {
	if (window.frameElement) return;

	var first_div = document.createElement("div");
	first_div.setAttribute("id", "first_div");
	first_div.className = "first_div";
	first_div.style.width = "100%";
	first_div.style.height = "50px"; 
	first_div.style.background = "blue"; 
	first_div.style.position = "fixed";  
	first_div.style.bottom = "0"; 
	first_div.style.left = "0";  

	var second_div = document.createElement("div");
	second_div.setAttribute("id", "second_div");
	second_div.className = "second_div";
	second_div.style.height = "300px";
	second_div.style.overflow = "scroll";

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
	
//	/*** Test Button ***/
//	var testBtn = document.createElement('button');
//	testBtn.type = "button";
//	testBtn.name = "test";
//	testBtn.value = "test";
//	testBtn.onclick = function() {
//		$().toastmessage('showToast', {
//			text     : 'Notice Dialog which is sticky',
//			sticky   : true,
//			position : 'top-right',
//			type     : 'notice',
//			closeText: '',
//			close    : function () {console.log("toast is closed ...");}
//		});
//	};
//	var text=document.createTextNode("Server");
//	testBtn.appendChild(text);
//	/*** End of Test Button ***/

	/*** Maps Button ***/
	var MapsBtn = document.createElement('button');
	MapsBtn.type = "button";
	MapsBtn.name = "maps";
	MapsBtn.value = "maps";
	MapsBtn.onclick = function() {
		self.port.emit("maps", 1);
	};
	var text=document.createTextNode("Map");
	MapsBtn.appendChild(text);
	/*** End of Maps Button ***/

	if(flag==1){
		status.innerHTML = "You have already visited this page!!!";
		status.appendChild(checkbox);
		status.appendChild(favBtn);
		//status.appendChild(testBtn);
		status.appendChild(MapsBtn);
		second_div.appendChild(status);
		first_div.appendChild(second_div);
		document.body.appendChild(first_div);
	}
	if(flag==0){
		status.innerHTML = "First time here!!!";
		status.appendChild(checkbox);
		status.appendChild(favBtn);
		//status.appendChild(testBtn);
		status.appendChild(MapsBtn);
		second_div.appendChild(status); 
		first_div.appendChild(second_div);
		document.body.appendChild(first_div); 
	}
});
