self.port.on("disp", function(links) {
	var first_div = document.createElement("div");
	first_div.setAttribute("id", "first_div");
	first_div.className = "first_div";
	var list = document.createElement("ul");
	
	first_div.innerHTML = "<h3><b>List of Favourite Websites:<br /> <br /></h3>";
	
	for (var url in links){
		
		var item = "<a href='"+url+"'>"+links[url][0].title+"</a> saved by ";

		for (var save in links[url]){
			item += " "+links[url][save].userid+",";
		}
		item = item.replace(/,+$/, " "); 

		var itemList = document.createElement('li');
		itemList.innerHTML = item;
		list.appendChild(itemList);

		//Like button
		var Like = document.createElement('input');
		Like.type = "image";
		Like.name = "like";
		Like.src = "up.png";
		Like.value = "like";
		Like.onclick = function() {
			//action
			console.log("Gostou");
		};
		var likeText =document.createTextNode("Like");
		Like.appendChild(likeText);

		//Number of likes
		var likes = "<p>" + "10" + "</p>";

		//Dislike button
		var disLike = document.createElement('input');
		disLike.type = "image";
		disLike.name = "dislike";
		disLike.value = "dislike";
		disLike.src = "down.png";
		disLike.onclick = function() {
			//action
			console.log("desgostou");
		};
		var disLikeText =document.createTextNode("Dislike");
		disLike.appendChild(disLikeText); 
		
		//Number of dislikes
		var disLikes = "<p>" + "15" + "</p>";

		var likeBtnTd = document.createElement('td');
		likeBtnTd.appendChild(Like);
		var likeNumberTd = document.createElement('td');
		likeNumberTd.innerHTML = likes;
		var disLikeBtnTd = document.createElement('td');
		disLikeBtnTd.appendChild(disLike);
		var disLikeNumberTd = document.createElement('td');
		disLikeNumberTd.innerHTML = disLikes;
		var likeDislikeTr = document.createElement('tr');
		
		likeDislikeTr.appendChild(likeBtnTd);
		likeDislikeTr.appendChild(likeNumberTd);
		likeDislikeTr.appendChild(disLikeBtnTd);
		likeDislikeTr.appendChild(disLikeNumberTd);
		
		var likeDislikeTable = document.createElement('table');
		likeDislikeTable.appendChild(likeDislikeTr);

		list.appendChild(likeDislikeTable);
	}
	document.body.appendChild(first_div);
	document.body.appendChild(list);
});
