self.port.on("disp", function(links, userId, flag) {

	if(flag == 1){
		document.body.innerHTML = "";
	}
	
	var first_div = document.createElement("div");
	first_div.setAttribute("id", "first_div");
	first_div.className = "first_div";
	var list = document.createElement("ul");
	
	first_div.innerHTML = "<h3><b>List of Favourite Websites:</b><br /> <br /></h3>";
	
	var Flag = 0;
	
	/*** Testing Like/Deslike Button ****/
	var like_flag = 0;
	var dislike_flag = 0;

	for (var url in links){
		
		var item = "<a href='"+url+"'>"+links[url][0].title+"</a> saved by ";
		var Likes = 0;
		var Dislikes = 0;
		
		Flag = 0;
		
		/*** Testing Like/Deslike Button ****/
		like_flag = 0;
		dislike_flag = 0;
		
		
		for (var save in links[url]){
			item += " "+links[url][save].userid+",";
			if(links[url][save].userid == userId){
				Flag = 1;
			}
			if(links[url][save].votes[userId]==1){ 
				like_flag = 1; 
				}
			else if(links[url][save].votes[userId]==(-1)){ 
				dislike_flag = 1; 
			}
		}
		
		for (var vote in links[url][0].votes){
			if(links[url][0].votes[vote] == 1){
				Likes += 1;
			}
			else{
				Dislikes += 1;
			}
		}
		
		
		item = item.replace(/,+$/, " "); 
		
		var itemList = document.createElement('li');
		var listText = document.createElement('p');
		listText.innerHTML = item;
		itemList.appendChild(listText);

		//Delete button
		var delBtn = document.createElement('button');
		delBtn.setAttribute("id", userId + "_" + url);
		delBtn.type = "button";
		delBtn.name = userId + "_" + url;
		delBtn.value = url;
		delBtn.onclick = function() {
			self.port.emit("del", this.value);
		}
		
		var delText=document.createTextNode("Delete");
		delBtn.appendChild(delText);
		
		if (Flag == 1){
			itemList.appendChild(delBtn);		
		}

		//Like button
		var Like = document.createElement('input');
		Like.setAttribute("id", "Like_" + url);
		Like.type = "image";
		Like.name = "like";
		Like.value = url;
		if(like_flag == 1){  		
			Like.src = "liked.jpeg";
			like_flag = 0;
		}
		else{
			Like.src = "up.png";
		}
		
		Like.onclick = function() {
			this.src = "liked.jpeg";
			$(document.getElementById("disLike_" + this.value)).attr('src', 'down.png');
			self.port.emit("like", this.value, Likes, Dislikes);
		};
		
		var likeText =document.createTextNode("Like");
		Like.appendChild(likeText);
		

		//Dislike button
		var disLike = document.createElement('input');
		disLike.setAttribute("id", "disLike_" + url);
		disLike.type = "image";
		disLike.name = "dislike";
		disLike.value = url;
		if(dislike_flag == 1){  		/*** Testing Like/Deslike Button ****/
			disLike.src = "disliked.jpeg";
			dislike_flag = 0;
		}
		else{
			disLike.src = "down.png";
		}
		
		disLike.onclick = function() {
			this.src = "disliked.jpeg";
			$(document.getElementById("Like_" + this.value)).attr('src', 'up.png');
			self.port.emit("dislike", this.value, Likes, Dislikes);
		};
		
		var disLikeText =document.createTextNode("Dislike");
		disLike.appendChild(disLikeText); 
	
		//Number of likes
		var likes = "<p>" + Likes + "</p>";		
		//Number of dislikes
		var disLikes = "<p>" + Dislikes + "</p>";

		var likeBtnTd = document.createElement('td');
		likeBtnTd.appendChild(Like);
		var likeNumberTd = document.createElement('td');
		likeNumberTd.setAttribute("id", "likeNumberTd_" + url);
		likeNumberTd.innerHTML = likes;
		var disLikeBtnTd = document.createElement('td');
		disLikeBtnTd.appendChild(disLike);
		var disLikeNumberTd = document.createElement('td');
		disLikeNumberTd.setAttribute("id", "disLikeNumberTd_" + url);
		disLikeNumberTd.innerHTML = disLikes;
		var likeDislikeTr = document.createElement('tr');
		
		likeDislikeTr.appendChild(likeBtnTd);
		likeDislikeTr.appendChild(likeNumberTd);
		likeDislikeTr.appendChild(disLikeBtnTd);
		likeDislikeTr.appendChild(disLikeNumberTd);
		
		var likeDislikeTable = document.createElement('table');
		likeDislikeTable.appendChild(likeDislikeTr);

		itemList.appendChild(likeDislikeTable);
		
		var item_div = document.createElement("div");
		item_div.setAttribute("id", url);
		item_div.className = url;
		item_div.appendChild(itemList);		
		
		list.appendChild(item_div);
	}
	document.body.appendChild(first_div);
	var list_div = document.createElement("div");
	list_div.setAttribute("id", "list_div");
	list_div.className = "list_div";
	list_div.appendChild(list);
	document.body.appendChild(list_div);
});

